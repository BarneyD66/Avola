import { CheckoutPageExperience } from "@/components/CheckoutPageExperience";

type CheckoutPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = await params;

  return <CheckoutPageExperience orderId={orderId} />;
}
