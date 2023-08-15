import * as categoryModels from '@/models/category'

export const getAllCategories = async () => {
  const categories = await categoryModels.selectAllCategories()
  return categories
}
