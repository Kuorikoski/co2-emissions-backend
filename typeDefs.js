import { gql } from 'apollo-server-express';

const typeDefs = gql`

  type Population {
    date: String
    value: Int
  }

  type Emission {
    date: String
    value: Float
  }

  type GDP {
    date: String
    value: Float
  }

  type Year {
    date: String
    emission: Float
    population: Int
    gdp: Float
  }

  type Country {
    id: String
    iso2Code: String
    name: String
    capitalCity: String
    years: [Year]
    populations: [Population]
    emissions: [Emission]
    gdps: [GDP]
  }

  type Query {
    allCountries: [Country]
    country(iso2Code: String!): Country
    countries(iso2Codes: [String]!): [Country]
  }

`;

export default typeDefs;
