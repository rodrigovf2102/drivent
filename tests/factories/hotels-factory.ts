import faker from "@faker-js/faker";
import { Hotel } from "@prisma/client";
import { prisma } from "@/config";

export async function createHotels(hotelsQuantity: number) {
  const hotels: HotelPost[] = [];
  for (let i = 0; i < hotelsQuantity; i++) {
    const hotel: HotelPost = {
      name: faker.company.companyName() + " Hotel",
      image: faker.image.city(),
      createdAt: faker.date.between("2018-01-01", "2020-10-10"),
      updatedAt: faker.date.between("2020-10-10", "2022-10-10")
    };
    hotels.push(hotel);
  }
  if(hotelsQuantity > 1 ) {
    return prisma.hotel.createMany({
      data: hotels,
    });
  }
  if(hotelsQuantity === 1) {
    return prisma.hotel.create({
      data: hotels[0]
    });
  }
  return {};
}

type HotelPost = Omit<Hotel, "id">
