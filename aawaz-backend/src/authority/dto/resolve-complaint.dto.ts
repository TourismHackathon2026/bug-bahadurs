import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResolveComplaintDto {
  @ApiProperty({ example: 'RESOLVED' })
  status: string;

  @ApiPropertyOptional({
    example: 'The passport has been found and returned to the tourist.',
  })
  resolution?: string;
}
