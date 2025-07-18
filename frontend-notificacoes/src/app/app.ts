import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacaoComponent } from './notificacao/notificacao'; // Importe o componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacaoComponent],
  template: `
    <main>
      <app-notificacao></app-notificacao>
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  title = 'frontend-notificacoes';
}