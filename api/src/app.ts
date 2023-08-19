import express, { Express, NextFunction, Request, Response } from 'express'
import { apiRoutes } from './routes'
import { connectRabbitMQ } from './utils/connectRabbitmq'
import { Channel } from 'amqplib'
import prisma from './utils/prisma'
import {Client} from 'pg'
function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response
) {
  switch (true) {
    case typeof err === 'string':
      // works for any errors thrown directly
      // eg: throw 'Some error occured!';
      return res.status(404).json({ message: 'Error: Not found!' })

    default:
      return res.status(500).json({ message: err.message })
  }
}

const getApp = async (): Promise<Express> => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded())
  // const channel = await connectRabbitMQ()
  const pgClient = new Client(process.env.DATABASE_URL)
await pgClient.connect()
  await pgClient.query('LISTEN AZE')

  pgClient.on('notification', async (msg) => {
      console.log('Change detected:', msg.payload)
      // Réagir au changement, par exemple, effectuer une requête avec Prisma
    
  })
  app.use(
    '/api',
    async (
      req: Request & { channel?: Channel },
      res: Response,
      next: NextFunction
    ) => {
      // req.channel = channel
      next()
    },
    apiRoutes
  )
  app.use(globalErrorHandler)

  // app.use((req: Request, res: Response) => {
  //   res.status(404).json({ error: 'Not Found' })
  // })

  return app
}

export default getApp
