import {ApiUrlBuilder} from "./ApiUrlBuilder";
import {expect} from 'chai';
import {API_URL} from "./API_URL";
import dotenv from 'dotenv';

describe('ApiUrlBuilder', () => {

    let apiUrlBuilder: ApiUrlBuilder;

    beforeEach(() => {
        dotenv.config();
        apiUrlBuilder = new ApiUrlBuilder();
    });

    it('should build an API Url by replacing parameters with given values', () => {
        const url = apiUrlBuilder.buildUrl(API_URL.CREATE_AUTHENTICATION_TOKEN, 'email@somewhere.com');
        expect(url).to.equal('https://caronsale-backend-service-dev.herokuapp.com/api/v1/authentication/email@somewhere.com');
    });

    it('should throw an error if the amount of parameters and given values doesn\'t match', () => {
        const callUrlBuilderWithInvalidArgs = () => {
            apiUrlBuilder.buildUrl(API_URL.CREATE_AUTHENTICATION_TOKEN)
        };

        expect(callUrlBuilderWithInvalidArgs).to.throw(Error);
    });

});
