'use client';

import type { Tarefa } from '@/server/db';

interface ListaTarefaProps {
  dadosIniciais: {
    items: Tarefa[];
    nextCursor?: number;
  };
}

export default function ListaTarefa({ dadosIniciais }: ListaTarefaProps) {
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
            
            {/*botão de deletar (vem depois)*/}
          </div>
        ))
      )}
    </div>
  );
}