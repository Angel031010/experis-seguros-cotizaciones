import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: any;
  password: any;
  onLogin() {
    throw new Error('Method not implemented.');
  }

}
