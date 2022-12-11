import { Context, HttpRequest } from "@azure/functions";
import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai";

export const queryOpenAi = async (
  { req, context }: { req: HttpRequest; context: Context },
  prompt: Partial<CreateCompletionRequest>
): Promise<string> => {
  // Workaround because debug mode in VS Code with .env does not work
  const KEY = req.query.key;
  const OPENAI_API_KEY = KEY ?? process.env.OPENAI_API_KEY;

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

  context.log("completion=", JSON.stringify(completion.data));
  return completion.data.choices[0].text;
};
