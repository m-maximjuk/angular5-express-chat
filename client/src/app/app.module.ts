import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AlertComponent } from './_directives';
import { AuthGuard, UnauthGuard } from './_guards';
import { AlertService, AuthenticationService } from './_services';
import { JwtInterceptor } from './_helpers';
import { PasswordComponent } from './password';
import { ChatComponent } from './chat';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    PasswordComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    PasswordStrengthBarModule,
  ],
  providers: [
    AuthGuard,
    UnauthGuard,
    AlertService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
