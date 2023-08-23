import { Tag } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import * as blogService from '@/services/blog'
import * as tagService from '@/services/tag'
import { ApiRequest, ApiResponse } from '@/type/api'
import { BadRequest, NotFound } from '@/type/error'
import {
  parseAndValidateNumber,
  validateDefined,
  validateEmpty,
} from '@/util/handler'

/** ブログAPI 個別取得
 * @pathParams Blog.id
 * @returns Blog
 */
export const getBlogHandler = async (
  req: ApiRequest,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
    throw new BadRequest('id not found in query', req)
  }

  const blogId = Number(req.params.id)
  if (isNaN(blogId)) {
    throw new BadRequest('Invalid params', req)
  }
  console.log(req.fieldMask)

  const blog = await blogService.getBlog(blogId, req.fieldMask)
  if (blog === undefined) {
    throw new NotFound(`Blog with ID ${blogId} not found`)
  }

  return {
    data: blog,
    status: 200,
  }
}

interface GetBlogTagsHandlerResponse extends ApiResponse {
  data: Tag[]
}
/** ブログAPI タグ取得
 * @pathParams Blog.id
 * @returns Blog.tag[]
 */
export const getBlogTagsHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<GetBlogTagsHandlerResponse> => {
  if (!req.params.id) {
    throw new BadRequest('id not found in query', req)
  }

  const blogId = Number(req.params.id)
  if (isNaN(blogId)) {
    throw new BadRequest('Invalid params', req)
  }

  const tags = await tagService.searchTags({ blogs: { some: { id: blogId } } })
  return {
    data: tags,
    status: 200,
  }
}

/** ブログAPI IDリスト取得
 * @returns Blog.id[]
 */
export const getBlogIdsHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const blogIds = await blogService.getBlogIds()
  return {
    data: blogIds,
    status: 200,
  }
}

/** ブログAPI ブログ作成
 * @body Blog
 * @returns Blog
 *
 * ex in) 
  {
    "title": "title",
    "slug": "slug",
    "categoryId": "1",
    "content": "content",
    "authorId": "1",
    "publish": true,
    "statusId": "1",
    "tags": [ "tag1", "tag2" ],
  }
 */
export const createBlogHandler = async (
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
    eyeCatchImgUrl,
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

  if (await blogService.doesBlogExistsWithSlug(authorId, slug)) {
    throw new BadRequest('Slug is already exists', req)
  }

  const blog = await blogService.postBlog({
    title,
    slug,
    content,
    publish,
    categoryId,
    authorId,
    statusId,
    tags,
    eyeCatchImgUrl,
  })

  return {
    data: blog,
    status: 201,
  }
}

/** ブログAPI ブログ削除
 * @pathParams Blog.id
 * @returns {}
 */
export const deleteBlogHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  validateDefined({ id: req.params.id }, req)
  const blogId = parseAndValidateNumber(req.params.id, 'Invalid id', req)
  if (!(await blogService.doesBlogExists(blogId))) {
    // 冪等性: 削除済みに対して再度DELETEを投げてもエラーにはさせない。
    return {
      data: {},
      status: 200,
    }
  }
  await blogService.removeBlog(blogId)
  return {
    data: {},
    status: 200,
  }
}

/** ブログAPI ブログ部分更新
 * @pathParams Blog.id
 * @body { authorId, data: Blog }
 * @returns Blog
 * ex in) 
  {
    "authorId": "1",
    "data": {
      "title": "title", // optional
      "slug": "slug", // optional
      "categoryId": "1", // optional
      "content": "content", // optional
      "publish": true, // optional
      "statusId": "1", // optional
      "tags": [ "tag1", "tag2" ], // optional
    }
  }
 */
export const patchBlogHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const { authorId: authorIdStr, data } = req.body
  const {
    title,
    slug,
    categoryId: categoryIdStr,
    content,
    publish,
    statusId: statusIdStr,
    tags,
  } = data

  // Require
  validateDefined({ id: req.params.id, authorId: authorIdStr }, req)
  const blogId = parseAndValidateNumber(req.params.id, 'Invalid id', req)
  const authorId = parseAndValidateNumber(authorIdStr, 'Invalid authorId', req)

  // Optional
  const categoryId = categoryIdStr
    ? parseAndValidateNumber(categoryIdStr, 'Invalid categoryId', req)
    : undefined
  const statusId = statusIdStr
    ? parseAndValidateNumber(statusIdStr, 'Invalid statusId', req)
    : undefined

  if (!(await blogService.doesIncludeAuthorId(blogId, authorId))) {
    throw new BadRequest('Can not update dirrerent author blog', req)
  }

  if (!(await blogService.doesMatchBlogOwnSlug(blogId, slug, authorId))) {
    // 別のblogでslugが使われている。同じブログへの上書きは許可。
    throw new BadRequest('Slug is already exists', req)
  }

  const blog = await blogService.patchBlog(blogId, authorId, {
    title: title,
    slug: slug,
    content: content,
    publish: publish,
    category: { update: { id: categoryId } },
    status: { update: { id: statusId } },
    tags: { upsert: tags },
  })

  return {
    data: blog,
    status: 200,
  }
}
