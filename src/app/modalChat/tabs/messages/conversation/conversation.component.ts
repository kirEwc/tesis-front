import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
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
export class ConversationComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @Output() backToMessages = new EventEmitter<string>();
  
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  private typingEffect: ReturnType<typeof setInterval> | null = null;

  switchChat(tabId: string) {
    this.backToMessages.emit(tabId);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarMensajes(4); // Cargar mensajes con el chat_id por defecto 4
  }

  sendMessage(idchat: number = 4) {
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
  
    interface AskQuestionResponse {
      data: {
        content: string;
        response: string;
        create_At: string;
        chat: {
          Chat_id: string;
          Create_At: string;
        };
        Message_id: string;
      };
    }
  
    this.http.post<AskQuestionResponse>(`http://localhost:3000/ask-question/${idchat}`, {
      pregunta: userMessage
    }).subscribe({
      next: (res) => {
        const fullResponse = res.data.response;
        let currentText = '';
        let index = 0;
  
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
        }, 25);
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


  cargarMensajes(idchat: number = 4) {
    this.http.get<any>(`http://localhost:3000/Chat/GetMessagesByChat/${idchat}`).subscribe({
      next: (res) => {
        if (res.data && res.data.message) {
          // Limpiar mensajes existentes
          this.messages = [];
          
          // Mapear los mensajes al formato esperado por el componente
          res.data.message.forEach((msg: any) => {
            // Mensaje del usuario
            if (msg.content) {
              this.messages.push({
                content: msg.content,
                isUser: true,
                timestamp: new Date(msg.create_At)
              });
            }
            
            // Respuesta del agente
            if (msg.response) {
              this.messages.push({
                content: msg.response,
                isUser: false,
                timestamp: new Date(msg.create_At)
              });
            }
          });
          
          // Hacer scroll al final de los mensajes
          this.scrollToBottom();
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar mensajes:', err);
        // Mostrar mensaje de error al usuario
        this.messages = [{
          content: 'No se pudieron cargar los mensajes. Por favor, intenta nuevamente.',
          isUser: false
        }];
      }
    });
  }
}