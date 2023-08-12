type PageType = 'md' | 'html'

type CompressionType = {
  type: 'zip' | 'gzip'
  level: number
}

type EncryptioinType = 'bcrypt' | 'md5'

type ExportConfig = {
  destination?: string
  compressionType?: CompressionType
  encryptionType?: EncryptioinType
}

type DownloadPageOption = {
  runId?: string
  pageType?: PageType
  exportConfig?: ExportConfig
}

const exportPage = ({
  runId,
  pageType,
  exportConfig,
}: DownloadPageOption): Operation<
  DownloadPageResponse,
  DownloadPageMetadata
> => {
  if (runId) {
    // response progress status
    // get task progress
    // getTask
    const status = false
    const jobMessage = 'job failed'
    if (!status) {
      return {
        runId: runId,
        metadata: { progress: 36 },
        result: { message: jobMessage },
      }
    }
    return { runId: runId, metadata: { progress: 36 } }
  }
  // get blog

  // passing cloud function
  const newRunId = 'xxx'

  // response download url
  return { runId: newRunId, metadata: { progress: 100 } }
}

type DownloadPageResponse = {
  exportConfig: ExportConfig
}

type DownloadPageMetadata = {
  progress: number
}

type OperationError = {
  message: string
  details?: any
}

type Operation<ResultT, MetadataT> = {
  runId?: string
  result?: ResultT | OperationError
  metadata?: MetadataT
}

const handleTaskProgress = (taskId: string, progress: number) => {
  // addTask
  // updateTaskProgress
}
