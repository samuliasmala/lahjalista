import { NextApiRequest, NextApiResponse } from "next";
import pg from 'pg';
import { Gift } from "..";

const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env["POSTGRESQL_PWD"],
    database: "giftsDB",
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 10000,
    max: 10,
    allowExitOnIdle: false

})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const client = await pool.connect()
            await client.query('SET search_path TO "gifts"') // set Schema to gifts
            const result = await client.query(`SELECT * FROM "gifts"`) // select all the columns inside table: gifts

            return res.status(200).json(result.rows as Gift[])
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error)
                return res.status(404).send("Virhe tapahtui!")
            }
            return res.status(404).send("Odottamaton virhe tapahtui!")
        }
    }
    return res.status(404).send("Vain GET-request!")
}