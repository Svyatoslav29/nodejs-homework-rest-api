import Joi from 'joi';
import pkg from 'mongoose';
import { MAX_AGE, MIN_AGE } from '../../../lib/constants';

const { Types } = pkg;

const createSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(12).required(),
  age: Joi.number().integer().min(MIN_AGE).max(MAX_AGE).optional(),
  favorite: Joi.bool().optional()
});

const updatedSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  age: Joi.number().integer().min(MIN_AGE).max(MAX_AGE).optional(),
  favorite: Joi.bool().optional()
}).or('name', 'email', 'phone', 'age');

const updatedFavoriteSchema = Joi.object({
  favorite: Joi.bool().required()
})

const querySchema = Joi.object({
  // eslint-disable-next-line prefer-regex-literals
  limit: Joi.string().pattern(new RegExp('\\d+')).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('name', 'age', 'email').optional(),
  sortByDesc: Joi.string().valid('name', 'age', 'email').optional(),
  // eslint-disable-next-line prefer-regex-literals
  filter: Joi.string().pattern(new RegExp('(name|email.age)\\|?(name|email.age)+')).optional()
})

export const validateCreation = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body)
  } catch (error) {
    return res.status(400).json({message: `Field ${error.message.replace(/"/g, '')}`})
  }
  next()
}

export const validateUpdate = async (req, res, next) => {
  try {
    await updatedSchema.validateAsync(req.body)
  } catch (error) {
    const [{ type }] = error.details;
    if (type === 'object.missing') {
      return res.status(400).json({ message: `missing fields` })
    }
    return res.status(400).json({ message: error.message })
  }
  next()
}

export const validateUpdateFavorite = async (req, res, next) => {
  try {
    await updatedFavoriteSchema.validateAsync(req.body)
  } catch (error) {
    const [{ type }] = error.details;
    if (type === 'object.missing') {
      return res.status(400).json({ message: 'missing field favorite' })
    }
    return res.status(400).json({ message: error.message })
  }
  next()
}

export const validateId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
   return res.status(400).json({ message: 'Invalid Object Id' })
 }
  next()
}

export const validateQuery = async (req, res, next) => {
  try {
    await querySchema.validateAsync(req.query)
  } catch (error) {
    return res.status(400).json({message: `Field ${error.message.replace(/"/g, '')}`})
  }
  next()
}
