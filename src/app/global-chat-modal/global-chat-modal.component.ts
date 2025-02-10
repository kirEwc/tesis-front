import { Component, HostListener } from '@angular/core';
import { InicioComponent } from "./(tabs)/inicio/inicio.component";
import { MensajesComponent } from "./(tabs)/mensajes/mensajes.component";
import { AyudaComponent } from "./(tabs)/ayuda/ayuda.component";
import { TareasComponent } from "./(tabs)/tareas/tareas.component";

@Component({
  selector: 'app-global-chat-modal',
  standalone: true,
  imports: [InicioComponent, MensajesComponent, AyudaComponent, TareasComponent],
  templateUrl: './global-chat-modal.component.html',
  styleUrl: './global-chat-modal.component.scss'
})
export class GlobalChatModalComponent {

  
  isOpen = false;
  activeTab = 'inicio';


  toggleChat() {
    this.isOpen = !this.isOpen;
  }

 public switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const modalElement = document.querySelector('.chat-modal');
    const buttonElement = document.querySelector('#chatButton');

    if (this.isOpen && modalElement && buttonElement) {
      if (!modalElement.contains(event.target as Node) && !buttonElement.contains(event.target as Node)) {
        this.toggleChat();
      }
    }
  }

}
