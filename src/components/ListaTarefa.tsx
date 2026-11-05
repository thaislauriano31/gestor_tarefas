'use client';
import Link from 'next/link';
import type { Tarefa } from '@/server/db';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/dist/client/components/navigation';
import { useState, useEffect, useRef } from 'react';

interface ListaTarefaProps {
  dadosIniciais: {
    items: Tarefa[];
    nextCursor?: number;
  };
}

export default function ClientTaskList({ dadosIniciais }: ListaTarefaProps) {
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  // Hook de busca infinita do tRPC
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = trpc.tarefas.listar.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [dadosIniciais],
        pageParams: [0],
      } as any,
    }
  );

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

  // Intersection Observer para detetar quando o utilizador chega ao fim da página
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    setIdEmExclusao(id);
    deletarTarefa.mutate({ id });
  };

  const todasAsTarefas = data?.pages.flatMap((page) => page.items) ?? [];

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
            <div className="min-w-0">
              <h3 className="font-semibold text-lg text-white truncate">{tarefa.titulo}</h3>
              {tarefa.descricao && (
                <p className="text-gray-200 text-sm line-clamp-2">{tarefa.descricao}</p>
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
      <div ref={observerRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <p className="text-sm text-gray-500 animate-pulse">Carregando mais tarefas...</p>
        )}
      </div>
    </div>
  );
}