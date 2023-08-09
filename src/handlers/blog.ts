import { NextFunction, Request, Response } from 'express'
import { getBlog } from '@/models/blog'
import { ApiResponse } from '@/type/api'
import { BadRequest } from '@/type/error'

export const getBlogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
    throw new BadRequest('id not found in query', req)
  }

  const blogId = Number(req.params.id)
  if (isNaN(blogId)) {
    throw new BadRequest('Invalid query', req)
  }

  const blog = await getBlog(blogId)
  return {
    data: blog,
    status: 200,
  }
}
