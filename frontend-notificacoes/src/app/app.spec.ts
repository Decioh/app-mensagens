import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Socket } from 'ngx-socket-io';

// Mock simples para o Socket
class MockSocket {
  fromEvent() { return { subscribe: () => {} }; }
  emit() {}
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Socket, useClass: MockSocket }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});