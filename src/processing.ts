import * as core from '@actions/core'
import { parse } from './parsers'
import { DEFAULT_OUTPUT_KEY } from './constants'

const normalizeOutput = (output: any, keyName?: string): Record<string, any> => {
  if (output && typeof output === 'object') {
    if (keyName)
      throw new Error(
        `The result is an object "${JSON.stringify(output)}". The default_key (${keyName}) parameter does not apply to objects`,
      )

    if (!Object.keys(output).length) throw new Error(`Empty output object`)
    return output
  }

  if (output == null) throw new Error(`Missing output`)

  return keyName ? { [keyName]: output } : { [DEFAULT_OUTPUT_KEY]: output }
}

export const processing = (map: string, key?: string, defaultKey?: string, keyName?: string): Record<string, any> => {
  if (!key && !defaultKey) throw new Error('One of the key or default_key parameters is mandatory')

  const obj = parse(map)
  core.debug(`input: ${JSON.stringify(obj)}`)

  if (key && key in obj) return normalizeOutput(obj[key], keyName)
  if (!defaultKey) throw new Error(`default_key is required if there is no master key or if the result of a condition is missing`)

  if (defaultKey in obj) return normalizeOutput(obj[defaultKey], keyName)

  throw new Error(`default_key (${defaultKey}) must match one of the keys in the map`)
}
