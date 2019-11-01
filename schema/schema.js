const graphql = require('graphql');
const bcrypt  = require('bcrypt');

const Course  = require('../models/course.model');
const Teacher = require('../models/teacher.model');
const User    = require('../models/user.model');
const auth    = require('../utils/auth');

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
// <= MESSAGE TYPE =>
///////////////////////////////////////////////////////////////////////////////////////
const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    message: { type: GraphQLString },
    token: { type: GraphQLString },
    error: { type: GraphQLString }
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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }
        
        return Course.findOne({ _id: args.id });
      }
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        return Course.find();
      }
    },
    teacher: {
      type: TeacherType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        return Teacher.findOne({ name: args.name });
      }
    },
    teachers: {
      type: new GraphQLList(TeacherType),
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        return Teacher.find();
      }
    },
    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString }
      },
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        return User.findOne({ email: args.email });
      }
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        return User.find();
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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }     

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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

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
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }
        
        return Teacher.findByIdAndDelete(args.id);
      }
    },
    addUser: {
      type: MessageType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        date: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let user = await User.findOne({ email: args.email });

        if (user) return { error: 'El usuario ya existe' };

        user = new User({
          name: args.name,
          email: args.email,
          password: bcrypt.hashSync(args.password, 10),
          date: args.date
        });

        user.save();
        return { message: 'Usuario creado' };
      }
    },
    login: {
      type: MessageType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let result = await auth.login(args.email, args.password, process.env.SEED_GRAPHQL_COURSES);
        return {
          message: result.message,
          error: result.error,
          token: result.token
        };
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        date: { type: GraphQLString },
      },
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        if (args.id === context.user._id) {
          return User.findOneAndUpdate(args.id, {
            name: args.name,
            email: args.email,
            date: args.date
          }, { new: true });
        } else {
          throw new Error('No puedes actualizar otro usuario');
        }
      } 
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args, context) {
        if (!context.user.auth) {
          throw new Error('Token invalido');
        }

        if (args.id === context.user._id) {
          return User.findByIdAndDelete(args.id);
        } else {
          throw new Error('No puedes eliminar a otros usuarios');
        }
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