import { createCaller } from '@/app/api/trpc/[trpc]/route';
import ClientTaskList from '@/components/ClientTaskList';

export default async function HomePage() {
  const caller = createCaller({});
  
  const dadosIniciais = await caller.tarefas.listar({ cursor: 0, limit: 10 });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Tarefas</h1>
      <ClientTaskList dadosIniciais={dadosIniciais} />
    </main>
  );
}