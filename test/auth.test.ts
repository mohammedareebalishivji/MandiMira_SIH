import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authenticate, authenticateAs, DEMO_CREDENTIALS, DEMO_PASSWORD } from '../src/services/auth';
import { UserRole } from '../src/types';

describe('Authentication Service', () => {
  const allRoles: UserRole[] = ['farmer', 'fpo', 'middleman', 'buyer', 'transporter', 'warehouse', 'officer'];

  it('should authenticate every role by username', () => {
    for (const role of allRoles) {
      const cred = DEMO_CREDENTIALS[role];
      const res = authenticate(cred.username, DEMO_PASSWORD);
      assert.strictEqual(res.ok, true, `Failed for ${role} by username`);
      if (res.ok) {
        assert.strictEqual(res.session.role, role);
      }
    }
  });

  it('should authenticate every role by email', () => {
    for (const role of allRoles) {
      const cred = DEMO_CREDENTIALS[role];
      const res = authenticate(cred.email, DEMO_PASSWORD);
      assert.strictEqual(res.ok, true, `Failed for ${role} by email`);
      if (res.ok) {
        assert.strictEqual(res.session.role, role);
      }
    }
  });

  it('should handle case insensitivity and whitespace in identifier', () => {
    const res = authenticate('  FARMER@MandiMitra.in  ', DEMO_PASSWORD);
    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.session.role, 'farmer');
    }
  });

  it('should reject wrong password', () => {
    const res = authenticate('farmer', 'WrongPassword!999');
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'Incorrect password. Try again.');
    }
  });

  it('should reject unknown user', () => {
    const res = authenticate('nonexistent_user', DEMO_PASSWORD);
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.error, 'No account found for that username, email or mobile number.');
    }
  });

  it('should reject empty identifier or empty password', () => {
    assert.strictEqual(authenticate('', DEMO_PASSWORD).ok, false);
    assert.strictEqual(authenticate('farmer', '').ok, false);
  });

  it('should enforce role scope in authenticateAs', () => {
    // Correct role
    const valid = authenticateAs('farmer', 'farmer', DEMO_PASSWORD);
    assert.strictEqual(valid.ok, true);

    // Mismatched role
    const mismatch = authenticateAs('buyer', 'farmer', DEMO_PASSWORD);
    assert.strictEqual(mismatch.ok, false);
    if (!mismatch.ok) {
      assert.ok(mismatch.error.includes('different role'));
    }
  });
});
