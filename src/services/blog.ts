import { Blog, Prisma } from '@prisma/client'
import * as blogModel from '@/models/blog'
import { notFoundMessage } from '@/util/error'

export const getBlog = async (id: number, select?: Prisma.BlogSelect) => {
  const blogs = await blogModel.selectBlogs({
    where: { id: id },
    select: select,
  })
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

export const removeBlog = async (id: number) => {
  const blog = await blogModel.deleteBlog(id)
  return blog
}

export const patchBlog = async (
  id: number,
  authorId: number,
  data: Prisma.BlogUpdateInput,
) => {
  const blog = await blogModel.updateBlog(id, authorId, data)
  return blog
}

/** 同一Author内ですでにslugが使われているか */
export const doesBlogExistsWithSlug = async (
  authorId: number,
  slug: string,
) => {
  const blogCount = await blogModel.selectBlogCount({
    where: { AND: { authorId: authorId, slug: slug } },
  })
  return blogCount > 0
}

/** slugがblogの自身のものと一致するか */
export const doesMatchBlogOwnSlug = async (
  blogId: number,
  slug: string,
  authorId: number,
): Promise<boolean> => {
  const searchBlogs = await blogModel.selectBlogs({
    where: { slug: slug, authorId: authorId },
    select: { id: true },
  })
  if (searchBlogs.length === 1 && searchBlogs[0].id !== blogId) {
    return false
  }
  return true
}

/** authorIdが該当blogに属するか */
export const doesIncludeAuthorId = async (blogId: number, authorId: number) => {
  const searchBlogs = await blogModel.selectBlogs({
    where: { id: blogId },
    select: { id: true, authorId: true },
  })
  if (searchBlogs.length === 0) {
    return false
  }
  return searchBlogs[0].authorId == authorId
}

/** blogが存在するか */
export const doesBlogExists = async (blogId: number) => {
  const count = await blogModel.selectBlogCount({ where: { id: blogId } })
  return count > 0
}
