# Desafio Full-Stack - Sistema de Notificações Assíncronas

Este é um projeto desenvolvido como parte do processo seletivo para a vaga de Programador Web Full-Stack na VR Software.

## Sobre o Projeto

O sistema consiste em uma aplicação simplificada de notificações assíncronas. O frontend envia uma mensagem para uma API backend, que a publica em uma fila do RabbitMQ. Um consumidor processa a mensagem, simula um sucesso ou falha, e o status final é comunicado de volta ao frontend em tempo real via WebSockets.

## Tecnologias Utilizadas

- **Frontend:** Angular
- **Backend:** Node.js com TypeScript
- **Mensageria:** RabbitMQ
- **Comunicação em Tempo Real:** WebSockets (Socket.IO)
- **Gerenciador de Pacotes:** PNPM

## Como Executar o Projeto

**Pré-requisitos:**
- Node.js
- PNPM
- Docker (para rodar o RabbitMQ localmente)

**1. Clone o repositório:**
```bash
git clone [[https://github.com/seu-usuario/vr-software-desafio-fullstack.git](https://github.com/seu-usuario/vr-software-desafio-fullstack.git](https://github.com/Decioh/app-mensagens.git)
cd vr-software-desafio-fullstack
```

**2. Inicie o RabbitMQ (com Docker):**
```bash
docker run -d --name rabbitmq-dev -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**3. Backend (`backend-notificacoes`):**
Abra um terminal na pasta do backend, instale as dependências e inicie o servidor.
```bash
cd backend-notificacoes
pnpm install
pnpm run dev
```
O servidor estará rodando em `http://localhost:3000`.

**4. Frontend (`frontend-notificacoes`):**
Abra **outro terminal** na pasta do frontend, instale as dependências e inicie a aplicação.
```bash
cd frontend-notificacoes
pnpm install
ng serve
```
A aplicação estará disponível em `http://localhost:4200`.
