import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeTabComponent {
  @Output() navigateToChatTab = new EventEmitter<void>();

  navigateToChat(): void {
    this.navigateToChatTab.emit();
  }



  chatTopics = [
    {
      title: 'Chat',
      description: 'Chat con un agente',
    },
    {
      title: 'Ayuda',
      description: 'Ayuda con un agente',
    },
  ];
}

