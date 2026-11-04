import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { tarefasDB, Tarefa } from '@/server/db';
import { TRPCError } from '@trpc/server';

export const tarefasRouter = router({
  // Listar tarefas 
  listar: publicProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
        limit: z.number().default(10),
      }).optional()
    )
    .query(({ input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor ?? 0;
      const items = tarefasDB.slice(cursor, cursor + limit);
      const nextCursor = cursor + limit < tarefasDB.length ? cursor + limit : undefined;

      return { items, nextCursor };
    }),
});