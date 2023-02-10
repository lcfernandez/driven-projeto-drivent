import Joi from "joi";

export const createBookingSchema = Joi.object({
  roomId: Joi.number().integer().strict().required()
});

export const updateBookingSchema = Joi.object({
  roomId: Joi.number().integer().required()
});
