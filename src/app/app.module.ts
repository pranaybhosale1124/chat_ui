import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppService } from './app.service';
import { UserListComponent } from './user-list/user-list.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './user-list/header/header.component';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChatComponent } from './chat/chat.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// pipes
import { TimeAgoPipe } from './pipes/time-ago.pipe';

import { EmojiPickerDialogComponent } from './emoji-picker-dialog/emoji-picker-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatHeaderComponent } from './chat/chat-header/chat-header.component';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DefaultChatComponent } from './chat/default-chat/default-chat.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { SearchHighlightPipe } from './pipes/search-highlight.pipe';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
// import { MyInterceptor } from './my-interceptor.interceptor';
//directives


const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    HeaderComponent,
    ChatComponent,
    TimeAgoPipe,
    EmojiPickerDialogComponent,
    ChatHeaderComponent,
    LoginComponent,
    UserProfileComponent,
    DefaultChatComponent,
    SearchFilterPipe,
    SearchHighlightPipe,
  ],
  imports: [
    //google sign In
    SocialLoginModule,
    GoogleSigninButtonModule,

    //Socket
    SocketIoModule.forRoot(socketConfig),

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    PickerComponent,
    FlexLayoutModule,

    //Angular Material
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    MatSnackBarModule

  ],
  providers: [
    AppService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '812383719002-m9ng6v57jds0cd452f15nlq7lomivtca.apps.googleusercontent.com'    //ClientID
            )
          }
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
