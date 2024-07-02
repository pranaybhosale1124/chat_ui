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
    private appSerice: AppService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.checkIfDesktop();
    window.addEventListener('resize', this.checkIfDesktop.bind(this));

    this.currentUserId = sessionStorage.getItem('currentUserId');

    this.appSerice.getAllUsers(this.currentUserId).subscribe((users: any) => {
      this.users = users.data;
    });
  }


  goToChat(friendId: string): void {
    // this.router.navigate(['/chat', friendId]);
    this.friendId = friendId
    this.toggleView()
  }


  checkIfDesktop() {
    this.isDesktopView = window.innerWidth >= 768;
  }

  toggleView() {
    if (!this.isDesktopView)
      this.isUserListVisible = !this.isUserListVisible;
  }

  newMessage(data:any) {
    const userIndex = this.users.findIndex(user => (user.user_id == data.senderId || user.user_id == data.recipientId));
    if (userIndex !== -1) {
      // Sender found in the users array
      const sender = this.users[userIndex];
      this.users.splice(userIndex, 1); // Remove the sender from its current position
      this.users=[sender, ...this.users]; // Add the sender to the beginning of the array
    }
    // if(data.senderId!=this.friendId || data.senderId==this.currentUserId){
    //   return
    // }
    // this._snackBar.open(`new Message`, '', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 1000
    // });
  }
}
