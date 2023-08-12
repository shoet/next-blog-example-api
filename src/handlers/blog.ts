import { NextFunction, Request, Response } from 'express'
import * as blogService from '@/services/blog'
import { ApiResponse } from '@/type/api'
import { BadRequest, NotFound } from '@/type/error'
import {
  parseAndValidateNumber,
  validateDefined,
  validateEmpty,
} from '@/util/handler'

export const getBlogHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
  }

  const blogId = Number(req.params.id)
  if (isNaN(blogId)) {
    throw new BadRequest('id not found in query', req)
  }

  const blog = await blogService.getBlog(blogId)
  if (blog === undefined) {
    throw new NotFound(`User with ID ${blogId} not found`)
  }

  return {
    data: blog,
    status: 200,
  }
}

export const addBlogHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const {
    title,
    slug,
    categoryId: categoryIdStr,
    content,
    authorId: authorIdStr,
    publish,
    statusId: statusIdStr,
    tags,
  } = req.body

  validateDefined({ title, slug, content, publish }, req)
  validateEmpty({ title, slug, content, publish }, req)
  const categoryId = parseAndValidateNumber(
    categoryIdStr,
    'Invalid categoryId',
    req,
  )
  const authorId = parseAndValidateNumber(authorIdStr, 'Invalid authorId', req)
  const statusId = parseAndValidateNumber(statusIdStr, 'Invalid statusId', req)

  const blog = await blogService.addBlog({
    ...req.body,
    categoryId: categoryId,
    authorId: authorId,
    statusId: statusId,
    tags: tags,
  })

  return {
    data: blog,
    status: 200,
  }
}
