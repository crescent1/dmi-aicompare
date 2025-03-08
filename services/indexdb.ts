import { openDB } from 'idb'
import type { IDBPDatabase, StoreNames } from 'idb'

export class IndexDBService {
  private dbName = 'BestariAI'
  private version = 1
  private db: IDBPDatabase | null = null

  async initDB() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('histories')) {
          db.createObjectStore('histories', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  async add<T>(storeName: StoreNames<unknown>, item: T): Promise<IDBValidKey> {
    if (!this.db) await this.initDB()
    return await this.db!.add(storeName, item)
  }

  async getAll<T>(storeName: StoreNames<unknown>): Promise<T[]> {
    if (!this.db) await this.initDB()
    return await this.db!.getAll(storeName)
  }

  async getById<T>(storeName: StoreNames<unknown>, id: IDBValidKey): Promise<T | undefined> {
    if (!this.db) await this.initDB()
    return await this.db!.get(storeName, id)
  }

  async update<T>(storeName: StoreNames<unknown>, item: T): Promise<T> {
    if (!this.db) await this.initDB()
    await this.db!.put(storeName, item)
    return item
  }

  async delete(storeName: StoreNames<unknown>, id: IDBValidKey): Promise<void> {
    if (!this.db) await this.initDB()
    await this.db!.delete(storeName, id)
  }
}

export const indexDBService = new IndexDBService()
