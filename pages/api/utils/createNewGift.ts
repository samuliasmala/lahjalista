import { GIFTS_LIST }  from "./giftDB";



export function createNewGift(receiver: string, gift: string){
    if(typeof receiver !== "string" || receiver.length === 0 ) throw new Error("Invalid receiver name")

    if(typeof gift !== "string" || gift.length === 0) throw new Error("Invalid gift name")

}