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

async function findTicketById(id: number) {
  return await prisma.ticket.findUnique(
    {
      where: { id },
      include: { Enrollment: true, TicketType: true }
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

async function updateTicketStatus(id: number) {
  return await prisma.ticket.update(
    {
      where: { id },
      data: { status: "PAID" },
    }
  );
}

const ticketRepository = {
  createTicket,
  findTicketById,
  findTicketByUser,
  findAllTicketTypes,
  updateTicketStatus
};

export default ticketRepository;
