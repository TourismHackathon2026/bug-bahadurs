import { ApiProperty } from '@nestjs/swagger';

export class RequestEvidenceDto {
  @ApiProperty({
    example: 'Please upload a clear photo of your passport details page.',
  })
  message: string;
}
