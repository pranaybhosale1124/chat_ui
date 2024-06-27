import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser!: any;

  constructor(
    private appService: AppService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.appService.currentUser$.subscribe((user: any) => {
      if(!user){
        this.currentUser=JSON.parse(sessionStorage.getItem('currentUser') as string)
        this.appService.setCurrentUser(this.currentUser)
      }
      else
        this.currentUser=user;
    })
  }
  openUserProfile(): void {
    this.dialog.open(UserProfileComponent, {
      width: '90%',
      height: '90%',
      data: {
        'user': this.currentUser,
        'editable': true
      }
    });
  }
}
