'use client';

import { useState } from 'react';

interface TarefaFormProps {
  initialValues?: {
    titulo: string;
    descricao?: string;
  };
  onSubmit: (data: { titulo: string; descricao?: string }) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
}

export default function FormTarefa({
  initialValues = { titulo: '', descricao: '' },
  onSubmit,
  isLoading,
  submitButtonText,
}: TarefaFormProps) {
  const [titulo, setTitulo] = useState(initialValues.titulo);
  const [descricao, setDescricao] = useState(initialValues.descricao || '');
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErroLocal(null);

    if (!titulo.trim()) {
      setErroLocal('O título é obrigatório.');
      return;
    }

    try {
      await onSubmit({ titulo: titulo.trim(), descricao: descricao.trim() || undefined });
    } catch (err: any) {
      setErroLocal(err?.message || 'Ocorreu um erro ao processar a requisição.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-gray-900 p-6 rounded-lg shadow-sm">
      {erroLocal && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
          {erroLocal}
        </div>
      )}

      <div>
        <label htmlFor="titulo" className="block text-base font-medium text-white">
          Título *
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-800 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="Título da tarefa"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-base font-medium text-white">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-800 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="Detalhes adicionais"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Salvando...' : submitButtonText}
      </button>
    </form>
  );
}