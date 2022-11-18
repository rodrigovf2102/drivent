import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketsTypes, getTicketsByUser, postTicket } from "@/controllers";
import { createTicketSchema } from "@/schemas/tickets-schemas";

const ticketsRouter = Router();

ticketsRouter
  .get("/types", getTicketsTypes)
  .all("/*", authenticateToken)
  .get("/", getTicketsByUser)
  .post("/", validateBody(createTicketSchema), postTicket);

export { ticketsRouter };
