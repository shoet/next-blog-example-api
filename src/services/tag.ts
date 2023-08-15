import { Prisma } from '@prisma/client'
import * as tagModel from '@/models/tag'

interface SearchTagsFilter extends Prisma.TagWhereInput {}

export const searchTags = async (where: SearchTagsFilter) => {
  const tags = await tagModel.selectTags({
    where: where,
  })
  return tags
}
