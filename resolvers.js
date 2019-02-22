import '@babel/polyfill';
import axios from 'axios';
import params from './params';

const { baseURL, format, indicatorCodes } = params.api;

const sortByYear = (a, b) => {
  if (a.date > b.date) {
    return 1;
  }
  if (a.date < b.date) {
    return -1;
  }
  return 0;
}

const resolvers = {
  Query: {
    allCountries: () => {
      const url = `${baseURL}/?format=${format}&per_page=500`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return [];
          }
          return response.data[1].filter(country => country.capitalCity !== '')
            .sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }
              if (a.name < b.name) {
                return -1;
              }
              return 0;
            });
        })
        .catch((error) => console.log(error))
    },
    country: (root, {iso2Code}) => {
      const url = `${baseURL}/${iso2Code}/?format=${format}`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return {};
          }
          if (response.data[1].length === 0) {
            return {};
          }
          return response.data[1][0];
        })
        .catch((error) => console.log(error))
    },
    countries: (root, { iso2Codes }) => {
      const countries = iso2Codes.join(';');
      const url = `${baseURL}/${countries}/?format=${format}`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return [];
          }
          if (response.data[1].length === 0) {
            return [];
          }
          return response.data[1];
        })
        .catch((error) => { console.log(error); return []; })
    }
  },
  Country: {
    populations: (country) => {
      const url = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.population}?format=${format}&per_page=100`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return [];
          }
          return response.data[1].sort(sortByYear);
        })
        .catch((error) => console.log(error))
    },
    emissions: (country) => {
      const url = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.emission}?format=${format}&per_page=100`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return [];
          }
          return response.data[1].sort(sortByYear);
        })
        .catch((error) => console.log(error))
    },
    gdps: (country) => {
      const url = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.gdp}?format=${format}&per_page=100`;
      return axios.get(url)
        .then((response) => {
          if (response.data.length <= 1) {
            return [];
          }
          return response.data[1].sort(sortByYear);
        })
        .catch((error) => console.log(error))
    },
    years: async (country) => {
      const populationUrl = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.population}?format=${format}&per_page=100`;
      const emissionUrl = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.emission}?format=${format}&per_page=100`;
      const gdpUrl = `${baseURL}/${country.iso2Code}/indicators/${indicatorCodes.gdp}?format=${format}&per_page=100`;
      const populations = await axios.get(populationUrl);
      const emissions = await axios.get(emissionUrl);
      const gdps = await axios.get(gdpUrl);

      // Combine years into single array of objects
      const data = populations.data[1].reduce((results, { date, value }) => {
        const emissionObject = emissions.data[1].find((emission) => emission.date === date);
        const gdpObject = gdps.data[1].find((gdp) => gdp.date === date);
        let year = {
          date,
          emission: ('value' in emissionObject && emissionObject.value !== null ? emissionObject.value.toFixed(2) : 0),
          population: (value === null ? 0 : value),
          gdp: ('value' in gdpObject && gdpObject.value !== null ? gdpObject.value.toFixed(2) : 0),
        };
        results.push(year);
        return results;
      }, []);

      return data.sort(sortByYear);
    }
  }
};

export default resolvers;
