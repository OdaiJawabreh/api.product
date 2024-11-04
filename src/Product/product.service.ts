import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./DTO/create-product.dto";
import { FailureResponse, SuccessResponse } from "src/classes";
import { CreateProductRequestWithOrdersDto, CreateProductResponseWithOrdersDto } from "./DTO/create-product-with-order";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: Partial<CreateProductDto>): Promise<ResponseApi> {
    try {
      const product = await this.productRepository.save(createProductDto);

      return { ...new SuccessResponse(), data: product };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async getAllProducts(limit?: number, offset?: number, key?: string): Promise<ResponseApi> {
    try {
      const obj = (limit == undefined || isNaN(limit)) && (offset == undefined || isNaN(offset)) ? {} : { take: limit || 10, skip: offset || 0 };

      const [count, products] = await this.productRepository.findAndCount({
        where: {
          name: Like(`%${key}%`),
        },
        ...obj,
      });

      return { ...new SuccessResponse(), data: { products, count } };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async getProduct(id: number): Promise<ResponseApi> {
    try {
      if (!id) {
        return { ...new FailureResponse(), error_message: "product id is required" };
      }
      const product = await this.productRepository.findOne({ where: { id } });
      return { ...new SuccessResponse(), data: product };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async update(id: number, data: Partial<CreateProductDto>): Promise<ResponseApi> {
    try {
      if (!id) {
        return { ...new FailureResponse(), error_message: "product id is required" };
      }
      await this.productRepository.update(id, data);

      return { ...new SuccessResponse(), data: "product Updated successfully" };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async delete(id: number): Promise<ResponseApi> {
    try {
      if (!id) {
        return { ...new FailureResponse(), error_message: "product id is required" };
      }
      await this.productRepository.softDelete(id);

      return { ...new SuccessResponse(), data: "product Deleted successfully" };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async createProductWithOrders(data: CreateProductRequestWithOrdersDto): Promise<CreateProductResponseWithOrdersDto | FailureResponse> {
    try {
      const { name, description, category, sku, price, stock } = data;

      const remainingStock = stock - data.quantity >= 0 ? stock - data.quantity : 0
      const product = await this.productRepository.save({name, description, category, sku, price, stock: remainingStock});

      const orderStatus = stock - data.quantity >= 0 ? 'Received' : 'Partial_receive'
      return {
        clientCode : data.clientCode,
        productId : product.id,
        quantity : data.quantity,
        unitPrice : price,
        totalAmount : price * data.quantity,
        status: orderStatus
      }

    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }
}
