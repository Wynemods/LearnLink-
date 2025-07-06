import { Test, TestingModule } from '@nestjs/testing';
import { LiveSessionsController } from './live-sessions.controller';

describe('LiveSessionsController', () => {
  let controller: LiveSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveSessionsController],
    }).compile();

    controller = module.get<LiveSessionsController>(LiveSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
