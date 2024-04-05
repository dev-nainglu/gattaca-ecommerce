import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productDTO: CreateProductDTO): Promise<Product> {
    const product = new Product();
    product.name = productDTO.name;
    product.pointCost = productDTO.pointCost;
    product.inventoryCount = productDTO.inventoryCount;

    return await this.productRepository.save(product);
  }

  async update(id: number, updates: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error(`product not found`);
    }

    Object.assign(product, updates);

    return await this.productRepository.save(product);
  }

  async findOne(id): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async isAvailable(productId: number): Promise<boolean> {
    try {
      const product = await this.findOne(productId);

      return product.inventoryCount > 0;
    } catch {
      throw new Error('error finding product');
    }
  }

  async reduceInventory(productId: number): Promise<boolean> {
    try {
      const product = await this.findOne(productId);
      const updatedInventoryCount = product.inventoryCount - 1;
      product.inventoryCount = updatedInventoryCount;

      await this.productRepository.save(product);

      return true;
    } catch {
      throw new Error('error updating inventory');
    }
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}
