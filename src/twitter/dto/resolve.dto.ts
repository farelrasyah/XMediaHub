import { IsNotEmpty, IsString, IsOptional, IsInt, Min, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';

export class ResolveDto {
  @IsString() @IsNotEmpty()
  url!: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  index?: number;

  @IsOptional() @IsBooleanString()
  all?: string; // '1' to include variants
}
