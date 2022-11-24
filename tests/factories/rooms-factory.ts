import faker from "@faker-js/faker";
import { Room } from "@prisma/client";
import { prisma } from "@/config";

export async function createRooms(hotelId: number, floorsAmount: number, roomsPerFloor: number) {
  const roomsNames = setRoomsNames(floorsAmount, roomsPerFloor);
  const rooms: RoomPost[] = [];
  for (let i = 0; i < floorsAmount*roomsPerFloor; i++) {
    const room: RoomPost = {
      name: roomsNames[i],
      capacity: Number(faker.random.numeric()),
      hotelId: hotelId,
      createdAt: faker.date.between("2018-01-01", "2020-10-10"),
      updatedAt: faker.date.between("2020-10-10", "2022-10-10")
    };
    rooms.push(room);
  }
  if(floorsAmount*roomsPerFloor > 1 ) {
    return prisma.room.createMany({
      data: rooms,
    });
  }
  if(floorsAmount*roomsPerFloor === 1) {
    return prisma.room.create({
      data: rooms[0]
    });
  }
  return {};
}

type RoomPost = Omit<Room, "id">

function setRoomsNames(floorsAmount: number, roomsPerFloor: number): Array<string> {
  if(roomsPerFloor>99) roomsPerFloor=99;
  const roomsNames: Array<string> = [];
  let floor = 1;
  let room = 0;
  for(let i=1; i <= floorsAmount*roomsPerFloor; i++) {
    room++;
    if(room>roomsPerFloor) {
      room=1;
    }
    if(room<10) {
      roomsNames.push(`${floor.toString()}0${room.toString()}`);
    } else {
      roomsNames.push(`${floor.toString()}${room.toString()}`);
    }
    if((roomsPerFloor*floor)/i===1) {
      floor++; 
    }
  }
  return roomsNames;
}
