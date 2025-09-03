import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DownloadDto {
  @IsString() @IsNotEmpty()
  url!: string;

  /** target bitrate (kbps), optional */
  @IsOptional() @Type(() => Number) @IsInt() @Min(32)
  bitrate?: number;

  /** pick media index if multiple */
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  index?: number;
}
