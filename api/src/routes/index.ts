import { Request, Response, Router } from 'express'

import { authRoute } from '../middlewares/auth'
import { userRoutes } from './user'
import { tradeRoutes } from './trade'

const router = Router()

router.get('/', authRoute, (_: Request, res: Response) =>
  res.status(200).json('OK')
)
router.use('/user', userRoutes)
router.use('/trade', tradeRoutes)

export { router as apiRoutes }
