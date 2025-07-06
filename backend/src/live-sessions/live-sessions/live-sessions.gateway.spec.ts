import { Test, TestingModule } from '@nestjs/testing';
import { LiveSessionsGateway } from './live-sessions.gateway';

describe('LiveSessionsGateway', () => {
  let gateway: LiveSessionsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveSessionsGateway],
    }).compile();

    gateway = module.get<LiveSessionsGateway>(LiveSessionsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
