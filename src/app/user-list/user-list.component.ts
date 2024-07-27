import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaySoundService } from '../play-sound.service';

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
    private playSoundService: PlaySoundService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.checkIfDesktop();
    window.addEventListener('resize', this.checkIfDesktop.bind(this));
    this.fetchChatList()
  }

  async fetchChatList() {
    this.currentUserId = sessionStorage.getItem('currentUserId');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');

    this.appService.getAllUsers(this.currentUserId).subscribe(async (alUsers: any) => {
      const fetchedUsers = alUsers.data;
      this.users = await this.mergeUsers(this.users, fetchedUsers);
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
    if (data.senderId != this.currentUserId)
      this.playSoundService.playNotificationSound()
    const userIndex = this.users.findIndex(user => user.user_id == data.senderId || user.user_id == data.recipientId);
    if (userIndex !== -1) {
      // Existing user
      const sender = this.users[userIndex];
      if (sender.user_id == data.senderId && sender.user_id != this.friendId)
        sender.notViewed = true; // Mark as not viewed
      this.users.splice(userIndex, 1);
      this.users = [sender, ...this.users];
      localStorage.setItem('users', JSON.stringify(this.users));
    } else {
      // New user
      const newUserId = data.senderId;
      this.appService.getUserById(newUserId).subscribe(newUserDetails => {
        const newUser = { ...newUserDetails.data, notViewed: true }; // Add notViewed property
        this.users = [newUser, ...this.users]; // Add the new user to the beginning of the array
        localStorage.setItem('users', JSON.stringify(this.users));
      });
    }
  }


  async mergeUsers(localUsers: any[], fetchedUsers: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const localUsersMap = localUsers.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});

      fetchedUsers = fetchedUsers.filter((el) => {
        return !localUsersMap[el.user_id]
      })
      fetchedUsers.forEach((el) => {
        localUsersMap[el.user_id] = el
      })
      localUsers = [...localUsers, ...fetchedUsers]
      this.appService.getUnreadChats(this.currentUserId).subscribe((unreadChatIds: any) => {
        for (let i = 0; i < localUsers.length; i++) {
          const usrId = "" + localUsers[i].user_id;
          if (unreadChatIds.includes(usrId)) {
            this.playSoundService.playNotificationSound()
            localUsers[i].notViewed=true;
            let temp = JSON.parse(JSON.stringify(localUsers[i]))
            localUsers.splice(i,1)
            localUsers = [...[temp], ...localUsers]
          }
        }
        resolve(localUsers);
      })
    })
  }

  killAciveChat() {
    this.friendId = null
  }

}
