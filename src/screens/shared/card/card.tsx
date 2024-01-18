import { motion } from "framer-motion";
import { css } from "@emotion/css";
import React from "react";
import { theme } from "../../../ui/theme.tsx";
import { observer } from "mobx-react-lite";
import { CardUnderReviewStore } from "../../deck-review/store/card-under-review-store.ts";
import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";
import { CardFieldView } from "./card-field-view.tsx";
import { assert } from "../../../lib/typescript/assert.ts";

export const cardSize = 310;

export type LimitedCardUnderReviewStore = Pick<
  CardUnderReviewStore,
  | "isOpened"
  | "deckSpeakField"
  | "isSpeakingCardsEnabledSettings"
  | "speak"
  | "front"
  | "back"
  | "example"
  | "answerType"
  | "answers"
  | "answer"
  | "openWithAnswer"
  | "open"
>;

type Props = {
  card: LimitedCardUnderReviewStore;
};

export const Card = observer(({ card }: Props) => {
  return (
    <motion.div
      className={
        card.answerType === "remember"
          ? css({
              position: "absolute",
              left: "50%",
              top: 0,
              marginLeft: -(cardSize / 2),
              height: cardSize,
              width: cardSize,
              boxSizing: "border-box",
              borderRadius: theme.borderRadius,
              color: theme.textColor,
              display: "grid",
              placeItems: "center center",
              padding: 10,
              background: theme.secondaryBgColorComputed,
            })
          : css({
              color: theme.textColor,
            })
      }
    >
      <span
        className={css({
          textAlign: "center",
          fontWeight: 600,
          color: theme.textColor,
        })}
      >
        <div>
          <CardFieldView text={card.front} />{" "}
          <CardSpeaker card={card} type={"front"} />
        </div>
        {card.isOpened ? <HorizontalDivider /> : null}
        {card.isOpened ? (
          <div>
            <CardFieldView text={card.back} />{" "}
            <CardSpeaker card={card} type={"back"} />
          </div>
        ) : null}
        {card.isOpened && card.example ? (
          <div
            className={css({ fontWeight: 400, fontSize: 14, paddingTop: 8 })}
          >
            <CardFieldView text={card.example} />
          </div>
        ) : null}
        {card.isOpened && card.answerType === "choice_single" ? (
          <>
            <HorizontalDivider />
            {(() => {
              assert(card.answer);
              if (card.answer.isCorrect) {
                return (
                  <div className={css({ fontWeight: "normal" })}>
                    <span className={css({ color: theme.success })}>
                      Correct:{" "}
                    </span>
                    {card.answer.text}
                  </div>
                );
              }
              if (!card.answer.isCorrect) {
                const correctAnswer = card.answers.find(
                  (answer) => answer.isCorrect,
                );

                return (
                  <div className={css({ fontWeight: "normal" })}>
                    <div>
                      <span className={css({ color: theme.danger })}>
                        Wrong:{" "}
                      </span>
                      {card.answer.text}
                    </div>
                    <div>Correct: {correctAnswer?.text}</div>
                  </div>
                );
              }
            })()}
          </>
        ) : null}
      </span>
    </motion.div>
  );
});
