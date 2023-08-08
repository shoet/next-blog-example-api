/* eslint @typescript-eslint/no-explicit-any: 0 */

import * as config from '@/config/config.json'

export const getEnvConfig = (environment: string | undefined) => {
  if (environment === undefined) {
    throw new Error('NODE_ENV is undefined')
  }
  const envConfig = (config as any)[environment] // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!envConfig) {
    throw new Error(`Environment [${environment}] is not found`)
  }
  return envConfig
}
