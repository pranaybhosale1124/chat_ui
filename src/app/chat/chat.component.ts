import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiPickerDialogComponent } from '../emoji-picker-dialog/emoji-picker-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../app.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { PlaySoundService } from '../play-sound.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {

  newMessage: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('chatMessages') private chatMessages!: ElementRef;
  @Input() friendId: any;
  @Output() newMessageEvent = new EventEmitter<string>();
  friend: any;
  currentUser: any;
  messages: any = [];
  searchText: string = '';
  searchEnabled: boolean = false;
  showSpinner: boolean = false
  constructor(
    private appService: AppService,
    private playSoundService: PlaySoundService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMessage()
  }

  ngOnChanges() {
    this.currentUser = sessionStorage.getItem('currentUserId');
    if (this.friendId) {
      this.showSpinner = true
      this.appService.getUserById(this.friendId).subscribe((res) => {
        this.friend = res.data
      })
      this.appService.getChat(this.currentUser, this.friendId).subscribe((chat) => {
        // // sessionStorage.setItem(this.friend.user_id, JSON.stringify(chat.chat_data))
        this.messages = chat.chat_data
        this.showSpinner = false
      })
    } else {
      this.friend = null
    }
  }

  ngAfterViewChecked() {
    // Scroll to the bottom when the view initializes
    if (this.chatMessages) {
      this.scrollToBottom()
    }
  }

  scrollToBottom(): void {
    const container = this.chatMessages.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  getMessage() {

    this.appService.getMessage().subscribe((data: any) => {
      this.newMessageEvent.emit(data);
      if (data.senderId != this.friend?.user_id) {
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
      this.playSoundService.playSentSound()
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

  sendHiiMessage() {
    this.newMessage = 'Hii';
    this.sendMessage();
  }


  ngOnDestroy() {
    // // // sessionStorage.removeItem(this.friend.user_id)
  }
}