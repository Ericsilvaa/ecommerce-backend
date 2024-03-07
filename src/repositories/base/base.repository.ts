import { DataSource, DeepPartial, ObjectType, Repository, FindOptionsWhere, ObjectLiteral } from "typeorm"
import { AppDataSource } from "../../db/datasource"
import { IBaseRepository } from "./IBaseRepository"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

export default class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T>{
  protected db: DataSource = AppDataSource
  protected repository: Repository<T>

  constructor(private entityType: ObjectType<T>) {
    this.repository = this.db.getRepository(entityType)
  }

  async getAllRegister(where: FindOptionsWhere<T> = {}) {
    return this.repository.find({ where: { ...where } })
  }

  async getOneRegister(where = {}, options = {}): Promise<T | null> {
    return await this.repository.findOne({ where: { ...where }, ...options })
  }

  async createRegister(data: DeepPartial<T>) {
    const entity = this.repository.create(data)
    return this.repository.save(entity)
  }

  async updateRegister(id: Partial<T>, data: QueryDeepPartialEntity<T>): Promise<{ affected: number | undefined; dataUpdated: T | null }> {
    const { affected } = await this.repository.update(id, data);
    const dataUpdated = await this.repository.findOne({ where: id });

    return { affected, dataUpdated }
  }

  async delete(id: number) {
    return await this.repository.delete(id)
  }

}