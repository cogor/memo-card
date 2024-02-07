import { CardPreview } from "../deck-form/card-preview.tsx";
import { useState } from "react";
import { CardFormStoreInterface } from "../deck-form/store/card-form-store-interface.ts";
import { TextField } from "../../lib/mobx-form/text-field.ts";
import { CardAnswerType } from "../../../functions/db/custom-types.ts";
import { BooleanToggle } from "../../lib/mobx-form/boolean-toggle.ts";
import { CardAnswerFormType } from "../deck-form/store/deck-form-store.ts";
import { ListField } from "../../lib/mobx-form/list-field.ts";

const createCardPreviewForm = (card: {
  front: string;
  back: string;
  example?: string;
}): CardFormStoreInterface => {
  return {
    cardForm: {
      front: new TextField<string>(card.front),
      back: new TextField<string>(card.back),
      example: new TextField<string>(card.example ?? ""),
      answerType: new TextField<CardAnswerType>("remember"),
      answerFormType: "new",
      options: null,
      answers: new ListField<CardAnswerFormType>([]),
      answerId: "0",
    },
    form: undefined,
    isCardPreviewSelected: new BooleanToggle(false),
    isSaveCardButtonActive: false,
    onBackCard: () => {},
    onSaveCard: () => {},
    isSending: false,
    markCardAsRemoved: () => {},
  };
};

export const CardPreviewStory = (props: {
  card: {
    front: string;
    back: string;
    example?: string;
  };
}) => {
  const [form] = useState(createCardPreviewForm(props.card));

  return <CardPreview form={form} onBack={() => {}} />;
};
