// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
    service.clear();
  });

  it('should add success toast notification', () => {
    service.success('Action réalisée avec succès', 'Succès');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
    expect(service.toasts()[0].message).toBe('Action réalisée avec succès');
  });

  it('should remove toast notification by id', () => {
    const id = service.info('Information enregistrée');
    expect(service.toasts().length).toBe(1);
    service.remove(id);
    expect(service.toasts().length).toBe(0);
  });
});
