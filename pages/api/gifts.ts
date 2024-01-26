import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Gift } from "..";

const baseURL = "http://localhost:3001/gifts"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            await handleGET(req, res)
            break
        case "POST":
            await handlePOST(req, res)
            break
        case "PUT":
            await handlePUT(req, res)
            break
        case "DELETE":
            await handleDELETE(req, res)
            break
        default:
            console.log(req.method, "default")
            break
    }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const giftRequest = await axios.get(`http://localhost:3001/gifts/${req.query.id}`)
        const giftItem = giftRequest.data as Gift
        return res.status(giftRequest.status).json(giftItem)
    }
    const gifts = await axios.get(baseURL)
    return res.status(gifts.status).json(gifts.data)
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
    const postRequest = await axios.post(baseURL, req.body)
    return res.status(postRequest.status).json(req.body)
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
    const putRequest = await axios.put(`${baseURL}/${req.body.id}`, req.body)
    return res.status(putRequest.status).json(req.body)
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
    const deleteRequest = await axios.delete(`${baseURL}/${req.body.id}`)
    return res.status(deleteRequest.status).json(req.body)
}