# Cody

> Hi, I'm Cody

[Slack](https://slack.com) bot based on [Open AI](https://openai.com), [Azure](https://azure.com), and [TypeScript](https://typescriptlang.org).

![Cody](avatar.thumbnail.jpg "Cody - credits: https://thispersondoesnotexist.com")

Credits for this photo: https://thispersondoesnotexist.com

## Developing

- Configure a .env file in the root of the project with the values listed under "Deploy to Azure"
- Make sure there is no server running on Azure
- Start local server with `npm start`
- Slack will have connected to the local server, so just go to your Slack workspace and type `@Cody Starr` and it should respond.

## Deploy as Azure WebApp

It needs to keep a socket open, because it should listen to incoming requests from Slack. That's why Azure Functions are not a good fit for the Slack bot.

```
npm run build
az login --tenant ??? # id from Azure Active Directory
# first time: az webapp up --sku B1 --name cody-slack-bot-app --resource-group rg-codestar-cody-slackbot --location westeurope --plan CodyCodestar_asp_5948 --os-type Linux --runtime "NODE:18-lts" --logs --dryrun

az webapp up --os-type Linux --runtime "NODE:18-lts"

# smoke test
az webapp log tail
https://cody-slack-bot-app.azurewebsites.net/api/
```

## Deploy to Azure

- Set envars in Azure: rg-codestar-cody-slackbot > cody-slack-bot-app > Settings / Configuration > Application Settings, add:

```
OPENAI_API_KEY=the_openai_api_key
SLACK_BOT_TOKEN=the_slackbot_token
SLACK_APP_TOKEN=the_cody-app-token
SLACK_SIGNING_SECRET=the_slack_signing_secret
WEBSITES_CONTAINER_START_TIME_LIMIT=600
```

- In VS Code, in the Azure toolbar under Resources, expand codestar-website-api > Slots > test and right-click. Click "Swap slot..."
- Select the production slot

or:

- in VS Code, in the Azure toolbar under Workspace > click the "deploy" icon (cloud with up arrow), select the correct Resource Group and the codestar-cody-slackbot Function App. Allow overwriting the existing deployment.

Test with `curl ???/api/animal-hero/\?animal\=panda`

Test with `curl ???/api/q-and-a\?question\=Where%20is%20the%20Sea%20of%20Silence%3F`

## Set up the Slack Bot

- Steps: https://www.napkin.io/blog/how-to-make-slack-bot-reminder-9-steps or https://api.slack.com/start/building/bolt-js
  - Create an app: https://api.slack.com/apps?new_app=1&ref=bolt_start_hub
  - App Name: Cody Starr
  - Workspace: set up for your workspace
  - In https://app.slack.com/app-settings/??/??/socket-mode
    - enable Socket Mode and create a token with name cody-app-token
  - Go to https://api.slack.com/apps/???/event-subscriptions? where ??? is the app id.
    - Enable Event Subscriptions and add the URL https://cody-slack-bot-app.azurewebsites.net/slack/events
    - Subscribe to bot events > add bot user event:
      - app_mention
      - app_home_opened
      - message.channels
      - team_join
    - Reinstall app
  - OAuth & Permissions > Scopes > Bot token Scopes: add "chat:write"
    - app_mentions:read
    - channels:history
    - users:read
    - files:write
    - files:read
    - chat:write
  - Install to Workspace, copy token
- In your Slack workspace: `/invite @Cody Starr`


TODO

- Deploy on Azure. Use Azure botbuilder-adapter https://github.com/howdyai/botkit/tree/main/packages/botbuilder-adapter-slack#readme
- add CORS protection
  CORS: in Azure Function App console under > API > CORS
  Request credentials can be turned OFF
  Add allowed origins: https://code-star.github.io
