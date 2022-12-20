import { queryOpenAI } from "./queryOpenAI";
import { sayLoading } from "./sayLoading";
import { AppMentionProps } from "./types";
import { logDate } from "./util";

const generatePrompt = (question: string): string => {
  return `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: ${question}\nA:`;
};

export const sayQandA = async (props: AppMentionProps, prompt: string) => {
  const { event, client, logger } = props;
  logger.info(`${logDate()} Starting sayQandA`);
  const loadingMsg = await sayLoading(props);

  try {
    const result = await queryOpenAI({
      model: "text-davinci-003",
      prompt: generatePrompt(prompt),
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    const text = result ? result.trim() : ":sweat_smile:";

    await client.chat.update({
      text,
      thread_ts: event.thread_ts,
      channel: loadingMsg.channel,
      ts: loadingMsg.ts,
    });
  } catch (err) {
    logger.error(err);
    await client.chat.update({
      text: "That question broke me! :broken_heart:",
      thread_ts: event.thread_ts,
      channel: loadingMsg.channel,
      ts: loadingMsg.ts,
    });
  }

  logger.info(`${logDate()} Finished sayQandA`);
};
