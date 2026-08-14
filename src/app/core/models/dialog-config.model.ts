export type DialogType = 'danger' | 'warning' | 'info' | 'primary';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  icon?: string;
}

export interface InternalDialogState extends DialogConfig {
  resolve: (confirmed: boolean) => void;
}
