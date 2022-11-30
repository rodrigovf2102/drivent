import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { Booking } from "@prisma/client";
import httpStatus from "http-status";
import hotelServices from "../hotel-service";

async function getBooking(userId: number): Promise<Booking> {
  const booking = await bookingRepository.findBooking(userId);
  await hotelServices.checkCredentialsByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBooking(userId: number, roomId: number): Promise<Booking> {
  await hotelServices.checkCredentialsByUserId(userId);
  const booking = await bookingRepository.createBooking();

  return booking;
}

const bookingServices = {
  getBooking, postBooking
};

export default bookingServices;
