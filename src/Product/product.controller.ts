import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./DTO/create-product.dto";
import { ProductResponse } from "./DTO/create-product.response";

@Controller("product")
export class ProductController {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  @GrpcMethod("ProductService", "CreateProduct")
  async create(data: CreateProductDto): Promise<ProductResponse> {
    const product = this.productRepository.create(data);
    const savedProduct = await this.productRepository.save(product);

    return {
      id: savedProduct.id,
      name: savedProduct.name,
      price: savedProduct.price,
      stock: savedProduct.stock,
    };
  }
}
