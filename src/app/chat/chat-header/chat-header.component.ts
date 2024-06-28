import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent {

  @Input() user: any;
  @Input() searchText: any;

  constructor(
    public dialog: MatDialog
  ) { }

  openUserProfile(): void {
    this.dialog.open(UserProfileComponent, {
      width: '90%',
      height: '90%',
      maxWidth:'500px',
      data: { 'user': this.user,
        editable:false
       }
    });
  }
}
