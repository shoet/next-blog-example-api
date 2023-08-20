import { Request } from 'express'

export type ApiResponse = {
  data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  status: number
}

export interface ApiRequest extends Request {
  fieldMask?: Record<string, any>
}

declare module 'express' {
  interface Request {
    userId?: number
  }
}
