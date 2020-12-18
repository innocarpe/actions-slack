# actions-slack

<p align="left">
  <a href="https://github.com/innocarpe/actions-slack"><img alt="GitHub Actions status" src="https://github.com/innocarpe/actions-slack/workflows/Slack%20Mainline/badge.svg"></a>
  <a href="https://github.com/innocarpe/actions-slack"><img alt="GitHub Actions status" src="https://github.com/innocarpe/actions-slack/workflows/Slack%20Appstore/badge.svg"></a>
</p>

You can notify to Slack in GitHub Actions workflow.

<img width="689" alt="Screen Shot 2019-12-19 at 1 06 23 AM" src="https://user-images.githubusercontent.com/2222333/71102541-06eea600-21fc-11ea-9107-46a3e4af1b60.png">

## Usage

### Simple case

```yaml
steps:
  - name: Action 1
    uses: ...

  - name: Action 2
    run: ...

  - name: Notify
    uses: innocarpe/actions-slack@v1
    with:
      status: ${{ jobs.<job_id>.status }} # Required
      success_text: 'Step Succeeded 🚀' # Optional
      failure_text: 'Step Failed 😱' # Optional
      cancelled_text: 'Step Cancelled ⚠️' # Optional
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Required
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # Required
```

### Advanced case

You can use `slack group mention(@your-group)` and `github actor/ref` and so on.

```yaml
steps:
  - name: Notify the start
    uses: innocarpe/actions-slack@v1
    with:
      status: ${{ jobs.<job_id>.status }} # Required
      success_text: '<!subteam^S1ABC2DEF> @${{ github.actor }} just started the workflow for `${{ github.ref }}`'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Required
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # Required

  - name: Action 1
    uses: ...

  - name: Action 2
    run: ...
    
  - name: Notify to Slack
    uses: innocarpe/actions-slack@v1
    with:
      status: ${{ jobs.<job_id>.status }} # Required
      success_text: '<!subteam^S1ABC2DEF> The awesome workflow just finished ✅'
      failure_text: '<!subteam^S1ABC2DEF> The bad workflow failed. Please check the issue below 👇'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Required
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # Required
```
