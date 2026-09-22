# Blog API

API RESTful para um sistema de Blog desenvolvida com NestJS, TypeORM e PostgreSQL.

##  Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [JWT](https://jwt.io/)
- [Passport](https://www.passportjs.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [class-validator](https://www.npmjs.com/package/class-validator)

##  Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)

##  Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/043Cecilio/blog-api.git
cd blog-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| DB_HOST | Host do banco de dados |
| DB_PORT | Porta do banco de dados |
| DB_USER | Usuário do banco de dados |
| DB_PASS | Senha do banco de dados |
| DB_NAME | Nome do banco de dados |
| JWT_SECRET | Chave secreta para geração do token JWT |
| NODE_ENV | Ambiente da aplicação (development/production) |

### 4. Suba o banco de dados com Docker

```bash
docker-compose up -d
```

### 5. Inicie a aplicação

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

##  Endpoints

### Auth
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | /auth/login | Login e geração do token JWT | 🔓 |

### Users
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | /users/register | Cadastro de usuário | 🔓 |

### Posts
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /posts | Listar posts com paginação (`?page=1&limit=10`) | 🔓 |
| GET | /posts/:id | Buscar post por ID | 🔓 |
| POST | /posts | Criar post | 🔒 |
| PATCH | /posts/:id | Editar post (apenas o autor) | 🔒 |
| DELETE | /posts/:id | Deletar post (apenas o autor) | 🔒 |

### Comments
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | /comments | Criar comentário | 🔒 |
| GET | /comments/post/:postId | Listar comentários de um post | 🔓 |

## 🔐 Autenticação

As rotas marcadas com 🔒 exigem um token JWT no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é obtido através do endpoint `POST /auth/login`.

##  Funcionalidades

- Cadastro e autenticação de usuários com hash de senha (bcrypt)
- CRUD completo de posts com geração automática de slug
- Paginação na listagem de posts
- Comentários vinculados a posts e usuários
- Proteção de rotas com JWT Guards
- Autorização por ownership (apenas o autor pode editar ou deletar seu post)
- Senha do usuário nunca exposta nas respostas da API
