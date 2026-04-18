"use client";

import { Header } from "@/components/Header";
import { useLocale } from "@/components/LocaleProvider";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function LoginPage() {
  const { messages } = useLocale();

  return (
    <>
      <Header />
      <PlaceholderPage
        eyebrow={messages.login.eyebrow}
        title={messages.login.title}
        description={messages.login.description}
      />
    </>
  );
}
