import { Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { envVarNotSetMessage, valueIsInvalidMessage } from './error'
import { AuthedUser } from '@/services/auth'
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
    throw new Unauthorized(valueIsInvalidMessage('Arguments', 'token', token))
  }
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
    sameSite: 'none', // TODO
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
  })
}
