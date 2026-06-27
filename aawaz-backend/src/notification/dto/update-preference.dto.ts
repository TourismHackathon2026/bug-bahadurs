import { ApiProperty } from '@nestjs/swagger';

export class UpdatePreferenceDto {
  @ApiProperty({ example: 'EMAIL' })
  channel: string;

  @ApiProperty({ example: 'STATUS_CHANGED' })
  eventType: string;

  @ApiProperty({ example: true })
  enabled: boolean;
}

export class NotificationPreferenceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'EMAIL' })
  channel: string;

  @ApiProperty({ example: 'STATUS_CHANGED' })
  eventType: string;

  @ApiProperty({ example: true })
  enabled: boolean;
}
