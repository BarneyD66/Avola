import { Header } from "@/components/Header";
import { CategoryPreviewSection } from "@/components/CategoryPreviewSection";
import { IntroSection } from "@/components/IntroSection";
import { NoticeCard } from "@/components/NoticeCard";
import { categoryPreviews } from "@/data/categories";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 lg:gap-9 lg:px-8">
          <IntroSection />
          <NoticeCard />
          <CategoryPreviewSection categories={categoryPreviews} />
        </div>
      </main>
    </>
  );
}
