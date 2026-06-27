import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComplaintDetailDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'AWAAZ-2026-00001' })
  referenceNumber: string;

  @ApiProperty({ example: 'Lost passport at Thamel' })
  title: string;

  @ApiProperty({
    example: 'I lost my passport while walking around Thamel area...',
  })
  description: string;

  @ApiProperty({ example: 'THEFT' })
  category: string;

  @ApiProperty({ example: 'SUBMITTED' })
  status: string;

  @ApiPropertyOptional({ example: 'HIGH' })
  priority?: string;

  @ApiPropertyOptional({ example: 27.7172 })
  locationLat?: number;

  @ApiPropertyOptional({ example: 85.324 })
  locationLng?: number;

  @ApiPropertyOptional({ example: 'Thamel, Kathmandu' })
  locationName?: string;

  @ApiProperty({ example: '2026-06-25T10:30:00.000Z' })
  incidentDate: string;

  @ApiProperty({ example: false })
  isAnonymous: boolean;

  @ApiProperty({ example: '2026-06-27T09:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-06-27T09:00:00.000Z' })
  updatedAt: string;
}
