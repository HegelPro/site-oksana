import { NextResponse } from "next/server";
import { getDatabase, logDatabaseError } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await getDatabase().query<{ ready: boolean }>(
      `SELECT
        has_column_privilege('public.leads', 'id', 'SELECT')
        AND has_column_privilege('public.leads', 'message', 'INSERT')
        AND has_column_privilege('public.leads', 'consent_version', 'INSERT') AS ready`,
    );
    if (rows[0]?.ready) return NextResponse.json({ status: "ok" });
  } catch (error) {
    logDatabaseError("PostgreSQL readiness check failed", error);
  }

  return NextResponse.json({ status: "unavailable" }, { status: 503 });
}
