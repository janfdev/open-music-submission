import Joi from "joi";

export const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().min(1).optional(),
  albumId: Joi.string(),
});

export const songUpdatePayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().min(1).optional(),
  albumId: Joi.string(),
});

const validatePayload = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    return next(err);
  }

  req.validated = value;
  return next();
};

export const validateSongPayload = validatePayload(songPayloadSchema);
export const validateSongUpdatePayload = validatePayload(
  songUpdatePayloadSchema,
);
