import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { gurdGuard } from './gurd.guard';

describe('gurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => gurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
