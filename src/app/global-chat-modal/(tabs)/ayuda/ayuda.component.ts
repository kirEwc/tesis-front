import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule

interface HelpItem {
  title: string;
  content: string;
  expanded: boolean;
}


@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadir FormsModule a los imports
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.scss'
})
export class AyudaComponent {

  searchTerm: string = '';

  helpItems: HelpItem[] = [
    {
      title: '¿Cómo funciona esto?',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      expanded: false
    },
    {
      title: '¿Dónde encuentro la configuración?',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      expanded: false
    },
    {
      title: 'Otra pregunta frecuente',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      expanded: false
    }
  ];

  get filteredHelpItems(): HelpItem[] {
    if (!this.searchTerm) {
      return this.helpItems;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.helpItems.filter(item =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.content.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }


  
  @Output() close = new EventEmitter<void>()

  toggleHelp(item: HelpItem) {
    item.expanded = !item.expanded;
  }

  onClose() {
    this.close.emit()
  }
}
