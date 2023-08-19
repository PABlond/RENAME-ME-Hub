import Router from 'express-promise-router'
import { Request, Response } from 'express'
import { RequestContext, authRoute } from '../../middlewares/auth'
import { Channel } from 'amqplib'
import Joi from 'joi'
import { validatePost } from '../../middlewares/validate'
import { ApiKey, Prisma, User } from '@prisma/client'
import prisma from '../../utils/prisma'

const router = Router()

router.route('/').post(
  authRoute,
  validatePost({
    symbol: Joi.string().required(),
    orderType: Joi.string().required(),
    volume: Joi.number().required(),
    price: Joi.number().required(),
    slippage: Joi.number().default(0),
    stoploss: Joi.number().default(0),
    takeprofit: Joi.number().default(0),
    comment: Joi.string().default(''),
    magic: Joi.number().default(0),
  }),
  async (req: RequestContext, res: Response): Promise<void> => {
    const {
      symbol,
      orderType,
      volume,
      price,
      slippage,
      stoploss,
      takeprofit,
      comment,
      magic,
    } = req.body
    const key = req.user?.key

    // Simule l'appel à la méthode OrderOpen
    const response = {
      key,
      tf: Date.now(),
      type: 'order-open',
      data: {
        symbol,
        orderType,
        volume,
        price,
        slippage,
        stoploss,
        takeprofit,
        comment,
        magic,
      },
    }
    console.log(req.user)
    const {id, pending, tfOpen, type} = await prisma.interaction.create({
      data: {
        user: {connect: { id: req.user?.id}},
        type: 'order-open',
        data: {
          symbol,
          orderType,
          volume,
          price,
          slippage,
          stoploss,
          takeprofit, 
          comment,
          magic,
        } as Prisma.InputJsonValue,
      },
    })
    await prisma.$queryRaw`NOTIFY AZE`
    // const x = await req.redisClient?.rPush('pending-order', JSON.stringify(response))
    // console.log('x ', x)
    res.json({id, pending, tfOpen, type})
  }
)

export { router as tradeRoutes }
