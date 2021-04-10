# Vue Apollo GraphQl
This project to make use of Graphql and Apollo Server as an alternative paradigm to define APIs.
Uses a node.js / express backend and a vue.js frontend.

Basically is a Template Validation application for output the template with the following features

# Project Outline
The repo contains both the Node.js backend and Vue.js frontend. 

## Node.js Backend
- Uses Express for routing
- MongoDB as database, Mongoose ODM as MongoDB driver and to define Model schemas
- JWT implementation to authentificate registered user
- GraphQl TypeDefs with Model definitions encapsulated in typeDefs.gql, file gets parsed via Node server
- JavaScript Methods for GraphQl queries with Database interactions are happening inside resolvers.js

## Vue.js Frontend
- Uses Google Material design with Vuetify
- GraphQl integration with Apollo Client via vue-apollo
- Query definitions in GQL language for Queries and Mutations encapsulated in queries.js
- Most queries happening inside Vuex except
- Functionality: User registration/ login, Datasets and Templates input/output 


Backend makes use of mongoose and MongoDB which could be set up at MongoDB Atlas, mlab or as a Docker container.

## Development
Set your .env variables. Copy and rename nodemon.example.json to nodemon.json
Insert connection to your MongoDB here.

Apollo playground can be reached at localhost:4000. The app will run at localhost:8080


Run the following command in root folder. This will start up both the node backend AND the vue frontend which is located in /client
```
npm run dev
```

## A friendly reminder
Use caution with npm and the folders. 
**There are two package.json files.** One for backend (root folder) and one for Vue frontend (client folder).

To manage and add Vue.js dependencies you need to move to the client folder and run npm there.

