import * as CategoryModels from '@/models/category'

export const getAllCategories = async () => {
  const categories = await CategoryModels.selectAllCategories()
  return categories
}
