import { Component } from '@angular/core';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {

  // sendMessage(): void {
    //   if (this.message.trim()) {
  //     // Añadir el mensaje del usuario
  //     const newUserMessage: Message = {
    //       id: this.messages.length + 1,
  //       text: this.message,
  //       sender: "user",
  //       timestamp: new Date(),
  //       read: true,
  //     }
  //     this.messages.push(newUserMessage)

  //     // Simular respuesta del agente después de un breve retraso
  //     setTimeout(() => {
    //       const randomAgentId = Math.floor(Math.random() * this.supportAgents.length) + 1
  //       const newAgentMessage: Message = {
  //         id: this.messages.length + 1,
  //         text: "Gracias por tu mensaje. Un agente te responderá lo antes posible.",
  //         sender: "agent",
  //         timestamp: new Date(),
  //         read: false,
  //         agentId: randomAgentId,
  //       }
  //       this.messages.push(newAgentMessage)
  //     }, 1000)

  //     this.message = ""
  //     this.activeConversation = true
  //   }
  // }
}