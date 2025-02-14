import React, { ReactNode, useEffect, useRef, useState } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";
import { AnimatePresence, m } from "framer-motion";
import { userStore } from "../store/user-store.ts";

type Props = {
  items: Array<{ text: ReactNode; onClick: () => void }>;
};

export const Dropdown = ({ items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={css({ position: "absolute", display: "inline-block" })}
    >
      <div
        onClick={toggleDropdown}
        className={cx(
          "dropdown-icon",
          css({ userSelect: "none", cursor: "pointer" }),
        )}
      >
        ...
      </div>
      <LazyLoadFramerMotion>
        <AnimatePresence>
          {isOpen && (
            <m.div
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cx(
                "dropdown-content",
                css({
                  display: "block",
                  position: "absolute",
                  backgroundColor: theme.secondaryBgColor,
                  minWidth: "160px",
                  borderRadius: theme.borderRadius,
                  boxShadow: theme.boxShadow,
                  right: userStore.isRtl ? undefined : 0,
                  left: userStore.isRtl ? 0 : undefined,
                  zIndex: 1,
                  color: theme.textColor,
                }),
              )}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className={css({
                    padding: "12px 16px",
                    borderRadius: 0,
                    whiteSpace: "nowrap",
                    ...tapScale,
                    ":hover": {
                      backgroundColor: theme.buttonColor,
                      color: theme.buttonTextColor,
                    },
                    ":first-child": {
                      borderTopLeftRadius: theme.borderRadius,
                      borderTopRightRadius: theme.borderRadius,
                    },
                    ":last-child": {
                      borderBottomLeftRadius: theme.borderRadius,
                      borderBottomRightRadius: theme.borderRadius,
                    },
                  })}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {item.text}
                </div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </LazyLoadFramerMotion>
    </div>
  );
};
