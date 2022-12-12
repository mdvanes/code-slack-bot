import { Context, HttpRequest } from "@azure/functions";
import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai";

export const queryOpenAI = async (
  prompt: Partial<CreateCompletionRequest>
): Promise<string> => {
  const { OPENAI_API_KEY } = process.env;

  if (!OPENAI_API_KEY) {
    throw new Error("Missing env OPENAI_API_KEY");
  }

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const config = prompt.model
    ? prompt
    : {
        model: "text-davinci-002",
        prompt: prompt.prompt,
        temperature: 0.6,
      };

  const completion = await openai.createCompletion(
    config as CreateCompletionRequest
  );

  return completion.data.choices[0].text;
};
