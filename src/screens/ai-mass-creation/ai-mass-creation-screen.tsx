import { observer } from "mobx-react-lite";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { AiMassCreationForm } from "./ai-mass-creation-form.tsx";
import { PreviousPromptsScreen } from "./previous-prompts-screen.tsx";
import { CardsGeneratedScreenWrapper } from "./cards-generated-screen-wrapper.tsx";

export const AiMassCreationScreen = observer(() => {
  const store = useAiMassCreationStore();
  if (store.screen.value === "cardsGenerated") {
    return <CardsGeneratedScreenWrapper />;
  }
  if (store.screen.value === "previousPrompts") {
    return <PreviousPromptsScreen />;
  }
  return <AiMassCreationForm />;
});
