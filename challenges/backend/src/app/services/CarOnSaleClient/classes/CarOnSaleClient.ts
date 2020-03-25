import "reflect-metadata";
import {ICarOnSaleClient} from "../interface/ICarOnSaleClient";
import {ApiUrlBuilder} from "../../../utils/ApiUrlBuilder/ApiUrlBuilder";
import {API_URL} from "../../../utils/ApiUrlBuilder/API_URL";
import axios from 'axios';
import {hashPasswordWithCycles} from "../../../utils/hashPassword";
import {IAuthenticationResult} from "../interface/IAuthenticationResult";
import {IAuctionResult} from "../interface/IAuctionResult";
import {injectable} from "inversify";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    private authData: IAuthenticationResult;

    public constructor(private apiUrlBuilder: ApiUrlBuilder = new ApiUrlBuilder()) {
    }

    /**
     * Retrieve a new authentication token
     */
    public async getAuthenticationToken(): Promise<IAuthenticationResult> {
        const url = this.apiUrlBuilder.buildUrl(API_URL.CREATE_AUTHENTICATION_TOKEN, process.env.SALESMAN_API_EMAIL);
        try {
            const {data} = await axios.put<IAuthenticationResult>(url, {
                password: hashPasswordWithCycles(process.env.SALESMAN_API_PASSWORD)
            });

            return data;
        } catch (e) {
            // Check for error response status,
            // Anything that does not result in an authentication response
            // automatically results in a failed authentication, so throw the error so the application can exit
            switch (e.response.status) {
                case 401:
                default:
                    throw new Error('Authentication failed');
            }
        }
    }

    /**
     * Try and refresh an existing authentication token
     */
    public async refreshAuthenticationToken(): Promise<IAuthenticationResult> {
        const url = this.apiUrlBuilder.buildUrl(API_URL.REFRESH_AUTHENTICATION_TOKEN, process.env.SALESMAN_API_EMAIL);
        try {
            const {data} = await axios.post<IAuthenticationResult>(url, this.authData);

            return data;
        } catch (e) {
            // Token could not be refreshed, mute the error and try and acquire a new token instead
            return this.getAuthenticationToken();
        }
    }

    /**
     * Authenticate with the API, either retrieve a new auth token
     * or try to refresh if one exists already
     */
    public async authenticate(): Promise<void> {
        if (!this.authData) {
            this.authData = await this.getAuthenticationToken();
        }
        this.authData = await this.refreshAuthenticationToken();
    }

    /**
     * Retrieve a list of currently running auctions
     */
    public async getRunningAuctions(): Promise<IAuctionResult> {
        await this.authenticate();
        const url = this.apiUrlBuilder.buildUrl(API_URL.GET_RUNNING_AUCTIONS);
        const {data} = await axios.get<IAuctionResult>(url, {headers: {"userid": this.authData.userId, "authtoken": this.authData.token}});
        return data;
    }

}