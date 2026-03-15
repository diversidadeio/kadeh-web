# Kadeh Ads - Documentação de Exportação do Projeto

**Data de Exportação:** 13 de Março de 2026  
**Versão do Projeto:** 77169fcc  
**Status:** Produção

---

## 📋 Índice

1. [Tecnologias e Linguagens](#tecnologias-e-linguagens)
2. [Dependências e Bibliotecas](#dependências-e-bibliotecas)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
5. [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
6. [Estrutura de Diretórios](#estrutura-de-diretórios)

---

## 🛠️ Tecnologias e Linguagens

### Frontend
- **React 19.2.1** - Framework UI
- **TypeScript 5.9.3** - Tipagem estática
- **Tailwind CSS 4.1.14** - Utilitários CSS
- **Vite 7.1.7** - Build tool e dev server
- **Wouter 3.3.5** - Roteamento leve

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.21.2** - Framework HTTP
- **tRPC 11.6.0** - RPC type-safe
- **Drizzle ORM 0.44.5** - Query builder e ORM
- **MySQL 2 3.15.0** - Driver de banco de dados

### Ferramentas de Desenvolvimento
- **TypeScript** - Tipagem estática
- **Vite** - Build e dev server
- **Vitest 2.1.4** - Framework de testes
- **Prettier 3.6.2** - Formatação de código
- **Tailwind CSS 4.1.14** - Utilitários CSS
- **Drizzle Kit 0.31.4** - Migrações de banco de dados

### Integrações Externas
- **Stripe 20.3.1** - Processamento de pagamentos
- **AWS S3** - Armazenamento de arquivos
- **Manus OAuth** - Autenticação
- **Google Maps** - Integração de mapas

---

## 📦 Dependências e Bibliotecas

### Dependências Principais (Production)

#### UI Components
```
@radix-ui/react-* (múltiplos componentes)
  - accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible
  - context-menu, dialog, dropdown-menu, hover-card, label, menubar
  - navigation-menu, popover, progress, radio-group, scroll-area, select
  - separator, slider, slot, switch, tabs, toggle, toggle-group, tooltip
```

#### Data Management & API
```
@tanstack/react-query: ^5.90.2
@trpc/client: ^11.6.0
@trpc/react-query: ^11.6.0
@trpc/server: ^11.6.0
superjson: ^1.13.3
```

#### Storage & Cloud
```
@aws-sdk/client-s3: ^3.693.0
@aws-sdk/s3-request-presigner: ^3.693.0
stripe: ^20.3.1
```

#### Database
```
drizzle-orm: ^0.44.5
mysql2: ^3.15.0
```

#### UI & Styling
```
tailwindcss: ^4.1.14
tailwind-merge: ^3.3.1
tailwindcss-animate: ^1.0.7
class-variance-authority: ^0.7.1
clsx: ^2.1.1
lucide-react: ^0.453.0
```

#### Forms & Validation
```
react-hook-form: ^7.64.0
@hookform/resolvers: ^5.2.2
zod: ^4.1.12
```

#### Charts & Visualization
```
chart.js: ^4.5.1
react-chartjs-2: ^5.3.1
recharts: ^2.15.2
```

#### Utilities
```
date-fns: ^4.1.0
nanoid: ^5.1.5
axios: ^1.12.0
cookie: ^1.0.2
jose: 6.1.0
dotenv: ^17.2.2
framer-motion: ^12.23.22
next-themes: ^0.4.6
```

#### PDF & Documents
```
pdfjs-dist: ^5.4.530
react-pdf: ^10.3.0
html2pdf.js: ^0.14.0
```

#### Other
```
embla-carousel-react: ^8.6.0
input-otp: ^1.4.2
react-day-picker: ^9.11.1
react-resizable-panels: ^3.0.6
sonner: ^2.0.7
streamdown: ^1.4.0
three: ^0.182.0
vaul: ^1.1.2
```

### Dependências de Desenvolvimento (DevDependencies)

```
@vitejs/plugin-react: ^5.0.4
@builder.io/vite-plugin-jsx-loc: ^0.1.1
@tailwindcss/vite: ^4.1.3
@tailwindcss/typography: ^0.5.15
@types/express: 4.17.21
@types/node: ^24.7.0
@types/react: ^19.2.1
@types/react-dom: ^19.2.1
@types/google.maps: ^3.58.1
@types/three: ^0.182.0
@testing-library/react: ^16.3.2
@testing-library/jest-dom: ^6.9.1
autoprefixer: ^10.4.20
postcss: ^8.4.47
esbuild: ^0.25.0
tsx: ^4.19.1
vitest: ^2.1.4
vitest-dom: ^0.1.1
vite-plugin-manus-runtime: ^0.0.57
prettier: ^3.6.2
drizzle-kit: ^0.31.4
pnpm: ^10.15.1
```

---

## 🔐 Variáveis de Ambiente

### Variáveis Obrigatórias

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication & OAuth
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=sua_chave_secreta_jwt

# Owner Information
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api_forge

# Frontend Manus APIs
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_api_frontend

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...

# Analytics
VITE_ANALYTICS_ENDPOINT=seu_endpoint_analytics
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# Application
VITE_APP_TITLE=Kadeh | Navegação Indoor com IA
VITE_APP_LOGO=url_do_logo
```

### Variáveis Opcionais

```env
NODE_ENV=development|production
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **users** - Usuários do Sistema
```sql
- id (INT, PK, AUTO_INCREMENT)
- openId (VARCHAR 64, UNIQUE) - Identificador OAuth
- name (TEXT)
- email (VARCHAR 320)
- loginMethod (VARCHAR 64)
- role (ENUM: 'user', 'admin')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
- lastSignedIn (TIMESTAMP)
```

#### 2. **advertisers** - Anunciantes/Empresas
```sql
- id (INT, PK, AUTO_INCREMENT)
- userId (INT, FK)
- companyName (VARCHAR 255)
- companyDocument (VARCHAR 20, UNIQUE) - CNPJ
- contactEmail (VARCHAR 320)
- contactPhone (VARCHAR 20)
- website (VARCHAR 255)
- status (ENUM: 'pending', 'approved', 'rejected', 'suspended')
- approvedBy (INT)
- approvalDate (TIMESTAMP)
- rejectionReason (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 3. **adCampaigns** - Campanhas de Anúncios
```sql
- id (INT, PK, AUTO_INCREMENT)
- advertiserId (INT, FK)
- companyName (VARCHAR 255)
- companyDocument (VARCHAR 20)
- contactEmail (VARCHAR 320)
- contactPhone (VARCHAR 20)
- duration (ENUM: '1day', '3days', '7days', '14days')
- numberOfStores (INT)
- numberOfProducts (INT)
- startDate (TIMESTAMP)
- endDate (TIMESTAMP)
- productName (VARCHAR 255)
- productImageUrl (VARCHAR 500)
- productEAN13 (VARCHAR 13)
- basePrice (DECIMAL 10,2)
- multiplier (DECIMAL 5,2)
- totalCost (DECIMAL 10,2)
- status (ENUM: 'pending_approval', 'approved', 'rejected', 'payment_pending', 'active', 'completed', 'cancelled')
- approvedBy (INT)
- approvalDate (TIMESTAMP)
- rejectionReason (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 4. **pricingPlans** - Planos de Preço
```sql
- id (INT, PK, AUTO_INCREMENT)
- duration (ENUM: '1day', '3days', '7days', '14days')
- minStores (INT)
- maxStores (INT)
- pricePerStore (DECIMAL 10,2)
- description (TEXT)
- isActive (BOOLEAN)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 5. **stripeCheckoutSessions** - Sessões de Checkout Stripe
```sql
- id (INT, PK, AUTO_INCREMENT)
- campaignId (INT, FK)
- stripeSessionId (VARCHAR 255, UNIQUE)
- stripeCustomerId (VARCHAR 255)
- amount (DECIMAL 10,2)
- currency (VARCHAR 3)
- status (ENUM: 'open', 'complete', 'expired')
- paymentStatus (ENUM: 'unpaid', 'paid', 'no_payment_required')
- checkoutUrl (VARCHAR 500)
- successUrl (VARCHAR 500)
- cancelUrl (VARCHAR 500)
- expiresAt (TIMESTAMP)
- completedAt (TIMESTAMP)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 6. **stripePayments** - Pagamentos Stripe
```sql
- id (INT, PK, AUTO_INCREMENT)
- campaignId (INT, FK)
- stripePaymentIntentId (VARCHAR 255, UNIQUE)
- stripeCustomerId (VARCHAR 255)
- stripeChargeId (VARCHAR 255, UNIQUE)
- amount (DECIMAL 10,2)
- currency (VARCHAR 3)
- status (ENUM: 'processing', 'succeeded', 'requires_action', 'canceled', 'failed')
- paymentMethod (VARCHAR 50)
- receiptUrl (VARCHAR 500)
- invoiceNumber (VARCHAR 50, UNIQUE)
- invoiceUrl (VARCHAR 500)
- paidAt (TIMESTAMP)
- refundedAt (TIMESTAMP)
- refundAmount (DECIMAL 10,2)
- refundReason (TEXT)
- failureReason (TEXT)
- metadata (JSON)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 7. **productCategories** - Categorias de Produtos
```sql
- id (INT, PK, AUTO_INCREMENT)
- userId (INT, FK)
- mainCategory (VARCHAR 100)
- name (VARCHAR 255)
- papelEstrategico (VARCHAR 100)
- defaultGiro (ENUM: 'Baixo', 'Médio', 'Alto')
- defaultMargem (ENUM: 'Baixa', 'Média', 'Alta')
- defaultLargura (INT)
- defaultComprimento (INT)
- defaultAltura (INT)
- salesVolume (DECIMAL 12,2)
- turnoverRate (DECIMAL 5,2)
- profitMargin (DECIMAL 5,2)
- stockoutRate (DECIMAL 5,2)
- lastUpdatedMetrics (TIMESTAMP)
- isActive (BOOLEAN)
- description (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### 8. **categoryProducts** - Produtos por Categoria
```sql
- id (INT, PK, AUTO_INCREMENT)
- categoryId (INT, FK)
- userId (INT, FK)
- name (VARCHAR 255)
- sku (VARCHAR 100)
- ean (VARCHAR 13)
- curvaFaturamento (ENUM: 'A', 'B', 'C')
- curvaLucratividade (ENUM: 'A', 'B', 'C')
- papelEstrategico (VARCHAR 100)
- defaultGiro (ENUM: 'Baixo', 'Médio', 'Alto')
- defaultMargem (ENUM: 'Baixa', 'Média', 'Alta')
- defaultLargura (INT)
- defaultComprimento (INT)
- defaultAltura (INT)
- salesVolume (DECIMAL 12,2)
- turnoverRate (DECIMAL 5,2)
- profitMargin (DECIMAL 5,2)
- stockoutRate (DECIMAL 5,2)
- lastUpdatedMetrics (TIMESTAMP)
- isActive (BOOLEAN)
- description (TEXT)
- imageUrl (VARCHAR 500)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### Outras Tabelas
- **advertisements** - Anúncios individuais
- **adAnalytics** - Analytics de anúncios
- **correlatedCategories** - Categorias correlacionadas
- **adBankPayments** - Pagamentos por depósito bancário
- **stripeCustomers** - Mapeamento de clientes Stripe
- **categoryPerformanceHistory** - Histórico de performance de categorias
- **productPerformanceHistory** - Histórico de performance de produtos

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

1. **Node.js** (v18+)
2. **pnpm** (v10+)
3. **MySQL** (v8+) ou TiDB
4. **Git**

### Instalação e Configuração

#### 1. Clonar o Repositório
```bash
git clone <seu_repositorio>
cd kadeh-webpage
```

#### 2. Instalar Dependências
```bash
pnpm install
```

#### 3. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env.local
cp .env.example .env.local

# Editar .env.local com suas credenciais
nano .env.local
```

**Variáveis Essenciais:**
```env
DATABASE_URL=mysql://root:password@localhost:3306/kadeh_db
VITE_APP_ID=seu_app_id
JWT_SECRET=sua_chave_secreta
NODE_ENV=development
```

#### 4. Configurar Banco de Dados

```bash
# Gerar migrações e aplicar ao banco
pnpm db:push

# Ou manualmente:
# drizzle-kit generate
# drizzle-kit migrate
```

#### 5. Iniciar o Servidor de Desenvolvimento

```bash
# Terminal 1: Servidor backend + frontend
pnpm dev
```

O servidor estará disponível em: `http://localhost:3000`

#### 6. Build para Produção

```bash
# Compilar frontend e backend
pnpm build

# Iniciar servidor de produção
pnpm start
```

### Scripts Disponíveis

```bash
pnpm dev          # Inicia dev server (hot reload)
pnpm build        # Build para produção
pnpm start        # Inicia servidor de produção
pnpm check        # Verifica tipos TypeScript
pnpm format       # Formata código com Prettier
pnpm test         # Executa testes com Vitest
pnpm db:push      # Aplica migrações do banco
```

### Troubleshooting

#### Erro: "Cannot find module"
```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Erro: "Database connection failed"
```bash
# Verificar credenciais em .env.local
# Verificar se MySQL está rodando
mysql -u root -p
```

#### Erro: "Port 3000 already in use"
```bash
# Usar porta diferente
PORT=3001 pnpm dev
```

---

## 📁 Estrutura de Diretórios

```
kadeh-webpage/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários
│   │   ├── _core/            # Hooks internos (useAuth, etc)
│   │   ├── App.tsx           # Componente raiz
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Estilos globais
│   ├── public/               # Assets estáticos
│   └── index.html            # HTML template
│
├── server/                    # Backend Express + tRPC
│   ├── _core/                # Framework interno
│   │   ├── index.ts          # Entry point do servidor
│   │   ├── context.ts        # Contexto tRPC
│   │   ├── env.ts            # Variáveis de ambiente
│   │   ├── auth.ts           # Autenticação
│   │   ├── oauth.ts          # OAuth flow
│   │   ├── llm.ts            # Integração LLM
│   │   ├── storage.ts        # S3 storage
│   │   ├── notification.ts   # Notificações
│   │   └── ...               # Outros utilitários
│   ├── routers.ts            # Definição de procedures tRPC
│   ├── campaignsRouter.ts    # Router de campanhas
│   ├── categoriesRouter.ts   # Router de categorias
│   ├── productsRouter.ts     # Router de produtos
│   ├── db.ts                 # Query helpers
│   ├── storage.ts            # S3 helpers
│   └── *.test.ts             # Testes
│
├── drizzle/                   # Banco de dados
│   ├── schema.ts             # Definição de tabelas
│   ├── relations.ts          # Relações entre tabelas
│   ├── migrations/           # Arquivos de migração
│   └── meta/                 # Metadados de migrações
│
├── shared/                    # Código compartilhado
│   ├── types.ts              # Tipos TypeScript
│   ├── const.ts              # Constantes
│   └── _core/                # Utilitários internos
│
├── storage/                   # Helpers de storage S3
│
├── package.json              # Dependências
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
├── drizzle.config.ts         # Configuração Drizzle
├── vitest.config.ts          # Configuração Vitest
└── README.md                 # Este arquivo
```

---

## 📝 Notas Importantes

### Segurança
- **Nunca** commitar `.env` ou `.env.local` no Git
- Usar variáveis de ambiente para todas as credenciais
- Stripe keys devem ser rotacionadas regularmente
- JWT_SECRET deve ser uma string aleatória forte

### Performance
- O projeto usa Vite para build rápido
- Tailwind CSS é compilado em tempo de build
- tRPC fornece type-safety end-to-end
- Drizzle ORM é otimizado para performance

### Deployment
- Build: `pnpm build`
- Output: `dist/` (frontend) + `dist/index.js` (backend)
- Variáveis de ambiente devem ser configuradas no servidor
- Database migrations devem ser executadas antes de deploy

### Desenvolvimento
- Use `pnpm dev` para desenvolvimento local
- TypeScript é obrigatório (sem `any` types)
- Prettier formata código automaticamente
- Vitest para testes unitários

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs em `.manus-logs/`
2. Consultar documentação do Drizzle: https://orm.drizzle.team
3. Consultar documentação do tRPC: https://trpc.io
4. Consultar documentação do Stripe: https://stripe.com/docs

---

**Última atualização:** 13 de Março de 2026
