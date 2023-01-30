import { prisma } from "@/config";

async function findPaymentByTicket(ticketId: number) {
  return await prisma.payment.findFirst(
    {
      where: { ticketId },
      include: { Ticket: { include: { Enrollment: true } } }
    }
  );
}

const paymentRepository = {
  findPaymentByTicket
};

export default paymentRepository;
