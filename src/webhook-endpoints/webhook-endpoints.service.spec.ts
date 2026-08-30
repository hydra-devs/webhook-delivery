import { Test, TestingModule } from '@nestjs/testing';
import { WebhookEndpointsService } from './webhook-endpoints.service';

describe('WebhookEndpointsService', () => {
  let service: WebhookEndpointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookEndpointsService],
    }).compile();

    service = module.get<WebhookEndpointsService>(WebhookEndpointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
