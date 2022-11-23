import faker from "@faker-js/faker";
import { Booking } from "@prisma/client";
import { prisma } from "@/config";

export async function createBookings(userId: number, roomId: number) {
  const booking: BookingPost = {
    userId,
    roomId,
    createdAt: faker.date.between("2018-01-01", "2020-10-10"),
    updatedAt: faker.date.between("2020-10-10", "2022-10-10")
  };
  return prisma.booking.create({
    data: booking
  });
}

type BookingPost = Omit<Booking, "id">
