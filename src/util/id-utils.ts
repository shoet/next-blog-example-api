import base32Encode from 'base32-encode'
import { v4 as uuidv4 } from 'uuid'

export function generateBase32EncodedUuid(): string {
  const uuid = uuidv4().replace(/-/g, '')
  const uuidv4Buffer = stringToArrayBuffer(uuid)
  const base32 = base32Encode(uuidv4Buffer, 'Crockford')
  return base32
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}
