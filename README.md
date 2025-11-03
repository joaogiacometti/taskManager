# Task Manager

## 1. Descrição do Projeto

Task Manager é uma aplicação full‑stack para gerenciar projetos e tarefas. Foi desenvolvida com arquitetura em camadas (Domain / Application / Infra / Api) e um frontend em Next.js. Oferece endpoints para CRUD de projetos e tarefas, notificações em tempo real via SignalR (em progresso) e persistência em PostgreSQL.

## 2. Tecnologias Utilizadas

- Backend: .NET 9 (C#), projeto organizado em `Domain`, `Application`, `Infra` e `Api`.
- Frontend: Next.js 16 (React 19), Tailwind CSS e Shadcn.
- Banco de dados: PostgreSQL.
- Orquestração local: `docker compose` ou `podman compose` usando `compose.yml`.

## 3. Como Executar

### Pré-requisitos

- Docker (ou Podman).
- .NET SDK .NET 9 para executar sem Docker.
- Node.js e npm para o frontend.

### Executar com Docker / Podman (recomendado)

No diretório raiz do repositório há um `compose.yml` que configura 3 serviços: `front`, `api` e `db`.

- Subir os serviços (Podman):

```fish
podman compose up -d
```

- Subir os serviços (Docker):

```fish
docker compose up -d
```

O `compose.yml` expõe as portas:

- Frontend: `3000`
- API: `8080` e `8081`
- PostgreSQL: `5432`

As credenciais padrão do banco (definidas no `compose.yml`) são:

- DB: `task-manager` (variável `POSTGRES_DB`)
- User: `postgres` (variável `POSTGRES_USER`)
- Password: `SuperSecretPassword1!vD3%` (variável `POSTGRES_PASSWORD`)

### Executar sem Docker (modo desenvolvimento)

1. Banco de dados: você precisa de um PostgreSQL local em funcionamento. Crie um banco (por ex. `task-manager`) e configure as variáveis de ambiente ou `appsettings.Development.json` para apontar para ele.

2. Backend

```fish
cd backend
dotnet run --project Api/Api.csproj
```

3. Frontend

```fish
cd frontend
npm install
npm run dev
```

## 4. Decisões Técnicas

Resumo das principais decisões:

- Clean Architecture: separação clara entre `Domain` (entidades), `Application` (use-cases), `Infra` (persistência, EF Core) e `Api` (endpoints). Isso facilita teste, evolução e permite mudar infra sem impactar regras de negócio.

- Use Cases / Handlers: cada caso de uso fica organizado em `Application/UseCases`, explicitando contratos e responsabilidades (melhora rastreabilidade e testabilidade).

- Repository pattern e EF Core (Npgsql): abstrai acesso a dados para manter Domain agnóstico ao DB e facilitar mocks em testes unitários.

- Frontend com Next.js + Tailwind: produtividade no desenvolvimento e performance

Trade-offs e considerações:

- Separação em múltiplos projetos (.sln) aumenta boilerplate e complexidade inicial, mas melhora manutenção para projetos maiores.
- Não usei frameworks mais opinativos (ex.: MediatR) para manter dependências reduzidas e controle direto dos use-cases.

## 5. Uso de IA no Desenvolvimento

Transparência sobre uso de IA durante o desenvolvimento deste repositório:

- Ferramentas de IA foram usadas para acelerar tarefas de documentação (este `README.md` foi gerado com auxílio de uma ferramenta de IA) e para pesquisas rápidas (ex.: exemplos de configuração, snippets e melhores práticas).
- Em código, se a IA foi utilizada para gerar ou sugerir trechos (boilerplate, mapeamentos, exemplos), todo código gerado foi revisado manualmente, adaptado ao estilo do projeto, e testado localmente antes de ser commitado.
- Propósito do uso de IA: geração de documentação, auxílio em pesquisa e revisão de padrões. Não foram automatizados commits sem revisão humana; todas as alterações passadas por revisão e ajuste.
- IA também foi utilizada para gerar o design das páginas.

## 6. Melhorias Futuras

Com mais tempo, eu faria:

- Notificações com signalR.
- Testes automatizados (unit + integração) para backend e frontend.
- Configurar CI (GitHub Actions) com build, lint e testes.
- Seeds para criar usuário/admin inicial e dados de exemplo.
- Rate limiting.

## 7. Testes

- Status atual: não há um projeto de testes automatizados.
