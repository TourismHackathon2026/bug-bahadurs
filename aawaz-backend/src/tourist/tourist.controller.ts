import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ComplaintListItemDto } from '../complaint/dto/complaint-list-item.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationParams } from '../common/dto/pagination-params.dto';

@ApiTags('Tourist')
@Controller('tourists')
export class TouristController {
  @Get('me/complaints')
  @ApiOperation({ summary: 'Get my complaints feed' })
  @ApiOkResponse({ type: ApiResponseDto<ComplaintListItemDto> })
  myComplaints(
    @Query() _params: PaginationParams,
  ): ApiResponseDto<ComplaintListItemDto[]> {
    return {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          referenceNumber: 'AWAAZ-2026-00001',
          title: 'Lost passport at Thamel',
          category: 'THEFT',
          status: 'SUBMITTED',
          locationName: 'Thamel, Kathmandu',
          incidentDate: '2026-06-25T10:30:00.000Z',
          createdAt: '2026-06-27T09:00:00.000Z',
        },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    };
  }
}
