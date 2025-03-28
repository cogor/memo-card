import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { screenStore } from "../../../store/screen-store.ts";
import { BlocksIcon, BookOpenIcon } from "lucide-react";
import { LazyLoadFramerMotion } from "../../../lib/framer-motion/lazy-load-framer-motion.tsx";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { BooleanToggle } from "mobx-form-lite";
import { cn } from "../../../ui/cn.ts";
import { userStore } from "../../../store/user-store.ts";
import { CustomCloseIcon } from "./icons/custom-close-icon.tsx";
import { CustomPlayIcon } from "./icons/custom-play-icon.tsx";
import { t } from "../../../translations/t.ts";
import { translateCardCount } from "../../deck-review/repeat-custom/translate-card-count.ts";
import { hapticImpact } from "../../../lib/platform/telegram/haptics.ts";

export const ReviewButton = observer(() => {
  const [isMenuOpen] = useState(() => new BooleanToggle(false));

  if (deckListStore.myInfoRequest.isLoading || !deckListStore.myDecks.length) {
    return null;
  }

  return (
    <LazyLoadFramerMotion>
      <div
        className={cn("fixed bottom-6", {
          "right-6": !userStore.isRtl,
          "left-6": userStore.isRtl,
        })}
      >
        <button
          onClick={() => {
            hapticImpact("medium");
            isMenuOpen.toggle();
          }}
          className="h-14 pt-0.5 w-14 rounded-full bg-button text-white shadow-xl flex items-center justify-center z-20"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isMenuOpen.value ? (
              <m.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <CustomCloseIcon />
              </m.div>
            ) : (
              <m.div
                key="play"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <CustomPlayIcon />
              </m.div>
            )}
          </AnimatePresence>
        </button>

        {/* Floating menu options */}
        <AnimatePresence>
          {isMenuOpen.value && (
            <m.div
              className={cn(
                "absolute bottom-16 bg-bg rounded-lg shadow-lg border border-gray-300 overflow-hidden z-10",
                {
                  "right-0": !userStore.isRtl,
                  "left-0": userStore.isRtl,
                },
              )}
              initial={{
                opacity: 0,
                scale: 0.8,
                transformOrigin: userStore.isRtl
                  ? "bottom left"
                  : "bottom right",
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => {
                  screenStore.go({ type: "reviewAll" });
                }}
                className="w-full whitespace-nowrap text-left text-base px-4 py-3 hover:bg-gray-100 flex items-center justify-between gap-3"
              >
                <span className={"flex gap-2 items-center text-text"}>
                  <BookOpenIcon className="max-[360px]:hidden h-5 w-5 text-button" />
                  {t("review_all_due")}
                </span>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm">
                  {translateCardCount(deckListStore.cardsToReviewCount)}
                </span>
              </button>
              <button
                onClick={() => {
                  screenStore.go({ type: "reviewCustom" });
                  hapticImpact("light");
                }}
                className="w-full whitespace-nowrap text-left text-base px-4 py-3 hover:bg-gray-100 flex justify-between items-center gap-3"
              >
                <span className={"flex gap-2 items-center text-text"}>
                  <BlocksIcon className="max-[360px]:hidden h-5 w-5 text-button" />
                  {t("review_custom")}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-sm">
                  {translateCardCount(deckListStore.cardsTotalCount)}
                </span>
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyLoadFramerMotion>
  );
});
