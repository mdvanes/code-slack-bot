# Cody

> Hi, I'm Cody

[Slack](https://slack.com) bot based on [Open AI](https://openai.com), [Azure](https://azure.com) Functions, and [TypeScript](https://typescriptlang.org).

![Cody](avatar.thumbnail.jpg "Cody - credits: https://thispersondoesnotexist.com")

Credits for this photo: https://thispersondoesnotexist.com

## Developing

- Configure a .env file in the root of the project with values for:
  - `OPENAI_API_KEY`
  - This file is loaded by the `envFile` prop in `.vscode/launch.json`
- In VS Code, run CodySlackBot/index.ts with F5
- `curl http://localhost:7071/api/animal-hero\?animal\=panda\&key\=the_api_key`

or instead of the last line:

- In VS Code Azure plugin, under Workspace, Function CodySlackBot, "Run function now"
- Use request body: `{ "animal": "panda" }`

## Deploy to Prod Slot

* set envars in Azure Function App console under > configuration > Application settings, add:

```
OPENAI_API_KEY=the_api_key
```

* In VS Code, in the Azure toolbar under Resources, expand codestar-website-api > Slots > test and right-click. Click "Swap slot..."
* Select the production slot

or:

* in VS Code, in the Azure toolbar under Workspace > click the "deploy" icon (cloud with up arrow), select the correct Resource Group and the codestar-cody-slackbot Function App. Allow overwriting the existing deployment.

Test with `curl ???/api/animal-hero/\?animal\=panda`

Test with `curl ???/api/q-and-a\?question\=Where%20is%20the%20Sea%20of%20Silence%3F`


## Set up the Slack Bot

* Steps: https://www.napkin.io/blog/how-to-make-slack-bot-reminder-9-steps or https://api.slack.com/start/building/bolt-js
  * Create an app: https://api.slack.com/apps?new_app=1&ref=bolt_start_hub
  * App Name: Cody Starr
  * Workspace: ...
  * OAuth & Permissions > Scopes > Bot token Scopes: add "chat:write"
  * Install to Workspace, copy token

TODO

add CORS protection
CORS: in Azure Function App console under > API > CORS
    Request credentials can be turned OFF
    Add allowed origins: https://code-star.github.io
