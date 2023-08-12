import { Prisma } from '@prisma/client'
import * as blogModel from '@/models/blog'

export const getBlog = async (id: number) => {
  const blogs = await blogModel.selectBlogs({ where: { id: id } })
  if (blogs.length === 0) return undefined
  return blogs[0]
}

export const getBlogIds = async () => {
  const ids = await blogModel.selectAllBlogIds()
  return ids
}

export const searchBlogs = async (
  id?: number,
  title?: string,
  categoryId?: number,
  tags?: string[],
) => {
  const tagsFilter = tags ? tags.map((t) => ({ name: t })) : []
  const blogs = await blogModel.selectBlogs({
    where: {
      id: id,
      title: title,
      categoryId: categoryId,
      tags: { some: { OR: tagsFilter } },
    },
  })
  return blogs
}

export type AddBlogProps = {
  title: string
  content: string
  slug: string
  categoryId: number
  authorId: number
  publish: boolean
  statusId: number
  tags?: string[]
  eyeCatchImgUrl?: string
}

export const postBlog = async ({
  title,
  content,
  slug,
  categoryId,
  authorId,
  publish,
  statusId,
  eyeCatchImgUrl,
  tags = [],
}: AddBlogProps) => {
  console.log(categoryId)
  const createTags: Prisma.TagCreateOrConnectWithoutBlogsInput[] = tags.map(
    (t) => ({
      where: { name: t },
      create: { name: t },
    }),
  )
  const blog = await blogModel.insertBlog({
    title: title,
    content: content,
    slug: slug,
    category: { connect: { id: categoryId } },
    author: { connect: { id: authorId } },
    publish: publish,
    status: { connect: { id: statusId } },
    eyeCatchImgUrl: eyeCatchImgUrl,
    tags: { connectOrCreate: createTags },
  })

  return blog
}

export const doesBlogExistWithSlug = async (slug: string) => {
  const blogCount = await blogModel.selectBlogCount({ where: { slug: slug } })
  return blogCount > 0
}
