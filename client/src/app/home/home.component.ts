import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services';
import { User } from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(public authenticationService: AuthenticationService,) {
    this.currentUser = authenticationService.getCurrentUser();
  }

  ngOnInit() {}
}
