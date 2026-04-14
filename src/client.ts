import * as core from '@actions/core'
import * as github from '@actions/github'
import type { GitHub } from "@actions/github/lib/utils";

import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'

export class Client {
  private webhook: IncomingWebhook
  private github: InstanceType<typeof GitHub>

  constructor() {
    if (process.env.GITHUB_TOKEN === undefined) {
      throw new Error('Specify secrets.GITHUB_TOKEN')
    }
    this.github = github.getOctokit(process.env.GITHUB_TOKEN)
    if (process.env.SLACK_WEBHOOK_URL === undefined) {
      throw new Error('Specify secrets.SLACK_WEBHOOK_URL')
    }
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)
  }

  public async sendMessage(status: string, text: string) {
    var color = ''

    switch (status) {
      case 'success':
        color = 'good'
        break
      case 'failure':
        color = 'danger'
        break
      case 'cancelled':
        color = 'warning'
        break
      default:
        throw new Error('The status must be success or failure or cancelled')
    }

    const payload = {
      text: text,
      attachments: [
        {
          color: color,
          fields: await this.fields(),
        },
      ],
    }

    this.send(payload)
  }

  private async fields() {
    if (this.github === undefined) {
      throw Error('Specify secrets.GITHUB_TOKEN')
    }
    const { owner, repo } = github.context.repo
    const { sha } = github.context
    return [
      {
        title: 'GitHub Actions',
        value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|Workflow>`,
      }
    ]
  }

  public async send(payload: string | IncomingWebhookSendArguments) {
    core.debug(JSON.stringify(github.context, null, 2))
    await this.webhook.send(payload)
    core.debug('send message')
  }
}
