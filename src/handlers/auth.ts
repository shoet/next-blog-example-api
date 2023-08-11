import { NextFunction, Request, Response } from 'express'
import { signIn, signUp } from '@/services/auth'
import { ApiResponse } from '@/type/api'
import { BadRequest } from '@/type/error'

export const signInHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.body.email) {
    throw new BadRequest('email is require', req)
  }
  if (!req.body.password) {
    throw new BadRequest('password is require', req)
  }
  const user = await signIn(req.body.email, req.body.password)
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
  if (!req.body.email) {
    throw new BadRequest('email is require', req)
  }
  if (!req.body.password) {
    throw new BadRequest('password is require', req)
  }

  const user = await signUp(req.body.email, req.body.password)
  return {
    data: user,
    status: 200,
  }
}
