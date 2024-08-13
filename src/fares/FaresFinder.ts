import AbstractProvider from '../providers/AbstractProvider';
import WizzAirProvider from '../providers/WizzAirProvider';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface IFare {
  fromCity: string;
  fromAirportCode: string;
  toCity: string;
  toAirport: string;
  departureDate: string;
  usdPrice: number;
  localPrice?: string;
}

// TODO: This level of abstraction will implement routes find logic that depends on provider
class FareFinder<P extends AbstractProvider> {
  private provider: P;

  constructor(Provider: new () => P) {
    this.provider = new Provider();
  }

  async getFaresFrom(origin: string) {
    const fares = await this.provider.getFaresFrom(origin);
    console.log(fares);
  }

  async getFaresTo(destination: string) {
    const fares = await this.provider.getFaresTo(destination);
    console.log(fares);
  }
}

const finder = new FareFinder(WizzAirProvider);
finder.getFaresFrom('Belgrade');

export default FareFinder;
