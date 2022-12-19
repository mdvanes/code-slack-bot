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
# first time: az webapp up --sku B1 --name cody-slack-bot-app --resource-group rg-codestar-cody-slackbot --location westeurope --plan CodyCodestar_asp_5948 --os-type Linux --runtime "NODE:16-lts" --dryrun

az webapp up --os-type Linux --runtime "NODE:16-lts"

# note: it should be possible to run az webapp up with the --logs flag to start logs, but this caused problems

# smoke test
az webapp log tail
https://cody-slack-bot-app.azurewebsites.net/
```

## Deploy to Azure Web App

- Set envars in Azure: 

`az webapp config appsettings set --resource-group rg-codestar-cody-slackbot --name cody-slack-bot-app --settings "@env.json"`

- Or set envars in manually in Azure Portal: rg-codestar-cody-slackbot > cody-slack-bot-app > Settings / Configuration > Application Settings, add:

```
OPENAI_API_KEY=the_openai_api_key
SLACK_BOT_TOKEN=the_slackbot_token
SLACK_APP_TOKEN=the_cody-app-token
SLACK_SIGNING_SECRET=the_slack_signing_secret
WEBSITES_CONTAINER_START_TIME_LIMIT=600
```

- In Azure Portal, under rg-codestar-cody-slackbot > cody-slack-bot-app > Settings / Configuration > General Settings:
  - Change "Always on" to "On"

- DOES NOT WORK YET: In Azure Portal, under Monitoring/Health Check: enable and point to `/`, the warmup endpoint. It will respond with "OK".

DOES NOT WORK YET: Test the deployment with `curl <Azure webapp URL>/`, should respond with "OK"

## Deploy on Azure ACI

Because the Azure Webapp times out after 5 minutes and the warmup/health endpoint doesn't seem to be accessible when deployed as a Webapp, it is also possible to deploy as a container.

```
az group create --name rg-codestar-cody-slackbot --location westeurope

az acr create --resource-group rg-codestar-cody-slackbot --name codestarcodyslackbotacr --sku Basic

# Enable admin user - https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-prepare-registry#enable-admin-account
# Save username and password
# Export with: 
export CODY_REGISTRY_USER=xxx
export CODY_REGISTRY_PASS=xxx

az acr login --name codestarcodyslackbotacr

az acr show --name codestarcodyslackbotacr --query loginServer --output table

docker build . -t cody-slack-bot

docker tag cody-slack-bot codestarcodyslackbotacr.azurecr.io/cody-slack-bot:v1

docker push codestarcodyslackbotacr.azurecr.io/cody-slack-bot:v1

az acr repository list --name codestarcodyslackbotacr.azurecr.io --output table

az container create --resource-group rg-codestar-cody-slackbot \
  --name cody-slack-bot \
  --image codestarcodyslackbotacr.azurecr.io/cody-slack-bot:v1 \
  --cpu 1 --memory 1 \
  --registry-login-server codestarcodyslackbotacr.azurecr.io \
  --registry-username "$CODY_REGISTRY_USER" \
  --registry-password "$CODY_REGISTRY_PASS" \
  --secure-environment-variables OPENAI_API_KEY="" SLACK_BOT_TOKEN="" SLACK_SIGNING_SECRET="" SLACK_APP_TOKEN="" \
  --ip-address Public --dns-name-label cody-slack-bot --ports 80

az container show --resource-group rg-codestar-cody-slackbot --name cody-slack-bot --query ipAddress.fqdn

Result: it hangs on state "Waiting" and unknown how to inspect the container logs (the logs show No Logs Available).

```

TODO https://learn.microsoft.com/en-us/azure/container-instances/container-instances-environment-variables#yaml-deployment


Deploy via Docker Hub

From Mac, do not build and publish manually, this causes an error when running. Instead rely on the Github workflow. Place a tag in Github and a new version will be build and published. 

After it's published, deploy to Azure:

```
az container create --resource-group rg-codestar-cody-slackbot \
  --name cody-slack-bot \
  --image mdworld/cody-slack-bot:latest \
  --cpu 1 --memory 1 \
  --secure-environment-variables OPENAI_API_KEY="" SLACK_BOT_TOKEN="" SLACK_SIGNING_SECRET="" SLACK_APP_TOKEN="" \
  --ip-address Public --dns-name-label cody-slack-bot --ports 80
```

TODO Remove the manual steps
```
TODO remove - docker build -t mdworld/cody-slack-bot:v6 .
TODO remove - docker login --username=yourhubusername # not email, but docker id!
TODO remove - docker push mdworld/cody-slack-bot:v6
TODO remove - docker logout
```

And where the container should run:

* copy the `docker-compose.yml` and replace `build` by `image: mdworld/cody-slack-bot:v6`
* set the `.env` 
* run: `docker-compose up -d`
* logs: `docker-compose logs -f`

TODO: this is broken (and probably also in Azure) because the image was build on macos. Building with `docker-compose` on linux works fine at least on the local machine.

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
  - When problem with connecting Azure to Slack: call the endpoint directly, and while waiting for response to warmup request it seems to work. And then it will disconnect on Azure when it times out eventually. 
  - Is it also starting up multiple instances as the endpoint is called multiple times?
  - Log Stream is showing the Bolt logging, but not anymore after a timeout?
- add CORS protection
  CORS: in Azure Function App console under > API > CORS
  Request credentials can be turned OFF
  Add allowed origins: https://code-star.github.io
