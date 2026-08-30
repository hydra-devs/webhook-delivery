import { Test, TestingModule } from '@nestjs/testing';
import { WebhookEndpointsController } from './webhook-endpoints.controller';

describe('WebhookEndpointsController', () => {
  let controller: WebhookEndpointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookEndpointsController],
    }).compile();

    controller = module.get<WebhookEndpointsController>(WebhookEndpointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
