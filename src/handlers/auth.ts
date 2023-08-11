import { NextFunction, Request, Response } from 'express'
import { signIn, signUp } from '@/services/auth'
import { ApiResponse } from '@/type/api'
import { BadRequest } from '@/type/error'

/**
 * 認証API（サインイン）
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns ユーザー、ステータスコード
 *
 */
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
  // TODO: setCookie
  return {
    data: user,
    status: 200,
  }
}

/**
 * 認証API（サインアップ）
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns ユーザー、ステータスコード
 *
 */
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
