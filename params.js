const params = {
  api: {
    baseURL: 'https://api.worldbank.org/v2/countries',
    format: 'json',
    indicatorCodes: {
      emission: 'EN.ATM.CO2E.PC',
      population: 'SP.POP.TOTL',
      gdp: 'NY.GDP.PCAP.CD'
    },
  }
}

export default params;
