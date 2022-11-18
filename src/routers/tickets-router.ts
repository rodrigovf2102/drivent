import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketsTypes, getTicketsByUser } from "@/controllers";
import { createEnrollmentSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
  .get("/types", getTicketsTypes)
  .all("/*", authenticateToken)
  .get("/", getTicketsByUser);

/*.get("/", getEnrollmentByUser)
.post("/", validateBody(createEnrollmentSchema), postCreateOrUpdateEnrollment);*/

export { ticketsRouter };
