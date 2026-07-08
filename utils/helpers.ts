export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function generatePassword(
  length: number = 16,
  options: { uppercase?: boolean; lowercase?: boolean; numbers?: boolean; symbols?: boolean } = {}
): string {
  const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  
  let result = '';
  // Ensure at least one of each selected type
  if (uppercase) result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  if (lowercase) result += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  if (numbers) result += '0123456789'[Math.floor(Math.random() * 10)];
  if (symbols) result += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  for (let i = result.length; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return result.split('').sort(() => Math.random() - 0.5).join('');
}

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score: 1, label: 'Weak', color: '#EF4444' };
  if (score <= 4) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (score <= 5) return { score: 3, label: 'Good', color: '#10B981' };
  return { score: 4, label: 'Strong', color: '#4F46E5' };
}

export function maskPassword(password: string): string {
  return '•'.repeat(Math.min(password.length, 12));
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}
