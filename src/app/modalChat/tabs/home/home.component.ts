import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatTopic {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeTabComponent {
  @Input() chatTopics: ChatTopic[] = [];
  @Output() topicSelected = new EventEmitter<ChatTopic>();
  @Output() messageSent = new EventEmitter<string>();
  
  message = '';

  selectTopic(topic: ChatTopic): void {
    this.topicSelected.emit(topic);
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message);
      this.message = '';
    }
  }
}