export const runtime = 'nodejs';

import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { NextRequest, NextResponse } from 'next/server';

export interface MyContext {
  req?: NextRequest;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

async function handler(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  if (!body.query) {
    return NextResponse.json(
      { error: 'No GraphQL query provided.' },
      { status: 400 }
    );
  }

  const response = await server.executeOperation({
    query: body.query,
    variables: body.variables,
  });

  if (response.body.kind === 'single') {
    return NextResponse.json(response.body.singleResult, { status: 200 });
  }

  return NextResponse.json(
    { error: 'GraphQL operation failed' },
    { status: 500 }
  );
}

export { handler as GET, handler as POST };