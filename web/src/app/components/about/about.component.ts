import { Component } from '@angular/core';
import { GenericButtonComponent } from "../generic-button/generic-button.component";

@Component({
  selector: 'app-about',
  imports: [GenericButtonComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {}
