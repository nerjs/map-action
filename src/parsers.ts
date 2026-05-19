import { load } from 'js-yaml'

const MAX_INPUT_LENGTH = 64 * 1024

const tryJSON = (str: string): unknown => {
  try {
    return JSON.parse(str)
  } catch {
    return undefined
  }
}

const tryYAML = (str: string): unknown => {
  try {
    return load(str)
  } catch {
    return undefined
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export const parse = (value: string): Record<string, unknown> => {
  if (typeof value !== 'string') throw new Error(`Empty map value`)
  const str = value.trim()
  if (!str) throw new Error(`Empty map value`)
  if (str.length > MAX_INPUT_LENGTH) throw new Error(`Map value exceeds ${MAX_INPUT_LENGTH} bytes`)

  const parsed = tryJSON(str) ?? tryYAML(str)
  if (parsed === undefined) throw new Error(`Incorrect map format. Acceptable formats are json or yaml`)

  if (!isPlainObject(parsed)) throw new Error(`Map must be a key-value object`)

  return parsed
}
