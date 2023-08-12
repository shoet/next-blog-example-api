import { Request } from 'express'
import { BadRequest } from '@/type/error'

export function validateEmpty(values: { [key: string]: any }, req: Request) {
  for (const [key, value] of Object.entries(values)) {
    if (value === '' || value === null) {
      throw new BadRequest(`Invalid ${key}`, req)
    }
  }
}

export function validateDefined(values: { [key: string]: any }, req: Request) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      throw new BadRequest(`Invalid ${key}`, req)
    }
  }
}

export function parseAndValidateNumber(
  value: string,
  errorMessage: string,
  req: Request,
): number {
  const numberValue = Number(value)
  if (isNaN(numberValue) || value === undefined) {
    throw new BadRequest(errorMessage, req)
  }
  return numberValue
}
