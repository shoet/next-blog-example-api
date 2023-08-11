import { NextFunction, Request, Response } from 'express'
import * as userService from '@/services/user'
import { ApiResponse } from '@/type/api'
import { BadRequest, NotFound } from '@/type/error'

export const getUserHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
    throw new BadRequest('id not found in query', req)
  }

  const userId = Number(req.params.id)
  if (isNaN(userId)) {
    throw new BadRequest('Invalid query', req)
  }

  const user = await userService.getUser({ id: userId })
  if (user === undefined) {
    throw new NotFound(`User with ID ${userId} not found`)
  }

  return {
    data: user,
    status: 200,
  }
}
