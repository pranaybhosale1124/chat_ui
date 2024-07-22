import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() showHeader: boolean = true
  users: any[] = [];
  friendId: any = null;
  currentUserId: any = null

  isUserListVisible: boolean = true;
  isDesktopView: boolean = false;


  constructor(
    private appService: AppService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.checkIfDesktop();
    window.addEventListener('resize', this.checkIfDesktop.bind(this));

    this.currentUserId = sessionStorage.getItem('currentUserId');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');

    this.appService.getAllUsers(this.currentUserId).subscribe((response: any) => {
      const fetchedUsers = response.data;
      this.users = this.mergeUsers(this.users, fetchedUsers);
      localStorage.setItem('users', JSON.stringify(this.users));
    });
  }

  goToChat(friendId: string): void {
    this.friendId = friendId;
    this.toggleView();
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.user_id == friendId) {
        user.notViewed = false;
        localStorage.setItem('users', JSON.stringify(this.users));
        break;
      }
    }
  }

  checkIfDesktop() {
    this.isDesktopView = window.innerWidth >= 768;
  }

  toggleView() {
    if (!this.isDesktopView) {
      this.isUserListVisible = !this.isUserListVisible;
    }
  }

  newMessage(data: any) {
    const userIndex = this.users.findIndex(user => user.user_id === data.senderId || user.user_id === data.recipientId);

    if (userIndex !== -1) {
      // Existing user
      const sender = this.users[userIndex];
      if (userIndex === data.senderId)
        sender.notViewed = true; // Mark as not viewed
      this.users.splice(userIndex, 1);
      this.users = [sender, ...this.users];
      localStorage.setItem('users', JSON.stringify(this.users));
    } else {
      // New user
      const newUserId = data.senderId;
      this.appService.getUserById(newUserId).subscribe(newUserDetails => {
        let nw = false
        if (userIndex === data.senderId)
          nw = userIndex === data.senderId
        const newUser = { ...newUserDetails.data, notViewed: nw }; // Add notViewed property
        this.users = [newUser, ...this.users]; // Add the new user to the beginning of the array
        localStorage.setItem('users', JSON.stringify(this.users));
      });
    }
  }


  mergeUsers(localUsers: any[], fetchedUsers: any[]): any[] {
    const mergedUsers = [...localUsers];

    fetchedUsers.forEach(fetchedUser => {
      const existingUserIndex = localUsers.findIndex(localUser => localUser.user_id === fetchedUser.user_id);
      if (existingUserIndex === -1) {
        mergedUsers.push(fetchedUser);
      }
    });

    return mergedUsers;
  }
}
