import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  @Output() close = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }

}
