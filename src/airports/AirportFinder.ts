import { IAPI, IRequestParams, createApi } from '../requests';

export interface IAirport {
  code: string;
  name: string;
  city: string;
  country: string;
  geoId: string;
}

interface IAirportResponse {
  column_1: string;
  airport_name: string;
  city_name: string;
  country_name: string;
  city_name_geo_name_id: string;
}

interface IResponse {
  total_count: number;
  results: IAirportResponse[];
}

class AirportFinder {
  private baseUrl = 'https://public.opendatasoft.com/api/explore/v2.1';
  private api: IAPI = createApi(this.baseUrl);

  constructor() {}

  private airportRequest(params: Partial<IRequestParams>) {
    return this.api.request<IResponse>({
      endpoint: '/catalog/datasets/airports-code/records',
      method: 'GET',
      ...params,
    });
  }

  private responseToDTO(res: IResponse): IAirport {
    if (res.total_count === 0) throw new Error('Airport not found');

    // TODO: Somehow indicate that there is possibly multiple airports found on searching by city name
    const firstAirport = res.results[0];

    return {
      code: firstAirport.column_1,
      name: firstAirport.airport_name,
      city: firstAirport.city_name,
      country: firstAirport.country_name,
      geoId: firstAirport.city_name_geo_name_id,
    };
  }

  async getByCityName(cityName: string) {
    const query = { where: `city_name like "${cityName}"` };
    const response = await this.airportRequest({ query });
    return this.responseToDTO(response);
  }

  async getByCode(airportCode: string) {
    const query = { where: `column_1 like "${airportCode}"` };
    const response = await this.airportRequest({ query });
    return this.responseToDTO(response);
  }
}

export default AirportFinder;
