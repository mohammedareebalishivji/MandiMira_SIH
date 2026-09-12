import { UserRole, UserSession } from '../types';
import { DEMO_SESSIONS } from '../data/roles';

/**
 * Demo authentication.
 *
 * These credentials are compiled into the client bundle and every account
 * shares one well-known password. That is acceptable for a demo build and
 * nothing else — a real deployment must move verification server-side and
 * never ship a password list to the browser.
 */

export const DEMO_PASSWORD = 'Test@123';

export interface DemoCredential {
  role: UserRole;
  username: string;
  email: string;
  password: string;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  farmer:      { role: 'farmer',      username: 'farmer',      email: 'farmer@mandimitra.in',      password: DEMO_PASSWORD },
  fpo:         { role: 'fpo',         username: 'fpo',         email: 'fpo@mandimitra.in',         password: DEMO_PASSWORD },
  middleman:   { role: 'middleman',   username: 'trader',      email: 'trader@mandimitra.in',      password: DEMO_PASSWORD },
  buyer:       { role: 'buyer',       username: 'buyer',       email: 'buyer@mandimitra.in',       password: DEMO_PASSWORD },
  transporter: { role: 'transporter', username: 'transporter', email: 'transporter@mandimitra.in', password: DEMO_PASSWORD },
  warehouse:   { role: 'warehouse',   username: 'warehouse',   email: 'warehouse@mandimitra.in',   password: DEMO_PASSWORD },
  officer:     { role: 'officer',     username: 'officer',     email: 'officer@mandimitra.in',     password: DEMO_PASSWORD }
};

export const credentialFor = (role: UserRole): DemoCredential => DEMO_CREDENTIALS[role];

export type AuthResult =
  | { ok: true; session: UserSession }
  | { ok: false; error: string };

/**
 * Verify an identifier and password. The identifier may be the username, the
 * email, or the registered mobile number for any role — matching is
 * case-insensitive and ignores spaces so a typed number still resolves.
 */
export const authenticate = (identifier: string, password: string): AuthResult => {
  const id = identifier.trim().toLowerCase().replace(/\s+/g, '');
  if (!id) return { ok: false, error: 'Enter your username, email or mobile number.' };
  if (!password) return { ok: false, error: 'Enter your password.' };

  const match = Object.values(DEMO_CREDENTIALS).find((c) => {
    const session = DEMO_SESSIONS[c.role];
    return (
      c.username.toLowerCase() === id ||
      c.email.toLowerCase() === id ||
      session.phone.replace(/\D/g, '') === id.replace(/\D/g, '')
    );
  });

  if (!match) return { ok: false, error: 'No account found for that username, email or mobile number.' };
  if (password !== match.password) return { ok: false, error: 'Incorrect password. Try again.' };

  return { ok: true, session: DEMO_SESSIONS[match.role] };
};

/** Verify credentials already scoped to a chosen role. */
export const authenticateAs = (role: UserRole, identifier: string, password: string): AuthResult => {
  const result = authenticate(identifier, password);
  if (!result.ok) return result;
  if (result.session.role !== role) {
    return { ok: false, error: `Those credentials belong to a different role. Use "${credentialFor(role).username}".` };
  }
  return result;
};
