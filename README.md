# IDEIAS - iServices

Sistema de gestão de ordens de serviço, contratos, documentos, rotas e combustível para empresas de campo.

**© IDEIAS Brasil Tecnologia — 2026**

---

## 📋 Pré-requisitos

- Node.js >= 18
- MySQL >= 8.0
- npm >= 9

---

## ⚙️ Instalação e Configuração

### 1. Banco de Dados

```bash
mysql -u <usuario> -p
CREATE DATABASE <nome_do_banco> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=<porta_backend>

DB_HOST=<host_banco>
DB_PORT=<porta_banco>
DB_NAME=<nome_do_banco>
DB_USER=<usuario_banco>
DB_PASSWORD=<senha_banco>

JWT_SECRET=<chave_jwt_com_32+_caracteres>
REFRESH_TOKEN_SECRET=<chave_refresh_com_32+_caracteres>

FRONTEND_URL=<url_frontend>
```

---

### 3. Migrations e Seeders

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

---

## ▶️ Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

---

### Frontend

```bash
cd frontend
npm run dev
```

---

## 👤 Usuários de Teste

Após rodar os seeders, o sistema cria usuários por perfil.

> ⚠️ As credenciais devem ser configuradas localmente ou consultadas nos seeders.

| Perfil       |
|--------------|
| Admin        |
| Gestor       |
| Coordenador  |
| Técnico      |
| Financeiro   |

---

## 🏗️ Estrutura do Projeto

```text
ideias-iservices/
├── backend/
│   ├── src/
│   │   ├── config/        # Configurações (DB, JWT, Sequelize)
│   │   ├── middlewares/   # auth, authorize, errorHandler, logs
│   │   ├── models/        # Models do Sequelize
│   │   ├── modules/       # Domínios da aplicação
│   │   └── database/
│   │       ├── migrations/
│   │       └── seeders/
│   └── src/app.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/
        │   └── ui/
        ├── pages/
        ├── hooks/
        ├── services/
        ├── store/
        └── router/
```

---

## 🔐 Perfis de Acesso (RBAC)

| Perfil       | Permissões                                      |
|--------------|-------------------------------------------------|
| admin        | Acesso total                                    |
| gestor       | Acesso gerencial                                |
| coordenador  | Operações (OS, contratos, rotas)                |
| tecnico      | Execução de OS                                  |
| financeiro   | Financeiro e contratos                          |

---

## 🔌 Endpoints Principais

| Método | Rota                         | Descrição                    |
|--------|------------------------------|------------------------------|
| POST   | /api/auth/login              | Autenticação                 |
| POST   | /api/auth/refresh            | Renovar token                |
| POST   | /api/auth/logout             | Encerrar sessão              |
| GET    | /api/service-orders          | Listar OS                    |
| GET    | /api/service-orders/counts   | Contadores por status        |
| GET    | /api/contracts               | Listar contratos             |
| GET    | /api/documents               | Listar documentos            |
| GET    | /api/fuel                    | Listar combustível           |
| GET    | /api/routes                  | Listar rotas                 |
| GET    | /api/prospects               | Listar prospects             |

---

## 🧩 Módulos do Sistema

- Auth
- Usuários
- Ordens de Serviço
- Contratos
- Documentos
- Combustível
- Rotas
- Prospects

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- React / Vite
- Zustand (state management)

---

## 📄 Licença

Uso interno — IDEIAS Brasil Tecnologia.

---

**© 2026 — IDEIAS Brasil Tecnologia**
