export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  statusCode: number
  message: string
  data: any
}

export interface MongooseError extends Error {
  code?: number;
  errors?: { [key: string]: { message: string } };
}