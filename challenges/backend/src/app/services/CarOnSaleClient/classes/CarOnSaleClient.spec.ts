import {ICarOnSaleClient} from "../interface/ICarOnSaleClient";
import {CarOnSaleClient} from "./CarOnSaleClient";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import dotenv from "dotenv";

chai.use(chaiAsPromised);

describe('CarOnSaleClient', () => {

    let client: ICarOnSaleClient;

    beforeEach(() => {
        dotenv.config();
        client = new CarOnSaleClient();
    });

    it('should acquire an authentication token with valid credentials', async () => {
        const token = await client.getAuthenticationToken();
        // tslint:disable-next-line:no-unused-expression
        expect(token).to.not.be.undefined;
        expect(token).to.be.an('object');
        // tslint:disable-next-line:no-unused-expression
        expect(token.authenticated).to.be.true;
    });

    it('should throw an error when trying to authenticate with invalid credentials', async () => {
        const originalPassword = process.env.SALESMAN_API_PASSWORD;
       process.env.SALESMAN_API_PASSWORD = 'invalid';

       // Re-initialize CarOnSaleClient so it loads the invalid password from env
       client = new CarOnSaleClient();

       const callWithInvalidCredentials = async () => {
         return client.getAuthenticationToken();
       };

       await expect(callWithInvalidCredentials()).to.eventually.be.rejectedWith('Authentication failed');

       // Reset password to original value
       process.env.SALESMAN_API_PASSWORD = originalPassword;
    });

    it('should get a list of running auctions', async () => {
        const result = await client.getRunningAuctions();
        // tslint:disable-next-line:no-unused-expression
        expect(result).to.not.be.undefined;
        expect(result).to.be.an('object');
        expect(result.items).to.be.an('array');
        expect(result.items.length).to.be.greaterThan(0);
    }).timeout(15000); // set a high enough timeout so this doesn't fail on a slow staging environment
});