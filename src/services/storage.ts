import path from 'path'
import { envVarNotSetMessage } from '@/util/error'
import * as GCPUtil from '@/util/gcp'

export const generateSignedPutUrlPublic = async (
  fileName: string,
  contentType: string,
) => {
  const bucketName = process.env.GCP_STORAGE_BUCKET_IMAGE_PUBLIC
  const filePath = process.env.GCP_STORAGE_PATH_IMAGE_PUBLIC
  if (bucketName === undefined)
    throw new Error(envVarNotSetMessage('GCP_STORAGE_BUCKET_IMAGE_PUBLIC'))
  if (filePath === undefined)
    throw new Error(envVarNotSetMessage('GCP_STORAGE_PATH_IMAGE_PUBLIC'))
  const url = await GCPUtil.generateV4UploadSignedUrl(
    bucketName,
    path.join(filePath, fileName),
    contentType,
  )
  return url
}
