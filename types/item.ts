import type { Message } from "./message"

export interface Item {
  id?: IDBValidKey,
  title: string
  messages: Message[]
  created_at?: number
  updated_at?: number
}