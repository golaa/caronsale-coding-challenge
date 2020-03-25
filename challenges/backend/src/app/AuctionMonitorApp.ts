import {inject, injectable} from "inversify";
import {ILogger} from "./services/Logger/interface/ILogger";
import {DependencyIdentifier} from "./DependencyIdentifiers";
import "reflect-metadata";
import {ICarOnSaleClient} from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import {IRunningAuctionStatistics} from "./services/CarOnSaleClient/interface/IRunningAuctionStatistics";

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.API_CLIENT) private apiClient: ICarOnSaleClient
    ) {
    }

    public async start(): Promise<void> {

        this.logger.log(`Auction Monitor started.`);

        const auctionStatistics = await this.getRunningAuctionsStatistics();

        this.logger.log(`###################################`);
        this.logger.log(`# Number of Auctions: ${auctionStatistics.numberOfAuctions}`);
        this.logger.log(`# Average Number of Bids: ${auctionStatistics.averageNumberOfBids}`);
        this.logger.log(`# Average Auction Progress: ${auctionStatistics.averageAuctionProgress}`);
        this.logger.log(`###################################\n`);
    }

    /**
     * Retrieve statistics about currently running auctions
     * like number of auctions, average number of bids
     * and percentage of the auction progress
     */
    public async getRunningAuctionsStatistics(): Promise<IRunningAuctionStatistics> {
        this.logger.log(`Calling API`);

        const data = await this.apiClient.getRunningAuctions();

        this.logger.log(`Received Result from API, aggregating...\n`);

        // Sum the number of bids per auction
        const totalNumberOfBids = data.items.reduce((currentCount, item) => currentCount + item.numBids, 0);

        // Map progress of each auction into an array
        const allAuctionProgress = data.items.map((item) => {
            return item.currentHighestBidValue / item.minimumRequiredAsk * 100;
        });

        // Sum progress of all auctions
        const allAuctionProgressSum = allAuctionProgress.reduce((currentCount, itemProgress) => currentCount + itemProgress, 0);

        return {
            // Total number of auctions returned
            numberOfAuctions: data.total,
            // Sum of number of bids (all auctions) divided by total number of auctions
            averageNumberOfBids: totalNumberOfBids / data.items.length,
            // Sum of progress of all auctions divided by total number of auctions (and format it to a readable format)
            averageAuctionProgress: parseFloat((allAuctionProgressSum / data.items.length).toFixed(2))
        };
    }

}