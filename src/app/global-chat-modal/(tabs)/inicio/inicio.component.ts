import { Component } from '@angular/core';
import { GlobalChatModalComponent } from '../../global-chat-modal.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  constructor(private Instancia: GlobalChatModalComponent,) { }
  

  onClose() {
    this.Instancia.toggleChat() ;
  }

  IrAMensaje(tab: string) {
    this.Instancia.switchTab(tab);
  }
  

}
