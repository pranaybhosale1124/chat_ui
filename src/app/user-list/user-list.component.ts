import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() showHeader: boolean = true
  users: any[] = [];
  friendId:any=null;
  currentUserId: any = null
  
  isUserListVisible: boolean = true;
  isDesktopView: boolean = false;


  constructor(private appSerice: AppService, private router: Router) { }

  ngOnInit(): void {
    this.checkIfDesktop();
    window.addEventListener('resize', this.checkIfDesktop.bind(this));

    this.currentUserId = sessionStorage.getItem('currentUserId');
    console.log("currentUserId:::", this.currentUserId);

    this.appSerice.getAllUsers().subscribe((users: any) => {
      console.log(users);
      this.users = users.data;
    });
  }


  goToChat(friendId: string): void {
    // this.router.navigate(['/chat', friendId]);
    this.friendId=friendId
    this.toggleView()
  }


  checkIfDesktop() {
    this.isDesktopView = window.innerWidth >= 768;
  }

  toggleView() {
    if(!this.isDesktopView)
      this.isUserListVisible = !this.isUserListVisible;
  }

}
