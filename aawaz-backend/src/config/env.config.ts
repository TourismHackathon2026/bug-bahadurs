import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  SENTRY_DSN: Joi.string().uri().optional().allow(''),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
});
