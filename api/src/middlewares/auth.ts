import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

import prisma from '../utils/prisma'

export const authRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<void> | void> => {
  const key = req.headers['api_key'] as string
  if (!key && typeof key !== 'string') return res.status(httpStatus.UNAUTHORIZED).json('API_KEY is missing')
  const data = await prisma.apiKey.findUnique({
    where: { key },
    include: {user: true}
  })
  if (!data) return res.status(httpStatus.UNAUTHORIZED).json('API_KEY is invalid')
  req.user = data.user
  next()
}
