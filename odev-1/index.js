import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { events, locations, users, participants } from './data.js'

const typeDefs = `

    type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
    }

    type Event {
    id: String
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]
    }

    type Location {
    id: String
    name: String
    desc: String
    lat: Float
    lng: Float
    }
    
    type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    }

    type Query {
    #User
    users: [User!]!
    user(id:ID!): User!

    #Event
    events: [Event!]!
    event(id:ID!): Event!

    #Location
    locations: [Location!]!
    location(id:ID!):Location!

    #Participant
    participants: [Participant!]!
    participant(id:ID!): Participant!
  }
`;


const resolvers = {
    Query: {
        users: () => users,
        user: (_, args) => users.find(user => user.id == args.id),

        events: () => events,
        event: (_, args) => events.find(event => event.id == args.id),

        locations: () => locations,
        location: (_, args) => locations.find(locations => locations.id == args.id),

        participants: () => participants,
        participant: (_, args) => participants.find(participant => participant.id == args.id),
    },
    User: {
        events: (parent) => events.filter((event) => event.user_id == parent.id)
    },
    Event: {
        user: (parent) => users.find(user => user.id == parent.user_id),
        location: (parent) => locations.find(location => location.id == parent.location_id),
        participants: (parent) => participants.filter((participant) => participant.user_id == parent.user_id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);  