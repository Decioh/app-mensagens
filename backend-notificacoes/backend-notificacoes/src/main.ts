import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectToRabbitMQ, getChannel } from './services/rabbitmq/rabbitmq.service';
import { startConsumers } from './services/notification/notification.consumer';

const app = express();
const port = 3000;
// Criando o servidor http e o servidor de sockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Vamos permitir qualquer origem para fins de desenvolvimento
    methods: ["GET", "POST"]
  }
});

// Configurando o Socket.IO para emitir eventos de notificação
export { io };
app.use(cors());
app.use(express.json());

app.post('/api/notificar', (req: Request, res: Response) => {
  try {
    const { mensagemId, conteudoMensagem } = req.body;

    if (!mensagemId) {
      return res.status(400).json({ error: 'mensagemId não pode ser vazio.' });
    }

    if (!conteudoMensagem) {
      return res.status(400).json({ error: 'conteudoMensagem não pode ser vazio.' });
    }

    const channel = getChannel();
    if (!channel) {
      return res.status(500).json({ error: 'Canal com RabbitMQ não está disponível.' });
    }
    
    const queueName = 'fila.notificacao.entrada.decio';
    const message = { mensagemId, conteudoMensagem };

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Mensagem enviada para a fila ${queueName}:`, message);

    return res.status(202).json({
      status: 'Requisição recebida com sucesso. A notificação será processada.',
      mensagemId: mensagemId,
    });
  } catch (error) {
    console.error("Erro ao processar a notificação:", error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Função principal assíncrona para controlar a inicialização
const startServer = async () => {
  server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });

  // Espera a conexão com o RabbitMQ ser completada
  await connectToRabbitMQ();
  
  // Após a conexão, inicia o consumidor
  startConsumers(); 
};

// Inicia todo o processo
startServer();