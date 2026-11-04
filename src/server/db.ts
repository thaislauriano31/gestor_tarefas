export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
}

// Array global em memória inicializado com alguns dados de exemplo
export const tarefasDB: Tarefa[] = [
  {
    id: "1",
    titulo: "Compras supermercado",
    descricao: "Comprar pão, leite e ovos",
    dataCriacao: new Date(),
  },
];