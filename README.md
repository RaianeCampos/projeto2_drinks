# Projeto 2: Web Fullstack - Drinks

Este é um projeto fullstack desenvolvido para a disciplina de Programação Web Fullstack (ES47B) da UTFPR-CP. A aplicação consiste em um sistema de 3 camadas (front-end, back-end e banco de dados) para gerenciar uma coleção de receitas de drinks.

O projeto segue a temática do Projeto 1 (Drinks).

## Tecnologias Utilizadas

O projeto foi implementado seguindo a arquitetura e as tecnologias:

* **Front-end:** **React.js** (com Vite, React Router DOM e Axios)
* **Back-end:** **Express.js** (com Node.js)
* **Banco de Dados:** **PostgreSQL** (utilizando a biblioteca `pg`)

## Funcionalidades Implementadas

A aplicação implementa todos os requisitos funcionais solicitados:

1.  **Login de Usuário:** Sistema de autenticação via token (JWT) para proteger rotas.
2. **Busca de Drinks:** Usuários logados podem buscar drinks existentes no banco de dados.
3.  **Inserção de Drinks:** Usuários logados podem adicionar novas receitas de drinks.
4.  **Detalhes do Drink:** Ao clicar em um resultado da busca, o usuário é levado a uma página de detalhes com a receita completa.
5.  **Logout:** O usuário pode invalidar sua sessão clicando no botão "Sair".

## Estrutura do Projeto

O repositório está dividido em duas pastas principais, `frontend` e `backend`.

O **Back-end** segue a estrutura de pastas restrita:
* `src/config`: Configuração do banco de dados (com pool) e cache.
* `src/models`: Classes de acesso aos dados (User e Drink).
* `src/routes`: Arquivos de rotas com controladores embutidos.

O **Front-end** segue a mesma estrutura de arquivos do Projeto 1.

## Segurança e Otimização

O projeto implementa diversos critérios de avaliação avançados:

* **Segurança (OWASP):**
    * **Falhas de Criptografia:** Senhas são armazenadas com hash (`bcrypt`).
    * **Injeção:** Prevenção contra SQL Injection (queries parametrizadas) e XSS (sanitização com `express-validator`).
    * **Falhas de Autenticação:** Invalidação de token no logout e prevenção contra ataques de força bruta (Rate Limiting) na rota de login.
    * **Monitoramento:** Logs de requisições (`morgan`) e de ações de segurança (login, buscas).
* **Otimização:**
    * **Front-end:** Compressão de arquivos estáticos (feita pelo Vite no build).
    * **Back-end:** Compressão de respostas do servidor (`compression`), uso de Pool de Conexões com o banco e estratégia de Cache (`node-cache`) na busca de drinks.

## Como Executar

### Pré-requisitos

* Node.js (v18+)
* NPM
* PostgreSQL

### 1. Backend

```bash
# 1. Navegue para a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env (veja o .env.example)
# Preencha com os dados do seu banco PostgreSQL
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projeto2_drinks
JWT_SECRET=seu_segredo_jwt

# 4. Rode o script SQL para criar as tabelas no seu banco

# 5. Crie o usuário de teste
node createUser.js

# 6. Inicie o servidor
node index.js
# O servidor estará rodando em http://localhost:3001

```bash

### 2. Frontend

```bash

# 1. Em outro terminal, navegue para a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# O app estará disponível em http://localhost:5173

```bash