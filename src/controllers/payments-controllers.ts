import { requestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { PaymentPost } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { ticketId } = req.query;
    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const payment = await paymentsService.getPaymentByUserIdTicketId(userId, ticketId as string);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const paymentInfo: PaymentPost = req.body;

    const payment = await paymentsService.createPayment(userId, paymentInfo);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if(error.name==="NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

