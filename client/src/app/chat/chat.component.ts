import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Event, Message, User, Typing } from '../_models';
import { AlertService, SocketService, AuthenticationService } from '../_services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatView') private chatContainer: ElementRef;

  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  currentUser: User;
  TypeTimer: any;
  status: Object = {};
  objectKeys = Object.keys;

  constructor(
    private alertService: AlertService,
    private socketService: SocketService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = authenticationService.getCurrentUser();
  }

  ngOnInit(): void {
    this.initIoConnection();

    this.socketService.fetchMessage()
      .subscribe(
        messages => {
          this.messages = messages;
        },
        error => {
          this.alertService.error(error.error.error?error.error.error:error.message);
        });

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {

    }
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.ioConnection = this.socketService.statusMessage()
      .subscribe((status: Typing) => {
        this.status[status.username] = status.type;
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.JOIN)
      .subscribe(() => {
        console.log('joined');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.sendMessage(message)
      .subscribe(
        data => {
          this.socketService.emitMessage(data);
          this.messageContent = null;
        },
        error => {
          this.alertService.error(error.error.error?error.error.error:error.message);
        });
  }

  public keyChange(): void {
    window.clearTimeout(this.TypeTimer);
    this.socketService.typeMessage({username:this.currentUser.username, type:true});
  }

  public keyUp(): void {
    let that = this;
    window.clearTimeout(this.TypeTimer);
    this.TypeTimer= window.setTimeout( function() {
      that.socketService.typeMessage({username:that.currentUser.username, type:false});
     }, 3000);
  }

  public keyDown(): void {
    window.clearTimeout(this.TypeTimer);
    this.socketService.typeMessage({username:this.currentUser.username, type:true});
  }
}
