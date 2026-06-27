import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ComplaintListItemDto } from '../complaint/dto/complaint-list-item.dto';
import { RequestEvidenceDto } from './dto/request-evidence.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationParams } from '../common/dto/pagination-params.dto';

@ApiTags('Authority')
@Controller('authorities')
export class AuthorityController {
  @Get('me/complaints')
  @ApiOperation({ summary: 'Get assigned complaints for authority officer' })
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
          status: 'UNDER_REVIEW',
          locationName: 'Thamel, Kathmandu',
          incidentDate: '2026-06-25T10:30:00.000Z',
          createdAt: '2026-06-27T09:00:00.000Z',
        },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    };
  }

  @Post('complaints/:id/request-evidence')
  @ApiOperation({ summary: 'Request additional evidence from tourist' })
  @ApiOkResponse({ type: ApiResponseDto })
  requestEvidence(
    @Param('id') _id: string,
    @Body() _dto: RequestEvidenceDto,
  ): ApiResponseDto<{ message: string }> {
    return { data: { message: 'Evidence requested successfully.' } };
  }

  @Post('complaints/:id/resolve')
  @ApiOperation({ summary: 'Resolve a complaint' })
  @ApiOkResponse({ type: ApiResponseDto })
  resolve(
    @Param('id') _id: string,
    @Body() _dto: ResolveComplaintDto,
  ): ApiResponseDto<{ message: string }> {
    return { data: { message: 'Complaint resolved successfully.' } };
  }
}
