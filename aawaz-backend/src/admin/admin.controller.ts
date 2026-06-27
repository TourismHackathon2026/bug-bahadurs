import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ComplaintListItemDto } from '../complaint/dto/complaint-list-item.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationParams } from '../common/dto/pagination-params.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  @Get('registrations')
  @ApiOperation({ summary: 'List pending tourist registrations' })
  @ApiOkResponse({ type: ApiResponseDto })
  listRegistrations(
    @Query() _params: PaginationParams,
  ): ApiResponseDto<unknown[]> {
    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }

  @Patch('registrations/:id/approve')
  @ApiOperation({ summary: 'Approve a tourist registration' })
  @ApiOkResponse({ type: ApiResponseDto })
  approveRegistration(
    @Param('id') _id: string,
  ): ApiResponseDto<{ message: string }> {
    return { data: { message: 'Registration approved.' } };
  }

  @Patch('registrations/:id/reject')
  @ApiOperation({ summary: 'Reject a tourist registration' })
  @ApiOkResponse({ type: ApiResponseDto })
  rejectRegistration(
    @Param('id') _id: string,
    @Body() _body: { reason: string },
  ): ApiResponseDto<{ message: string }> {
    return { data: { message: 'Registration rejected.' } };
  }

  @Get('complaints')
  @ApiOperation({ summary: 'View all complaints (full visibility)' })
  @ApiOkResponse({ type: ApiResponseDto<ComplaintListItemDto> })
  allComplaints(
    @Query() _params: PaginationParams,
  ): ApiResponseDto<ComplaintListItemDto[]> {
    return {
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  @Get('authorities')
  @ApiOperation({ summary: 'Manage authority accounts' })
  @ApiOkResponse({ type: ApiResponseDto })
  listAuthorities(): ApiResponseDto<unknown[]> {
    return { data: [] };
  }

  @Get('reports')
  @ApiOperation({ summary: 'Aggregated reports by category/status/authority' })
  @ApiOkResponse({ type: ApiResponseDto })
  reports(): ApiResponseDto<Record<string, unknown>> {
    return {
      data: {
        totalComplaints: 0,
        byCategory: {},
        byStatus: {},
        byAuthority: {},
      },
    };
  }
}
