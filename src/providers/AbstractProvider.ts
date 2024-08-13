import AirportFinder from '../airports/AirportFinder';
import { IFare } from '../fares/FaresFinder';

abstract class AbstractProvider {
  private airportFinder = new AirportFinder();

  abstract getFaresFrom(cityOrCode: string): Promise<IFare[]>;
  abstract getFaresTo(cityOrCode: string): Promise<IFare[]>;

  private isAirportCode(cityOrCode: string) {
    return /[A-Z]{3}/.test(cityOrCode);
  }

  protected async getAirport(cityOrCode: string) {
    if (this.isAirportCode(cityOrCode)) {
      return this.airportFinder.getByCode(cityOrCode);
    } else {
      return this.airportFinder.getByCityName(cityOrCode);
    }
  }
}

export default AbstractProvider;
