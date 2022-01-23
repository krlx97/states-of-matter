import Service from "./Service.js";

import type {
  Collection,
  DeleteResult,
  Filter,
  FindOneAndUpdateOptions,
  InsertOneResult,
  ModifyResult,
  OptionalId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateResult,
  WithId
} from "mongodb";

import type {Apis} from "../models";

class MongoService<T> extends Service {
  protected readonly _collectionName: string;

  constructor (apis: Apis, collectionName: string) {
    super(apis);
    this._collectionName = collectionName;
  }

  protected get _collection (): Collection<T> {
    return this._apis.mongo.collection(this._collectionName);
  }

  public async find (query: Filter<T>): Promise<WithId<T> | undefined> {
    let document!: WithId<T> | null;

    try {
      document = await this._collection.findOne(query);
    } catch (error) {
      this._handleError(error);
    }

    return document ? document : undefined;
  }

  public async insert (doc: OptionalUnlessRequiredId<T>): Promise<boolean> {
    let inserted!: InsertOneResult<T>;

    try {
      inserted = await this._collection.insertOne(doc);
    } catch (error) {
      this._handleError(error);
    }

    return inserted.acknowledged;
  }

  public async update (filter: Filter<T>, update: UpdateFilter<T> | Partial<T>): Promise<boolean> {
    let updated!: UpdateResult;

    try {
      updated = await this._collection.updateOne(filter, update);
    } catch (error) {
      this._handleError(error);
    }

    return updated.acknowledged;
  }

  public async delete (filter: Filter<T>): Promise<boolean> {
    let deleteResult!: DeleteResult;

    try {
      deleteResult = await this._collection.deleteOne(filter);
    } catch (error) {
      this._handleError(error);
    }

    return deleteResult.acknowledged;
  }

  public async findAndUpdate (
    filter: Filter<T>,
    update: UpdateFilter<T> | Partial<T>,
    options: FindOneAndUpdateOptions
  ): Promise<WithId<T> | undefined> {
    let result!: ModifyResult<T>;

    try {
      result = await this._collection.findOneAndUpdate(filter, update, options);
    } catch (error) {
      this._handleError(error);
    }

    return result.value ? result.value : undefined;
  }
}

export default MongoService;
