const express     = require('express');
const graphqlHttp = require('express-graphql');

const Schema = require('./schema/schema');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use('/graphql', graphqlHttp({
  schema  : Schema,
  graphiql: true
}));

app.listen(app.get('port'), () => console.log(`Server on port: ${app.get('port')}`));
