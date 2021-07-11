/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCustomerRequest = /* GraphQL */ `
  query GetCustomerRequest($id: ID!) {
    getCustomerRequest(id: $id) {
      id
      name
      email
      message
      weddingTime
      weddingDate
      createdAt
      updatedAt
    }
  }
`;
export const listCustomerRequests = /* GraphQL */ `
  query ListCustomerRequests($filter: ModelCustomerRequestFilterInput, $limit: Int, $nextToken: String) {
    listCustomerRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        message
        weddingTime
        weddingDate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
