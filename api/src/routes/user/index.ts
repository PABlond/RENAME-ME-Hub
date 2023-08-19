import bcrypt from 'bcryptjs'
import Router from 'express-promise-router'
import { Request, Response } from 'express'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import prisma from '../../utils/prisma'
import Joi from 'joi'
import { validateGet, validatePost } from '../../middlewares/validate'

const router = Router()

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
    const user = await prisma.user.create({
      data: { username, email, password: bcrypt.hashSync(password, salt) },
    })
    res.status(200).json('OK')
  }
)

router
  .route('/key')
  .post(
    validatePost({
      userId: Joi.number().required(),
    }),
    async (req: Request, res: Response) => {
      const key = generateKey()
      const secret = generateKey()
      const hash = generateSecretHash(secret)
      await prisma.apiKey.create({
        data: {
          key,
          hash: hash as string,
          userId: req.body.userId as number,
        },
      })

      res.status(200).json({ key, secret })
    }
  )
  .get(
    validateGet({
      key: Joi.string().required(),
      secret: Joi.string().required(),
    }),
    async (req: Request, res: Response) => {
      const { key, secret } = req.body
      const data = await prisma.apiKey.findUnique({ where: { key } })
      if (!data) return res.status(400).json('Invalid key')
      if (!compareKeys(data.hash, secret))
        return res.status(400).json('Invalid secret key')

      res.status(200).json({ key, secret })
    }
  )

export { router as userRoutes }
