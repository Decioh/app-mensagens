import { getChannel } from '../rabbitmq/rabbitmq.service';
import { Channel } from 'amqplib';
import { io } from '../../main'; // Importa a instância do Socket.IO

const simularProcessamento = () => {
  const delay = 1000 + Math.random() * 1000;
  return new Promise(resolve => setTimeout(resolve, delay));
};

const startEntradaConsumer = (channel: Channel) => {
  const entradaQueue = 'fila.notificacao.entrada.decio';
  const statusQueue = 'fila.notificacao.status.decio';

  channel.consume(entradaQueue, async (msg) => {
    if (msg) {
      try {
        const { mensagemId, conteudoMensagem } = JSON.parse(msg.content.toString());
        console.log(`[Consumidor Entrada] Mensagem recebida:`, { mensagemId });

        await simularProcessamento();

        const sucesso = Math.random() <= 0.8;
        const status = sucesso ? "PROCESSADO_SUCESSO" : "FALHA_PROCESSAMENTO";
        
        const statusMessage = { mensagemId, status };
        channel.sendToQueue(statusQueue, Buffer.from(JSON.stringify(statusMessage)), { persistent: true });
        console.log(`[Consumidor Entrada] Status publicado para a fila ${statusQueue}:`, statusMessage);

        channel.ack(msg);
      } catch (error) {
        console.error("Erro ao processar mensagem de entrada:", error);
      }
    }
  });
};

const startStatusConsumer = (channel: Channel) => {
  const statusQueue = 'fila.notificacao.status.decio';

  channel.consume(statusQueue, (msg) => {
    if (msg) {
      try {
        const { mensagemId, status } = JSON.parse(msg.content.toString());
        console.log(`[Consumidor Status] Status recebido da fila ${statusQueue}:`, { mensagemId, status });
        
        io.emit('status_update', { mensagemId, status });
        console.log(`[Socket.IO] Evento 'status_update' emitido para ${mensagemId}`);

        channel.ack(msg);
      } catch (error) {
        console.error("Erro ao processar mensagem de status:", error);
      }
    }
  });
}

export const startConsumers = async (): Promise<void> => {
  console.log('Iniciando consumidores...');
  const channel = getChannel();
  if (!channel) {
    console.error("Canal do RabbitMQ não disponível.");
    setTimeout(startConsumers, 10000);
    return;
  }
  
  startEntradaConsumer(channel);
  startStatusConsumer(channel);
};