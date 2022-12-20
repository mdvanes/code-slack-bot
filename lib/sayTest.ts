import { queryOpenAI } from "./queryOpenAI";
import { sayLoading } from "./sayLoading";
import { AppMentionProps } from "./types";
import { logDate } from "./util";

/* Expects to be called with 
@Cody Starr test js
```
const sumNumbers = (a, b) => a + b;
```
*/
export const sayTest = async (props: AppMentionProps, prompt: string) => {
  const { event, client, logger } = props;
  logger.info(`${logDate()} Starting sayTest`);
  const loadingMsg = await sayLoading(props);

  const result = await queryOpenAI({
    model: "code-davinci-002",
    prompt: `# JavaScript
    ${prompt}
    
    # Unit test
    `,
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  await client.chat.update({
    text: `Some tests for: ${prompt}
are: ${result.trim()}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Some tests for: ${prompt}
are: ${result.trim()}`,
        },
      },
    ],
    thread_ts: event.thread_ts,
    channel: loadingMsg.channel,
    ts: loadingMsg.ts,
  });

  logger.info(`${logDate()} Finished sayTest`);
};
