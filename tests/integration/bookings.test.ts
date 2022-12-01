import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { Hotel, Room, TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { number } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser, createHotels, createEnrollmentWithAddress, createTicket, createTicketTypeWithHotel, createTicketTypeWithNoHotel } from "../factories";
import { createBookings } from "../factories/bookings-factory";
import { createRooms, createRoomWithCapacity } from "../factories/rooms-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When toking is valid", () => {
    it("should respond with status 200 and with booking object", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;
      const booking = await createBookings(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining({
        id: booking.id,
        userId: booking.userId,
        roomId: booking.roomId,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString()
        }
      }));
    });

    it("should respond with status 404 when user doesnt have booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
            await createRooms(hotel.id, 1, 1) as Room;

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 when ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;
      await createBookings(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 400 when ticket isn't hotel type and is remote type", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithNoHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;
      await createBookings(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when user doesn't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;
      await createBookings(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when user doesn't have a enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;
      await createBookings(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);

      //testar falta de pagamento? falta de cadastro? falta de user?
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When toking is valid", () => {
    it("should respond with status 200 and with booking object", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number)
      });
    });

    it("should respond with status 403 when roomId is less than 1", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
            await createRooms(hotel.id, 1, 1) as Room;

            const body = { roomId: -1 };

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when room is full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRoomWithCapacity(hotel.id, 1);
      await createBookings(user.id, room.id);

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 when roomId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createHotels(1) as Hotel;

            const body = { roomId: Number(faker.random.numeric()) };

            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 when roomId is a string", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: faker.random.word() };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 402 when ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 400 when ticket isn't hotel type and is remote type", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithNoHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 400 when user doesn't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 400 when user doesn't have a enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotels(1) as Hotel;
      const room = await createRooms(hotel.id, 1, 1) as Room;

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });

  describe("POST /booking/:bookingId", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.post("/booking/1");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.post("/booking/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.post("/booking/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When token is valid", () => {
      it("should respond with status 200 and with booking object", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          bookingId: booking.id
        });
      });

      it("should respond with status 403 when bookingId isn't a number", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${faker.random.word()}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when user doesn't have a booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${faker.random.numeric()}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when user doesnt own the booking", async () => {
        const user = await createUser();
        const otherUser = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(otherUser.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when roomId is smaller then 1", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: -1 };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when room is full", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRoomWithCapacity(hotel.id, 1);
        const newRoom = await createRoomWithCapacity(hotel.id, 1);
        const booking = await createBookings(user.id, room.id);
        await createBookings(user.id, newRoom.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it("should respond with status 404 when roomId doesn't exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRoomWithCapacity(hotel.id, 1);
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: Number(faker.random.numeric(12)) };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with status 400 when roomId is a string", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: faker.random.word() };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 403 when ticket is not paid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when ticket isn't hotel type and is remote type", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithNoHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it("should respond with status 403 when user doesn't have a ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        await createTicketTypeWithNoHotel();
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it("should respond with status 400 when user doesn't have a enrollment", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createTicketTypeWithNoHotel();
        const hotel = await createHotels(1) as Hotel;
        const room = await createRooms(hotel.id, 1, 1) as Room;
        const newRoom = await createRooms(hotel.id, 1, 1) as Room;
        const booking = await createBookings(user.id, room.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
    });
  });
});
