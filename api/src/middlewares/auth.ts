import { NextFunction, Request, Response } from 'express'
import prisma from '../utils/prisma'
import { ApiKey, User } from '@prisma/client'
import {createClient} from 'redis'

export type RequestContext = Request & {
  user?: User & ApiKey;
  redisClient?: ReturnType<typeof createClient>
}
export const authRoute = async (
  req: RequestContext,
  res: Response,
  next: NextFunction
): Promise<Response<void> | void> => {
// const client = createClient({
//   url: 'redis://redis:6379'
// })
//   await client.connect()
//   await client.set('pending-order', JSON.stringify([]))
  // console.log(client.isReady)
  const key = req.headers['api_key'] as string
  if (!key) return res.status(400).json('Unauthorized')
  const data = await prisma.apiKey.findUnique({
    where: { key },
  })
  if (!data) return res.status(400).json('Unauthorized')
  req.user = {
    id: 3,
    username: 'JohnDoe',
    key,
    email: 'johndoe@sample.net',
    userId: 1,
    hash: 'SampleOfHash',
    password: 'EncryptedPassword',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // req.redisClient = client
  next()
}
