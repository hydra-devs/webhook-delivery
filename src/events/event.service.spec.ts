import { Test, TestingModule } from "@nestjs/testing";
import { EventsService } from "./events.service";
import { PrismaService } from "../prisma/prisma.service";

describe("EventService", () => {
  let service: EventsService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });
  it("should return all events belonging to an account", async () => {
    const mockEvents = [
      {
        id: "event-1",
        eventType: "payment.successful",
        payload: { amount: 5000 },
        accountId: "account-1",
      },
      {
        id: "event-2",
        eventType: "payment.failed",
        payload: { amount: 2000 },
        accountId: "account-1",
      },
    ];

    mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

    const result = await service.findAll("account-1");

    expect(result).toEqual(mockEvents);

    expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
      where: {
        accountId: "account-1",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
