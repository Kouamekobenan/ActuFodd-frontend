"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "../../actions/locale";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale: string) => {
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div
      className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      <button
        onClick={() => handleSwitch("fr")}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === "fr"
            ? "text-orange-600"
            : "text-gray-400 hover:text-gray-700"
        }`}
        disabled={isPending}
      >
        FR
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className={`px-1.5 py-0.5 rounded transition-colors ${
          locale === "en"
            ? "text-orange-600"
            : "text-gray-400 hover:text-gray-700"
        }`}
        disabled={isPending}
      >
        EN
      </button>
    </div>
  );
}
