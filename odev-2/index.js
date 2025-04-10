import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { events, locations, users, participants } from './data.js'
import { nanoid } from 'nanoid'

const typeDefs = `

    type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
    }

    input createUserInput {
    username: String!
    email: String!
    }

    input updateUserInput {
    username: String
    email:String
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

    input createEventInput{
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID!
    user_id: ID!
    }

    input updateEventInput{
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
    }

    type Location {
    id: String
    name: String
    desc: String
    lat: Float
    lng: Float
    }

    input createLocationInput{
    name: String
    desc: String
    lat: Float
    lng: Float
    }

    input updateLocationInput{
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

    input createParticipantInput{
    user_id: ID!
    event_id: ID!
    }

    input updateParticipantInput{
    user_id: ID
    event_id: ID
    }

    type deleteAllOutput{
    count: Int!
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

    type Mutation {
    #User
    createUser(data: createUserInput): User!
    updateUser(id: ID!, data: updateUserInput): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: deleteAllOutput!

    #Event
    createEvent(data: createEventInput): Event!
    updateEvent(id: ID!, data: updateEventInput):Event!
    deleteEvent(id: ID!):Event!
    deleteAllEvents: deleteAllOutput!

    #Location
    createLocation(data: createLocationInput): Location!
    updateLocation(id: ID!, data: updateLocationInput): Location!
    deleteLocation(id: ID!): Location!
    deleteAllLocations: deleteAllOutput!

    #Participant
    createParticipant(data: createParticipantInput): Participant!
    updateParticipant(id: ID!,data: updateParticipantInput): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: deleteAllOutput!
    }
`;

const resolvers = {
    Mutation:{
        // User
        createUser: (parent, {data}) => {
            const user = {
                id: nanoid(),
                ...data
            }

            users.push(user)

            return user
        },
        updateUser: (parent, {id,data}) => {
            const userIndex = users.findIndex(user => user.id == id)

            if(userIndex === -1) {
                throw new Error("User not found")
            }

            const updatedUser = (users[userIndex] = {
                ...users[userIndex],
                ...data
            })

            return updatedUser
        },
        deleteUser: (parent, {id,data}) => {
            const userIndex = users.findIndex(user => user.id == id)

            if(userIndex === -1) {
                throw new Error("User not found")
            }

            const deletedUser = users[userIndex]
            users.splice(userIndex, 1)

            return deletedUser
        },
        deleteAllUsers: ()=> {
            const length = users.length
            users.splice(0, length)

            return {count: length}
        },
        // Event
        createEvent: (parent, {data})=> {
            const event = {
                id: nanoid(),
                ...data
            }

            events.push(event)

            return event
        },
        updateEvent: (parent, {id,data}) => {
            const eventIndex = events.findIndex(event => event.id == id)

            if(eventIndex === -1) {
                throw new Error("Event not found")
            }

            const updatedEvent = (events[eventIndex] = {
                ...events[eventIndex],
                ...data
            })

            return updatedEvent
        },
        deleteEvent: (parent, {id}) => {
            const eventIndex = events.findIndex(event => event.id == id)

            if(eventIndex === -1) {
                throw new Error("Event not found")
            }

            const deletedEvent = events[eventIndex]
            events.splice(eventIndex, 1)

            return deletedEvent
        },
        deleteAllEvents: () => {
            const length = events.length
            events.splice(0, length)

            return {count: length}
        },
        // Location
        createLocation: (parent, {data})=> {
            const location = {
                id: nanoid(),
                ...data
            }

            locations.push(location)

            return location
        },
        updateLocation: (parent, {id,data}) => {
            const locationIndex = locations.findIndex(location => location.id == id)

            if(locationIndex === -1) {
                throw new Error("Location not found")
            }

            const updatedLocation = (locations[locationIndex] = {
                ...locations[locationIndex],
                ...data
            })

            return updatedLocation
        },
        deleteLocation: (parent, {id}) => {
            const locationIndex = locations.findIndex(location => location.id == id)

            if(locationIndex === -1) {
                throw new Error("Location not found")
            }

            const deletedLocation = locations[locationIndex]
            locations.splice(locationIndex, 1)

            return deletedLocation
        },
        deleteAllLocations: () => {
            const length = locations.length
            locations.splice(0, length)

            return {count: length}
        },
        // Participant
        createParticipant: (parent, {data})=> {
            const participant = {
                id: nanoid(),
                ...data
            }

            participants.push(participant)

            return participant
        },
        updateParticipant: (parent, {id,data}) => {
            const participantIndex = participants.findIndex(participant => participant.id == id)

            if(participantIndex === -1) {
                throw new Error("Participant not found")
            }

            const updatedParticipant = (participants[participantIndex] = {
                ...participants[participantIndex],
                ...data
            })

            return updatedParticipant
        },
        deleteParticipant: (parent, {id}) => {
            const participantIndex = participants.findIndex(participant => participant.id == id)

            if(participantIndex === -1) {
                throw new Error("Participant not found")
            }

            const deletedParticipant = participants[participantIndex]
            participants.splice(participantIndex, 1)

            return deletedParticipant
        },
        deleteAllParticipants: () => {
            const length = participants.length
            participants.splice(0, length)

            return {count: length}
        },
    },
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