import * as core from '@actions/core'
import { wait } from './wait'
import yaml from 'js-yaml'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const map: string = core.getInput('map')
    const map2: string = core.getInput('map2')
    core.debug(`env: ${JSON.stringify(process.env, null, 4)}`)
    core.debug(`test: ${map}`)
    core.debug(`test2: ${map2}`)

    // Set outputs for other workflow steps to use
    core.setOutput('time', { a: 1, qwerty: 'Tratata' })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
