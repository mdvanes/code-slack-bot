import { Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";

export const queryOpenAi = async (
  { req, context }: { req: HttpRequest; context: Context },
  prompt: string
): Promise<string> => {
  // Workaround because debug mode in VS Code with .env does not work
  const KEY = req.query.key;
  const OPENAI_API_KEY = KEY ?? process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    // context.res = {
    //   status: 400,
    //   body: "Missing env OPENAI_API_KEY",
    // };
    // return;
    throw new Error("Missing env OPENAI_API_KEY");
  }

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt, // generatePrompt(req.query.animal ?? req.body.animal),
    temperature: 0.6,
  });

  context.log("completion=", JSON.stringify(completion.data));
  return completion.data.choices[0].text;
};
