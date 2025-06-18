import { ApolloServer, BaseContext } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { NextRequest, NextResponse } from 'next/server';
import { GraphQLRequest } from '@apollo/server';

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});

server.start();

async function handler(req: NextRequest) {
  const body = await req.json();

  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
    } as GraphQLRequest
  );

  // Bu if bloğu hatayı düzeltecek
  if (response.body.kind === 'single') {
    // TypeScript artık bu bloğun içinde response.body'nin
    // singleResult özelliğine sahip olduğunu biliyor.
    if (response.body.singleResult.errors === undefined) {
      return new NextResponse(JSON.stringify(response.body.singleResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  // Eğer 'single' değilse veya hata varsa, genel bir hata dön.
  return new NextResponse(JSON.stringify({ errors: [{ message: 'An error occurred.' }] }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export { handler as GET, handler as POST };