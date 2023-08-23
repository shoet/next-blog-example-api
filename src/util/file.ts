import { generateBase32EncodedUuid } from './id-utils'

function extractFileExtension(fileName: string): string {
  const splitName = fileName.split('.')
  return splitName.length > 1 ? '.' + splitName.pop()! : ''
}

export function generateUniqueFileName(fileName: string): string {
  const fileExtension = extractFileExtension(fileName)
  const uniqueFileName = generateBase32EncodedUuid()
  return uniqueFileName + fileExtension
}
