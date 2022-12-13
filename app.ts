// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
import { App } from "@slack/bolt";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { generateHeroPrompt, sayAnimalHero } from "./lib/heroPrompt";
import { sayQandA } from "./lib/qAndAPrompt";
import { queryOpenAI } from "./lib/queryOpenAI";
import { queryOpenAi } from "./lib/util";

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
});

app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Hi, I am _Cody Starr_* :sunglasses:",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "I am a work in progress :construction:, but then again, who isn't?\nI can answer questions by using <https://openai.com|*OpenAI*>. It's not free, so keep that in mind :smile:",
            },
          },
          // {
          //   "type": "actions",
          //   "elements": [
          //     {
          //       "type": "button",
          //       "text": {
          //         "type": "plain_text",
          //         "text": "Click me!"
          //       }
          //     }
          //   ]
          // }
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

const welcomeChannelId = "C8CK09Q14";

// When a user joins the team, send a message in a predefined channel asking them to introduce themselves
app.event("team_join", async ({ event, client, logger }) => {
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: welcomeChannelId,
      text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`,
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

// app.message("knockknock", async ({ message, say }) => {
//   await say(`_Who's there?_`);
// });

// subscribe to 'app_mention' event in your App config
// need app_mentions:read and chat:write scopes
app.event("app_mention", async ({ event, context, client, say, payload }) => {
  // console.log(event.text, payload.text, payload);

  const sayDefault = async () => {
    await say({
      thread_ts: payload.thread_ts,
      text: `Hi <@${event.user}>! Try saying "Hi Cody!"`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            // NOTE: without <@ only the user id is shown.
            text: `Hi <@${event.user}>! Try saying _"Hi Cody!"_`,
          },
          // accessory: {
          //   type: "button",
          //   text: {
          //     type: "plain_text",
          //     text: "Button",
          //     emoji: true,
          //   },
          //   value: "click_me_123",
          //   action_id: "first_button",
          // },
        },
      ],
    });
  };

  const [mention, command, arg] = payload.text.split(" ");

  try {
    if (command === "hero") {
      await sayAnimalHero(arg, say, event);
    } else if (command === "question") {
      const question = payload.text.split(" ").slice(2).join(" ");
      await sayQandA(question, say, event);
    } else {
      await sayDefault();
    }
  } catch (error) {
    console.error(error);
  }
});

// app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
app.message("Hi Cody!", async ({ message, event, context, say }) => {
  // const greeting = context.matches[0];

  // @ts-expect-error ??
  const u = message.user;

  // await say(`${greeting} <@${context.user}>! :cs_rotating:`);
  await say(`Hi <@${u}>! :cs_rotating:`);
});

// Listen for a slash command invocation
// app.command("/hi", async ({ ack, payload, context }) => {
//   // Acknowledge the command request
//   ack();

//   try {
//     const result = await app.client.chat.postMessage({
//       token: context.botToken,
//       // Channel to send message to
//       channel: payload.channel_id,
//       // Include a button in the message (or whatever blocks you want!)
//       blocks: [
//         {
//           type: "section",
//           text: {
//             type: "plain_text",
//             text: "Hi! :cs_rotating:",
//           },
//         },
//       ],
//       // Text in the notification
//       text: "Message from Test App",
//     });
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

// Listen for a button invocation with action_id `button_abc`
// You must set up a Request URL under Interactive Components on your app configuration page
// app.action("button_abc", async ({ ack, body, context }) => {
//   // Acknowledge the button request
//   ack();

//   try {
//     // Update the message
//     const result = await app.client.chat.update({
//       token: context.botToken,
//       // ts of message to update
//       ts: body.message.ts,
//       // Channel of message
//       channel: body.channel.id,
//       blocks: [
//         {
//           type: "section",
//           text: {
//             type: "mrkdwn",
//             text: "*The button was clicked!*",
//           },
//         },
//       ],
//       text: "Message from Test App",
//     });
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
