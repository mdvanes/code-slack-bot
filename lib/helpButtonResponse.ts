import { SayFn, SlackAction } from "@slack/bolt";

export const helpButtonResponse = async ({
  ack,
  say,
  body,
}: {
  ack: () => Promise<void>;
  say: SayFn;
  body: SlackAction;
}) => {
  await ack();
  // Update the message to reflect the action
  await say({
    text: `How to talk to me: ...`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `How to talk to me:
- Ask me to make up super hero names for your pet:
        - Start with \`@Cody Starr hero \`
        - Example: \`@Cody Starr hero snake\`
- Ask me a question based in facts (if not based in facts I will respond with Unknown):
        - Start with \`@Cody Starr question \`
        - Example: \`@Cody Starr question what is the most expensive option in the AWS Snow family of products?\`
        - Example: \`@Cody Starr question how heavy it the moon?\`
- Ask me to paint something:
        - Start with \`@Cody Starr paint \`
        - Example: \`@Cody Starr paint a cat with a hat and a baseball bat in the style of Rembrandt\`
- Ask me to write your unit tests (JavaScript only for now):
        - Start with \`@Cody Starr test js \` followed by a code block
        - Example: \`@Cody Starr test js \` \`\`\`
const appendText = (a, b) => \`\${a}\${b}\`;
\`\`\`
  `,
        },
      },
    ],
    // @ts-expect-error
    thread_ts: body.container.thread_ts,
  });
};
