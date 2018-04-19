import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

import { Message, Event, User } from '../_models';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  private socket;
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.currentUser = authenticationService.getCurrentUser();
  }

  public initSocket(): void {
    this.socket = socketIo(environment.API_URL);
  }

  public emitMessage(message: any): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('thread', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public sendMessage(body: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/api/chat/send`, { message: body })
      .map(data => {
        const message = {
          _id: this.makeid(),
          body: body,
          author: {
            _id: this.currentUser._id,
            username: this.currentUser.username
          },
          createdAt: moment()
        }
        return message;
      });
  }

  public fetchMessage(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/api/chat`)
      .map(data => {
        return data.messages;
      });
  }

  private makeid(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
