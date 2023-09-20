//import type { NextApiRequest, NextApiResponse } from 'next';
import { AnyPtrRecord } from "dns"
import { NextApiRequest, NextApiResponse } from "next"



export const DATA: Record<string, any> = []



export default function handler(
    req: AnyPtrRecord,
    res: NextApiResponse,
) {
    return res.json(DATA)
}