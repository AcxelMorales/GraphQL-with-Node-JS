const graphql = require('graphql');

const Course  = require('../models/course.model');
const Teacher = require('../models/teacher.model');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList
} = graphql;

///////////////////////////////////////////////////////////////////////////////////////
// <= COURSE TYPE =>
///////////////////////////////////////////////////////////////////////////////////////
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
        return Teacher.findById(parent.teacherId);
      }
    }
  })
});

///////////////////////////////////////////////////////////////////////////////////////
// <= TEACHER TYPE =>
///////////////////////////////////////////////////////////////////////////////////////
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
        return Course.find({ teacherId: parent.id });
      }
    }
  })
});

///////////////////////////////////////////////////////////////////////////////////////
// <= USER TYPE =>
///////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////
// <= QUERYS =>
///////////////////////////////////////////////////////////////////////////////////////
const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    course: {
      type: CourseType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Course.findOne({ _id: args.id });
      }
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        return Course.find();
      }
    },
    teacher: {
      type: TeacherType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Teacher.findOne({ name: args.name });
      }
    },
    teachers: {
      type: new GraphQLList(TeacherType),
      resolve() {
        return Teacher.find();
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

///////////////////////////////////////////////////////////////////////////////////////
// <= MUTATIONS =>
///////////////////////////////////////////////////////////////////////////////////////
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCourse: {
      type: CourseType,
      args: {
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        teacherId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let course = new Course({
          name: args.name,
          language: args.language,
          date: args.date,
          teacherId: args.teacherId
        });

        return course.save();
      }
    },
    updateCourse: {
      type: CourseType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        language: { type: GraphQLString },
        date: { type: GraphQLString },
        teacherId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Course.findByIdAndUpdate(args.id, {
          name: args.name,
          language: args.language,
          date: args.date,
          teacherId: args.teacherId
        }, { new: true });
      }
    },
    deleteCourse: {
      type: CourseType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Course.findByIdAndDelete(args.id);
      }
    },
    addTeacher: {
      type: TeacherType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString }
      },
      resolve(parent, args) {
        let teacher = new Teacher({
          name: args.name,
          age: args.age,
          active: args.active,
          date: args.date
        });

        return teacher.save();
      }
    },
    updateTeacher: {
      type: TeacherType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        date: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Teacher.findByIdAndUpdate(args.id, {
          name: args.name,
          age: args.age,
          active: args.active,
          date: args.date
        }, { new: true });
      }
    },
    deleteTeacher: {
      type: TeacherType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Teacher.findByIdAndDelete(args.id);
      }
    }
  }
});

///////////////////////////////////////////////////////////////////////////////////////
// <= EXPORTS =>
///////////////////////////////////////////////////////////////////////////////////////
module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: mutation
});