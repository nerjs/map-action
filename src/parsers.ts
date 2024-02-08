import { load } from 'js-yaml'
import * as core from '@actions/core'

const isString = (value: any): value is string => typeof value === 'string'
const isNotEmptyString = (value: any): value is string => isString(value) && !!value

const isJSON = (value: string): value is string => isNotEmptyString(value) && /^{.*}$/.test(value)
const isYaml = (value: string): value is string => isNotEmptyString(value) && !isJSON(value) && /^[a-zA-Z0-9-_]+(\s+)?:/.test(value)

export const parse = (value: string): Record<string, any> => {
  const str = value.trim()
  core.debug(`Input map: ${str}`)
  if (!isNotEmptyString(str)) throw new Error(`Empty map value`)

  if (isJSON(str)) return JSON.parse(str)
  if (isYaml(str)) return load(str)

  throw new Error(`Incorect map format. Acceptable formats are json or yaml`)
}
