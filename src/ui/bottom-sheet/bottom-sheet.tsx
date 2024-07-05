import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { theme } from "../theme.tsx";
import { css } from "@emotion/css";
import { platform } from "../../lib/platform/platform.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";

const variants = {
  open: { y: 0 },
  closed: { y: "100%" },
};

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const BottomSheet = (props: Props) => {
  const { isOpen, onClose, children } = props;

  // Disable backdrop scroll
  useEffect(() => {
    if (isOpen) {
      if (platform instanceof TelegramPlatform && platform.isIos()) {
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={css({
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: theme.zIndex.bottomSheetBackground,
            })}
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={css({
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.bgColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
              zIndex: theme.zIndex.bottomSheetForeground,
            })}
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
