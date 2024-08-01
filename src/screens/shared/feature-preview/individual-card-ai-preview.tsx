import { observer } from "mobx-react-lite";
import { CardInputModeDb } from "../../../../functions/db/card-input-mode/schema.ts";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { css } from "@emotion/css";
import { t } from "../../../translations/t.ts";
import { theme } from "../../../ui/theme.tsx";
import { CardSidePreview } from "../../card-input-mode/card-side-preview.tsx";
import { UpgradeProBlock } from "./upgrade-pro-block.tsx";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  viewMode: CardInputModeDb | null;
  showUpgrade?: boolean;
};

export const IndividualCardAiPreview = observer((props: Props) => {
  const { isOpen, onClose, viewMode, showUpgrade } = props;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {(() => {
        if (!viewMode) {
          return null;
        }

        return (
          <Flex direction={"column"} alignItems={"center"} pb={48}>
            <BottomSheetTitle title={viewMode.title} onClose={onClose} />
            <div className={css({ width: 250 })}>
              <Flex pb={16} justifyContent={"center"}>
                {t("card_input_mode_type")}
              </Flex>
              <div
                className={css({
                  padding: "12px 10px",
                  borderRadius: theme.borderRadius,
                  boxSizing: "border-box",
                  width: "100%",
                  backgroundColor: theme.secondaryBgColor,
                })}
              >
                {viewMode.preview_front}
              </div>

              <Flex pt={16} pb={16} justifyContent={"center"}>
                {t("card_input_mode_get")}
              </Flex>

              <Flex gap={8} direction={"column"}>
                <CardSidePreview
                  front={viewMode.preview_front}
                  back={viewMode.preview_back}
                  example={viewMode.preview_example}
                />
              </Flex>

              <Flex mt={16} justifyContent={"center"}>
                {t("ai_card_input_mode_supports")}
              </Flex>
            </div>
            {showUpgrade && <UpgradeProBlock />}
          </Flex>
        );
      })()}
    </BottomSheet>
  );
});
