import { existEmailAndTokenAction } from "@/actions/auth-actions";
import { VerifyEmailForm } from "@/components/authComponents/VerifyEmailForm";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; email: string }>;
}) {
  const { email, token } = await searchParams;

  // Si no hay email o token, pasamos un error inicial al componente
  if (!email || !token) {
    return (
      <VerifyEmailForm
        email={email || ""}
        token={token || ""}
        initialCheckError="El email o token de verificación es inválido"
      />
    );
  }

  // Verificamos si el token es válido en el servidor (pre-check)
  const verificationResult = await existEmailAndTokenAction(email, token);

  return (
    <VerifyEmailForm
      email={email}
      token={token}
      initialCheckError={verificationResult?.error}
    />
  );
}
