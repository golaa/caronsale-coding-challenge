import {IAuction} from "./IAuction";

export type IAuctionResult = {
    items: IAuction[],
    page: number;
    total: number;
};