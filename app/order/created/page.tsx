import { Header } from "@/components/Header";
import { OrderCreatedExperience } from "@/components/OrderCreatedExperience";

export default function OrderCreatedPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
          <OrderCreatedExperience />
        </div>
      </main>
    </>
  );
}
