import { AppMentionEvent, SayFn } from "@slack/bolt";
import { queryOpenAI } from "./queryOpenAI";

export const generateHeroPrompt = (animal: string): string => {
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

export const sayAnimalHero = async (
  animal: string,
  say: SayFn,
  event: AppMentionEvent
) => {
  console.log("Starting sayAnimalHero");
  const result = await queryOpenAI({
    prompt: generateHeroPrompt(animal),
  });
  const heroNames = result.trim().split(", ");

  await say({
    text: `Hi <@${
      event.user
    }>, I made up some names for a hero ${animal}: ${heroNames.join(", ")}`,
    thread_ts: event.thread_ts,
  });
  console.log("Finished sayAnimalHero");
};
