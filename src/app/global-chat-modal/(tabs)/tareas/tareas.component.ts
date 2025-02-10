import { Component,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {
  @Output() close = new EventEmitter<void>()

  onClose() {
    this.close.emit()
  }
}
