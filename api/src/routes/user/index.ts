import bcrypt from 'bcryptjs'
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createCipheriv,
} from 'crypto'
import Router from 'express-promise-router'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import Joi from 'joi'

import { validateGet, validatePost } from '../../middlewares/validate'
import prisma from '../../utils/prisma'

const router = Router()
const { AES_KEY = '07e52e2e396e933d2501e0347cb4f2bf' } = process.env // set random encryption key
const generateKey = (size = 32, format: BufferEncoding = 'base64') =>
  randomBytes(size).toString(format)

const generateSecretHash = (key: string): string => {
  const salt = randomBytes(8).toString('hex')
  const buffer = scryptSync(key, salt, 64) as Buffer
  return `${buffer.toString('hex')}.${salt}`
}

const compareKeys = (storedKey: string, suppliedKey: string): boolean => {
  const [hashedPassword, salt] = storedKey.split('.')

  const buffer = scryptSync(suppliedKey, salt, 64) as Buffer
  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer)
}

function encrypt(iv: Buffer, plaintext: string) {
  const cipher = createCipheriv('aes-128-cbc', Buffer.from(AES_KEY, 'hex'), iv)
  let ciphertext = cipher.update(plaintext, 'utf-8', 'base64')
  ciphertext += cipher.final('base64')
  return ciphertext
}

router.post(
  '/',
  validatePost({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    await prisma.user.create({
      data: { username, email, password: bcrypt.hashSync(password, salt) },
    })
    res.status(httpStatus.CREATED).json('OK')
  }
)

router
  .route('/key')
  .post(
    validatePost({
      userId: Joi.number().required(),
      server: Joi.string().required(),
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
    async (req: Request, res: Response) => {
      const key = generateKey()
      const secret = generateKey()
      const hash = generateSecretHash(secret)
      const iv = randomBytes(16)
      console.log(req.body.login, req.body.password)
      await prisma.apiKey.create({
        data: {
          key,
          hash: hash as string,
          userId: req.body.userId as number,
          login: encrypt(iv, req.body.login),
          server: encrypt(iv, req.body.server),
          password: encrypt(iv, req.body.password),
          iv: iv.toString('hex'),
        },
      })

      res.status(httpStatus.CREATED).json({ key, secret })
    }
  )
  .get(
    validateGet({
      key: Joi.string().required(),
      secret: Joi.string().required(),
    }),
    async (req: Request, res: Response) => {
      const { key, secret } = req.query as { key: string; secret: string }
      const data = await prisma.apiKey.findUnique({ where: { key } })
      if (!data) return res.status(httpStatus.UNAUTHORIZED).json('Invalid key')
      if (!compareKeys(data.hash, secret))
        return res.status(httpStatus.UNAUTHORIZED).json('Invalid secret key')

      res.status(httpStatus.OK).json({ key, secret })
    }
  )

export { router as userRoutes }
