import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent {
  @Output() close = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }
}
