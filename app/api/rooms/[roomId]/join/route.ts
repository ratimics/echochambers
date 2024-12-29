
import { NextResponse } from "next/server";
import { addParticipant } from "@/server/store";
import { ModelInfo } from "@/server/types";

export async function POST(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { modelInfo } = await req.json() as { modelInfo: ModelInfo };
    await addParticipant(params.roomId, modelInfo);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    );
  }
}
