import { Types } from 'mongoose';
import { Beer, IBeer } from '../models/Beer';
import { IBeerRepository, BeerQuery } from './interfaces/IBeerRepository';

export class BeerRepository implements IBeerRepository {
  async findById(id: string | Types.ObjectId): Promise<IBeer | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return Beer.findById(objectId).lean();
  }

  async findByIdWithBrewery(id: string | Types.ObjectId): Promise<IBeer | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return Beer.findById(objectId).populate('brewery').lean();
  }

  async find(query: BeerQuery): Promise<IBeer[]> {
    return Beer.find(query).lean();
  }

  async findWithPagination(
    query: BeerQuery,
    skip: number,
    limit: number,
    sort: any
  ): Promise<IBeer[]> {
    return Beer.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('brewery')
      .lean();
  }

  async count(query: BeerQuery): Promise<number> {
    return Beer.countDocuments(query);
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return Beer.aggregate(pipeline);
  }

  async create(data: Partial<IBeer>): Promise<IBeer> {
    const beer = new Beer(data);
    await beer.save();
    return beer.toObject();
  }

  async update(id: string | Types.ObjectId, data: Partial<IBeer>): Promise<IBeer | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return Beer.findByIdAndUpdate(objectId, data, { new: true }).lean();
  }

  async delete(id: string | Types.ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const result = await Beer.findByIdAndDelete(objectId);
    return !!result;
  }
}