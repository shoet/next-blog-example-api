import { NextFunction, Request, Response } from 'express'
import * as blogService from '@/services/blog'
import { ApiResponse } from '@/type/api'
import { BadRequest, NotFound } from '@/type/error'

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
  const body = req.body
  // TODO: validation
  console.log(body)

  const {
    title,
    slug,
    categoryId,
    body: blogBody,
    authorId,
    publish,
    statusId,
    tags,
  } = req.body

  if (
    title === undefined ||
    slug === undefined ||
    categoryId === undefined ||
    blogBody === undefined ||
    authorId === undefined ||
    publish === undefined ||
    statusId === undefined ||
    tags === undefined
  ) {
    throw new BadRequest('Invalid params', req)
  }

  const blog = await blogService.addBlog({ ...req.body })

  return {
    data: blog,
    status: 200,
  }
}
