import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Observable, of } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user: any;
  editable: boolean;
  editMode: boolean = false;

  constructor(
    private appService:AppService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient  // Inject HttpClient
  ) {
    this.user = data.user;
    this.editable = data.editable;
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleEditMode(): void {
    if (this.editMode) {
      this.updateUser();
    }
    this.editMode = !this.editMode;
  }

  updateUser(): void {
    this.appService.updateUser(this.user).subscribe(response => {
      console.log('User updated:', response);
      this.appService.setCurrentUser(response);
    });
  }

  mockApiCall(updatedUser: any): Observable<any> {
    // Mock API call
    console.log('Mock API call with user data:', updatedUser);
    return of(updatedUser); // Replace with actual HTTP request in real implementation
  }
}
