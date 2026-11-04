export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
}

const globalForDb = globalThis as unknown as {
  tarefasDB: Tarefa[] | undefined;
};

// Array global em memória inicializado com alguns dados de exemplo
export const tarefasDB =
  globalForDb.tarefasDB ?? [
    {
      id: "1",
      titulo: "Compras supermercado",
    descricao: "Comprar pão, leite e ovos",
      dataCriacao: new Date(),
    },
  ];

globalForDb.tarefasDB = tarefasDB;