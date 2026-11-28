import { Test, TestingModule } from "@nestjs/testing";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { ApiKeyGuardTsGuard } from "../api-key/guard/api-key-guard.ts/api-key-guard.ts.guard";
import { AuthenticatedRequest } from "../auth/interface/authenticated-request";
import { ApiKeyAuthenticatedRequest } from "../api-key/interface/api-key-auth-request.interface";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";

describe("EventController", () => {
  let controller: EventsController;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    })
      .overrideGuard(ApiKeyGuardTsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<EventsController>(EventsController);
  });
  it("should return all events", async () => {
    const mockEvents = [
      {
        id: "event-1",
        eventType: "payment.successful",
        payload: { amount: 5000 },
        accountId: "account-1",
      },
    ];

    mockEventsService.findAll.mockResolvedValue(mockEvents);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    const result = await controller.findAll(req);

    expect(result).toEqual(mockEvents);

    expect(mockEventsService.findAll).toHaveBeenCalled();
  });
  it("should pass the accountId to the service", async () => {
    mockEventsService.findAll.mockResolvedValue([]);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await controller.findAll(req);

    expect(mockEventsService.findAll).toHaveBeenCalledWith(
      "account-1",
      undefined,
      1,
      10,
    );
  });
  it("should pass eventType to the service", async () => {
    mockEventsService.findAll.mockResolvedValue([]);

    const req = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await controller.findAll(req, "payment.successful");

    expect(mockEventsService.findAll).toHaveBeenCalledWith(
      "account-1",
      "payment.successful",
      1,
      10,
    );
  });
  it("should pass pagination parameters to the service", async () => {
    mockEventsService.findAll.mockResolvedValue([]);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await controller.findAll(req, undefined, "2", "5");

    expect(mockEventsService.findAll).toHaveBeenCalledWith(
      "account-1",
      undefined,
      2,
      5,
    );
  });
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

    mockEventsService.create.mockResolvedValue(mockEvent);

    const req: ApiKeyAuthenticatedRequest = {
      headers: {},
      accountId: "account-1",
    };

    const result = await controller.create(dto, req);

    expect(result).toEqual(mockEvent);

    expect(mockEventsService.create).toHaveBeenCalledWith(dto, "account-1");
  });
  it("should return an event by id", async () => {
    const mockEvent = {
      id: "event-1",
      eventType: "payment.successful",
      payload: { amount: 5000 },
      accountId: "account-1",
      createdAt: new Date(),
    };

    mockEventsService.findOne.mockResolvedValue(mockEvent);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    const result = await controller.findOne(req, "event-1");

    expect(result).toEqual(mockEvent);

    expect(mockEventsService.findOne).toHaveBeenCalledWith(
      "event-1",
      "account-1",
    );
  });
  it("should throw NotFoundException if event does not exist", async () => {
    mockEventsService.findOne.mockRejectedValue(
      new NotFoundException("Event not found"),
    );

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await expect(controller.findOne(req, "event-1")).rejects.toThrow(
      NotFoundException,
    );
  });
  it("should reject invalid pagination parameters", async () => {
    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    expect(() => controller.findAll(req, undefined, "0", "10")).toThrow(
      BadRequestException,
    );
  });
  it("should pass the authenticated account ID when finding an event", async () => {
    mockEventsService.findOne.mockResolvedValue(null);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await controller.findOne(req, "event-1");

    expect(mockEventsService.findOne).toHaveBeenCalledWith(
      "event-1",
      "account-1",
    );
  });
  it("should propagate errors when creating an event", async () => {
    mockEventsService.create.mockRejectedValue(new Error("Database error"));

    const dto = {
      eventType: "payment.successful",
      payload: { amount: 5000 },
    };

    const req: ApiKeyAuthenticatedRequest = {
      headers: {},
      accountId: "account-1",
    };

    await expect(controller.create(dto, req)).rejects.toThrow("Database error");
  });
  it("should propagate errors when retrieving events", async () => {
    mockEventsService.findAll.mockRejectedValue(new Error("Database error"));

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await expect(controller.findAll(req)).rejects.toThrow("Database error");
  });
  it("should use default pagination values", async () => {
    mockEventsService.findAll.mockResolvedValue([]);

    const req: AuthenticatedRequest = {
      headers: {},
      user: {
        userId: "user-1",
        accountId: "account-1",
        role: "OWNER",
      },
    };

    await controller.findAll(req);

    expect(mockEventsService.findAll).toHaveBeenCalledWith(
      "account-1",
      undefined,
      1,
      10,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
});
