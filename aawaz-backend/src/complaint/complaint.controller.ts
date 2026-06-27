import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreateComplaintDto,
  CreateComplaintResponseDto,
} from './dto/create-complaint.dto';
import { ComplaintListItemDto } from './dto/complaint-list-item.dto';
import { ComplaintDetailDto } from './dto/complaint-detail.dto';
import {
  UploadEvidenceDto,
  EvidenceResponseDto,
} from './dto/upload-evidence.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationParams } from '../common/dto/pagination-params.dto';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintController {
  @Post()
  @ApiOperation({ summary: 'File a new complaint' })
  @ApiCreatedResponse({ type: ApiResponseDto<CreateComplaintResponseDto> })
  create(
    @Body() _dto: CreateComplaintDto,
  ): ApiResponseDto<CreateComplaintResponseDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        referenceNumber: 'AWAAZ-2026-00001',
        status: 'SUBMITTED',
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'List complaints (feed-style filtering)' })
  @ApiOkResponse({ type: ApiResponseDto<ComplaintListItemDto> })
  findAll(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get complaint detail' })
  @ApiOkResponse({ type: ApiResponseDto<ComplaintDetailDto> })
  findOne(@Param('id') _id: string): ApiResponseDto<ComplaintDetailDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        referenceNumber: 'AWAAZ-2026-00001',
        title: 'Lost passport at Thamel',
        description: 'I lost my passport while walking around Thamel area...',
        category: 'THEFT',
        status: 'SUBMITTED',
        incidentDate: '2026-06-25T10:30:00.000Z',
        isAnonymous: false,
        createdAt: '2026-06-27T09:00:00.000Z',
        updatedAt: '2026-06-27T09:00:00.000Z',
      },
    };
  }

  @Post(':id/evidence')
  @ApiOperation({ summary: 'Upload evidence for a complaint' })
  @ApiCreatedResponse({ type: ApiResponseDto<EvidenceResponseDto> })
  uploadEvidence(
    @Param('id') _id: string,
    @Body() _dto: UploadEvidenceDto,
  ): ApiResponseDto<EvidenceResponseDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'PHOTO',
        fileUrl: 'https://storage.example.com/evidence/abc.jpg',
        createdAt: '2026-06-27T09:00:00.000Z',
      },
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update complaint status' })
  @ApiOkResponse({ type: ApiResponseDto<ComplaintDetailDto> })
  updateStatus(
    @Param('id') _id: string,
    @Body() _dto: UpdateStatusDto,
  ): ApiResponseDto<ComplaintDetailDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        referenceNumber: 'AWAAZ-2026-00001',
        title: 'Lost passport at Thamel',
        description: 'I lost my passport while walking around Thamel area...',
        category: 'THEFT',
        status: _dto.status,
        incidentDate: '2026-06-25T10:30:00.000Z',
        isAnonymous: false,
        createdAt: '2026-06-27T09:00:00.000Z',
        updatedAt: '2026-06-27T09:00:00.000Z',
      },
    };
  }
}
