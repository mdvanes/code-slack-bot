import { App } from "@slack/bolt";
import { publishAppHome } from "./lib/publishAppHome";
import { sayAnimalHero } from "./lib/sayAnimalHero";
import { sayDefault } from "./lib/sayDefault";
import { sayPaint } from "./lib/sayPaint";
import { sayQandA } from "./lib/sayQAndA";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { sayTest } from "./lib/sayTest";
import { helpButtonResponse } from "./lib/helpButtonResponse";
import { AppMentionProps } from "./lib/types";
import { logDate } from "./lib/util";

dotenv.config();

const VERSION = {
  major: 0,
  minor: 0,
  patch: 14,
};

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  customRoutes: [
    {
      path: "/",
      method: ["GET"],
      handler: (req, res) => {
        console.log("Called warmup endpoint on / for Cody 🌞");
        res.writeHead(200);
        res.end("OK");
      },
    },
    {
      path: "/warmup",
      method: ["GET"],
      handler: (req, res) => {
        console.log("Called warmup endpoint on /warmup for Cody 🌞");
        res.writeHead(200);
        res.end("OK");
      },
    },
  ],
});

const getVersion = () => {
  const { major, minor, patch } = VERSION;
  return `v${major}.${minor}.${patch}`;
};

app.event("app_home_opened", async (props) => {
  try {
    await publishAppHome(props);
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

const mentionFn = async (props: AppMentionProps) => {
  const { event, context, client, say, payload } = props;
  // console.log(event.text, payload.text, payload);

  const [mention, command, ...arg] = payload.text.split(" ");
  const argsString = arg.join(" ");

  // console.log(JSON.stringify(payload.text), arg, argsString);

  try {
    if (command === "hero") {
      await sayAnimalHero(props, arg[0]);
    } else if (command === "question") {
      await sayQandA(props, argsString);
    } else if (command === "paint") {
      await sayPaint(props, argsString);
    } else if (command === "test") {
      const prompt = payload.text.substring(payload.text.indexOf("\n"));
      await sayTest(props, prompt);
    } else {
      await sayDefault(props);
    }
  } catch (error) {
    console.error(error);
  }
};

// subscribe to 'app_mention' event in your App config
// need app_mentions:read and chat:write scopes
app.event("app_mention", mentionFn);

// TODO on mobile mention does not work, but matching message starting with "cody" will also not work because it has a different type
// app.message(new RegExp(/^cody .*/, "i"), mentionFn);

app.message(
  new RegExp(/^(hi|hello|hey) cody\!.*/, "i"),
  async ({ message, event, context, say, logger, client, payload }) => {
    logger.info(`${logDate()} Responding to HI`);
    // @ts-expect-error
    const user = message.user;

    const result = await client.users.info({
      user,
    });

    const name = result?.user?.profile?.first_name ?? `<@${user}>`;

    await say({
      text: `Hi ${name}! :cs_rotating:`,
      // @ts-expect-error
      thread_ts: event.thread_ts,
    });
  }
);

// Cody, what version are you running?

app.message(
  new RegExp(/^cody, what version are you running\?.*/, "i"),
  async ({ message, event, context, say, logger, client, payload }) => {
    logger.info(`${logDate()} Responding to VERSION`);

    await say({
      text: `I'm running ${getVersion()} :robot_face:`,
      // @ts-expect-error
      thread_ts: event.thread_ts,
    });
  }
);

app.action("cody_help_button", helpButtonResponse);

(async () => {
  const port = process.env.PORT || 3000;
  // Start your app
  await app.start(port);

  console.log(
    `${logDate()} ⚡️ Bolt app is running on port ${port}. [${getVersion()}]`
  );
})();

// app.message("knockknock", async ({ message, say }) => {
//   await say(`_Who's there?_`);
// });

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
