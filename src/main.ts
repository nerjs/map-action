import { processing } from './processing'
export interface IControlls {
  getInput(key: string): string
  info(message: string): void
  setFailed(message: string): void
  setOutput(key: string, value: any): void
}

export const main = (controls: IControlls) => {
  const map = controls.getInput('map')
  const key = controls.getInput('key')
  const defaultKey = controls.getInput('default_key')
  const outputName = controls.getInput('output_key_name')

  try {
    const result = processing(map, key, defaultKey, outputName)
    controls.info(`result: ${JSON.stringify(result)}`)
    Object.entries(result).forEach(([key, value]) => controls.setOutput(key, value))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error'
    controls.setFailed(message)
  }
}
