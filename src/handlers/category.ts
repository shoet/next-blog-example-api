import { NextFunction, Request, Response } from 'express'
import * as categoryService from '@/services/category'
import { ApiResponse } from '@/type/api'

export const getCategoryHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const categories = await categoryService.getAllCategories()
  return {
    data: categories,
    status: 200,
  }
}
