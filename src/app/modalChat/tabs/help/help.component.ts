import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: number;
  title: string;
  content: string;
  expanded?: boolean;
  Mcontent?: {
    title: string;
    content: string;
  }[];
}

@Component({
  selector: 'app-help-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpTabComponent {
  @Output() contactSupportRequested = new EventEmitter<void>();
  
  selectedHelpArticle: HelpArticle | null = null;
  searchQuery = '';
  filteredHelpItems: HelpArticle[] = [];
  
  // Array de ayudas para facilitar su modificación
  ayudas: HelpArticle[] = [
    { 
      id: 1, 
      title: 'Acerca de BFG Token', 
      content: 'Información detallada sobre BFG Token, su utilidad y características principales.'
    },
    { 
      id: 2, 
      title: 'Depositar y Retirar en BetFury', 
      content: 'Guía paso a paso sobre cómo depositar y retirar fondos en la plataforma BetFury.'
    },
    { 
      id: 3, 
      title: '¿Cómo registrarse y proteger su cuenta?', 
      content: 'Instrucciones detalladas para crear una cuenta segura y protegerla adecuadamente.'
    },
    { 
      id: 4, 
      title: 'Preguntas Frecuentes',
      content: '', 
      Mcontent: [
        {
          title: '¿Qué es BFG Token?',
          content: 'BFG Token es una criptomoneda que se puede adquirir en la plataforma BetFury.'
        },
        {
          title: '¿Cómo puedo adquirir BFG Token?',
          content: 'Puedes adquirir BFG Token en la plataforma BetFury a través del depósito de criptomonedas.'
        },
        {
          title: '¿Cómo puedo retirar BFG Token?',
          content: 'Puedes retirar BFG Token de la plataforma BetFury a través del retiro de criptomonedas.'
        },
        {
          title: '¿Cómo puedo convertir BFG Token en criptomonedas?',
          content: 'Puedes convertir BFG Token en criptomonedas a través del depósito de criptomonedas.'
        },
        {
          title: '¿Cómo puedo convertir BFG Token en criptomonedas?',
          content: 'Puedes convertir BFG Token en criptomonedas a través del depósito de criptomonedas.'
        },
        {
          title: '¿Cómo puedo convertir BFG Token en criptomonedas?',
          content: 'Puedes convertir BFG Token en criptomonedas a través del depósito de criptomonedas.'
        }
      ] ,     
    },
    { 
      id: 5, 
      title: 'JUEGO Y APUESTAS RESPONSABLES', 
      content: 'Guía sobre prácticas de juego responsable y herramientas disponibles para controlar tu actividad de juego.'
    },
    { 
      id: 6, 
      title: 'Autenticación de dos factores (2FA)', 
      content: 'Instrucciones para configurar y usar la autenticación de dos factores para mayor seguridad.'
    },
    { 
      id: 7, 
      title: '¿Cómo funcionan la caché y las cookies?', 
      content: 'Explicación sobre el uso de caché y cookies en la plataforma y cómo afectan tu experiencia.'
    },
    { 
      id: 8, 
      title: 'Juegos BetFury', 
      content: 'Catálogo y descripción de los juegos disponibles en la plataforma BetFury.'
    },
    { 
      id: 9, 
      title: 'Club VIP', 
      content: 'Detalles sobre el programa VIP, sus beneficios y cómo subir de nivel.'
    },
    { 
      id: 10, 
      title: 'Sistema de rangos', 
      content: 'Explicación del sistema de rangos y recompensas por progresión en la plataforma.'
    },
    { 
      id: 11, 
      title: '¿Falta el depósito?', 
      content: 'Solución de problemas comunes relacionados con depósitos faltantes o retrasados.'
    }
  ];

  ngOnInit(): void {
    // Si no se proporcionan artículos de ayuda, usar el array predeterminado
    if (this.ayudas.length === 0) {
      this.ayudas = this.ayudas;
    }
    // Inicializar los artículos filtrados con todos los artículos disponibles
    this.filteredHelpItems = [...this.ayudas];
  }

  ngOnChanges(): void {
    // Actualizar los artículos filtrados cuando cambien los artículos de entrada
    this.filteredHelpItems = [...this.ayudas];
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
      this.filteredHelpItems = [...this.ayudas];
    } else {
      // Filtrar artículos que coincidan con la consulta de búsqueda
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredHelpItems = this.ayudas.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );
    }
    // Cerrar el artículo seleccionado si hay uno abierto
    this.selectedHelpArticle = null;
  }

  // Ya no necesitamos toggleHelp ya que ahora navegamos a la vista detallada

  contactSupport(): void {
    this.contactSupportRequested.emit();
  }
}