import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/response.dto';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get()
  async findAll(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const instructors = await this.instructorsService.findAll(paginationDto);
    return new ApiResponse(true, 'Instructors retrieved successfully', instructors);
  }

  @Get('top')
  async getTopInstructors(
    @Query('limit') limit?: string,
  ): Promise<ApiResponse<any[]>> {
    const instructors = await this.instructorsService.getTopInstructors(
      limit ? parseInt(limit) : 5,
    );
    return new ApiResponse(true, 'Top instructors retrieved successfully', instructors);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const instructor = await this.instructorsService.findOne(id);
    
    if (!instructor) {
      return new ApiResponse(false, 'Instructor not found', null);
    }

    return new ApiResponse(true, 'Instructor retrieved successfully', instructor);
  }
}
