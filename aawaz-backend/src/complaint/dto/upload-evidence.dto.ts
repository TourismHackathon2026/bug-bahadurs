import { ApiProperty } from '@nestjs/swagger';

export class UploadEvidenceDto {
  @ApiProperty({ example: 'PHOTO' })
  type: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ example: 2048576 })
  fileSize: number;
}

export class EvidenceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'PHOTO' })
  type: string;

  @ApiProperty({ example: 'https://storage.example.com/evidence/abc.jpg' })
  fileUrl: string;

  @ApiProperty({ example: '2026-06-27T09:00:00.000Z' })
  createdAt: string;
}
