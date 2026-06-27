import { ApiProperty } from '@nestjs/swagger';

export class MarkReadResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}

export class UnreadCountResponseDto {
  @ApiProperty({ example: 3 })
  count: number;
}
