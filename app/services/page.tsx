import { Header } from "@/components/Header";
import { ServicesDirectoryExperience } from "@/components/ServicesDirectoryExperience";
import { categoryPreviews } from "@/data/categories";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServicesDirectoryExperience categories={categoryPreviews} />
    </>
  );
}
