import { prisma } from "@/config";

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create(
    {
      data: {
        ticketTypeId,
        enrollmentId,
        status: "RESERVED"
      },
      include: { TicketType: true }
    }
  );
}

async function findTicketByUser(userId: number) {
  return await prisma.ticket.findFirst(
    {
      where: { Enrollment: { userId } },
      include: { TicketType: true }
    }
  );
}

async function findAllTicketTypes() {
  return await prisma.ticketType.findMany();
}

const ticketRepository = {
  createTicket,
  findTicketByUser,
  findAllTicketTypes
};

export default ticketRepository;
