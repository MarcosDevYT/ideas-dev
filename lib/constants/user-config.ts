/**
 * Diccionario completo de roles de usuario
 * Mapea etiquetas en español a valores de string
 */
export const USER_ROLES: {
  label: string;
  value: string;
  description?: string;
}[] = [
  {
    label: "Desarrollador Frontend",
    value: "FRONTEND_DEV",
    description:
      "Especialista en interfaces de usuario y experiencia del usuario",
  },
  {
    label: "Desarrollador Backend",
    value: "BACKEND_DEV",
    description: "Especialista en lógica del servidor, APIs y bases de datos",
  },
  {
    label: "Desarrollador Full Stack",
    value: "FULL_STACK_DEV",
    description: "Desarrollador con experiencia en frontend y backend",
  },
  {
    label: "Desarrollador Móvil",
    value: "MOBILE_DEV",
    description: "Especialista en aplicaciones iOS, Android o multiplataforma",
  },
  {
    label: "Ingeniero DevOps",
    value: "DEVOPS_ENGINEER",
    description: "Especialista en infraestructura, CI/CD y automatización",
  },
  {
    label: "Científico de Datos",
    value: "DATA_SCIENTIST",
    description: "Especialista en análisis de datos, ML y estadística",
  },
  {
    label: "Product Manager",
    value: "PRODUCT_MANAGER",
    description: "Gestión de productos y estrategia",
  },
  {
    label: "Diseñador UI/UX",
    value: "DESIGNER",
    description:
      "Especialista en diseño de interfaces y experiencia de usuario",
  },
  {
    label: "Estudiante",
    value: "STUDENT",
    description: "Aprendiendo desarrollo de software",
  },
  {
    label: "Otro",
    value: "OTHER",
    description: "Otro rol no listado",
  },
];

/**
 * Diccionario extenso de tecnologías y stacks
 * Mapea etiquetas en español a valores de string
 */
/**
 * Diccionario EXTENSO de tecnologías, herramientas y stacks
 * Pensado para todos los roles: Frontend, Backend, Full Stack,
 * Mobile, DevOps, Data, Product, Design y Students.
 */
export const TECH_STACKS: {
  label: string;
  value: string;
  category?: string;
}[] = [
  /* =========================
     LENGUAJES DE PROGRAMACIÓN
     ========================= */
  { label: "JavaScript", value: "javascript", category: "Lenguaje" },
  { label: "TypeScript", value: "typescript", category: "Lenguaje" },
  { label: "Python", value: "python", category: "Lenguaje" },
  { label: "Java", value: "java", category: "Lenguaje" },
  { label: "Go", value: "go", category: "Lenguaje" },
  { label: "Rust", value: "rust", category: "Lenguaje" },
  { label: "C", value: "c", category: "Lenguaje" },
  { label: "C++", value: "cpp", category: "Lenguaje" },
  { label: "C#", value: "csharp", category: "Lenguaje" },
  { label: "Ruby", value: "ruby", category: "Lenguaje" },
  { label: "PHP", value: "php", category: "Lenguaje" },
  { label: "Kotlin", value: "kotlin", category: "Lenguaje" },
  { label: "Swift", value: "swift", category: "Lenguaje" },
  { label: "Dart", value: "dart", category: "Lenguaje" },
  { label: "Scala", value: "scala", category: "Lenguaje" },
  { label: "R", value: "r", category: "Lenguaje" },
  { label: "Shell / Bash", value: "bash", category: "Lenguaje" },

  /* =========================
     FRONTEND
     ========================= */
  { label: "React", value: "react", category: "Frontend Framework" },
  { label: "Next.js", value: "nextjs", category: "Frontend Framework" },
  { label: "Vue.js", value: "vue", category: "Frontend Framework" },
  { label: "Nuxt", value: "nuxt", category: "Frontend Framework" },
  { label: "Angular", value: "angular", category: "Frontend Framework" },
  { label: "Svelte", value: "svelte", category: "Frontend Framework" },
  { label: "SvelteKit", value: "sveltekit", category: "Frontend Framework" },
  { label: "Astro", value: "astro", category: "Frontend Framework" },
  { label: "SolidJS", value: "solidjs", category: "Frontend Framework" },

  /* =========================
     UI / CSS
     ========================= */
  { label: "HTML5", value: "html", category: "Frontend Base" },
  { label: "CSS3", value: "css", category: "Frontend Base" },
  { label: "Tailwind CSS", value: "tailwind", category: "CSS Framework" },
  { label: "Bootstrap", value: "bootstrap", category: "CSS Framework" },
  { label: "Sass / SCSS", value: "sass", category: "CSS Preprocessor" },
  {
    label: "Styled Components",
    value: "styled-components",
    category: "CSS-in-JS",
  },
  { label: "Shadcn UI", value: "shadcn", category: "UI Library" },
  { label: "Material UI", value: "mui", category: "UI Library" },
  { label: "Chakra UI", value: "chakra", category: "UI Library" },
  { label: "Radix UI", value: "radix", category: "UI Primitives" },

  /* =========================
     BACKEND / RUNTIME
     ========================= */
  { label: "Node.js", value: "nodejs", category: "Backend Runtime" },
  { label: "Bun", value: "bun", category: "Backend Runtime" },
  { label: "Deno", value: "deno", category: "Backend Runtime" },
  { label: "Express", value: "express", category: "Backend Framework" },
  { label: "Fastify", value: "fastify", category: "Backend Framework" },
  { label: "NestJS", value: "nestjs", category: "Backend Framework" },
  { label: "Hono", value: "hono", category: "Backend Framework" },
  { label: "Django", value: "django", category: "Backend Framework" },
  { label: "Flask", value: "flask", category: "Backend Framework" },
  { label: "Spring Boot", value: "springboot", category: "Backend Framework" },
  { label: ".NET", value: "dotnet", category: "Backend Framework" },
  { label: "Laravel", value: "laravel", category: "Backend Framework" },
  { label: "Ruby on Rails", value: "rails", category: "Backend Framework" },

  /* =========================
     APIs & COMUNICACIÓN
     ========================= */
  { label: "REST API", value: "rest", category: "API" },
  { label: "GraphQL", value: "graphql", category: "API" },
  { label: "tRPC", value: "trpc", category: "API" },
  { label: "WebSockets", value: "websockets", category: "Comunicación" },
  { label: "gRPC", value: "grpc", category: "Comunicación" },

  /* =========================
     BASES DE DATOS
     ========================= */
  { label: "PostgreSQL", value: "postgresql", category: "Base de Datos SQL" },
  { label: "MySQL", value: "mysql", category: "Base de Datos SQL" },
  { label: "SQLite", value: "sqlite", category: "Base de Datos SQL" },
  { label: "MongoDB", value: "mongodb", category: "Base de Datos NoSQL" },
  { label: "Redis", value: "redis", category: "Cache / KV" },
  {
    label: "Firebase Firestore",
    value: "firestore",
    category: "Base de Datos NoSQL",
  },
  { label: "Supabase", value: "supabase", category: "Backend as a Service" },
  { label: "Neon", value: "neon", category: "Base de Datos Serverless" },

  /* =========================
     ORM / DATA
     ========================= */
  { label: "Prisma", value: "prisma", category: "ORM" },
  { label: "Drizzle", value: "drizzle", category: "ORM" },
  { label: "TypeORM", value: "typeorm", category: "ORM" },
  { label: "Sequelize", value: "sequelize", category: "ORM" },
  { label: "Mongoose", value: "mongoose", category: "ODM" },

  /* =========================
     AUTH & SEGURIDAD
     ========================= */
  { label: "Better Auth", value: "better-auth", category: "Auth" },
  { label: "NextAuth", value: "nextauth", category: "Auth" },
  { label: "Clerk", value: "clerk", category: "Auth" },
  { label: "Auth0", value: "auth0", category: "Auth" },
  { label: "JWT", value: "jwt", category: "Seguridad" },
  { label: "OAuth", value: "oauth", category: "Seguridad" },

  /* =========================
     PAGOS & SAAS
     ========================= */
  { label: "Stripe", value: "stripe", category: "Pagos" },
  { label: "MercadoPago", value: "mercadopago", category: "Pagos" },
  { label: "PayPal", value: "paypal", category: "Pagos" },

  /* =========================
     DEVOPS & CLOUD
     ========================= */
  { label: "Docker", value: "docker", category: "DevOps" },
  { label: "Docker Compose", value: "docker-compose", category: "DevOps" },
  { label: "Kubernetes", value: "kubernetes", category: "DevOps" },
  { label: "GitHub Actions", value: "github-actions", category: "CI/CD" },
  { label: "AWS", value: "aws", category: "Cloud" },
  { label: "GCP", value: "gcp", category: "Cloud" },
  { label: "Azure", value: "azure", category: "Cloud" },
  { label: "Vercel", value: "vercel", category: "Hosting" },
  { label: "Netlify", value: "netlify", category: "Hosting" },

  /* =========================
     DATA / AI
     ========================= */
  { label: "Machine Learning", value: "machine-learning", category: "AI" },
  { label: "Deep Learning", value: "deep-learning", category: "AI" },
  { label: "TensorFlow", value: "tensorflow", category: "AI Framework" },
  { label: "PyTorch", value: "pytorch", category: "AI Framework" },
  { label: "OpenAI API", value: "openai", category: "AI API" },
  { label: "LangChain", value: "langchain", category: "AI Tooling" },
  { label: "Pandas", value: "pandas", category: "Data Analysis" },
  { label: "NumPy", value: "numpy", category: "Data Analysis" },

  /* =========================
     PRODUCT & DESIGN
     ========================= */
  { label: "Figma", value: "figma", category: "Diseño" },
  { label: "Adobe XD", value: "adobe-xd", category: "Diseño" },
  { label: "Sketch", value: "sketch", category: "Diseño" },
  { label: "UX Research", value: "ux-research", category: "UX" },
  {
    label: "Product Discovery",
    value: "product-discovery",
    category: "Product",
  },
  { label: "Roadmapping", value: "roadmapping", category: "Product" },

  /* =========================
     OTROS
     ========================= */
  { label: "Testing", value: "testing", category: "Calidad" },
  { label: "Jest", value: "jest", category: "Testing" },
  { label: "Playwright", value: "playwright", category: "Testing" },
  { label: "Cypress", value: "cypress", category: "Testing" },
  { label: "Git", value: "git", category: "Control de Versiones" },
  { label: "GitHub", value: "github", category: "Control de Versiones" },
  { label: "Monorepos", value: "monorepo", category: "Arquitectura" },

  { label: "Otro", value: "other", category: "Otro" },
];

/**
 * Obtiene la etiqueta en español para un rol dado
 */
export function getRoleLabel(role: string): string {
  return USER_ROLES.find((r) => r.value === role)?.label || role;
}

/**
 * Obtiene la etiqueta en español para un stack tecnológico dado
 */
export function getStackLabel(stack: string): string {
  return TECH_STACKS.find((s) => s.value === stack)?.label || stack;
}

/**
 * Obtiene el valor para una etiqueta de rol
 */
export function getRoleValue(label: string): string | undefined {
  return USER_ROLES.find((r) => r.label === label)?.value;
}

/**
 * Obtiene el valor para una etiqueta de stack
 */
export function getStackValue(label: string): string | undefined {
  return TECH_STACKS.find((s) => s.label === label)?.value;
}
