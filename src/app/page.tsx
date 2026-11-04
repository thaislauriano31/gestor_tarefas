import Link from 'next/link';
import { createCaller } from '@/app/api/trpc/[trpc]/route';
import ListaTarefa from '@/components/ListaTarefa';

export default async function HomePage() {
  const caller = createCaller({});

  const dadosIniciais = await caller.tarefas.listar({ cursor: 0, limit: 10 });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Tarefas</h1>
      <Link
          href="/tarefas/nova"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          + Nova Tarefa
        </Link>
      </div>
      <ListaTarefa dadosIniciais={dadosIniciais} />
    </main>
  );
}