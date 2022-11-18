import { TicketPost } from "@/services/tickets-service";
import Joi from "joi";

export const createTicketSchema = Joi.object<TicketPost>({
  ticketTypeId: Joi.number().required()
});
