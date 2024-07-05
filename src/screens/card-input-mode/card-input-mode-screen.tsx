import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { ReactNode, useState } from "react";
import { CardInputModeStore } from "./store/card-input-mode-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { DeckFormStore } from "../deck-form/deck-form/store/deck-form-store.ts";
import { css } from "@emotion/css";
import { IndividualCardAiPreview } from "../shared/feature-preview/individual-card-ai-preview.tsx";

type Props = { deckFormStore: DeckFormStore };

export const CardInputModeScreen = observer((props: Props) => {
  const { deckFormStore } = props;
  const [store] = useState(() => new CardInputModeStore(deckFormStore));

  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  useMainButton(
    t("save"),
    () => store.submit(),
    () => !store.isBottomSheetScreen,
  );

  useProgress(() => store.cardInputModesRequest.isLoading);

  return (
    <Screen title={t("card_input_mode_screen")}>
      {store.cardInputModesRequest.result.status === "loading" ? (
        <FullScreenLoader />
      ) : null}
      {store.cardInputModesRequest.result.status === "success" ? (
        <RadioList
          selectedId={store.modeId?.value}
          options={[
            { id: null, title: t("card_input_mode_manual") } as {
              id: string | null;
              title: ReactNode;
            },
          ].concat(
            store.cardInputModesRequest.result.data.map((inputMode) => ({
              id: inputMode.id,
              title: (
                <div className={css({ width: "100%", position: "relative" })}>
                  <div>{inputMode.title}</div>
                  <div
                    className={css({
                      position: "absolute",
                      top: -6,
                      right: 0,
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      store.viewModeId.onChange(inputMode.id);
                    }}
                  >
                    <i className={"mdi mdi-24px mdi-information-outline"} />
                  </div>
                </div>
              ),
            })),
          )}
          onChange={store.modeId.onChange}
        />
      ) : null}

      <IndividualCardAiPreview
        isOpen={!!store.viewModeId.value}
        onClose={() => {
          store.viewModeId.onChange(null);
        }}
        viewMode={store.viewMode}
      />
    </Screen>
  );
});
