import { prisma } from "@/config";
import { NewPayment } from "@/protocols";

async function createPaymentForTicket(newPayment: NewPayment, value: number) {
  const cardDigits = newPayment.cardData.number.toString();

  return await prisma.payment.create(
    {
      data: {
        ticketId: newPayment.ticketId,
        value,
        cardIssuer: newPayment.cardData.issuer,
        cardLastDigits: cardDigits.substring(cardDigits.length - 4)
      }
    }
  );
}

async function findPaymentByTicket(ticketId: number) {
  return await prisma.payment.findFirst(
    {
      where: { ticketId }
    }
  );
}

const paymentRepository = {
  createPaymentForTicket,
  findPaymentByTicket
};

export default paymentRepository;
