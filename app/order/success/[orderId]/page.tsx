import { PaymentSuccessExperience } from "@/components/PaymentSuccessExperience";

type PaymentSuccessPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function PaymentSuccessPage({
  params,
}: PaymentSuccessPageProps) {
  const { orderId } = await params;

  return <PaymentSuccessExperience orderId={orderId} />;
}
