import { processing } from './processing'

export interface Controls {
  getInput(key: string): string
  info(message: string): void
  setFailed(message: string): void
  setOutput(key: string, value: any): void
}

export const main = (controls: Controls) => {
  const map = controls.getInput('map')
  const key = controls.getInput('key')
  const defaultKey = controls.getInput('default_key')
  const outputKeyName = controls.getInput('output_key_name')

  try {
    const result = processing(map, key, defaultKey, outputKeyName)
    controls.info(`output keys: ${Object.keys(result).join(', ')}`)
    Object.entries(result).forEach(([outputKey, value]) => controls.setOutput(outputKey, value))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error'
    controls.setFailed(message)
  }
}
