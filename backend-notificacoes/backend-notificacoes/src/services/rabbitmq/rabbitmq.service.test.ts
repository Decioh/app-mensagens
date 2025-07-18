import { connectToRabbitMQ, getChannel } from './rabbitmq.service';
import amqp from 'amqplib';

jest.mock('amqplib');

// Mockamos as funções de conexão e canal do RabbitMQ
const mockSendToQueue = jest.fn();
const mockAssertQueue = jest.fn();
const mockCreateChannel = jest.fn().mockResolvedValue({
  assertQueue: mockAssertQueue,
  sendToQueue: mockSendToQueue,
});
const mockConnect = jest.fn().mockResolvedValue({
  createChannel: mockCreateChannel,
});

// Dizemos ao Jest para usar nossas funções de mock quando 'amqplib' for importado
(amqp.connect as jest.Mock).mockImplementation(mockConnect);

describe('RabbitMQ Service', () => {

  // Limpa os mocks antes de cada teste para garantir que um teste não afete o outro
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve conectar e criar o canal e as filas corretamente', async () => {
    await connectToRabbitMQ();
    
    // Testa se a conexão foi tentada
    expect(amqp.connect).toHaveBeenCalledWith(expect.any(String));
    
    // Testa se o canal foi criado
    expect(mockCreateChannel).toHaveBeenCalledTimes(1);
    
    // Testa se as filas foram declaradas
    expect(mockAssertQueue).toHaveBeenCalledWith('fila.notificacao.entrada.decio', { durable: true });
    expect(mockAssertQueue).toHaveBeenCalledWith('fila.notificacao.status.decio', { durable: true });
  });

  it('deve retornar o canal após a conexão', async () => {
    await connectToRabbitMQ();
    const channel = getChannel();

    // Testa se o canal retornado é o mesmo que foi mockado
    expect(channel).toBeDefined();
    expect(channel?.sendToQueue).toBeDefined();
  });
});