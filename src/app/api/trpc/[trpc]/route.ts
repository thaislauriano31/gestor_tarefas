import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createCallerFactory, router } from '@/server/trpc/trpc';
import { tarefasRouter } from '@/server/trpc/routers/tarefas';

export const appRouter = router({
  tarefas: tarefasRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };