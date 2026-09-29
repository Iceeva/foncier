import { NextResponse } from "next/server";
import { z } from "zod";
import { verifierSignature } from "@/lib/domain/signature";
const corps = z.object({ empreinte: z.string().min(10), signature: z.string().min(10) });
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parse = corps.safeParse(json);
  if (!parse.success) return NextResponse.json({ erreur: "Empreinte ou signature manquante/invalide." }, { status: 400 });
  return NextResponse.json({ valide: verifierSignature(parse.data.empreinte, parse.data.signature) });
}
