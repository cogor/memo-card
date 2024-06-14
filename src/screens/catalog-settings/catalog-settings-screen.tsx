import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import React, { useState } from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { screenStore } from "../../store/screen-store.ts";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { theme } from "../../ui/theme.tsx";
import { css } from "@emotion/css";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { CatalogSettingsStore } from "./store/catalog-settings-store.ts";
import { Select } from "../../ui/select.tsx";
import {
  LanguageCatalogItemAvailableIn,
  languageCatalogItemAvailableInToNative,
} from "../../../shared/language/language-shared.ts";
import { enumValues } from "../../lib/typescript/enum-values.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";

export const CatalogSettingsScreen = observer(() => {
  const [catalogSettingsStore] = useState(() => new CatalogSettingsStore());
  const screen = screenStore.screen;
  assert(screen.type === "catalogSettings");

  useBackButton(() => {
    screenStore.back();
  });

  useMainButton(t("save"), () => {
    catalogSettingsStore.submit();
  });

  useProgress(
    () => catalogSettingsStore.updateCatalogItemSettingsRequest.isLoading,
  );

  useMount(() => {
    catalogSettingsStore.loadForm();
  });

  const { form } = catalogSettingsStore;

  if (!form) {
    return <FullScreenLoader />;
  }

  return (
    <Screen title={"Catalog settings"}>
      <div>
        <List
          animateTap={false}
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.pink}
                  icon={"mdi-eye"}
                />
              ),
              right: (
                <span
                  className={css({
                    top: 3,
                    position: "relative",
                  })}
                >
                  <RadioSwitcher
                    isOn={form.isPublic.value}
                    onToggle={form.isPublic.toggle}
                  />
                </span>
              ),
              text: "Is public",
            },
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={"mdi-translate"}
                />
              ),
              text: "User language",
              right: (
                <div className={css({ color: theme.linkColor })}>
                  <Select<LanguageCatalogItemAvailableIn | null>
                    value={form.availableIn.value}
                    onChange={(value) => {
                      form?.availableIn.onChange(value);
                    }}
                    options={(
                      enumValues(LanguageCatalogItemAvailableIn).map(
                        (lang) => ({
                          value: lang,
                          label: languageCatalogItemAvailableInToNative(lang),
                        }),
                      ) as Array<{
                        value: LanguageCatalogItemAvailableIn | null;
                        label: string;
                      }>
                    ).concat([{ value: null, label: "Empty" }])}
                  />
                </div>
              ),
            },
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.blue}
                  icon={"mdi-folder-outline"}
                />
              ),
              text: "Category",
              right: (
                <div className={css({ color: theme.linkColor })}>
                  <Select<string | null>
                    value={form.categoryId.value}
                    onChange={(value) => {
                      form?.categoryId.onChange(value);
                    }}
                    isLoading={catalogSettingsStore.categoriesRequest.isLoading}
                    options={
                      catalogSettingsStore.categoriesRequest.result.status ===
                      "success"
                        ? (
                            catalogSettingsStore.categoriesRequest.result.data.categories.map(
                              (category) => ({
                                value: category.id,
                                label: category.name,
                              }),
                            ) as Array<{ value: string | null; label: string }>
                          ).concat([
                            {
                              value: null,
                              label: "No category",
                            },
                          ])
                        : []
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </Screen>
  );
});
