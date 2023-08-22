import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePost = (data: { [key: string]: any }) => {
  return createValidator({}).body(Joi.object(data))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateGet = (data: { [key: string]: any }) => {
  return createValidator({}).query(Joi.object(data))
}
