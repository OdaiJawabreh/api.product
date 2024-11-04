import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./DTO/create-product.dto";
import { FailureResponse, SuccessResponse } from "src/classes";
import {
  CreateOrderCheckAndUpdateProductRequest,
  CreateOrderCheckAndUpdateProductResponse,
  CreateProductRequestWithOrdersDto,
  CreateProductResponseWithOrdersDto,
  GetProductsByIdsResponseDto,
  ProductData,
} from "./DTO/micro-scrives.dto";

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

      const remainingStock = stock - data.quantity >= 0 ? stock - data.quantity : 0;
      const product = await this.productRepository.save({ name, description, category, sku, price, stock: remainingStock });

      const orderStatus = stock - data.quantity >= 0 ? "Received" : "Partial_receive";
      return {
        clientCode: data.clientCode,
        productId: product.id,
        quantity: data.quantity,
        unitPrice: price,
        totalAmount: price * data.quantity,
        status: orderStatus,
      };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }
  async GetProductsByIds(data: { ids: number[] }): Promise<GetProductsByIdsResponseDto | FailureResponse> {
    try {
      const { ids } = data;

      // Fetch products from the repository based on the provided IDs
      const products = await this.productRepository.find({ where: { id: In(ids) } });

      // Map the fetched products to DTOs
      const productDtos: ProductData[] = products.map((product) => ({
        id: +product.id,
        name: product.name,
        description: product.description || "", // Default to empty string if null
        category: product.category,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
      }));

      console.log({ products: productDtos });

      // Return the response DTO with the list of products
      return { products: productDtos };
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }

  async CreateOrderWithCheckProductUndUpdate(data: CreateOrderCheckAndUpdateProductRequest): Promise<CreateOrderCheckAndUpdateProductResponse | FailureResponse> {
    try {
      let { orderItems } = data;

      // now i want to check if every item quantity is available
      const ids = orderItems.map((el) => el.productId);
      const currentProductData = await this.productRepository.find({ where: { id: In(ids) } });

      const productArrayToUpdate = [];

      const countOfStock = currentProductData.reduce((acc, product) => {
        return product.stock + acc;
      }, 0);

      let status = countOfStock > 0 ? "Received" : "Rejected";
      let totalAmount = 0;

      if (status == "Rejected") {
        orderItems = orderItems.map((el)=>{
          return {
            ...el,
            quantity: 0
          }
        })
      } else {
        orderItems = orderItems.map((product) => {
          const findProduct = currentProductData.find((el) => el.id == product.productId);

          const isEnough = findProduct.stock >= product.quantity;
          const realQuantityAvailable = isEnough ? product.quantity : findProduct.stock;

          if (!isEnough) {
            status = "Partial_receive";
          }
          totalAmount = totalAmount + (product.unitPrice * realQuantityAvailable)
          // now i want to update product
          const newQuantity = (findProduct.stock - realQuantityAvailable )
           this.productRepository.update({id: product.productId},{stock: newQuantity})

          return {
            ...product,
            quantity: realQuantityAvailable > 0 ? realQuantityAvailable : 0,
          };
        });
      }

      return {
        totalAmount,
        status,
        orderItems
      }
    } catch (error) {
      return { ...new FailureResponse(), error_message: error };
    }
  }
}
