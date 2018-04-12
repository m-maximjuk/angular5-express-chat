import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../_services';

@Component({
  moduleId: module.id,
  selector: 'alert',
  template: `<div *ngIf="message" [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }">{{message.text}}</div>`
})

export class AlertComponent implements OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { 
    // subscribe to alert messages
    this.subscription = alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnDestroy(): void {
    // unsubscribe on destroy to prevent memory leaks
    this.subscription.unsubscribe();
  }
}