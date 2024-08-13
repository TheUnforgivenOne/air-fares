import * as fs from 'fs';
import path from 'path';
import { IAPI, IRequestParams, createApi } from '../requests';
import AbstractProvider from './AbstractProvider';
import { IFare } from '../fares/FaresFinder';

interface IFareResponse {
  originCity: string;
  originAirportCode: string;
  destinationCity: string;
  destinationAirportCode: string;
  formattedTotalPrice: string;
  usdTotalPrice: number;
  departureDate: string;
}

interface IStandardFareModuleResponse {
  data?: {
    standardFareModule: {
      fares: IFareResponse[];
    };
  };
  errors?: Error[];
}

class WizzAirProvider extends AbstractProvider {
  private baseUrl = 'https://vg-api.airtrfx.com';
  private api: IAPI = createApi(this.baseUrl);

  constructor() {
    super();
  }

  private wizzairRequest(params: Partial<IRequestParams>) {
    return this.api.request<IStandardFareModuleResponse>({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      endpoint: '/graphql',
      method: 'POST',
      ...params,
    });
  }

  private responseToDTO(res: IStandardFareModuleResponse): IFare[] {
    if (res?.errors) throw new Error(res.errors[0].message);

    const rawFares = res?.data?.standardFareModule?.fares;
    if (!rawFares?.length) throw new Error('No fares found');

    return rawFares.map((rawFare) => ({
      fromCity: rawFare.originCity,
      fromAirportCode: rawFare.originAirportCode,
      toCity: rawFare.destinationCity,
      toAirport: rawFare.destinationAirportCode,
      departureDate: rawFare.departureDate,
      usdPrice: rawFare.usdTotalPrice,
      localPrice: rawFare.formattedTotalPrice,
    }));
  }

  async getFaresFrom(cityOrCode: string) {
    const queryPath = path.join(__dirname, 'query.graphql');
    const query = fs.readFileSync(queryPath, 'utf-8');
    const requestId = '66841887b71ef09da403cf4a';

    const airport = await this.getAirport(cityOrCode);

    const response = await this.wizzairRequest({
      body: {
        query,
        variables: {
          id: requestId,
          page: {
            tenant: 'w6',
            // slug: 'cheap-flights-from-belgrade',
            siteEdition: 'en-gb',
          },
          flatContext: {
            templateId: '60ad2c4c46f6ab1000000716',
            templateName: 'from-city',
            originLocationLevel: 'City',
            originGeoId: airport.geoId,
          },
        },
      },
    });

    return this.responseToDTO(response);
  }

  async getFaresTo(cityOrCode: string) {
    const queryPath = path.join(__dirname, 'query.graphql');
    const query = fs.readFileSync(queryPath, 'utf-8');
    const requestId = '666c0974dab20537060fd7f5';

    const airport = await this.getAirport(cityOrCode);

    const response = await this.wizzairRequest({
      body: {
        query,
        variables: {
          id: requestId,
          page: {
            tenant: 'w6',
            // slug: 'cheap-flights-to-belgrade',
            siteEdition: 'en-gb',
          },
          flatContext: {
            templateId: '60ad2c4c46f6ab1000000713',
            templateName: 'to-city',
            destinationLocationLevel: 'City',
            destinationGeoId: airport.geoId,
          },
        },
      },
    });

    return this.responseToDTO(response);
  }
}

export default WizzAirProvider;
