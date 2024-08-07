import * as fs from 'fs';
import { IAPI, createApi } from '../requests';

class FaresFinder {
  private baseUrl = 'https://vg-api.airtrfx.com';
  private api: IAPI = createApi(this.baseUrl);

  constructor() {}

  async getFaresFromCity() {
    const query = fs.readFileSync('src/fares/query.graphql', 'utf-8');
    const requestId = '64ee04d89ceb00b06307adef';

    const res: any = await this.api.request({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      endpoint: '/graphql',
      method: 'POST',
      body: {
        query,
        variables: {
          id: requestId,
          page: {
            tenant: 'w6',
            slug: 'cheap-flights-from-belgrade',
            siteEdition: 'en-gb',
          },
          flatContext: {
            templateId: '60ad2c4c46f6ab1000000716',
            templateName: 'from-city',
            originLocationLevel: 'City',
            originGeoId: '792680',
          },
        },
      },
    });
    res.data.standardFareModule.fares.forEach((fare) => {
      console.log(fare);
    });
  }

  async getFaresToCity() {
    const query = fs.readFileSync('src/fares/query.graphql', 'utf-8');
    const requestId = '666c0974dab20537060fd7f5';

    const res: any = await this.api.request({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      endpoint: '/graphql',
      method: 'POST',
      body: {
        query,
        variables: {
          id: requestId,
          page: {
            tenant: 'w6',
            slug: 'cheap-flights-to-belgrade',
            siteEdition: 'en-gb',
          },
          flatContext: {
            templateId: '60ad2c4c46f6ab1000000716',
            templateName: 'to-city',
            destinationLocationLevel: 'City',
            destinationGeoId: '792680',
          },
        },
      },
    });
    res.data.standardFareModule.fares.forEach((fare) => {
      console.log(fare);
    });
  }
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const f = new FaresFinder();
// f.getFaresFromCity();
f.getFaresToCity();

export default FaresFinder;
