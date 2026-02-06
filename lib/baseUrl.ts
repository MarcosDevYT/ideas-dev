export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `${process.env.NEXT_PUBLIC_URL}`;

export const appName = process.env.NEXT_PUBLIC_APP_NAME;
