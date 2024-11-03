import { IsNumber, IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Mr. Chips',
    description: 'Product Name',
  })
  @IsNotEmpty()
  @IsString()
   name: string;

   @ApiProperty({
    example: 'A brief description of the product.',
    description: 'good product with high quality',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Category of the product (e.g., electronics, clothing).',
    description: 'electronics',
  })
  @IsNotEmpty()
  @IsString()
  category: string;


  @ApiProperty({
    example: 20,
    description: 'Price for quantity',
  })
  @IsNotEmpty()
  @IsNumber()
   price: number;

   @ApiProperty({
    example: 'Stock Keeping Unit, unique identifier for inventory tracking.',
    description: '010265ajja56',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({
    example: 9,
    description: 'Current stock level of the product.',
  })
  @IsNotEmpty()
  @IsInt()
   stock: number;
};
