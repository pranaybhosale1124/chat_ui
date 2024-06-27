import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chat_ui';

  constructor(private appService:AppService){}

  ngOnInit(){
    let currentUserId= sessionStorage.getItem('currentUserId');
    this.appService.register(currentUserId)
  }
}
