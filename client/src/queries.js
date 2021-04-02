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

export const GET_POST = gql`
    query($postId: ID!){
      getPost(postId: $postId)   {
          _id
          title
          imageUrl
          categories
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
      $description: String!,
      $userId:ID!
    ) {
      addPost(
        title:$title
        imageUrl:$imageUrl
        categories:$categories
        description:$description
        userId:$userId
      ){
        _id
        title
        imageUrl
        categories
        description
      }
    }
    `;

export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(
      messageBody: $messageBody,
      userId: $userId,
      postId: $postId
    ) {
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

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm) {
      _id
      title
      description
      imageUrl
      likes
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
      createdDate
      likes
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
    $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
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

export const LIKE_POST = gql`
    mutation($postId: ID!, $username: String!) {
      likePost(
        postId: $postId
        username: $username
      ) {
        likes
        favorites {
          _id
          title
          imageUrl
        }
      }
    }
    `;

export const UNLIKE_POST = gql`
    mutation($postId: ID!, $username: String!) {
      unlikePost(
        postId: $postId
        username: $username
      ) {
        likes
        favorites {
          _id
          title
          imageUrl
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
