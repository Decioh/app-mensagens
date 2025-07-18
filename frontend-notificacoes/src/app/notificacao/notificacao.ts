import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { NotificationService } from '../services/notification.service';

// Interface para tipar nosso objeto de notificação
export interface Notificacao {
  id: string;
  content: string;
  status: 'AGUARDANDO PROCESSAMENTO' | 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicione aqui
  templateUrl: './notificacao.html',
  styleUrl: './notificacao.scss',
})
export class NotificacaoComponent implements OnInit {
  conteudoMensagem: string = '';
  notificacoes: Notificacao[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Adicione o tipo 'any' ou 'unknown' ao parâmetro 'update'
    this.notificationService.receberStatusUpdates().subscribe((update: any) => {
      // O restante do código funciona da mesma forma
      const notificacao = this.notificacoes.find(n => n.id === update.mensagemId);
      if (notificacao) {
        // Garantimos que o status seja um dos tipos esperados
        notificacao.status = update.status as 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';
      }
    });
  }

  enviar(): void {
    if (!this.conteudoMensagem.trim()) return;

    const mensagemId = this.notificationService.enviarNotificacao(this.conteudoMensagem);

    // Adiciona imediatamente à lista com status inicial
    this.notificacoes.unshift({
      id: mensagemId,
      content: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
    });

    this.conteudoMensagem = ''; // Limpa o campo
  }
}