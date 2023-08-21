import { NextFunction, Request, Response } from 'express'
import * as blogStatusService from '@/services/blog-status'
import { ApiResponse } from '@/type/api'

export const getBlogStatusHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const blogStatuses = await blogStatusService.getAllBlogStatuses()
  return {
    data: blogStatuses,
    status: 200,
  }
}
