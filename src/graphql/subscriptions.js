/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStorehouse = /* GraphQL */ `
  subscription OnCreateStorehouse($owner: String!) {
    onCreateStorehouse(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      owner
      createdAt
    }
  }
`;
export const onUpdateStorehouse = /* GraphQL */ `
  subscription OnUpdateStorehouse($owner: String!) {
    onUpdateStorehouse(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      owner
      createdAt
    }
  }
`;
export const onDeleteStorehouse = /* GraphQL */ `
  subscription OnDeleteStorehouse($owner: String!) {
    onDeleteStorehouse(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      owner
      createdAt
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($owner: String!) {
    onCreateProduct(owner: $owner) {
      id
      description
      storehouse {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($owner: String!) {
    onUpdateProduct(owner: $owner) {
      id
      description
      storehouse {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($owner: String!) {
    onDeleteProduct(owner: $owner) {
      id
      description
      storehouse {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
