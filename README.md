# Sistema de Gestão de Tarefas

Gestor de tarefas funcional com suporte a operações CRUD, armazenamento em memória e renderização do lado do servidor (SSR).

<!-- ## Tecnologias Utilizadas
- **Framework:** Next.js 15 (App Router)
- **Comunicação API:** tRPC v11 + TanStack React Query
- **Validação:** Zod
- **Estilização:** Tailwind CSS
- **Linguagem:** TypeScript

## Decisões de Arquitetura & Implementação
- **SSR na Listagem:** A listagem inicial de tarefas é pré-carregada no servidor via Server-Side Rendering (SSR) utilizando o `createCaller` do tRPC para otimização de performance e SEO.
- **Persistência em Memória:** Os dados são mantidos numa estrutura em memória (`globalThis`) no lado do servidor para garantir que as alterações persistam entre chamadas HTTP durante a sessão.
- **Infinite Scroll:** Implementado na página principal através do hook `useInfiniteQuery` do tRPC e da API nativa `IntersectionObserver`.
- **Tratamento de Erros:** Validações de frontend e backend tratadas via Zod com códigos de erro apropriados (`NOT_FOUND`, `BAD_REQUEST`). -->

---

## Tecnologias & Ferramentas

- **Next.js 15 (App Router)** — Framework React com renderização híbrida.
- **tRPC v11 + TanStack React Query** — Comunicação tipada entre cliente e servidor com gerenciamento de estado assíncrono.
- **Zod** — Validação de schemas e inferência de tipos.
- **TypeScript** — Tipagem estática em toda a aplicação.
- **Tailwind CSS** — Estilização ágil e responsiva.

---

## Como o Sistema Funciona & Decisões de Arquitetura

### 1. Renderização Híbrida (SSR + Hydration no Cliente)
A primeira página de tarefas é pré-renderizada diretamente no servidor (SSR) utilizando a funcionalidade de `createCallerFactory` do tRPC. Isso garante que a página já chegue ao navegador preenchida com os dados iniciais, trazendo ganho de performance no primeiro carregamento. A partir disso, o componente cliente assume a interatividade via React Query.

### 2. Comunicação e Tipagem com tRPC
Em vez de definir contratos REST, o tRPC expõe os métodos do backend diretamente para o frontend. Se um campo no backend mudar, o TypeScript avisa imediatamente no componente React em tempo de compilação.

### 3. Infinite Scroll nativo com `IntersectionObserver`
Para lidar com a paginação da lista de forma fluida, o backend expõe um cursor incremental. No frontend, combinamos o hook `useInfiniteQuery` do tRPC com a API nativa do navegador `IntersectionObserver`. Quando o usuário aproxima a rolagem do final da tela, a próxima página é requisitada automaticamente.

### 4. Persistência em Memória Global (`globalThis`)
Como o objetivo do projeto foi focar na arquitetura de comunicação e gerenciamento de estado sem a complexidade de um banco de dados relacional, as tarefas ficam armazenadas na memória da aplicação. Para evitar que o mecanismo de *Hot Reload* do Next.js recrie o array a cada mudança de código em ambiente de desenvolvimento, a instância foi acoplada ao objeto global do Node.js (`globalThis`).

### 5. Validação e Resiliência a Erros
Todas as entradas do usuário passam por validação em duas etapas:
- **Frontend:** Validação imediata para evitar requisições desnecessárias (ex: título em branco).
- **Backend:** Schemas rigorosos com Zod e lançamento de erros padronizados (`TRPCError`), garantindo que falhas como tentar editar ou excluir um item inexistente retornem mensagens claras e amigáveis para a interface.

## Como Executar o Projeto

É preciso ter o Node.js instalado para conseguir executar o projeto (pode ser baixado seguindo [este tutorial](https://nodejs.org/en/download)).

1. Clone o repositório:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
```

2. Instale as dependências:
```bash
npm install
```
3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador: http://localhost:3000
