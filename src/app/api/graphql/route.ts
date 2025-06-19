import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { NextRequest, NextResponse } from 'next/server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function handler(req: NextRequest) {
  const body = await req.json();

  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
    }
  );

  if (response.body.kind === 'single') {
    return NextResponse.json(response.body.singleResult, { status: 200 });
  }

  return NextResponse.json(
    { error: 'GraphQL operation failed' },
    { status: 500 }
  );
}

export { handler as GET, handler as POST };