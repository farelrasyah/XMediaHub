import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DownloadDto {
  @ApiProperty({ description: 'Twitter tweet URL', example: 'https://twitter.com/username/status/123456789' })
  @IsString() @IsNotEmpty()
  url!: string;

  /** target bitrate (kbps), optional */
  @ApiPropertyOptional({ description: 'Target bitrate in kbps', example: 720 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(32)
  bitrate?: number;

  /** pick media index if multiple */
  @ApiPropertyOptional({ description: 'Media index if multiple', example: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  index?: number;
}
