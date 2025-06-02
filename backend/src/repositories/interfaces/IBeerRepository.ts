import { Types } from 'mongoose';
import { IBeer } from '../../models/Beer';

export interface BeerQuery {
  style?: RegExp | string;
  brewery?: string | Types.ObjectId;
  awards?: any;
  $or?: any[];
}

export interface IBeerRepository {
  findById(id: string | Types.ObjectId): Promise<IBeer | null>;
  findByIdWithBrewery(id: string | Types.ObjectId): Promise<IBeer | null>;
  find(query: BeerQuery): Promise<IBeer[]>;
  findWithPagination(
    query: BeerQuery,
    skip: number,
    limit: number,
    sort: any
  ): Promise<IBeer[]>;
  count(query: BeerQuery): Promise<number>;
  aggregate(pipeline: any[]): Promise<any[]>;
  create(data: Partial<IBeer>): Promise<IBeer>;
  update(id: string | Types.ObjectId, data: Partial<IBeer>): Promise<IBeer | null>;
  delete(id: string | Types.ObjectId): Promise<boolean>;
}