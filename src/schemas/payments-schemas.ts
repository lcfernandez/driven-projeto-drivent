import Joi from "joi";

export const createPaymentsSchema = Joi.object({
  ticketId: Joi.number().integer().strict().min(1).required(),
  cardData: Joi.object({
    issuer: Joi.string(),
    number: Joi.number(),
    name: Joi.string(),
    expirationDate: Joi.string(),
    cvv: Joi.number()
  }).required()
});
