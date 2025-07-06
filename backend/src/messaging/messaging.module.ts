import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging/messaging.gateway';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway]
})
export class MessagingModule {}
