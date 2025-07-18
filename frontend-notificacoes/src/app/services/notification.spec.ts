import { TestBed } from '@angular/core/testing';
// HttpTestingController nos permite simular e inspecionar requisições HTTP
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Socket } from 'ngx-socket-io';
import { of } from 'rxjs';

import { NotificationService } from './notification.service';
import { importProvidersFrom } from '@angular/core';

// Criamos um mock simples para o Socket.IO
// Ele não precisa fazer nada, apenas existir para ser injetado.
class MockSocket {
  fromEvent() {
    // Retorna um Observable vazio para que o .subscribe() no componente funcione
    return of(null); 
  }
}

describe('NotificationService', () => {
  let service: NotificationService;
  let httpTestingController: HttpTestingController;
  let mockSocket: Socket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Importamos o HttpClientTestingModule para poder mockar o HttpClient
      providers: [
        NotificationService,
        // Fornecemos nosso mock em vez do Socket real
        { provide: Socket, useClass: MockSocket },
        importProvidersFrom(HttpClientTestingModule)

      ]
    });

    // Injetamos o serviço e os controllers de mock
    service = TestBed.inject(NotificationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockSocket = TestBed.inject(Socket);
  });

  // Este afterEach garante que não há requisições HTTP pendentes entre os testes
  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('enviarNotificacao', () => {
    it('deve gerar um ID, enviar uma requisição POST e retornar o ID', () => {
      const messageContent = 'Teste de notificação';
      const expectedUrl = 'http://localhost:3000/api/notificar';
      
      // Act: Chamamos o método que queremos testar
      const returnedId = service.enviarNotificacao(messageContent);
      
      // Assert: Verificamos se uma requisição foi feita
      // O `expectOne` falhará se nenhuma ou mais de uma requisição for feita para essa URL.
      const req = httpTestingController.expectOne(expectedUrl);
      
      // Verificamos o método da requisição
      expect(req.request.method).toEqual('POST');

      // Verificamos o corpo da requisição
      // O ID da mensagem deve ser o mesmo que a função retornou
      expect(req.request.body.mensagemId).toEqual(returnedId);
      expect(req.request.body.conteudoMensagem).toEqual(messageContent);

      // Verificamos que o ID retornado é uma string válida (não vazia)
      expect(typeof returnedId).toBe('string');
      expect(returnedId.length).toBeGreaterThan(0);
      
      // Respondemos à requisição para que o .subscribe() dentro do serviço seja completado
      req.flush({}); 
    });
  });

  describe('receberStatusUpdates', () => {
    it('deve escutar o evento "status_update" do socket', () => {
      // Criamos um "espião" na nossa instância mock do socket
      const fromEventSpy = spyOn(mockSocket, 'fromEvent').and.returnValue(of(null));

      // Act: Chamamos o método
      service.receberStatusUpdates();

      // Assert: Verificamos se `fromEvent` foi chamado com o nome do evento correto
      expect(fromEventSpy).toHaveBeenCalledWith('status_update');
      expect(fromEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});