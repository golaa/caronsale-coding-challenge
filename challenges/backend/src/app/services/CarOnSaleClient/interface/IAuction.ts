// Actual response item contains A LOT more data,
// I just typed here what seems reasonable in the scope of this challenge
export type IAuction = {
    id: number,
    label: string,
    endingTime: string,
    minimumRequiredAsk: number,
    currentHighestBidValue: number,
    numBids: number,
    createdAt: string,
    updatedAt: string,
    startingBidValue: number,
    uuid: string,
};