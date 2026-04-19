import { notFound } from "next/navigation";
import { InternalOrderOpsPanel } from "@/components/InternalOrderOpsPanel";

type DashboardInternalOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DashboardInternalOrderPage({
  params,
}: DashboardInternalOrderPageProps) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { id } = await params;

  return <InternalOrderOpsPanel orderId={id} />;
}
