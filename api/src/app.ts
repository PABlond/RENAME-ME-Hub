import express, { Express, Request, Response } from 'express'

import { apiRoutes } from './routes'
import httpStatus from 'http-status'

const globalErrorHandler = (_: Request, res: Response): Response =>
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal server error')

const getApp = async (): Promise<Express> => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded())

  app.use('/api', apiRoutes)
  app.use(globalErrorHandler)

  return app
}

export default getApp
