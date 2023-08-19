import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

export const validatePost = (data: { [key: string]: any }) => {
  return createValidator({}).body(Joi.object(data))
}

export const validateGet = (data: { [key: string]: any }) => {
  return createValidator({}).params(Joi.object(data))
}
