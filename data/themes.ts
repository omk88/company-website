export const userThemes = [
  { name: 'electric-blue', primary: '#2563eb', gradient: ['#3b82f6', '#1d4ed8'] },
  { name: 'emerald', primary: '#059669', gradient: ['#10b981', '#047857'] },
  { name: 'violet', primary: '#7c3aed', gradient: ['#8b5cf6', '#6d28d9'] },
  { name: 'rose', primary: '#e11d48', gradient: ['#f43f5e', '#be123c'] },
  { name: 'amber', primary: '#d97706', gradient: ['#f59e0b', '#b45309'] },
] as const;

export const THEME_MAP = Object.fromEntries(
  userThemes.map((t) => [t.name, t])
);