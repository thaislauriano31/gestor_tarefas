'use client';
import Link from 'next/link';
import type { Tarefa } from '@/server/db';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/dist/client/components/navigation';
import { useState } from 'react';

interface ListaTarefaProps {
  dadosIniciais: {
    items: Tarefa[];
    nextCursor?: number;
  };
}

export default function ClientTaskList({ dadosIniciais }: ListaTarefaProps) {
  const router = useRouter();
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  // Hook da mutation de exclusão no tRPC
  const deletarTarefa = trpc.tarefas.deletar.useMutation({
    onSuccess: () => {
      setMensagemSucesso('Tarefa excluída com sucesso!');
      setMensagemErro(null);
      setIdEmExclusao(null);
      // Recarrega o Server Component (page.tsx) para atualizar os dados do SSR
      router.refresh();
      
      setTimeout(() => setMensagemSucesso(null), 3000);
    },
    onError: (error) => {
      setMensagemErro(error.message || 'Erro ao tentar excluir a tarefa.');
      setMensagemSucesso(null);
      setIdEmExclusao(null);
    },
  });

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    setIdEmExclusao(id);
    deletarTarefa.mutate({ id });
  };

  return (
    <div className="space-y-4">
      {dadosIniciais.items.length === 0 ? (
        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
      ) : (
        dadosIniciais.items.map((tarefa) => (
          <div 
            key={tarefa.id} 
            className="p-4 rounded-lg shadow-sm flex justify-between items-center bg-gray-900"
          >
            <div>
              <h3 className="font-semibold text-lg text-white">{tarefa.titulo}</h3>
              {tarefa.descricao && (
                <p className="text-gray-200 text-sm">{tarefa.descricao}</p>
              )}
              <span className="text-xs text-gray-400">
                Criado em: {new Date(tarefa.dataCriacao).toLocaleDateString()}
              </span>
            </div>
            <div className="flex space-x-2">
              <Link
                  href={`/tarefas/${tarefa.id}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Editar
                </Link>
              <button
                onClick={() => handleDeletar(tarefa.id)}
                disabled={idEmExclusao === tarefa.id}
                className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-800 rounded-md text-sm font-medium disabled:opacity-50 transition-colors shrink-0"
              >
                {idEmExclusao === tarefa.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}