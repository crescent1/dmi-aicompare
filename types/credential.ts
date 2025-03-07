import type { AiModel } from "./index"

export interface Credential {
  _id?: string
  aiModel: AiModel
  apiKey: string
  systemPrompt: string
  createdAt?: Date
  updatedAt?: Date
}