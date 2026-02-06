export const verifyEmailTemplate = (verifyLink: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eaeaea; }
    .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .header h1 { margin: 0; color: #111; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; text-align: center; }
    .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
    .button { display: inline-block; background-color: #101828; color: #ffffff !important; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background 0.3s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .footer { padding: 20px; text-align: center; background-color: #f8f9fa; font-size: 12px; color: #9ca3af; }
    .brand-accent { color: #84cc16; } /* Lime green approximation */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ideas<span class="brand-accent">Dev</span></h1>
    </div>
    <div class="content">
      <h2 style="margin-top: 0; font-size: 20px; color: #1f2937;">Verifica tu correo electrónico</h2>
      <p class="message">
        Gracias por registrarte en <strong>IdeasDev</strong>. Para comenzar a construir tus ideas, necesitamos confirmar que este correo es tuyo.
      </p>
      <a href="${verifyLink}" class="button" target="_blank">Verificar mi cuenta</a>
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <span style="color: #3b82f6; word-break: break-all;">${verifyLink}</span>
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} IdeasDev. Todos los derechos reservados.</p>
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;
