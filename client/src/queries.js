/**
 * Store all GQL queries in central file
 */

import { gql } from 'apollo-boost';

export const GET_POSTS = gql`
    query {
      getPosts {
        _id
        title
        imageUrl
        description
      }
    }
    `;

export const GET_TEMPLATES = gql`
    query {
      getTemplates {
        _id
        title
        imageUrl
        description
      }
    }
    `;

export const GET_SAVED_TEMPLATES = gql`
    query {
      getSavedTemplates {
        _id
        title
        imageUrl
      }
    }
    `;

export const GET_POST = gql`
    query($postId: ID!){
      getPost(postId: $postId)   {
          _id
          title
          imageUrl
          categories
          variables
          description
          likes
          createdDate
          messages {
            _id
            messageBody
            messageDate
            messageUser {
              _id
              username
              avatar
            }
          }
      }
    }
    `;

export const GET_TEMPLATE = gql`
    query($templateId: ID!){
      getTemplate(templateId: $templateId){
          _id
          title
          imageUrl
          content
          description
          likes
          createdDate
          messages {
            _id
            messageBody
            messageDate
            messageUser {
              _id
              username
              avatar
            }
          }
      }
    }
    `;

export const ADD_POST = gql`
    mutation(
      $title: String!,
      $imageUrl:String!,
      $categories: [String]!,
      $variables: [String]!,
      $description: String!,
      $userId:ID!
    ) {
      addPost(
        title:$title
        imageUrl:$imageUrl
        categories:$categories
        variables:$variables
        description:$description
        userId:$userId
      ){
        _id
        title
        imageUrl
        categories
        variables
        description
      }
    }
    `;

  export const ADD_TEMPLATE = gql`
    mutation(
      $title: String!,
      $imageUrl:String!,
      $content: String!,
      $description: String!,
      $userId:ID!
    ) {
      addTemplate(
        title:$title
        imageUrl:$imageUrl
        content:$content
        description:$description
        userId:$userId
      ){
        _id
        title
        imageUrl
        content
        description
      }
    }
    `;

  export const SAVE_TEMPLATES = gql`
    mutation(
      $title: String!,
      $imageUrl:String!,
      $templates: [String]!,
      $node_ids: [String]!,
      $userId:ID!
    ) {
      saveTemplates(
        title:$title
        imageUrl:$imageUrl
        templates:$templates
        node_ids:$node_ids
        userId:$userId
      ){
        _id
        title
        imageUrl
        templates
        node_ids
      }
    }
    `;

export const INFINITE_SCROLL_POSTS = gql`
    query(
      $pageNum: Int!,
      $pageSize: Int!,
    
    ) {
      infiniteScrollPosts(
        pageNum:$pageNum
        pageSize:$pageSize
      ){
        hasMore
        posts {
          _id
          title
          imageUrl
          categories
          variables
          description
          likes
          createdDate
          messages {
            _id
          }
          userId {
            _id
            username
            avatar
          }
        }
      }
    }
    `;

  export const INFINITE_SCROLL_TEMPLATES = gql`
    query(
      $pageNum: Int!,
      $pageSize: Int!,
    
    ) {
      infiniteScrollTemplates(
        pageNum:$pageNum
        pageSize:$pageSize
      ){
        hasMore
        templates {
          _id
          title
          imageUrl
          content
          description
          likes
          createdDate
          messages {
            _id
          }
          userId {
            _id
            username
            avatar
          }
        }
      }
    }
    `;

export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      variables
      createdDate
      likes
    }
  }
`;

export const GET_USER_TEMPLATES = gql`
  query($userId: ID!) {
    getUserTemplates(userId: $userId) {
      _id
      title
      imageUrl
      description
      content
      createdDate
      likes
    }
  }
`;

export const GET_USER_SAVED_TEMPLATES = gql`
  query($userId: ID!) {
    getUserSavedTemplates(userId: $userId) {
      _id
      title
      imageUrl
      node_ids
      templates
      createdDate
    }
  }
`;

export const UPDATE_USER_POST = gql`
  mutation(
    $postId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $variables: [String]!
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      variables: $variables
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      variables
      createdDate
      likes
      userId {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_POST = gql`
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      _id
    }
  }
`;

export const DELETE_USER_TEMPLATE = gql`
  mutation($templateId: ID!) {
    deleteUserTemplate (templateId: $templateId) {
      _id
    }
  }
`;

export const DELETE_USER_SAVED_TEMPLATE = gql`
  mutation($templateId: ID!) {
    deleteUserSavedTemplate(templateId: $templateId) {
      _id
    }
  }
`;


export const LOGIN_USER = gql`
    mutation($email: String!, $password: String!) {
      loginUser(
        email: $email
        password: $password
      ) {
        token
        user {
          _id
          username
          email
          avatar
         favorites {
              _id
              title
              imageUrl
            }
        }
      }
    }
    `;

export const REGISTER_USER = gql`
    mutation($username: String!, $email: String!, $password: String!) {
      registerUser(
        username: $username
        email: $email
        password: $password
      ) {
        token
      }
    }
    `;

export const GET_CURRENT_USER = gql`
    query {
      getCurrentUser {
        _id
        username
        email
        avatar
        favorites {
            _id
            title
            imageUrl
        }
        joinDate
      }
    }
    `;
