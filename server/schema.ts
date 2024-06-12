import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from "graphql";
import axios from "axios";

const ClassType = new GraphQLObjectType({
  name: "Class",
  fields: {
    index: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const SpellType = new GraphQLObjectType({
  name: "Spell",
  fields: {
    index: { type: GraphQLString },
    name: { type: GraphQLString },
    desc: { type: new GraphQLList(GraphQLString) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    classes: {
      type: new GraphQLList(ClassType),
      async resolve() {
        try {
          const response = await axios.get(
            "https://www.dnd5eapi.co/api/classes"
          );
          console.log("Classes fetched from API:", response.data.results);
          return response.data.results;
        } catch (error) {
          console.error("Error fetching classes:", error);
          return [];
        }
      },
    },
    class: {
      type: ClassType,
      args: {
        index: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          const response = await axios.get(
            `https://www.dnd5eapi.co/api/classes/${args.index}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching class:", error);
          return null;
        }
      },
    },
    spells: {
      type: new GraphQLList(SpellType),
      async resolve() {
        try {
          const response = await axios.get(
            "https://www.dnd5eapi.co/api/spells"
          );
          console.log("Spells fetched from API:", response.data.results);
          return response.data.results;
        } catch (error) {
          console.error("Error fetching spells:", error);
          return [];
        }
      },
    },
    spell: {
      type: SpellType,
      args: {
        index: { type: GraphQLString },
      },
      async resolve(_, args) {
        try {
          const response = await axios.get(
            `https://www.dnd5eapi.co/api/spells/${args.index}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching spell:", error);
          return null;
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
