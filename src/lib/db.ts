// src/lib/db.ts
import { sql } from '@vercel/postgres';

const users = await sql`SELECT * FROM users`;


export { sql };
