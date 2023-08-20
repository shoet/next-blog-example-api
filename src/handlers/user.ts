import { NextFunction, Request, Response } from 'express'
import * as userService from '@/services/user'
import { ApiResponse } from '@/type/api'
import { BadRequest, NotFound, Unauthorized } from '@/type/error'
import { notFoundMessage, valueIsInvalidMessage } from '@/util/error'
import { verifyToken } from '@/util/http'

/**
 * ユーザーAPI（個別取得）
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns ユーザー、ステータスコード
 *
 */
export const getUserHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
    throw new BadRequest(
      notFoundMessage('Path params', 'id', req.params.id),
      req,
    )
  }

  const userId = Number(req.params.id)
  if (isNaN(userId)) {
    throw new BadRequest(
      valueIsInvalidMessage('Path params', 'id', req.params.id),
      req,
    )
  }

  const user = await userService.getUser({ id: userId })
  if (user === undefined) {
    throw new NotFound(notFoundMessage('Path params', 'id', `${userId}`))
  }

  return {
    data: user,
    status: 200,
  }
}

export const getUserMeHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const token = req.cookies['auth_token']
  if (!token) {
    throw new Unauthorized('Unauthorized')
  }
  const decodedPayload = verifyToken(token)
  const userId = Number(decodedPayload)
  const user = await userService.getUser({ id: userId })
  if (!user) {
    throw new Unauthorized('Unauthorized')
  }
  return { data: user, status: 200 }
}
