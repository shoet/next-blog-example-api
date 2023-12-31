import { Request } from 'express'

export class BadRequest extends Error {
  status: number
  req: Request
  message: string

  constructor(message: string, req: Request) {
    super('BadRequest')
    this.status = 400
    this.req = req
    this.message = message
  }
}

export class NotFound extends Error {
  status: number
  message: string

  constructor(message?: string) {
    super('NotFound')
    this.status = 404
    this.message = message ?? 'NotFound'
  }
}

export class Unauthorized extends Error {
  status: number
  message: string

  constructor(message?: string) {
    super('Unauthorized')
    this.status = 401
    this.message = message ?? 'Unauthorized'
  }
}

export class Conflict extends Error {
  status: number
  message: string

  constructor(message: string) {
    super('Conflict')
    this.status = 409
    this.message = message
  }
}

export class ConfigurationError extends Error {
  status: number
  message: string

  constructor(message: string) {
    super('ConfigurationError')
    this.status = 500
    this.message = message
  }
}
