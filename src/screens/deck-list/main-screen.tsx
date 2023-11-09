import React from "react";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { PublicDeck } from "./public-deck.tsx";
import { MyDeck } from "./my-deck.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { Hint } from "../../ui/hint.tsx";
import { theme } from "../../ui/theme.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { Button } from "../../ui/button.tsx";
import { DeckLoading } from "./deck-loading.tsx";
import WebApp from "@twa-dev/sdk";
import { assert } from "../../lib/typescript/assert.ts";

export const MainScreen = observer(() => {
  useMount(() => {
    deckListStore.load();
    deckListStore.loadSharedDeck(WebApp.initDataUnsafe.start_param);
  });

  if (deckListStore.isSharedDeckLoading) {
    return (
      <div
        className={css({
          display: "flex",
          height: "100vh",
          backgroundColor: theme.bgColor,
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <i className={"mdi mdi-loading mdi-spin mdi-48px"} />
      </div>
    );
  }

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: 12 })}>
      <h2 className={css({ margin: 0, padding: 0, paddingTop: 4 })}>
        My decks
      </h2>

      <div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: 6,
          })}
        >
          {deckListStore.myInfo?.state === "pending" &&
            [1, 2, 3].map((i) => <DeckLoading key={i} />)}
          {deckListStore.myInfo?.state === "fulfilled"
            ? deckListStore.myDecks.map((deck) => {
                return <MyDeck key={deck.id} deck={deck} />;
              })
            : null}

          {deckListStore.myInfo?.state === "fulfilled" &&
          !deckListStore.myDecks.length ? (
            <Hint>
              You don't have any personal deck yet. Feel free to{" "}
              <span
                className={css({
                  color: theme.linkColor,
                })}
                onClick={() => {
                  screenStore.navigateToDeckForm();
                }}
              >
                create one
              </span>{" "}
              or explore the public decks below. Happy learning! 😊
            </Hint>
          ) : null}

          {deckListStore.myInfo?.state === "fulfilled" &&
          deckListStore.myDecks.length > 0 ? (
            <Button
              icon={"mdi-plus"}
              onClick={() => {
                screenStore.navigateToDeckForm();
              }}
            >
              Add deck
            </Button>
          ) : null}

          {deckListStore.areAllDecksReviewed && (
            <Hint>
              Amazing work! 🌟 You've reviewed all the decks for now. Come back
              later for more.
            </Hint>
          )}
        </div>
      </div>

      <h2 className={css({ margin: 0, padding: 0 })}>Public decks</h2>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 6,
        })}
      >
        {deckListStore.myInfo?.state === "fulfilled" &&
        !deckListStore.publicDecks.length ? (
          <Hint>
            Wow! 🌟 You've added them all! There are no more public decks left
            to discover.
          </Hint>
        ) : null}

        {deckListStore.myInfo?.state === "fulfilled" ? (
          <>
            {deckListStore.publicDecks.map((deck) => (
              <PublicDeck key={deck.id} deck={deck} />
            ))}
          </>
        ) : null}

        {deckListStore.myInfo?.state === "pending" &&
          [1, 2, 3].map((i) => <DeckLoading key={i} />)}
      </div>

      <h2 className={css({ margin: 0, padding: 0 })}>News and updates</h2>
      <div className={css({ paddingBottom: 16 })}>
        <Button
          icon={"mdi-call-made"}
          onClick={() => {
            const channelLink = import.meta.env.VITE_CHANNEL_LINK;
            assert(channelLink, "Channel link env variable is empty");

            WebApp.openTelegramLink(channelLink);
          }}
        >
          Telegram channel
        </Button>
      </div>
    </div>
  );
});