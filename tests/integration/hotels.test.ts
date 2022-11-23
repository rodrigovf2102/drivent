import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client";
import { empty } from "@prisma/client/runtime";
import exp from "constants";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser, createHotels } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and with hotels data in a array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

            await createHotels(2) as Hotel[];

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body)
              .toEqual(
                expect.arrayContaining(
                  [expect.objectContaining(
                    {
                      id: expect.any(Number),
                      name: expect.any(String),
                      image: expect.any(String),
                      createdAt: expect.any(String),
                      updatedAt: expect.any(String)
                    })
                  ]
                )
              );

      /*expect(response.body)
                .toEqual([{
                    id: hotels[0].id,
                    name: hotels[0].name,
                    image: hotels[0].image,
                    createdAt: hotels[0].createdAt,
                    updatedAt: hotels[0].updatedAt
                }, {
                    id: hotels[1].id,
                    name: hotels[1].name,
                    image: hotels[1].image,
                    createdAt: hotels[1].createdAt,
                    updatedAt: hotels[1].updatedAt
                }]
                );*/
    });
  });
});

describe("GET /hotels/process/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/process/1");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/process/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/process/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and with hotel data when hotelId is a number and exists on database", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotels(1) as Hotel;

      const response = await server.get(`/hotels/process/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString()
      });
    });

    it("should respond with status 400 when hotelId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createHotels(1);

      const response = await server.get(`/hotels/process/${faker.lorem.word()}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when hotelId doesn't exist on database", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createHotels(1);

      const response = await server.get(`/hotels/process/${faker.random.numeric(12)}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});

