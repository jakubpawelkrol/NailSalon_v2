import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    message: '',
  };

  submitForm() {
    // TODO: real email functionality
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message!');
    this.contactForm = { name: '', email: '', message: '' }; // reset
  }
}
