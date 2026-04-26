import { NextResponse } from "next/server";
import { getRaffleProgress } from "@/lib/raffleStore";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const progress = await getRaffleProgress(orderId);

  if (!progress) {
    return NextResponse.json({
      ok: true,
      orderId,
      currentParticipants: 0,
      targetParticipants: 0,
      progress: 0,
    });
  }

  return NextResponse.json({
    ok: true,
    ...progress,
  });
}
