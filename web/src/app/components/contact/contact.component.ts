import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericButtonComponent } from "../generic-button/generic-button.component";

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule, GenericButtonComponent],
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
