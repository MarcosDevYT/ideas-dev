import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addCredits } from "@/actions/credits/service";
import { CREDIT_PACKAGES, type PackageId } from "@/actions/credits/constants";

/**
 * POST /api/credits/purchase
 * Procesa la compra de un paquete de créditos (simulada)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { packageId } = body as { packageId: PackageId };

    // Validar que el paquete existe
    const packageInfo = CREDIT_PACKAGES[packageId];
    if (!packageInfo) {
      return NextResponse.json({ error: "Paquete inválido" }, { status: 400 });
    }

    // Simular compra exitosa y agregar créditos
    await addCredits(
      session.user.id,
      packageInfo.credits,
      "purchase",
      `Compra de paquete ${packageInfo.name}`,
    );

    return NextResponse.json({
      success: true,
      credits: packageInfo.credits,
      package: packageInfo.name,
    });
  } catch (error) {
    console.error("Error al procesar compra:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra" },
      { status: 500 },
    );
  }
}
