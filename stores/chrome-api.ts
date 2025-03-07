import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useIndexedDB } from '~/composables/useIndexedDB'
import { useLocalStorage } from '~/composables/useLocalStorage'
import type { Credential, Item, Message, Roles, StorageKeys } from '~/types'

export const useChromeApiStore = defineStore('chrome-api', () => {
  const { add, getAll, getById, update, remove } = useIndexedDB()
  const { setLocalData, getLocalData, removeLocalData, clearLocalData } = useLocalStorage()
  
  const loadingStorage = ref<boolean>(false)
  const items = ref<Item[]>([])
  const storageKeys = ref<StorageKeys>({
    drawer_status: 'drawer_status',
    rail_status: 'rail_status',
    drawer_admin: 'drawer_admin',
    rail_admin: 'rail_admin',
    selected_models: 'selected_models',
    system_prompt: 'system_prompt'
  })
  const roles = ref<Roles>({
    user: 'user',
    assistant: 'assistant'
  })

  async function fetchItems() {
    try {
      items.value = await getAll<Item>('histories')
      return items.value
    } catch (error) {
      // errorMessage(error)
    }
  }

  async function fetchItemById(id: string) {
    loadingStorage.value = true
    try {
      return await getById<Item>('histories', id)
    } catch (error) {
      // errorMessage(error)
    } finally {
      loadingStorage.value = false
    }
  }

  async function addItem(item: Item) {
    loadingStorage.value = true
    try {
      const id = await add('histories', item)
      await fetchItems()
      return id
    } catch (error) {
      // errorMessage(error)
    } finally {
      loadingStorage.value = false
    }
  }

  async function updateItem(item: Item) {
    try {
      await update('histories', item)
      await fetchItems()
    } catch (error) {
      // errorMessage(error)
    }
  }

  async function deleteItem(id: IDBValidKey) {
    loadingStorage.value = true
    try {
      await remove('histories', id)
      await fetchItems()
    } catch (error) {
      // errorMessage(error)
    } finally {
      loadingStorage.value = false
    }
  }

  const prepareStoreIndexDb = (messages: Message[] | Credential[] ) => {
    return JSON.parse(JSON.stringify(messages))
  }

  const sanitizeForIndexedDB = <T>(obj: T) => {
    return JSON.parse(JSON.stringify(obj))
  }

  return {
    storageKeys,
    loadingStorage,
    roles,
    items,
    setLocalData,
    getLocalData,
    removeLocalData,
    clearLocalData,
    fetchItems,
    fetchItemById,
    addItem,
    deleteItem,
    updateItem,
    prepareStoreIndexDb,
    sanitizeForIndexedDB
  }
})
