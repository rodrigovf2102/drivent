import { AuthenticatedRequest } from "@/middlewares";
import hotelServices from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelServices.getHotels();

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);
    const hotel = await hotelServices.getHotelById(hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if(error.name==="InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name==="NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    console.log(error.message);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
