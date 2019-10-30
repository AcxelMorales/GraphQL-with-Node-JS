const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList
} = graphql;

const courses = [
  { id: '1', name: 'Patrones de Diseño en Java', language: 'Java', date: '2019', teacherId: '1' },
  { id: '2', name: 'Patrones de Diseño en JavaScript', language: 'JavaScript', date: '2019', teacherId: '2' },
  { id: '3', name: 'Front-End Angular', language: 'TypeScript', date: '2019', teacherId: '3' },
  { id: '4', name: 'Node JS', language: 'JavaScript', date: '2019', teacherId: '3' },
  { id: '5', name: 'Bases de Datos', language: 'SQL', date: '2019', teacherId: '4' }
];

const teachers = [
  { id: '1', name: 'Javier Vazquez', age: 40, active: true, date: '2019' },
  { id: '2', name: 'Juan De la Torre', age: 33, active: true, date: '2019' },
  { id: '3', name: 'Fernando Herrera', age: 35, active: true, date: '2019' },
  { id: '4', name: 'Pablo Tilota', age: 52, active: true, date: '2019' }
];

const users = [
  { id: '1', name: 'Acxel', email: 'acxel@correo.com', password: '123', date: '2019' },
  { id: '2', name: 'Test1', email: 'test1@correo.com', password: '123', date: '2019' },
  { id: '3', name: 'Test2', email: 'test2@correo.com', password: '123', date: '2019' }
];

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    language: { type: GraphQLString },
    date: { type: GraphQLString  },
    teacher: { 
      type: TeacherType,
      resolve(parent, args) {
        return teachers.find(t => t.id === parent.teacherId);
      }
    }
  })
});

const TeacherType = new GraphQLObjectType({
  name: "Teacher",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    active: { type: GraphQLBoolean },
    date: { type: GraphQLString  },
    course: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        return courses.filter(c => c.teacherId === parent.id);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    date: { type: GraphQLString }
  })
});

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    course: {
      type: CourseType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return courses.find(c => c.id === args.id);
      }
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        return courses;
      }
    },
    teacher: {
      type: TeacherType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return teachers.find(t => t.name === args.name);
      }
    },
    teachers: {
      type: new GraphQLList(TeacherType),
      resolve() {
        return teachers;
      }
    },
    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString }
      },
      resolve(parent, args) {
        return users.find(u => u.email === args.email);
      }
    },
    users: {
      type: GraphQLList(UserType),
      resolve() {
        return users;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery
});