/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
import {IAuthenticationResult} from "./IAuthenticationResult";
import {IAuctionResult} from "./IAuctionResult";

export interface ICarOnSaleClient {

    getRunningAuctions(): Promise<IAuctionResult>

    getAuthenticationToken(): Promise<IAuthenticationResult>

    refreshAuthenticationToken(): Promise<IAuthenticationResult>

    authenticate(): Promise<void>
}