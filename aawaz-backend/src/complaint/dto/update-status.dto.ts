import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ example: 'UNDER_REVIEW' })
  status: string;

  @ApiPropertyOptional({ example: 'We are looking into this matter.' })
  remark?: string;
}
