import * as core from '@actions/core'
import { Client } from './client'

async function run() {
  try {
    let status: string = core.getInput('status', { required: true })
    status = status.toLowerCase()
    const success_text = core.getInput('success_text')
    const failure_text = core.getInput('failure_text')
    const cancelled_text = core.getInput('cancelled_text')

    core.debug(`status: ${status}`)
    core.debug(`success_text: ${success_text}`)
    core.debug(`failure_text: ${failure_text}`)
    core.debug(`cancelled_text: ${cancelled_text}`)

    const client = new Client()
    var message = ''
    switch (status) {
      case 'success':
        message = success_text
        break
      case 'failure':
        message = failure_text
        break
      case 'cancelled':
        message = cancelled_text
        break
      default:
        throw new Error(
          'You can specify success or failure or cancelled',
        )
    }
    await client.sendMessage(status, message)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
