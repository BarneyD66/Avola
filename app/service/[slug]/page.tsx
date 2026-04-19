import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PurchasePanel } from "@/components/PurchasePanel";
import { ServiceDetailHero } from "@/components/ServiceDetailHero";
import { getServiceBySlug, services } from "@/data/services";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.name,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_380px] lg:px-8 lg:gap-8">
          <ServiceDetailHero service={service} />
          <PurchasePanel service={service} />
        </div>
      </main>
    </>
  );
}
