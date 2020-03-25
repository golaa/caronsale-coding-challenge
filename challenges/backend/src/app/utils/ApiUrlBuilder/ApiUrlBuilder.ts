import {API_URL} from "./API_URL";

export class ApiUrlBuilder {
    public constructor(private apiBaseUrl: string = process.env.API_BASE_URL) {
    }

    private static isConstructableEndpoint(endpoint: API_URL): boolean {
        return !!(endpoint.match(/{.+}/g));

    }

    private static replaceParameters(endpoint: API_URL, ...urlParams: string[]): string {
        if (endpoint.match(/{.+}/g).length > urlParams.length) {
            throw new Error('[ApiUrlBuilder]: Number of provided urlParams did not match number of parameters in URL');
        }
        let placementIndex = 0;
        return endpoint.replace(/({.+})/g, () => {
            return urlParams[placementIndex++];
        });
    }

    public buildUrl(endpoint: API_URL, ...urlParams: string[]): string {
        if (ApiUrlBuilder.isConstructableEndpoint(endpoint)) {
            return `${this.apiBaseUrl}/${ApiUrlBuilder.replaceParameters(endpoint, ...urlParams)}`;
        }
        return `${this.apiBaseUrl}/${endpoint}`;
    }
}
