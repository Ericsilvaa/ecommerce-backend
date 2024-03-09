import { DeepPartial, DeleteResult, FindOptionsWhere, ObjectLiteral, ObjectType } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";


export interface IBaseRepository<T> {
  createRegister(data: DeepPartial<T>): Promise<T>;
  getOneRegister(where?: Partial<T>, options?: Partial<T>): Promise<T | null>;
  getAllRegister(where?: Partial<T>): Promise<T[]>;
  updateRegister(id: Partial<T>, data: QueryDeepPartialEntity<T>): Promise<{ affected: number | undefined; dataUpdated: T | null }>;
  delete(id: number): Promise<DeleteResult>;
}