import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  MarkReadResponseDto,
  UnreadCountResponseDto,
} from './dto/mark-read.dto';
import {
  UpdatePreferenceDto,
  NotificationPreferenceResponseDto,
} from './dto/update-preference.dto';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  @Get('tourists/me/notifications')
  @ApiOperation({ summary: 'Get tourist notifications' })
  @ApiOkResponse({ type: ApiResponseDto })
  touristNotifications(): ApiResponseDto<unknown[]> {
    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }

  @Patch('tourists/me/notifications/:id/read')
  @ApiOperation({ summary: 'Mark tourist notification as read' })
  @ApiOkResponse({ type: ApiResponseDto<MarkReadResponseDto> })
  markTouristRead(
    @Param('id') _id: string,
  ): ApiResponseDto<MarkReadResponseDto> {
    return { data: { success: true } };
  }

  @Get('authorities/me/notifications')
  @ApiOperation({ summary: 'Get authority officer notifications' })
  @ApiOkResponse({ type: ApiResponseDto })
  authorityNotifications(): ApiResponseDto<unknown[]> {
    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }

  @Patch('authorities/me/notifications/:id/read')
  @ApiOperation({ summary: 'Mark authority notification as read' })
  @ApiOkResponse({ type: ApiResponseDto<MarkReadResponseDto> })
  markAuthorityRead(
    @Param('id') _id: string,
  ): ApiResponseDto<MarkReadResponseDto> {
    return { data: { success: true } };
  }

  @Get('notifications/unread-count')
  @ApiOperation({ summary: 'Get total unread notification count' })
  @ApiOkResponse({ type: ApiResponseDto<UnreadCountResponseDto> })
  unreadCount(): ApiResponseDto<UnreadCountResponseDto> {
    return { data: { count: 0 } };
  }

  @Patch('notifications/preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiOkResponse({ type: ApiResponseDto<NotificationPreferenceResponseDto> })
  updatePreferences(
    @Body() _dto: UpdatePreferenceDto,
  ): ApiResponseDto<NotificationPreferenceResponseDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        channel: 'EMAIL',
        eventType: 'STATUS_CHANGED',
        enabled: true,
      },
    };
  }
}
