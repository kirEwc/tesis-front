import { Component,Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.scss'
})
export class AyudaComponent {


  
  @Output() close = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }
}
