import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_OWNER, DEMO_TENANT, DEMO_USERS } from './mockData';
import { initials } from './format';
import type { Channel, Role, User } from './types';

const AUTH_STORAGE_KEY = 'imobvirtual:auth:v1';
export const RESEND_COOLDOWN_SECONDS = 42;

export interface SignupDraft {
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  canalPreferido: Channel;
  role: Role;
  documento: string;
  codigoConvite: string;
}

export type OtpMode = 'login' | 'signup';

interface PendingAuth {
  mode: OtpMode;
  identifier: string;
  channel: Channel;
  resendAvailableAt: number;
}

export type OtpVerifyResult = { ok: true } | { ok: false; reason: 'expired' | 'invalid' };

interface AuthContextValue {
  currentUser: User | null;
  pendingAuth: PendingAuth | null;
  signupDraft: SignupDraft | null;
  isAuthenticated: boolean;
  requestLoginOtp: (identifier: string) => void;
  requestSignupOtp: (draft: SignupDraft) => void;
  resendOtp: () => void;
  verifyOtp: (code: string) => OtpVerifyResult;
  cancelPendingAuth: () => void;
  logout: () => void;
  homePathFor: (role: Role) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function detectChannel(identifier: string): Channel {
  return identifier.includes('@') ? 'email' : 'sms';
}

function normalize(identifier: string) {
  return identifier.trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');
}

function loadUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(loadUser);
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null);
  const [signupDraft, setSignupDraft] = useState<SignupDraft | null>(null);

  useEffect(() => {
    if (currentUser) window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    else window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [currentUser]);

  const requestLoginOtp = useCallback((identifier: string) => {
    setPendingAuth({
      mode: 'login',
      identifier,
      channel: detectChannel(identifier),
      resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
    });
  }, []);

  const requestSignupOtp = useCallback((draft: SignupDraft) => {
    setSignupDraft(draft);
    const identifier = draft.canalPreferido === 'email' ? draft.email : draft.telefone;
    setPendingAuth({
      mode: 'signup',
      identifier,
      channel: draft.canalPreferido,
      resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
    });
  }, []);

  const resendOtp = useCallback(() => {
    setPendingAuth((prev) => (prev ? { ...prev, resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000 } : prev));
  }, []);

  const verifyOtp = useCallback(
    (code: string): OtpVerifyResult => {
      if (!pendingAuth) return { ok: false, reason: 'invalid' };
      if (code === '000000') return { ok: false, reason: 'expired' };
      if (code === '111111') return { ok: false, reason: 'invalid' };

      if (pendingAuth.mode === 'login') {
        const target = normalize(pendingAuth.identifier);
        const match = DEMO_USERS.find(
          (u) => normalize(u.email) === target || normalize(u.telefone) === target,
        );
        setCurrentUser(match ?? DEMO_OWNER);
      } else if (signupDraft) {
        const novo: User = {
          id: `u-${Date.now()}`,
          nome: signupDraft.nome,
          sobrenome: signupDraft.sobrenome,
          email: signupDraft.email,
          telefone: signupDraft.telefone,
          role: signupDraft.role,
          canalPreferido: signupDraft.canalPreferido,
          documento: signupDraft.documento,
          iniciais: initials(signupDraft.nome, signupDraft.sobrenome),
        };
        setCurrentUser(novo);
      }
      setPendingAuth(null);
      return { ok: true };
    },
    [pendingAuth, signupDraft],
  );

  const cancelPendingAuth = useCallback(() => {
    setPendingAuth(null);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setPendingAuth(null);
    setSignupDraft(null);
  }, []);

  const homePathFor = useCallback((role: Role) => (role === 'proprietario' ? '/painel' : '/app'), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      pendingAuth,
      signupDraft,
      isAuthenticated: !!currentUser,
      requestLoginOtp,
      requestSignupOtp,
      resendOtp,
      verifyOtp,
      cancelPendingAuth,
      logout,
      homePathFor,
    }),
    [currentUser, pendingAuth, signupDraft, requestLoginOtp, requestSignupOtp, resendOtp, verifyOtp, cancelPendingAuth, logout, homePathFor],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { DEMO_OWNER, DEMO_TENANT };
