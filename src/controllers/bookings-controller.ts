import { invalidDataError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import bookingServices from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingServices.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const booking = await bookingServices.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking.id);
  } catch (error) {
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "PaymentError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);
  if (isNaN(bookingId)) {
    throw invalidDataError(["bookingId must be a number"]);
  }
  try {
    const booking = await bookingServices.updateBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send(booking.id);
  } catch (error) {
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "PaymentError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
