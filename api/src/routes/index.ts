import { Request, Response, Router } from 'express'
import httpStatus from 'http-status'

import { accountRoutes } from './account'
import { userRoutes } from './user'

const router = Router()

router.get('/', (_: Request, res: Response) =>
  res.status(httpStatus.OK).json('OK')
)
router.use('/account', accountRoutes)
router.use('/user', userRoutes)

export { router as apiRoutes }
