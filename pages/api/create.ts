// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import { DATA } from './utils/giftDB';

/* NOT NEEDED RIGHT NOW
type Data = {
    receiver: string;
    giftName: string;
};
*/


//const DATA: any[] = []




function generateID(){
    return(Object.keys(DATA).length + 1)
}


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    let receiver = req.query["receiver"] as string;
    let giftName = req.query["giftName"] as string;

    if(typeof receiver !== "string" || receiver.length === 0 ) throw new Error("Invalid receiver name")

    if(typeof giftName !== "string" || giftName.length === 0) throw new Error("Invalid gift name")

    let generatedID: number;

    generatedID = generateID()

    const objectToAppend: Record<string, any> = {}
    objectToAppend[generatedID] = {}
    objectToAppend[generatedID]["Receiver"] = receiver
    objectToAppend[generatedID]["Gift"] = giftName
    DATA.push(objectToAppend)

    console.log(DATA)


    /*
    if(DATA.hasOwnProperty(receiver) === true){
        //DATA[receiver][]
    }

    if(DATA.hasOwnProperty(receiver) === false){
        DATA[receiver] = {}
        DATA[receiver]["gifts"] = []
        DATA[receiver]["gifts"].push(giftName)
        console.log(DATA)
        console.log(DATA[receiver])
        console.log(DATA[receiver]["gifts"])
    }
    //res.status(200).json({"name": "hey"});
    */
   res.status(200).json(DATA)
    
}
