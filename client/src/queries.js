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
          createdDate
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
          createdDate
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
      $originalTemp:String!,
      $newTemplates: [String]!,
      $isUpdated:String!,
      $node_ids: [String]!,
      $userId:ID!
    ) {
      saveTemplates(
        title:$title
        imageUrl:$imageUrl
        templates:$templates
        originalTemp:$originalTemp
        newTemplates:$newTemplates
        isUpdated:$isUpdated
        node_ids:$node_ids
        userId:$userId
      ){
        _id
        title
        imageUrl
        templates
        originalTemp
        newTemplates
        isUpdated
        node_ids
      }
    }
  `;
  export const SEARCH_POSTS = gql`
    query($searchTerm: String) {
      searchPosts(searchTerm: $searchTerm) {
        _id
        title
        description
        imageUrl
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
          createdDate
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
          createdDate
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
      originalTemp
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
      userId {
        _id
        avatar
      }
    }
  }
`;

export const UPDATE_PROC_TEMPLATE = gql`
    mutation(
      $templateId: ID!
      $userId:ID!
      $title: String!,
      $imageUrl:String!,
      $templates: [String]!,
      $originalTemp:String!,
      $newTemplates: [String]!,
      $isUpdated:String!,
      $node_ids: [String]!,
    ) {
      updateProcTemplate(
        templateId: $templateId
        userId:$userId
        title:$title
        imageUrl:$imageUrl
        templates:$templates
        originalTemp:$originalTemp
        newTemplates:$newTemplates
        isUpdated:$isUpdated
        node_ids:$node_ids
      ){
        _id
        title
        imageUrl
        templates
        originalTemp
        newTemplates
        isUpdated
        node_ids
        userId {
          _id
          avatar
        }
      }
    }
  `;

export const UPDATE_USER_TEMPLATE = gql`
  mutation(
    $templateId: ID!
    $userId: ID!
    $title: String!
    $imageUrl: String!
    $content: String!
    $description: String!
  ) {
    updateUserTemplate(
      templateId: $templateId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      content: $content
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      content
      createdDate
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
        joinDate
      }
    }
    `;
