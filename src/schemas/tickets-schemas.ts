import Joi from "joi";

export const createTicketsSchema = Joi.object({
  ticketTypeId: Joi.number().integer().strict().min(1).required()
});
