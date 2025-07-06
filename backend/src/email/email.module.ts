import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Export EmailService so it can be used in other modules
})
export class EmailModule {}
