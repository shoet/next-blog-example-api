import { NextFunction, Response } from 'express'
import * as storageServiceGcp from '@/services/storage'
import { ApiRequest, ApiResponse } from '@/type/api'
import { generateUniqueFileName } from '@/util/file'
import { validateDefined } from '@/util/handler'

/** ストレージAPI GCP署名付きURL取得(PUT)
 * @body fileName
 * @returns URL
 */
export const generateStoragePutUrlHandler = async (
  req: ApiRequest,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const { fileName, contentType } = req.body
  validateDefined({ fileName }, req)

  const newFileName = generateUniqueFileName(fileName)

  const url = await storageServiceGcp.generateSignedPutUrlPublic(
    newFileName,
    contentType,
  )

  return {
    data: { url, fileName: newFileName },
    status: 200,
  }
}
