// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonDirective, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;

  constructor(
    private appService: AppService,
    private router: Router,
    private socialAuthService: SocialAuthService) { }

    ngOnInit(){
      this.login()
    }

  login() {
    this.socialAuthService.authState.subscribe((user) => {
      sessionStorage.setItem('google_id_token',user.idToken );
      this.appService.loginByGoogle(user.idToken).subscribe((user:any)=>{
        sessionStorage.setItem('currentUserId', user.user_id)
        let currentUser=JSON.stringify(user)
        sessionStorage.setItem('currentUser', currentUser)
        this.appService.setCurrentUser(user);
        this.router.navigate(['/']);
      },
      (err)=>{
        console.log(err);
      }
    )
    });
  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
