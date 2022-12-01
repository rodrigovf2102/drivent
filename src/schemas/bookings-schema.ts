import Joi from "joi";
import { Booking } from "@prisma/client";

export const createBookingSchema = Joi.object<PostBook>({
  roomId: Joi.number().required()
});

type PostBook = Pick<Booking, "roomId">
