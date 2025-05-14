import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  id: number;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  read: boolean;
  agentId?: number;
}

interface SupportAgent {
  id: number;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-messages-tab',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesTabComponent {
  @Input() messages: Message[] = [];
  @Input() supportAgents: SupportAgent[] = [];
  @Output() conversationOpened = new EventEmitter<void>();
  


  openConversation(): void {
    this.conversationOpened.emit();
  }


}