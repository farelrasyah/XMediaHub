import { IsNotEmpty, IsString, IsOptional, IsInt, Min, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResolveDto {
  @ApiProperty({ description: 'Twitter tweet URL', example: 'https://twitter.com/username/status/123456789' })
  @IsString() @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({ description: 'Media index if multiple', example: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  index?: number;

  @ApiPropertyOptional({ description: 'Include all variants (1 for yes)', example: '1' })
  @IsOptional() @IsBooleanString()
  all?: string; // '1' to include variants
}
