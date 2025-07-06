import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadService]
})
export class FileUploadModule {}
