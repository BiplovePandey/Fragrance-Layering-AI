import { UserProfile, AuthCredentials, RegisterData, OtpSendResponse, OtpVerifyResponse } from '../types.js';
import { api } from './api.js';

const STORAGE_KEY = 'olfactory_atelier_active_user';
const TOKEN_KEY = 'olfactory_atelier_session_token';

// Curated demo personas for immediate high-fidelity testing
export const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 1,
    name: 'Elena Vance',
    email: 'elena@olfactory.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    title: 'Master Perfumer & Haute Connoisseur',
    level: 5,
    xp: 1450,
    role: 'perfumer',
    signature_notes: ['Mysore Sandalwood', 'Turkish Rose', 'Assam Oud'],
    preferred_family: 'Woody Aromatic',
    bio: 'Senior evaluator of oriental chypres and rare attars. Fascinated by resinous alchemy and cold-weather incense chords.'
  },
  {
    id: 2,
    name: 'Aarav Sharma',
    email: 'aarav@olfactory.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    title: 'Kannauj Heritage Scholar',
    level: 4,
    xp: 880,
    role: 'scholar',
    signature_notes: ['Mitti Attar', 'Ruh Gulab', 'Shamama'],
    preferred_family: 'Traditional Indian Attar',
    bio: 'Preserving fifth-generation hydro-distillation traditions across the deg-bhapka hearths of Kannauj.'
  },
  {
    id: 3,
    name: 'Maya Patel',
    email: 'maya@olfactory.ai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    title: 'Contemporary Scent Explorer',
    level: 2,
    xp: 340,
    role: 'enthusiast',
    signature_notes: ['Bergamot', 'Sea Salt', 'Cardamom'],
    preferred_family: 'Fresh Citrus / Aquatic',
    bio: 'Exploring botanical skin-scents, monsoon ozonics, and crisp daily office accords.'
  }
];

type AuthChangeListener = (user: UserProfile | null) => void;

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: Set<AuthChangeListener> = new Set();

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.currentUser = JSON.parse(saved);
      } else {
        // Default to Elena Vance as the active master persona for rich initial state
        this.currentUser = DEMO_PERSONAS[0];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      }
    } catch {
      this.currentUser = DEMO_PERSONAS[0];
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentUser);
      } catch (err) {
        console.error('Error in auth change listener:', err);
      }
    }
  }

  public subscribe(listener: AuthChangeListener): () => void {
    this.listeners.add(listener);
    // Call immediately with current state
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getDemoPersonas(): UserProfile[] {
    return DEMO_PERSONAS;
  }

  public async login(credentials: AuthCredentials): Promise<UserProfile> {
    try {
      const response = await api.auth.login(credentials);
      if (response.success && response.user) {
        this.currentUser = response.user;
        if (response.token) {
          localStorage.setItem(TOKEN_KEY, response.token);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return this.currentUser;
      }
    } catch (apiErr: any) {
      // Re-throw server business logic errors directly (e.g. USER_NOT_FOUND, INVALID_PASSWORD)
      if (apiErr.message && !apiErr.message.includes('Network') && !apiErr.message.includes('Failed to fetch')) {
        throw apiErr;
      }

      // Local fallback for offline/Capacitor matching demo personas
      const cleanEmail = credentials.email.trim().toLowerCase();
      const matched = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
      if (matched) {
        this.currentUser = matched;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return this.currentUser;
      }
      throw apiErr;
    }

    throw new Error('Invalid credentials');
  }

  public async sendOtp(email: string): Promise<OtpSendResponse> {
    try {
      return await api.auth.sendOtp(email);
    } catch (err: any) {
      // Local fallback for offline mode
      const dummyOtp = '882319';
      return {
        success: true,
        message: `Offline code generated: ${dummyOtp}`,
        emailDelivered: false,
        previewOtp: dummyOtp,
        expiresInSeconds: 600
      };
    }
  }

  public async verifyOtp(
    email: string,
    otp: string,
    additionalData?: { name?: string; preferred_family?: string; signature_notes?: string[] }
  ): Promise<OtpVerifyResponse> {
    try {
      const response = await api.auth.verifyOtp(email, otp, additionalData);
      if (response.success && response.user) {
        this.currentUser = response.user;
        if (response.token) {
          localStorage.setItem(TOKEN_KEY, response.token);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return response;
      }
      return response;
    } catch (err: any) {
      // If offline or demo bypass
      const cleanEmail = email.trim().toLowerCase();
      const matched = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail);
      if (matched && (otp === '882319' || otp.length === 6)) {
        this.currentUser = matched;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return {
          success: true,
          user: matched,
          isNewUser: false,
          token: `offline_token_${matched.id}`
        };
      }
      throw err;
    }
  }

  public async register(data: RegisterData): Promise<UserProfile> {
    try {
      const response = await api.auth.register(data);
      if (response.success && response.user) {
        this.currentUser = response.user;
        if (response.token) {
          localStorage.setItem(TOKEN_KEY, response.token);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return this.currentUser;
      }
    } catch (apiErr: any) {
      // Re-throw server business logic errors directly (e.g. Account already exists)
      if (apiErr.message && !apiErr.message.includes('Network') && !apiErr.message.includes('Failed to fetch')) {
        throw apiErr;
      }

      // Local fallback for offline/standalone execution
      const newId = Date.now();
      const fallbackUser: UserProfile = {
        id: newId,
        name: data.name,
        email: data.email,
        title: data.title || 'Scent Explorer',
        level: 1,
        xp: 150,
        role: 'enthusiast',
        signature_notes: data.signature_notes || ['Bergamot', 'Sandalwood'],
        preferred_family: data.preferred_family || 'Woody Aromatic',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=b45309`,
        bio: 'Atelier Member'
      };

      this.currentUser = fallbackUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      this.notify();
      return fallbackUser;
    }

    throw new Error('Registration failed');
  }

  public switchPersona(personaId: number): UserProfile {
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
    this.currentUser = persona;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persona));
    this.notify();
    return persona;
  }

  public continueAsGuest(): UserProfile {
    const guestUser: UserProfile = {
      id: 999,
      name: 'Guest Explorer',
      email: 'guest@olfactory.ai',
      title: 'Visiting Alchemist',
      level: 1,
      xp: 50,
      role: 'guest',
      signature_notes: ['Citrus', 'Cedarwood'],
      preferred_family: 'Fresh Citrus',
      bio: 'Exploring without persistent vault registration'
    };
    this.currentUser = guestUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
    this.notify();
    return guestUser;
  }

  public async forgotPassword(email: string): Promise<{ success: boolean; message: string; email: string }> {
    return await api.auth.forgotPassword(email);
  }

  public async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    return await api.auth.resetPassword(email, newPassword);
  }

  public async logout(): Promise<void> {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network failures on logout
    }
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.notify();
  }
}

export const authService = new AuthService();
