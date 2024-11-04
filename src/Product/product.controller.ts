import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./DTO/create-product.dto";
import { ProductService } from "./product.service";
import { FailureResponse } from "src/classes";
import { CreateProductRequestWithOrdersDto } from "./DTO/create-product-with-order";

@Controller("product")
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Partial<CreateProductDto>){
    return this.productService.create(createProductDto);
  }


  @Get()
  getAllProducts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('key') key?: string,
  ){
    return this.productService.getAllProducts(limit, offset, key);
  }

  @Get('/:id')
  getProduct(
    @Param('id') id: string,
  ){
    return this.productService.getProduct(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createProductDto: Partial<CreateProductDto>) {
    return this.productService.update(+id, createProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
  // microservices section
  @GrpcMethod("ProductService", "CreateProductWithOrders")
  async createProductWithOrders(data: CreateProductRequestWithOrdersDto) {
    return this.productService.createProductWithOrders(data)
  }

 
}
