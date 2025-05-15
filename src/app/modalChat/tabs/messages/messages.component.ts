import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from "./conversation/conversation.component";

interface Message {
  id: number;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  read: boolean;
  agentId?: number;
}



@Component({
  selector: 'app-messages-tab',
  standalone: true,
  imports: [CommonModule, ConversationComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesTabComponent {
  @Input() messages: Message[] = [];
  @Output() conversationOpened = new EventEmitter<void>();
  


  openConversation(): void {
    this.conversationOpened.emit();
  }

}