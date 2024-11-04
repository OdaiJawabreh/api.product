export class CreateProductRequestWithOrdersDto {
    name: string;
    description?: string;
    category: string;
    sku: string;
    price: number;
    stock: number;
    clientCode: number;
    quantity: number;
  }

  export class CreateProductResponseWithOrdersDto {
    clientCode: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    status: string;
  }
  

// DTO for the response of getting products by IDs
export class GetProductsByIdsResponseDto {
  products: ProductData[];
}

// DTO representing individual product data
export class ProductData {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
}
  
  
  