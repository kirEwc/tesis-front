import { Component, EventEmitter, Input, Output, OnInit,ViewChild } from '@angular/core';
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
export class MessagesTabComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Output() conversationOpened = new EventEmitter<void>();
  @ViewChild(ConversationComponent) conversationComponent!: ConversationComponent;
  
  activeChat: string = 'Mensajes';

  ngOnInit(): void {
    // Inicializar componente
    console.log('MessagesTabComponent inicializado');
  }

  public switchChat(tabId: string) {
    this.activeChat = tabId;
  }
  public getActiveChat() {
    return this.activeChat;
  }
  
  public nuevaConversacion() {
    // Switch to the chat view
    this.activeChat = 'CHAT';
    
    // If conversation component is available, trigger new conversation
    if (this.conversationComponent) {
      this.conversationComponent.nuevaConversacion();
    }
  }
}