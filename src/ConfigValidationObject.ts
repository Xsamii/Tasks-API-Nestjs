import Joi from '@hapi/joi';
import { join } from 'path';

export const configValidationObject = Joi.object({
  PORT: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRETKEY: Joi.string().required(),
});
