import { PrismaClient } from '@/src/generated/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is not defined.");
    return null as any;
  }
  const pool = new pg.Pool({ 
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000, // Close idle connections before Supavisor drops them
    connectionTimeoutMillis: 10000,
  });

  // Prevent idle connection errors from crashing the application or leaving the pool in a bad state
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
