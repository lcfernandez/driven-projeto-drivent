import { notFoundError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";

async function getPaymentByUser(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const payment = await paymentRepository.findPaymentByTicket(ticketId);

  if (payment.Ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  return exclude(payment, "Ticket");
}

const paymentsService = {
  getPaymentByUser
};

export default paymentsService;
