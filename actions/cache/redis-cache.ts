import { Redis } from "@upstash/redis";

// Utilizaremos la instancia de Redis con los datos otorgados
// Se asume el formato de la URL rediss:// parseándola hacia la interfaz REST de Upstash
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Función genérica para obtener datos cacheados o hidratar el caché.
 * Ideal para integrar en server actions y acelerar Data Fetching sin requerir 'use cache' global.
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600, // 1 hora por defecto
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached) {
      return cached;
    }
  } catch (error) {
    console.warn(`Error leyendo desde Redis la db clave ${key}:`, error);
  }

  // Si no hay caché o falló Redis, recuperamos datos frescos
  const data = await fetcher();

  try {
    if (data !== undefined && data !== null) {
      await redis.set(key, data, { ex: ttlSeconds });
    }
  } catch (error) {
    console.warn(
      `Error escribiendo en memoria caché de Redis [${key}]:`,
      error,
    );
  }

  return data;
}

/**
 * Función para invalidades manualmente un tag o key de Redis.
 */
export async function invalidateCacheKey(key: string) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Error invalidando caché [${key}]:`, error);
  }
}
