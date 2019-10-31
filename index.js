const express     = require('express');
const graphqlHttp = require('express-graphql');
const mongoose    = require('mongoose');

const Schema = require('./schema/schema');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use('/graphql', graphqlHttp({
  schema  : Schema,
  graphiql: true
}));

mongoose.connect('mongodb://localhost/graphql', {
  useNewUrlParser   : true,
  useUnifiedTopology: true,
  useFindAndModify  : false
})
.then(()   => console.log('DB Online'))
.catch(err => console.log(err));

app.listen(app.get('port'), () => console.log(`Server on port: ${app.get('port')}`));
