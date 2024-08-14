import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  deckListStore,
  DeckWithCardsWithReviewType,
} from "../../store/deck-list-store.ts";
import { CardListWithPreviewReadonly } from "../deck-review/preview-readonly/card-list-with-preview-readonly.tsx";
import { FolderPreview } from "./folder-preview.tsx";

export const FolderPreviewWrapper = observer(() => {
  const [previewDeck, setPreviewDeck] =
    useState<DeckWithCardsWithReviewType | null>(null);

  if (previewDeck) {
    const folderName = deckListStore.selectedFolder?.name || "";
    return (
      <CardListWithPreviewReadonly
        folderName={folderName}
        deck={previewDeck}
        cards={previewDeck.deck_card}
        onBack={() => setPreviewDeck(null)}
      />
    );
  }

  return (
    <FolderPreview
      onDeckPreviewOpen={(deck) => {
        setPreviewDeck(deck);
      }}
    />
  );
});