/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCustomerRequest = /* GraphQL */ `
  mutation CreateCustomerRequest($input: CreateCustomerRequestInput!, $condition: ModelCustomerRequestConditionInput) {
    createCustomerRequest(input: $input, condition: $condition) {
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
export const updateCustomerRequest = /* GraphQL */ `
  mutation UpdateCustomerRequest($input: UpdateCustomerRequestInput!, $condition: ModelCustomerRequestConditionInput) {
    updateCustomerRequest(input: $input, condition: $condition) {
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
export const deleteCustomerRequest = /* GraphQL */ `
  mutation DeleteCustomerRequest($input: DeleteCustomerRequestInput!, $condition: ModelCustomerRequestConditionInput) {
    deleteCustomerRequest(input: $input, condition: $condition) {
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
