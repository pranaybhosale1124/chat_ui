import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-emoji-picker-dialog',
  templateUrl: './emoji-picker-dialog.component.html',
  styleUrls: ['./emoji-picker-dialog.component.scss']
})
export class EmojiPickerDialogComponent {

  private dataSubject = new Subject<any>();
  emojiData$ = this.dataSubject.asObservable();

  constructor(
    public dialogRef: MatDialogRef<EmojiPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public emojiData: any
  ) {}

  addEmoji(event: any) {
    this.dataSubject.next({ emoji: event.emoji.native });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
