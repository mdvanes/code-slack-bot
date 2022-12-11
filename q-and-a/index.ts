import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { queryOpenAi } from "../lib/util";

const generatePrompt = (question: string): string => {
  // const capitalizedAnimal =
  //   animal.toUpperCase() + animal.slice(1).toLowerCase();
  return `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: ${question}\nA:`;
};

/*
Call with: { "question": "Where is the Sea of Silence?" }
*/
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function q-and-a processed a request.");

  const question = req.query.question ?? req.body.question;

  if (!question) {
    context.res = {
      status: 400,
      body: 'Missing param "question"',
    };
    return;
  }

  context.log(`With question: ${question}`);

  try {
    const result = await queryOpenAi(
      { req, context },
      {
        model: "text-davinci-003",
        prompt: generatePrompt(question),
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      }
    );
    const answer = result.trim();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        question,
        answer,
      },
    };
    return;
  } catch (err) {
    context.res = {
      status: 400,
      body: "Missing env OPENAI_API_KEY",
    };
    return;
  }
};

export default httpTrigger;
