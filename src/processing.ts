import { parse } from './parsers'
import { DEFAULT_OUTPUT_KEY } from './constants'

const FORBIDDEN_OUTPUT_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeOutput = (output: unknown, outputKeyName?: string): Record<string, unknown> => {
  if (isPlainObject(output)) {
    if (outputKeyName) throw new Error(`Map value is an object - output_key_name (${outputKeyName}) is not applicable`)
    if (!Object.keys(output).length) throw new Error(`Empty output object`)
    return output
  }

  if (Array.isArray(output)) throw new Error(`Array result is not supported`)
  if (output == null) throw new Error(`Missing output`)

  const target = outputKeyName || DEFAULT_OUTPUT_KEY
  if (FORBIDDEN_OUTPUT_KEYS.has(target)) throw new Error(`output_key_name "${target}" is not allowed`)
  return { [target]: output }
}

export const processing = (map: string, key?: string, defaultKey?: string, outputKeyName?: string): Record<string, unknown> => {
  if (!key && !defaultKey) throw new Error('One of the key or default_key parameters is mandatory')

  const obj = parse(map)

  if (key && Object.hasOwn(obj, key)) return normalizeOutput(obj[key], outputKeyName)
  if (!defaultKey) throw new Error(`default_key is required when key is not found in the map`)

  if (Object.hasOwn(obj, defaultKey)) return normalizeOutput(obj[defaultKey], outputKeyName)

  throw new Error(`default_key (${defaultKey}) must match one of the keys in the map`)
}
