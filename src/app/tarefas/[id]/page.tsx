'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/trpc/client'; 
import TarefaForm from '@/components/FormTarefa';

interface EditarTarefaPageProps {
  params: Promise<{ id: string }>;
}

export default function EditarTarefaPage({ params }: EditarTarefaPageProps) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const router = useRouter();
  const { data: tarefa, isLoading, error } = trpc.tarefas.buscarPorId.useQuery(
    { id: taskId },
    { retry: false }
  );

  const atualizarTarefa = trpc.tarefas.atualizar.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  const handleUpdate = async (data: { titulo: string; descricao?: string }) => {
    await atualizarTarefa.mutateAsync({
      id: taskId,
      titulo: data.titulo,
      descricao: data.descricao,
    });
  };

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">Carregando os dados da tarefa...</p>
      </main>
    );
  }

  if (error || !tarefa) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
          {error?.message || 'Tarefa não encontrada.'}
        </div>
        <Link href="/" className="text-blue-600 underline text-sm">
          ← Voltar para a lista
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Editar Tarefa</h1>
        <Link href="/" className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium transition-colors"
        >
          Cancelar
        </Link>
      </div>

      <TarefaForm
        initialValues={{
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
        }}
        onSubmit={handleUpdate}
        isLoading={atualizarTarefa.isPending}
        submitButtonText="Salvar Alterações"
      />
    </main>
  );
}