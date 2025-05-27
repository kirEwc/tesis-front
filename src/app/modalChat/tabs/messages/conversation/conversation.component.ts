import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

interface Message {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: Date;
}
interface ChatResponse {
  data: {
    Chat_id: string;
    Create_At: string;
    user: {
      Userid: string;
      Email: string;
      Name: string;
      created_At: string;
    };
  }[];
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
  IdChatEnUso: number = 0;

  switchChat(tabId: string) {
    this.backToMessages.emit(tabId);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMaxChatId().subscribe({
      next: (chatId) => {
        this.cargarMensajes(chatId);
        this.IdChatEnUso = chatId;
      },
      error: (err) => {
        console.error('❌ Error obteniendo el chat ID:', err);
        // Fallback si falla, usa un ID por defecto
        this.cargarMensajes(4);
        this.IdChatEnUso = 4;
      }
    });
  }
  
 

  sendMessage(idchat: number = this.IdChatEnUso) {
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


  cargarMensajes(idchat: number = this.IdChatEnUso) {
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


  
  getMaxChatId(userId: number=1): Observable<number> {
    return this.http.get<ChatResponse>(`http://localhost:3000/Chat/${userId}`).pipe(
      map((response) => {
        if (!response?.data?.length) return 0;

        // Convertimos los Chat_id a number y devolvemos el máximo
        const maxId = Math.max(...response.data.map(chat => Number(chat.Chat_id)));
        return maxId;
      }),
      catchError((error) => {
        console.error('Error obteniendo los chats:', error);
        return throwError(() => new Error('Error obteniendo los chats'));
      })
    );
  }


  limpiarChat(){
    this.http.delete<any>(`http://localhost:3000/Chat/${this.IdChatEnUso}`)
     .subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('❌ Error al limpiar la conversación:', err);
      },
      complete: () => {
        this.nuevaConversacion();
      }
     })
  }

  public nuevaConversacion(){
     this.http.post<any>(`http://localhost:3000/Chat/1`,{})
     .subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('❌ Error al crear la conversación:', err);
      }
     })

     this.getMaxChatId().subscribe({
      next: (chatId) => {
        this.cargarMensajes(chatId);
        this.IdChatEnUso = chatId;
      },
      error: (err) => {
        console.error('❌ Error obteniendo el chat ID:', err);
        // Fallback si falla, usa un ID por defecto
        this.cargarMensajes(4);
        this.IdChatEnUso = 4;
      }
    });

    this.switchChat('CHAT');
  }


}