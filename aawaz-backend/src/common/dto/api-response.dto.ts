import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class ApiResponseDto<TData> {
  @ApiPropertyOptional()
  data?: TData;

  @ApiPropertyOptional({ example: null, nullable: true })
  error?: string | null;

  @ApiPropertyOptional({ type: PaginationMeta })
  meta?: PaginationMeta;
}
