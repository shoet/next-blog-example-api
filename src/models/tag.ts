import { Prisma, Tag } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type TagWhereProps = {
  where?: Prisma.TagWhereInput
  select?: Prisma.TagSelect
}

export const selectTags = async ({ where, select }: TagWhereProps) => {
  const tags = await prisma.tag.findMany({
    where: where,
    select: select,
  })
  return tags
}
