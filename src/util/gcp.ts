import { Storage, GetSignedUrlConfig } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_CREDENTIAL_PATH,
})

export async function generateV4UploadSignedUrl(
  bucketName: string,
  fileName: string,
  contentType: string = 'image/*',
) {
  const option: GetSignedUrlConfig = {
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000,
    version: 'v4',
    contentType: contentType,
  }
  const url = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(option)

  return url
}
