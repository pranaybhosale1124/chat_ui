import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiPickerDialogComponent } from '../emoji-picker-dialog/emoji-picker-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../app.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges {

  newMessage: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @Input() friendId: any;
  @Input() friend: any;
  currentUser: any;
  messages: any = [];
  searchText: string = '';
  searchEnabled: boolean = false;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.currentUser = sessionStorage.getItem('currentUserId');
    this.appService.getUserById(this.friendId).subscribe((res) => {
      this.friend = res.data
      this.getMessage()
    })
    if (this.friendId) {
      this.appService.getChat(this.currentUser, this.friendId).subscribe((chat) => {
        // // sessionStorage.setItem(this.friend.user_id, JSON.stringify(chat.chat_data))
        this.messages = chat.chat_data
      })
    }
  }

  getMessage() {
    this.appService.getMessage().subscribe((data: any) => {
      console.log(data);

      if (data.senderId != this.friend.user_id) {
        alert(`new Message from ${data.senderId}`)
        return;
      }

      this.messages.push(
        { sender: data.senderId, message: data.message, timestamp: new Date() },
      );
      this.updateLocalChatMemory();

    })

  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ senderId: this.currentUser, message: this.newMessage, timestamp: new Date() });
      // Handle sending message to the server here
      this.appService.sendMessage(this.currentUser, this.friend.user_id, this.newMessage)
      this.updateLocalChatMemory()
      this.newMessage = '';

    }
  }

  toggleEmojiPicker(): void {
    const dialogRef = this.dialog.open(EmojiPickerDialogComponent, {
    });

    dialogRef.componentInstance.emojiData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.newMessage += result.emoji;
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.destroy$.next();
    });
  }

  updateLocalChatMemory() {
    let updatedMessage = JSON.stringify(this.messages)
    // // sessionStorage.setItem(this.friend.user_id, updatedMessage);
  }

  toggleSearch() {
    this.searchEnabled = !this.searchEnabled;
  }



  ngOnDestroy() {
    // // // sessionStorage.removeItem(this.friend.user_id)
  }
}