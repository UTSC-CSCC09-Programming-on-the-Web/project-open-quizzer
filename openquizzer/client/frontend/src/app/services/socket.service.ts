import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor() {
    this.socket = io(environment.apiBaseUrl.replace('/api', ''));

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connectedSubject.next(false);
    });
  }

  // Quiz Taker Methods
  joinQuiz(quizCode: string, nickname: string): void {
    this.socket.emit('join-quiz', { quizCode, nickname });
  }

  submitAnswer(answer: string): void {
    this.socket.emit('submit-answer', { answer });
  }

  // Quiz Master Methods
  activateQuiz(quizId: string): void {
    this.socket.emit('activate-quiz', quizId);
  }

  closeQuiz(quizId: string): void {
    this.socket.emit('close-quiz', quizId);
  }

  // Event Listeners
  onQuizJoined(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('quiz-joined', (data) => observer.next(data));
    });
  }

  onJoinError(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('join-error', (data) => observer.next(data));
    });
  }

  onAnswerConfirmed(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('answer-confirmed', (data) => observer.next(data));
    });
  }

  onAnswerError(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('answer-error', (data) => observer.next(data));
    });
  }

  onQuizClosed(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('quiz-closed', (data) => observer.next(data));
    });
  }

  // Quiz Master Event Listeners
  onParticipantJoined(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('participant-joined', (data) => observer.next(data));
    });
  }

  onAnswerSubmitted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('answer-submitted', (data) => observer.next(data));
    });
  }

  onParticipantLeft(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('participant-left', (data) => observer.next(data));
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
