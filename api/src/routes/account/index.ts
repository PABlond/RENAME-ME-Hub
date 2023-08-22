import axios from 'axios'
import Router from 'express-promise-router'
import { Request, Response } from 'express'

import { authRoute } from '../../middlewares/auth'
import prisma from '../../utils/prisma'
import httpStatus from 'http-status'

const router = Router()

router
  .route('/')
  .get(authRoute, async (req: Request, res: Response): Promise<void> => {
    if (!req.user.type) throw new Error('Type is missing')
    const container = await prisma.container.findFirst({
      where: { type: req.user.type },
      select: { type: true, ip: true, id: true },
    })
    if (!container?.ip) throw new Error('No Container found')
    try {
      const { data } = await axios.get(`http://${container.ip}:5000/account`, {
        headers: {
          Authorization: req.headers.api_key,
        },
      })
      res.status(httpStatus.OK).json(data)
    } catch (e) {
      throw new Error('Container is not ready')
    }
  })

export { router as accountRoutes }
