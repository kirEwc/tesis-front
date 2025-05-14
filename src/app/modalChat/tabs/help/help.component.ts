import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  icon: string;
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

  selectHelpArticle(article: HelpArticle): void {
    this.selectedHelpArticle = article;
  }

  backToHelpList(): void {
    this.selectedHelpArticle = null;
  }

  searchHelp(): void {
    // Esta función se implementaría para filtrar los artículos de ayuda
    console.log('Buscando:', this.searchQuery);
  }

  contactSupport(): void {
    this.contactSupportRequested.emit();
  }
}