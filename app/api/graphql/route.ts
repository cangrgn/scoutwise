import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { NextRequest, NextResponse } from 'next/server';

// Context'imizin nasıl görüneceğini tanımlıyoruz
export interface MyContext {
  req?: NextRequest;
}

// Sunucuyu bu context tipiyle oluşturuyoruz
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

async function handler(req: NextRequest) {
  const body = await req.json();

  // executeOperation'da context gönderilmiyor
  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
    },
    // Context artık burada değil!
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