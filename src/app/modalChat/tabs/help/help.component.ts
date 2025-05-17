import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  icon: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-help-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpTabComponent {
  @Input() helpArticles: HelpArticle[] = [];
  @Output() contactSupportRequested = new EventEmitter<void>();
  
  selectedHelpArticle: HelpArticle | null = null;
  searchQuery = '';
  filteredHelpItems: HelpArticle[] = [];

  ngOnInit(): void {
    // Inicializar los artículos filtrados con todos los artículos disponibles
    this.filteredHelpItems = [...this.helpArticles];
  }

  ngOnChanges(): void {
    // Actualizar los artículos filtrados cuando cambien los artículos de entrada
    this.filteredHelpItems = [...this.helpArticles];
  }

  selectHelpArticle(article: HelpArticle): void {
    this.selectedHelpArticle = article;
  }

  backToHelpList(): void {
    this.selectedHelpArticle = null;
  }

  searchHelp(): void {
    if (this.searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los artículos
      this.filteredHelpItems = [...this.helpArticles];
    } else {
      // Filtrar artículos que coincidan con la búsqueda (título o contenido)
      const query = this.searchQuery.toLowerCase();
      this.filteredHelpItems = this.helpArticles.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );
    }
  }

  toggleHelp(item: HelpArticle): void {
    // Alternar la expansión del elemento de ayuda
    item.expanded = !item.expanded;
  }

  contactSupport(): void {
    this.contactSupportRequested.emit();
  }
}