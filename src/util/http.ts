import { Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { envVarNotSetMessage, valueIsInvalidMessage } from './error'
import { parseFieldMask } from '@/lib/prisma'
import { AuthedUser } from '@/services/auth'
import { ApiRequest } from '@/type/api'
import { ConfigurationError, Unauthorized } from '@/type/error'

export function generateToken(user: AuthedUser): string {
  if (!process.env.JWT_SECRET_KEY) {
    throw new ConfigurationError(envVarNotSetMessage('JWT_SECRET_KEY'))
  }
  const token = jwt.sign(`${user.id}`, process.env.JWT_SECRET_KEY)
  return token
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET_KEY) {
    throw new ConfigurationError(envVarNotSetMessage('JWT_SECRET_KEY'))
  }
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decodedPayload
  } catch (err) {
    throw new Unauthorized(
      valueIsInvalidMessage('Arguments', 'auth_token', token),
    )
  }
}

export function setFieldMask(req: ApiRequest): ApiRequest {
  let fieldMask: string[] | undefined
  if (typeof req.query.fieldMask === 'string') {
    fieldMask = [req.query.fieldMask]
  } else {
    fieldMask = req.query.fieldMask as string[]
  }
  req.fieldMask = parseFieldMask(fieldMask)
  return req
}

export function setCookieToken(
  res: Response,
  user: AuthedUser,
  tokenKey: string = 'auth_token',
) {
  const token = generateToken(user)
  res.cookie(tokenKey, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 14,
  })
}

export function clearCookieToken(
  res: Response,
  tokenKey: string = 'auth_token',
) {
  res.clearCookie(tokenKey, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}
