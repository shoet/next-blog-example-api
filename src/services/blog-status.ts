import * as blogStatusModels from '@/models/blog-status'

export const getAllBlogStatuses = async () => {
  const statuses = await blogStatusModels.selectAllBlogStatuses()
  return statuses
}
