import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
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

  it("should return empty array if there is no events", async () => {
    const mockEvents = [];

    mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

    const result = await service.findAll("account-1");

    expect(result).toEqual([]);
  });

  it("should filter events by eventType", async () => {
    mockPrismaService.event.findMany.mockResolvedValue([]);

    await service.findAll("account-1", "payment.successful");

    expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
      where: {
        accountId: "account-1",
        eventType: "payment.successful",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
    });
  });

  it("should apply pagination correctly", async () => {
    mockPrismaService.event.findMany.mockResolvedValue([]);

    await service.findAll("account-1", undefined, 2, 5);

    expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
      where: {
        accountId: "account-1",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 5,
      take: 5,
    });
  });

  it("should throw an error if fetching events fails", async () => {
    mockPrismaService.event.findMany.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(service.findAll("account-1")).rejects.toThrow(
      "Database error",
    );
  });

  it("should call findAll", async () => {
    const spy = jest.spyOn(service, "findAll");

    await service.findAll("account-1");

    expect(spy).toHaveBeenCalled();
  });

  // CREATE Event Test
  it("should create an event", async () => {
    const dto = {
      eventType: "payment.successful",
      payload: { amount: 5000 },
    };

    const mockEvent = {
      id: "event-1",
      ...dto,
      accountId: "account-1",
      createdAt: new Date(),
    };

    mockPrismaService.event.create.mockResolvedValue(mockEvent);

    const result = await service.create(dto, "account-1");

    expect(result).toEqual(mockEvent);

    expect(mockPrismaService.event.create).toHaveBeenCalledWith({
      data: {
        eventType: dto.eventType,
        payload: dto.payload,
        accountId: "account-1",
      },
    });
  });

  it("should throw an error if creating an event fails", async () => {
    const dto = {
      eventType: "payment.successful",
      payload: { amount: 5000 },
    };

    mockPrismaService.event.create.mockRejectedValue(
      new Error("Database error"),
    );

    await expect(service.create(dto, "account-1")).rejects.toThrow(
      "Database error",
    );
  });

  // FindOne
  it("should return an event by id", async () => {
    const mockEvent = {
      id: "event-1",
      eventType: "payment.successful",
      payload: { amount: 5000 },
      accountId: "account-1",
      createdAt: new Date(),
    };

    mockPrismaService.event.findFirst.mockResolvedValue(mockEvent);

    const result = await service.findOne("event-1", "account-1");

    expect(result).toEqual(mockEvent);

    expect(mockPrismaService.event.findFirst).toHaveBeenCalledWith({
      where: {
        id: "event-1",
        accountId: "account-1",
      },
    });
  });

  it("should throw NotFoundException if event does not exist", async () => {
    mockPrismaService.event.findFirst.mockResolvedValue(null);

    await expect(service.findOne("event-1", "account-1")).rejects.toThrow(
      NotFoundException,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
});
