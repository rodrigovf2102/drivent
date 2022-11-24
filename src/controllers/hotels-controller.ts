import { AuthenticatedRequest } from "@/middlewares";
import hotelServices from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelServices.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name==="PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name==="InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelRoomsByHotelIdWithNoBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotelId = Number(req.params.hotelId);
    const rooms = await hotelServices.getHotelRoomsByHotelIdWithNoBookings(hotelId, userId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if(error.name==="PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name==="InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name==="NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
