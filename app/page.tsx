import { Header } from "@/components/Header";
import { CategoryPreviewSection } from "@/components/CategoryPreviewSection";
import { IntroSection } from "@/components/IntroSection";
import { NoticeCard } from "@/components/NoticeCard";
import { categoryPreviews } from "@/data/categories";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative flex-1 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 sm:gap-10 sm:px-6 lg:px-8">
          <IntroSection />
          <NoticeCard />
          <CategoryPreviewSection categories={categoryPreviews} />
        </div>
      </main>
    </>
  );
}
