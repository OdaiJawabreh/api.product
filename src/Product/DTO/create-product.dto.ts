import { IsNumber, IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Mr. Chips',
    description: 'Product Name',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 20.99,
    description: 'Price for quantity',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    example: 9,
    description: 'Number Of Stock',
  })
  @IsNotEmpty()
  @IsInt()
  readonly stock: number;
}
