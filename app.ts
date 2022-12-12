// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
import { App } from "@slack/bolt";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Hi, I am _Cody Starr_* :cs_rotate:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "I am a work in progress :construction:, but then again, who isn't?"
            }
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
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a slash command invocation
app.command("/hi", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Hi! :cs_rotating:",
          },
        },
      ],
      // Text in the notification
      text: "Message from Test App",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

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
