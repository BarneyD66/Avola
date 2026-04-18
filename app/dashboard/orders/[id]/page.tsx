import { DashboardOrderDetailExperience } from "@/components/DashboardOrderDetailExperience";

type DashboardOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DashboardOrderDetailPage({
  params,
}: DashboardOrderDetailPageProps) {
  const { id } = await params;

  return <DashboardOrderDetailExperience orderId={id} />;
}
