import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  private typingEffect: any;

  sendMessage() {
    if (this.newMessage.trim()) {
      // Agregar mensaje del usuario
      this.messages.push({
        content: this.newMessage,
        isUser: true
      });

      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isTyping = true;

      // Simular respuesta después de 3 segundos
      setTimeout(() => {
        const response = `Respuesta a: ${userMessage}`;
        let displayedText = '';
        this.messages.push({
          content: '',
          isUser: false,
          isTyping: true
        });

        // Simular efecto de escritura
        this.typingEffect = setInterval(() => {
          if (displayedText.length < response.length) {
            displayedText += response[displayedText.length];
            this.messages[this.messages.length - 1].content = displayedText;
            this.scrollToBottom();
          } else {
            this.stopTypingEffect();
          }
        }, 50);
      }, 3000);

      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) { console.error(err);}
    }, 100);
  }

  stopMessage() {
    this.stopTypingEffect();
  }

  private stopTypingEffect() {
    if (this.typingEffect) {
      clearInterval(this.typingEffect);
      this.typingEffect = null;
      this.messages[this.messages.length - 1].isTyping = false;
      this.isTyping = false;
    }
  }
}
