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
        templateType
        content
        treeTemplate
        filenames
        filetypes
      }
    }
    `;

export const GET_SAVED_TEMPLATES = gql`
    query {
      getSavedTemplates {
        _id
        title
        templateType
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
          templateType
          content
          treeTemplate
          filenames
          filetypes
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

  export const ADD_REPORT = gql`
    mutation(
      $report_name: String!,
      $report_desc: String!,
      $template_name: [String]!,
      $file_name: [String]!,
      $project_id: [String]!,
      $node_id: [String]!,
      $variable: [String]!,
      $previous: [String]!,
      $modified: [String]!,
      $userId:ID!
    ) {
      addReport(
        report_name:$report_name
        report_desc:$report_desc
        template_name:$template_name
        file_name:$file_name
        project_id:$project_id
        node_id:$node_id
        variable:$variable
        previous:$previous
        modified:$modified
        userId:$userId
      ){
        _id
        report_name
        report_desc
        template_name
        file_name
        project_id
        node_id
        variable
        previous
        modified
      }
    }
    `;

  export const ADD_TEMPLATE = gql`
    mutation(
      $title: String!,
      $templateType:String!,
      $content: String!,
      $treeTemplate: [String]!,
      $filenames: [String]!,
      $filetypes: [String]!,
      $userId:ID!
    ) {
      addTemplate(
        title:$title
        templateType:$templateType
        content:$content
        treeTemplate:$treeTemplate
        filenames:$filenames
        filetypes:$filetypes
        userId:$userId
      ){
        _id
        title
        templateType
        content
        treeTemplate
        filenames
        filetypes
      }
    }
    `;

  export const SAVE_TEMPLATES = gql`
    mutation(
      $title: String!,
      $templateType:String!,
      $templates: [String]!,
      $originalTemp:String!,
      $newTemplates: [String]!,
      $isUpdated:String!,
      $node_ids: [String]!,
      $project_ids: [String]!,
      $file_names: [String]!,
      $file_types: [String]!,
      $userId:ID!
    ) {
      saveTemplates(
        title:$title
        templateType:$templateType
        templates:$templates
        originalTemp:$originalTemp
        newTemplates:$newTemplates
        isUpdated:$isUpdated
        node_ids:$node_ids
        project_ids:$project_ids
        file_names:$file_names
        file_types:$file_types
        userId:$userId
      ){
        _id
        title
        templateType
        templates
        originalTemp
        newTemplates
        isUpdated
        node_ids
        project_ids
        file_names
        file_types
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
          templateType
          content
          treeTemplate
          filenames
          filetypes
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

export const GET_USER_REPORTS = gql`
  query($userId: ID!) {
    getUserReports(userId: $userId) {
      _id
      report_name
      report_desc
      template_name
      file_name
      project_id
      node_id
      variable
      previous
      modified
      createdDate
    }
  }
`;

export const GET_USER_TEMPLATES = gql`
  query($userId: ID!) {
    getUserTemplates(userId: $userId) {
      _id
      title
      templateType
      content
      treeTemplate
      filenames
      filetypes
      createdDate
    }
  }
`;

export const GET_USER_SAVED_TEMPLATES = gql`
  query($userId: ID!) {
    getUserSavedTemplates(userId: $userId) {
      _id
      title
      templateType
      node_ids
      templates
      newTemplates
      originalTemp
      isUpdated
      project_ids
      file_names
      file_types
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
      $templateType:String!,
      $templates: [String]!,
      $originalTemp:String!,
      $newTemplates: [String]!,
      $isUpdated:String!,
      $node_ids: [String]!,
      $project_ids: [String]!,
      $file_names: [String]!,
      $file_types: [String]!,
    ) {
      updateProcTemplate(
        templateId: $templateId
        userId:$userId
        title:$title
        templateType:$templateType
        templates:$templates
        originalTemp:$originalTemp
        newTemplates:$newTemplates
        isUpdated:$isUpdated
        node_ids:$node_ids
        project_ids:$project_ids
        file_names:$file_names
        file_types:$file_types
      ){
        _id
        title
        templateType
        templates
        originalTemp
        newTemplates
        isUpdated
        node_ids
        project_ids
        file_names
        file_types
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
    $templateType: String!
    $content: String!
    $treeTemplate: [String]!
    $filenames: [String]!
    $filetypes: [String]!
  ) {
    updateUserTemplate(
      templateId: $templateId
      userId: $userId
      title: $title
      templateType: $templateType
      content: $content
      treeTemplate: $treeTemplate
      filenames: $filenames
      filetypes: $filetypes
    ) {
      _id
      title
      templateType
      content
      treeTemplate
      filenames
      filetypes
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

export const DELETE_USER_REPORT = gql`
  mutation($reportId: ID!) {
    deleteUserReport (reportId: $reportId) {
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
