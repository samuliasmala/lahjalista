import { NextApiRequest, NextApiResponse } from 'next';
import pg, { DatabaseError } from 'pg';
import { Gift } from '..';
import * as pgErrorHandlers from '~/utils/psqlFunctions';

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: process.env['POSTGRESQL_PWD'],
  database: 'giftDB',
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 10000,
  max: 10,
  allowExitOnIdle: false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      await client.query('SET search_path TO "public"'); // set Schema to gifts
      const result = await client.query(`SELECT * FROM "gifts"`); // select all the columns inside table: gifts

      return res.status(200).json(result.rows as Gift[]);
    } catch (e) {
      handleError(e);
      /*
      if (e instanceof Error) {
        handleError(e);
        return res.status(404).send('Virhe tapahtui!');
      }
      */
      //console.log(e);
      return res.status(404).send('Odottamaton virhe tapahtui!');
    }
  }
  return res.status(404).send('Vain GET-request!');
}

const HANDLER: Record<string, (e: DatabaseError) => void> = {
  '3D000': pgErrorHandlers.handle3D000,
  '42P01': pgErrorHandlers.handle42P01,
} as const;

function handleError(e: unknown) {
  if (e instanceof DatabaseError) {
    const codeHandler = e.code !== undefined && HANDLER[e.code];
    if (codeHandler) {
      codeHandler(e);
    }
  }
}
