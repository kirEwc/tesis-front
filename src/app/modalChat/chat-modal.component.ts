import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { HomeTabComponent } from "./tabs/home/home.component"
import { MessagesTabComponent } from "./tabs/messages/messages.component"
import { HelpTabComponent } from "./tabs/help/help.component"

interface ChatTopic {
  title: string
  description: string
}

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
  read: boolean
  agentId?: number
}

interface HelpArticle {
  id: number
  title: string
  content: string
  icon: string
}

@Component({
  selector: "app-chat-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, HomeTabComponent, MessagesTabComponent, HelpTabComponent],
  templateUrl: "./chat-modal.component.html",
  styleUrls: ["./chat-modal.component.scss"],
})
export class ChatModalComponent implements OnInit {
  isOpen = false
  message = ""
  activeTab: "inicio" | "mensajes" | "ayuda" = "inicio"
  searchQuery = ""

  supportAgents = [
    { id: 1, name: "Carlos", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Maria", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Alex", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  chatTopics: ChatTopic[] = [
    {
      title: "How to register and secure your account?",
      description: "Register Account, Take Care of Security, 2FA",
    },
    {
      title: "Welcome Bonuses",
      description: "Deposit bonus, Free Spins, Bonus Boost",
    },
    {
      title: "About BetFury",
      description: "Crypto Casino, slots, jackpots, news, social media",
    },
    {
      title: "Live Support chat rules",
      description: "Guidelines for using our live support service",
    },
  ]

  messages: Message[] = [
    {
      id: 1,
      text: "¡Bienvenido a BetFury! ¿En qué podemos ayudarte hoy?",
      sender: "agent",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      agentId: 1,
    },
    {
      id: 2,
      text: "Hola, tengo una pregunta sobre mi bono de bienvenida.",
      sender: "user",
      timestamp: new Date(Date.now() - 85400000),
      read: true,
    },
    {
      id: 3,
      text: "Claro, estaré encantado de ayudarte con eso. ¿Ya has realizado tu primer depósito?",
      sender: "agent",
      timestamp: new Date(Date.now() - 85300000),
      read: true,
      agentId: 1,
    },
    {
      id: 4,
      text: "Sí, deposité hace unas horas pero no veo mi bono.",
      sender: "user",
      timestamp: new Date(Date.now() - 85200000),
      read: true,
    },
    {
      id: 5,
      text: "Voy a revisar tu cuenta ahora mismo. Dame un momento por favor.",
      sender: "agent",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      agentId: 2,
    },
  ]

  helpArticles: HelpArticle[] = [
    {
      id: 1,
      title: "Guía de inicio rápido",
      content: "Aprende a usar nuestra plataforma en minutos con esta guía paso a paso.",
      icon: "book-open",
    },
    {
      id: 2,
      title: "Preguntas frecuentes",
      content: "Respuestas a las preguntas más comunes de nuestros usuarios.",
      icon: "help-circle",
    },
    {
      id: 3,
      title: "Métodos de pago",
      content: "Información sobre todos los métodos de pago disponibles.",
      icon: "credit-card",
    },
    {
      id: 4,
      title: "Términos y condiciones",
      content: "Información legal importante sobre el uso de nuestros servicios.",
      icon: "file-text",
    },
    {
      id: 5,
      title: "Contacto directo",
      content: "Ponte en contacto con nuestro equipo de soporte directamente.",
      icon: "phone",
    },
  ]

  selectedHelpArticle: HelpArticle | null = null
  activeConversation = false

  constructor() {}

  ngOnInit(): void {}

  toggleChat(): void {
    this.isOpen = !this.isOpen
    if (!this.isOpen) {
      this.resetActiveStates()
    }
  }

  resetActiveStates(): void {
    this.activeConversation = false
    this.selectedHelpArticle = null
  }

  sendMessage(): void {
    if (this.message.trim()) {
      // Añadir el mensaje del usuario
      const newUserMessage: Message = {
        id: this.messages.length + 1,
        text: this.message,
        sender: "user",
        timestamp: new Date(),
        read: true,
      }
      this.messages.push(newUserMessage)

      // Simular respuesta del agente después de un breve retraso
      setTimeout(() => {
        const randomAgentId = Math.floor(Math.random() * this.supportAgents.length) + 1
        const newAgentMessage: Message = {
          id: this.messages.length + 1,
          text: "Gracias por tu mensaje. Un agente te responderá lo antes posible.",
          sender: "agent",
          timestamp: new Date(),
          read: false,
          agentId: randomAgentId,
        }
        this.messages.push(newAgentMessage)
      }, 1000)

      this.message = ""
      this.activeConversation = true
    }
  }

  setActiveTab(tab: "inicio" | "mensajes" | "ayuda"): void {
    this.activeTab = tab
    this.resetActiveStates()
  }

  selectTopic(topic: ChatTopic): void {
    // Simular inicio de conversación basada en el tema
    const newAgentMessage: Message = {
      id: this.messages.length + 1,
      text: `Has seleccionado: ${topic.title}. ¿En qué podemos ayudarte específicamente con este tema?`,
      sender: "agent",
      timestamp: new Date(),
      read: false,
      agentId: 1,
    }
    this.messages.push(newAgentMessage)
    this.activeConversation = true
    this.activeTab = "mensajes"
  }

  getAgentById(agentId: number) {
    return this.supportAgents.find((agent) => agent.id === agentId)
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  formatDate(date: Date): string {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString()
    }
  }

  getUnreadCount(): number {
    return this.messages.filter((msg) => !msg.read && msg.sender === "agent").length
  }

  handleMessageSent(message: string): void {
    this.message = message;
    this.sendMessage();
  }

  openConversation(): void {
    this.activeConversation = true;
  }

  contactSupport(): void {
    this.activeConversation = true;
    this.activeTab = 'mensajes';
  }
}
