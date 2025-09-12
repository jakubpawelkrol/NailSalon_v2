export interface DropdownOption {
  label: string;
  action?: () => void;
  route?: string;
  icon?: string;
  divider?: boolean;
  visible?: boolean;
}
