import { Category, Prisma } from '@prisma/client'
import * as blogModel from '@/models/blog'
import { BadRequest } from '@/type/error'

export const getBlog = async (id: number) => {
  const blogs = await blogModel.getBlogs({ id: id })
  if (blogs.length === 0) return undefined
  return blogs[0]
}

export const searchBlogs = async (
  id?: number,
  title?: string,
  categoryId?: number,
  tag?: string,
) => {
  const blogs = await blogModel.getBlogs({
    id: id,
    title: title,
    categoryId: categoryId,
    tag: tag,
  })
  return blogs
}
