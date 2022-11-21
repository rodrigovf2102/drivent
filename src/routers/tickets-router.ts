import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketsTypes, getTicketsByUser, postTicket } from "@/controllers";
import { createTicketSchema } from "@/schemas/tickets-schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/", getTicketsByUser)
  .post("/", validateBody(createTicketSchema), postTicket);

export { ticketsRouter };
