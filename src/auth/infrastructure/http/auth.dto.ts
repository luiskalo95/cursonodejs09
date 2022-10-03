import joi from 'joi';

export const authSchemas = {
  LOGIN: {
    body: joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(5).max(30).required(),
    }),
  },
};
