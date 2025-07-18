import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notificar';

  constructor(private http: HttpClient, private socket: Socket) {}

  /**
   * Envia a notificação para o backend via HTTP.
   * @param conteudo O texto da mensagem.
   * @returns O ID da mensagem gerado.
   */
  enviarNotificacao(conteudo: string) {
    const mensagemId = uuidv4(); // Gera um ID único
    const payload = {
      mensagemId: mensagemId,
      conteudoMensagem: conteudo,
    };

    // Envia a requisição POST para o backend
    this.http.post(this.apiUrl, payload).subscribe();

    return mensagemId;
  }

  /**
   * Retorna um Observable que emite as atualizações de status recebidas via WebSocket.
   */
  receberStatusUpdates() {
    // Escuta o evento 'status_update' que o backend emite
    return this.socket.fromEvent('status_update');
  }
}