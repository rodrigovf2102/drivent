import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBooking, postBooking, updateBooking } from "@/controllers";
import { createBookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(createBookingSchema), postBooking)
  .put("/:bookingId", validateBody(createBookingSchema), updateBooking);

export { bookingsRouter };
