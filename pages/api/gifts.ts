import { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            handleGET(req.query)
            break
        case "POST":
            console.log(req.method, "POST2")
            break
        case "DELETE":
            console.log("DELETE")
            break
        case "PUT":
            console.log("PUT")
            break
        default:
            console.log(req.method, "default")
            break
    }
    res.status(200).json({ message: "Hello from Next.js!" })
}

function handleGET(queries: NextApiRequest["query"]) {
    console.log(queries)
}