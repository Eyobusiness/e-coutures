// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    service = new DialogService();
  });

  it('should set active dialog on confirm call and resolve true on confirm', async () => {
    const promise = service.confirmDelete('Supprimer le client', 'Confirmez-vous ?');
    expect(service.activeDialog()).not.toBeNull();
    expect(service.activeDialog()?.title).toBe('Supprimer le client');

    service.onConfirm();
    const result = await promise;
    expect(result).toBe(true);
  });

  it('should resolve false on cancel', async () => {
    const promise = service.confirmDelete('Supprimer le client', 'Confirmez-vous ?');
    service.onCancel();
    const result = await promise;
    expect(result).toBe(false);
  });
});
