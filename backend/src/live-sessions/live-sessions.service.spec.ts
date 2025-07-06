import { Test, TestingModule } from '@nestjs/testing';
import { LiveSessionsService } from './live-sessions.service';

describe('LiveSessionsService', () => {
  let service: LiveSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveSessionsService],
    }).compile();

    service = module.get<LiveSessionsService>(LiveSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
