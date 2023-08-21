import { NextFunction, Request, Response } from 'express'
import * as storageServiceGcp from '@/services/storage'
import { ApiRequest, ApiResponse } from '@/type/api'
import { validateDefined } from '@/util/handler'

/** ストレージAPI GCP署名付きURL取得(PUT)
 * @body fileName
 * @returns URL
 */
export const getStoragePutUrlHandler = async (
  req: ApiRequest,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const { fileName } = req.body

  console.log(req.body)

  validateDefined({ fileName }, req)

  const url = await storageServiceGcp.getSignedPutUrlPublic(fileName)

  return {
    data: url,
    status: 200,
  }
}
