
let fetchedData: any;

export async function getGifts(){
    fetchedData = await fetch("/api/utils/giftDB",{
        method: "GET",
    }
    )
    return fetchedData;

}