import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownOption } from '../../models/dropdown.model';

@Component({
  selector: 'app-dropdown-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
})
export class DropdownMenuComponent {
  items = input<DropdownOption[]>();
  isOpen = input<boolean>(false);

  dropdownToggle = output<void>();
  itemClick = output<DropdownOption>();

  toggleDropdown() {
    this.dropdownToggle.emit();
  }

  closeDropdown() {
    if (this.isOpen()) {
      this.dropdownToggle.emit();
    }
  }

  handleItemClick(item: DropdownOption) {
    this.itemClick.emit(item);
    if (item.action) {
      item.action();
    }
    this.closeDropdown();
  }
}
