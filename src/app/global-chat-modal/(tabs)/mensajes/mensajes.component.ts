import { Component, } from '@angular/core';
import { GlobalChatModalComponent } from '../../global-chat-modal.component';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent {

  constructor (private Instancia: GlobalChatModalComponent) { }
  
  isOpen = this.Instancia.isOpen;
  activeChat = 'Mensajes';
  
   public switchChat(tabId: string) {
      this.activeChat = tabId;
    }

    public onClose() {
      this.Instancia.toggleChat() ;
    }


}
