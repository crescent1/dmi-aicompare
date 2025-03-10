import { openDB } from 'idb'
import type { IDBPDatabase, StoreNames } from 'idb'

export function useIndexedDB() {
  const dbName = 'DMIaicompare'
  const version = 1
  const isClient = typeof window !== 'undefined'
  let db: IDBPDatabase | null = null

  const initDB = async () => {
    if (isClient) {
      db = await openDB(dbName, version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('histories')) {
            db.createObjectStore('histories', { keyPath: 'id', autoIncrement: true })
          }
        }
      })
    }
  }

  const add = async <T>(storeName: StoreNames<unknown>, item: T): Promise<IDBValidKey> => {
    if (!db) await initDB()
    return await db!.add(storeName, item)
  }

  const getAll = async <T>(storeName: StoreNames<unknown>): Promise<T[]> => {
    if (!db) await initDB()
    return await db!.getAll(storeName)
  }

  const getById = async <T>(storeName: StoreNames<unknown>, id: IDBValidKey): Promise<T | undefined> => {
    if (!db) await initDB()
    return await db!.get(storeName, id)
  }

  const update = async <T>(storeName: StoreNames<unknown>, item: T): Promise<T> => {
    if (!db) await initDB()
    await db!.put(storeName, item)
    return item
  }

  const remove = async (storeName: StoreNames<unknown>, id: IDBValidKey): Promise<void> => {
    if (!db) await initDB()
    await db!.delete(storeName, id)
  }

  return {
    initDB,
    add,
    getAll,
    getById,
    update,
    remove
  }
}
