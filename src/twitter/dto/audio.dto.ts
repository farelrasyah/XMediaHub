import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AudioDto {
  @IsString() @IsNotEmpty()
  url!: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(32)
  bitrate?: number; // kbps

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  index?: number;

  @IsOptional() @IsString()
  filename?: string;
}
