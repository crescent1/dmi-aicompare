import type { SelectedModel } from "./message"

export interface Item {
  id?: IDBValidKey,
  title: string
  messages: SelectedModel[]
  created_at?: number
  updated_at?: number
}