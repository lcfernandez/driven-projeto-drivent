import { prisma } from "@/config";

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
  findTicketByUser,
  findAllTicketTypes
};

export default ticketRepository;
