import amqp, { Channel } from 'amqplib';

const amqpUrl = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672';
let channel: Channel | null = null;

export const connectToRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
    console.log("Conexão com o RabbitMQ estabelecida com sucesso!");
    
    // Use seu nome aqui
    await channel.assertQueue('fila.notificacao.entrada.decio', { durable: true });
    await channel.assertQueue('fila.notificacao.status.decio', { durable: true });
  } catch (error) {
    console.error("Erro ao conectar ou criar canal no RabbitMQ:", error);
    setTimeout(connectToRabbitMQ, 10000);
  }
};

export const getChannel = (): Channel | null => {
  if (!channel) {
    console.error("Canal do RabbitMQ não está disponível. Conecte primeiro.");
  }
  return channel;
};