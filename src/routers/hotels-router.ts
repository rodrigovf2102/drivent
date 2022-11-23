import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelRoomsByHotelIdWithNoBookings } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelRoomsByHotelIdWithNoBookings);

export { hotelsRouter };
