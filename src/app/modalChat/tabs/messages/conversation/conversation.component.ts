import { Component, ElementRef, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError, switchMap } from 'rxjs';

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
  
  newId: number = 0;
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
    this.inicializarChat();
  }

  private inicializarChat() {
    this.getMaxChatId().subscribe({
      next: (chatId) => {
        console.log('💬 Chat ID obtenido:', chatId);
        
        if (chatId === 0 || chatId === null || chatId === undefined) {
          console.log('🆕 No hay chats existentes, creando nuevo chat...');
          this.crearNuevoChat();
        } else {
          this.newId = chatId;
          this.IdChatEnUso = chatId;
          console.log('📥 Cargando mensajes del chat:', chatId);
          this.cargarMensajes(this.newId);
        }
      },
      error: (err) => {
        console.error('❌ Error obteniendo el chat ID:', err);
        // Si falla, crear un nuevo chat como fallback
        this.crearNuevoChat();
      }
    });
  }

  private crearNuevoChat() {
    this.http.post<any>(`http://localhost:3000/Chat/1`, {})
      .pipe(
        switchMap(() => {
          // Después de crear el chat, obtener el nuevo ID
          return this.getMaxChatId();
        })
      )
      .subscribe({
        next: (nuevoId) => {
          console.log('✅ Nuevo chat creado con ID:', nuevoId);
          this.newId = nuevoId;
          this.IdChatEnUso = nuevoId;
          
          // Agregar mensaje de bienvenida
          this.messages = [{
            content: 'Hola, ¿en qué puedo ayudarte hoy?',
            isUser: false,
            timestamp: new Date()
          }];
          
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('❌ Error creando nuevo chat:', err);
          // Fallback con ID por defecto
          this.IdChatEnUso = 1;
          this.messages = [{
            content: 'Error al inicializar el chat. Por favor, recarga la página.',
            isUser: false,
            timestamp: new Date()
          }];
        }
      });
  }

  sendMessage(idchat: number = this.IdChatEnUso) {
    const userMessage = this.newMessage.trim();
    if (!userMessage) return;

    // Validar que tenemos un chat válido
    if (!this.IdChatEnUso || this.IdChatEnUso === 0) {
      console.error('❌ No hay chat activo');
      return;
    }

    this.messages.push({
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    this.newMessage = '';
    this.isTyping = true;

    // Agrega mensaje vacío con indicador de escritura
    this.messages.push({
      content: '',
      isUser: false,
      isTyping: true
    });

    this.scrollToBottom();

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

        // Limpiar cualquier intervalo previo
        if (this.typingEffect) {
          clearInterval(this.typingEffect);
        }

        this.typingEffect = setInterval(() => {
          if (index < fullResponse.length) {
            currentText += fullResponse[index];
            this.messages[this.messages.length - 1].content = currentText;
            index++;
            this.scrollToBottom();
          } else {
            this.stopTypingEffect();
          }
        }, 25);
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        this.messages[this.messages.length - 1] = {
          content: '⚠️ Error al obtener la respuesta del servidor.',
          isUser: false,
          timestamp: new Date()
        };
        this.isTyping = false;
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.chatContainer?.nativeElement) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      } catch(err) { 
        console.error('Error en scroll:', err); 
      }
    }, 100);
  }

  stopMessage() {
    this.stopTypingEffect();
  }

  private stopTypingEffect() {
    if (this.typingEffect) {
      clearInterval(this.typingEffect);
      this.typingEffect = null;
      
      // Verificar que el array de mensajes no esté vacío
      if (this.messages.length > 0) {
        this.messages[this.messages.length - 1].isTyping = false;
      }
      this.isTyping = false;
    }
  }

  cargarMensajes(idchat: number = this.IdChatEnUso) {
    if (!idchat || idchat === 0) {
      console.warn('⚠️ ID de chat inválido para cargar mensajes:', idchat);
      return;
    }

    console.log('📥 Cargando mensajes del chat:', idchat);
    
    this.http.get<any>(`http://localhost:3000/Chat/GetMessagesByChat/${idchat}`).subscribe({
      next: (res) => {
        console.log('📨 Respuesta del servidor:', res);
        
        if (res.data && res.data.message && Array.isArray(res.data.message)) {
          // Limpiar mensajes existentes
          this.messages = [];
          
          // Mapear los mensajes al formato esperado por el componente
          res.data.message.forEach((msg: any) => {
            // Mensaje del usuario
            if (msg.content && msg.content.trim()) {
              this.messages.push({
                content: msg.content,
                isUser: true,
                timestamp: new Date(msg.create_At)
              });
            }
            
            // Respuesta del agente
            if (msg.response && msg.response.trim()) {
              this.messages.push({
                content: msg.response,
                isUser: false,
                timestamp: new Date(msg.create_At)
              });
            }
          });
          
          // Si no hay mensajes, agregar mensaje de bienvenida
          if (this.messages.length === 0) {
            this.messages.push({
              content: 'Hola, ¿en qué puedo ayudarte hoy?',
              isUser: false,
              timestamp: new Date()
            });
          }
          
          console.log('✅ Mensajes cargados:', this.messages.length);
          this.scrollToBottom();
        } else {
          console.log('📭 No hay mensajes en este chat');
          // Agregar mensaje de bienvenida si no hay mensajes
          this.messages = [{
            content: 'Hola, ¿en qué puedo ayudarte hoy?',
            isUser: false,
            timestamp: new Date()
          }];
          this.scrollToBottom();
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar mensajes:', err);
        // Mostrar mensaje de error al usuario
        this.messages = [{
          content: 'No se pudieron cargar los mensajes. Por favor, intenta nuevamente.',
          isUser: false,
          timestamp: new Date()
        }];
      }
    });
  }

  getMaxChatId(userId: number = 1): Observable<number> {
    return this.http.get<ChatResponse>(`http://localhost:3000/Chat/${userId}`).pipe(
      map((response) => {
        console.log('🔍 Respuesta de chats:', response);
        
        if (!response?.data?.length) {
          console.log('📭 No hay chats existentes');
          return 0;
        }

        // Convertimos los Chat_id a number y devolvemos el máximo
        const chatIds = response.data.map(chat => Number(chat.Chat_id)).filter(id => !isNaN(id));
        
        if (chatIds.length === 0) {
          console.log('📭 No hay IDs de chat válidos');
          return 0;
        }
        
        const maxId = Math.max(...chatIds);
        console.log('🎯 ID máximo encontrado:', maxId);
        return maxId;
      }),
      catchError((error) => {
        console.error('❌ Error obteniendo los chats:', error);
        return throwError(() => new Error('Error obteniendo los chats'));
      })
    );
  }

  limpiarChat(IdChat: number = this.IdChatEnUso) {
    if (IdChat === 0) {
      this.nuevaConversacion();
      return;
    }

    this.http.delete<any>(`http://localhost:3000/Chat/${IdChat}`)
      .subscribe({
        next: (res) => {
          console.log('🗑️ Chat eliminado:', res);
        },
        error: (err) => {
          console.error('❌ Error al limpiar la conversación:', err);
        },
        complete: () => {
          this.nuevaConversacion();
        }
      });
  }

  public nuevaConversacion() {
    this.http.post<any>(`http://localhost:3000/Chat/1`, {})
      .pipe(
        switchMap(() => {
          // Después de crear el chat, obtener el nuevo ID
          return this.getMaxChatId();
        })
      )
      .subscribe({
        next: (nuevoId) => {
          console.log('✅ Nueva conversación creada con ID:', nuevoId);
          this.newId = nuevoId;
          this.IdChatEnUso = nuevoId;
          
          // Limpiar mensajes y agregar mensaje de bienvenida
          this.messages = [{
            content: 'Hola, ¿en qué puedo ayudarte hoy?',
            isUser: false,
            timestamp: new Date()
          }];
          
          this.scrollToBottom();
          this.switchChat('CHAT');
        },
        error: (err) => {
          console.error('❌ Error al crear nueva conversación:', err);
        }
      });
  }
}