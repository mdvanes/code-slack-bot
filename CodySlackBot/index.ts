import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";

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
  context.log("HTTP trigger function CodySlackBot processed a request.");
  // const name = (req.query.name || (req.body && req.body.name));
  // const responseMessage = name
  //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
  //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  const animal = req.query.animal ?? req.body.animal;

  if (!animal) {
    context.res = {
      status: 400,
      body: 'Missing param "animal"',
    };
    return;
  }

  const { OPENAI_API_KEY } = process.env;
  context.log("OPENAI_API_KEY=", OPENAI_API_KEY);

  if (!OPENAI_API_KEY) {
    context.res = {
      status: 400,
      body: 'Missing env OPENAI_API_KEY',
    };
    return;
  }

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: generatePrompt(req.query.animal ?? req.body.animal),
    temperature: 0.6,
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: completion.data.choices[0].text,
  };
};

export default httpTrigger;
