import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs'; // Subject é útil para simular eventos

import { NotificacaoComponent } from './notificacao';
import { NotificationService } from '../services/notification.service';

// Mockamos nosso NotificationService
class MockNotificationService {
  // Usamos 'jasmine.createSpy' para ver a chamada do método
  enviarNotificacao = jasmine.createSpy('enviarNotificacao').and.returnValue('mock-uuid-123');
  
  // Usamos um Subject para simular a emissão de eventos do WebSocket
  private statusUpdateSubject = new Subject<{ mensagemId: string, status: string }>();
  
  receberStatusUpdates() {
    return this.statusUpdateSubject.asObservable();
  }

  // Simulamos o recebimento de um evento de atualização de status
  simulateStatusUpdate(update: { mensagemId: string, status: string }) {
    this.statusUpdateSubject.next(update);
  }
}

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let mockNotificationService: MockNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent, FormsModule], // Importamos o componente e o FormsModule
      // Fornecemos nosso serviço mockado
      providers: [{ provide: NotificationService, useClass: MockNotificationService }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    
    // Injetamos a instância do nosso serviço mockado para poder controlá-la
    mockNotificationService = TestBed.inject(NotificationService) as any;

    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve enviar uma notificação, adicionar à lista com status inicial e limpar o input', () => {
    // Mensagem de teste
    const testMessage = 'minha mensagem de teste';
    component.conteudoMensagem = testMessage;

    // Executa o método enviar
    component.enviar();

    // Verifica se o método enviarNotificacao foi chamado com a mensagem correta
    expect(mockNotificationService.enviarNotificacao).toHaveBeenCalledWith(testMessage);
    
    // Verifica se a mensagem foi adicionada à lista de notificações
    expect(component.notificacoes.length).toBe(1);
    
    // Verifica se a notificação tem o ID e status corretos
    expect(component.notificacoes[0].id).toBe('mock-uuid-123');
    expect(component.notificacoes[0].status).toBe('AGUARDANDO PROCESSAMENTO');
    
    // Verifica se o campo de input foi limpo
    expect(component.conteudoMensagem).toBe('');
  });

  it('deve atualizar o status de uma notificação ao receber um evento do WebSocket', () => {
    // Configuramos uma notificação inicial
    component.notificacoes = [{
      id: 'mock-uuid-123',
      content: 'mensagem antiga',
      status: 'AGUARDANDO PROCESSAMENTO'
    }];
    const update = { mensagemId: 'mock-uuid-123', status: 'PROCESSADO_SUCESSO' };

    // Simulamos o recebimento de um evento de atualização de status
    mockNotificationService.simulateStatusUpdate(update);
    fixture.detectChanges(); // Atualiza a view

    // Verifica se o status da notificação foi atualizado corretamente
    expect(component.notificacoes[0].status).toBe('PROCESSADO_SUCESSO');
  });
});