import { NextFunction, Request, Response } from 'express'
import { signIn, signUp } from '@/services/auth'
import { ApiResponse } from '@/type/api'
import { BadRequest } from '@/type/error'
import { valueIsRequireMessage } from '@/util/error'
import { validateDefined } from '@/util/handler'
import { clearCookieToken, setCookieToken } from '@/util/http'

export const signInHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.body.email) {
    throw new BadRequest(valueIsRequireMessage('Request body', 'email'), req)
  }
  if (!req.body.password) {
    throw new BadRequest(valueIsRequireMessage('Request body', 'password'), req)
  }
  const user = await signIn(req.body.email, req.body.password)
  setCookieToken(res, user)
  return {
    data: user,
    status: 200,
  }
}

export const signUpHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const { email, password, name } = req.body
  validateDefined({ email, password, name }, req)

  const user = await signUp(
    req.body.email,
    req.body.password,
    req.body.username,
  )
  return {
    data: user,
    status: 200,
  }
}

export const signOutHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  clearCookieToken(res)
  return {
    data: undefined,
    status: 200,
  }
}
