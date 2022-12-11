import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
import { queryOpenAi } from "../lib/util";

const generatePrompt = (animal: string): string => {
  const capitalizedAnimal =
    animal.toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.
  
  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`;
};

/*
Call with: { "animal": "panda" }
*/
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function animal-hero processed a request.");

  const animal = req.query.animal ?? req.body.animal;

  if (!animal) {
    context.res = {
      status: 400,
      body: 'Missing param "animal"',
    };
    return;
  }

  // Workaround because debug mode in VS Code with .env does not work
  const KEY = req.query.key;
  const OPENAI_API_KEY = KEY ?? process.env.OPENAI_API_KEY;

  try {
    const result = await queryOpenAi(
      { req, context },
      generatePrompt(req.query.animal ?? req.body.animal)
    );
    const heroNames = result.trim().split(", ");

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        animal,
        heroNames,
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

  // if (!OPENAI_API_KEY) {
  //   context.res = {
  //     status: 400,
  //     body: "Missing env OPENAI_API_KEY",
  //   };
  //   return;
  // }

  // const configuration = new Configuration({
  //   apiKey: OPENAI_API_KEY,
  // });
  // const openai = new OpenAIApi(configuration);

  // const completion = await openai.createCompletion({
  //   model: "text-davinci-002",
  //   prompt: generatePrompt(req.query.animal ?? req.body.animal),
  //   temperature: 0.6,
  // });

  // context.log("completion=", JSON.stringify(completion.data));

  // const heroNames = completion.data.choices[0].text.trim().split(", ");

  // context.res = {
  //   // status: 200, /* Defaults to 200 */
  //   body: {
  //     animal,
  //     heroNames,
  //   },
  // };
};

export default httpTrigger;
