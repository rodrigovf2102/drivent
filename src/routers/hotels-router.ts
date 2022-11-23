import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelById } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/process/:hotelId", getHotelById);

export { hotelsRouter };
