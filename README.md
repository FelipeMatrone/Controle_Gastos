# Controle de Gastos.

Este projeto é um sistema de controle de gastos desenvolvido como desafio prático. A aplicação permite cadastrar pessoas, registrar receitas e despesas e consultar o resumo financeiro de cada pessoa. 
Também existe um Dashboard com uma visão geral dos dados cadastrados.
O projeto foi desenvolvido de maneira simples, utilizando recursos básicos do React e do ASP.NET Core. Ao longo do código foram adicionados comentários para explicar algumas das principais regras e lógicas utilizadas.

---

## Funcionalidades

### Pessoas

- Cadastro de pessoas;
- Identificador gerado automaticamente;
- Cálculo da idade pela data de nascimento;
- Listagem de pessoas;
- Edição de dados;
- Exclusão de pessoas;
- Exclusão automática das transações relacionadas à pessoa.

### Transações

- Cadastro de receitas e despesas;
- Identificador gerado automaticamente;
- Seleção de uma pessoa cadastrada;
- Pesquisa de pessoas pelo nome;
- Listagem das transações;
- Validação da existência da pessoa;
- Bloqueio de receitas para menores de 18 anos.

Os tipos de transação são representados da seguinte maneira:

```text
0 = Despesa
1 = Receita
```

### Totais

- Total de receitas de cada pessoa;
- Total de despesas de cada pessoa;
- Saldo individual;
- Total geral de receitas;
- Total geral de despesas;
- Saldo líquido geral.

### Dashboard

O Dashboard apresenta:

- Quantidade de pessoas cadastradas;
- Total de receitas;
- Total de despesas;
- Saldo geral;
- Última pessoa cadastrada;
- Última movimentação;
- Resumo financeiro das pessoas.

---

## Tecnologias utilizadas

### Back-end

- C#;
- .NET 8;
- ASP.NET Core Web API;
- Entity Framework Core;
- SQLite;
- Swagger.

### Front-end

- React;
- TypeScript;
- Vite;
- CSS;
- Fetch API.

O SQLite foi utilizado para manter os dados salvos mesmo depois que a aplicação é encerrada.

---

## Requisitos para executar

É necessário ter instalado:

- .NET 8 SDK;
- Node.js;
- npm;
- Ferramenta `dotnet-ef`.

Para conferir as instalações:

```powershell
git --version
dotnet --version
node --version
npm --version
dotnet ef --version
```

Se o `dotnet-ef` não estiver instalado:

```powershell
dotnet tool install --global dotnet-ef
```

---

## Como executar o projeto

Primeiro, clone o repositório:

```powershell
git clone https://github.com/FelipeMatrone/Controle_Gastos.git
cd Controle_Gastos
```

### Executar o back-end

Abra um terminal e execute:

```powershell
cd backend\ControleGastos.Api
dotnet restore
dotnet ef database update
dotnet run
```

A API estará disponível em:

```text
http://localhost:5114
```

O Swagger estará disponível em:

```text
http://localhost:5114/swagger
```

### Executar o front-end

Abra outro terminal e execute:

```powershell
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

O front-end e o back-end precisam ficar em execução ao mesmo tempo.

---

## Estrutura principal

```text
Controle_Gastos/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   └── Models/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── styles/
│
└── README.md
```

---

## Validação do projeto

Para validar o back-end:

```powershell
cd backend\ControleGastos.Api
dotnet build
```

Para validar o front-end:

```powershell
cd frontend
npm run build
```

---

## Persistência

O banco SQLite é criado através das migrations:

```powershell
dotnet ef database update
```

O arquivo do banco é local e não é enviado para o GitHub. Cada pessoa que baixar o projeto criará seu próprio banco ao executar as migrations.
