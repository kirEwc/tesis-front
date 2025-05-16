import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Message {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  private typingEffect: ReturnType<typeof setInterval> | null = null;

  constructor(private http: HttpClient) {
    // Inicializar con un mensaje de bienvenida
    this.messages.push({
      content: 'Hola, ¿en qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    });
  }

  
  sendMessage() {
    const userMessage = this.newMessage.trim();
    if (!userMessage) return;
  
    this.messages.push({
      content: userMessage,
      isUser: true
    });
  
    this.newMessage = '';
    this.isTyping = true;
  
    // Agrega mensaje vacío con indicador de escritura
    this.messages.push({
      content: '',
      isUser: false,
      isTyping: true
    });
  
    this.http.post<{ respuesta: string }>('http://localhost:3000/ask-question', {
      pregunta: userMessage
    }).subscribe({
      next: (res) => {
        const fullResponse = res.respuesta;
        let currentText = '';
        let index = 0;
  
        // Animar letra por letra
        const interval = setInterval(() => {
          if (index < fullResponse.length) {
            currentText += fullResponse[index];
            this.messages[this.messages.length - 1].content = currentText;
            index++;
            this.scrollToBottom();
          } else {
            clearInterval(interval);
            this.messages[this.messages.length - 1].isTyping = false;
            this.isTyping = false;
          }
        }, 25); // velocidad de escritura
  
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        this.messages[this.messages.length - 1] = {
          content: '⚠️ Error al obtener la respuesta del servidor.',
          isUser: false
        };
        this.isTyping = false;
      }
    });
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) { console.error(err); }
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