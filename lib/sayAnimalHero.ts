import { queryOpenAI } from "./queryOpenAI";
import { sayLoading } from "./sayLoading";
import { AppMentionProps } from "./types";

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

export const sayAnimalHero = async (props: AppMentionProps, animal: string) => {
  console.log("Starting sayAnimalHero");
  const loadingMsg = await sayLoading(props);

  const { event, client } = props;

  const result = await queryOpenAI({
    prompt: generateHeroPrompt(animal),
  });
  const heroNames = result.trim().split(", ");

  client.chat.update({
    text: `Hi <@${
      event.user
    }>, I made up some names for a hero ${animal}: ${heroNames.join(", ")}`,
    thread_ts: event.thread_ts,
    channel: loadingMsg.channel,
    ts: loadingMsg.ts,
  });

  console.log("Finished sayAnimalHero");
};
