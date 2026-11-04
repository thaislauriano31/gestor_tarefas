'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';
import FormTarefa from '@/components/FormTarefa';

export default function NovaTarefaPage() {
  const router = useRouter();
  const criarTarefa = trpc.tarefas.criar.useMutation({
    onSuccess: () => {
      // Redireciona e atualiza a lista SSR
      router.push('/');
      router.refresh();
    },
  });

  const handleCreate = async (data: { titulo: string; descricao?: string }) => {
    await criarTarefa.mutateAsync(data);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Tarefa</h1>
      <FormTarefa
        onSubmit={handleCreate}
        isLoading={criarTarefa.isPending}
        submitButtonText="Criar Tarefa"
      />
    </main>
  );
}