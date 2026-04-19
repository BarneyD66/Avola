import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryItemsSection } from "@/components/CategoryItemsSection";
import { Header } from "@/components/Header";
import { ServiceCategorySection } from "@/components/ServiceCategorySection";
import { categoryPages, getCategoryBySlug } from "@/data/categories";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categoryPages.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
          {category.platforms?.length ? (
            <ServiceCategorySection
              category={{
                slug: category.slug,
                title: category.title,
                description: category.description,
                platforms: category.platforms,
              }}
            />
          ) : (
            <CategoryItemsSection category={category} />
          )}
        </div>
      </main>
    </>
  );
}
