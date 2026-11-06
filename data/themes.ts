export const userThemes = [
  { name: 'electric-blue', primary: '#2563eb', gradient: ['#3b82f6', '#1d4ed8'] },
  { name: 'cyan', primary: '#06b6d4', gradient: ['#22d3ee', '#0891b2'] },       
  { name: 'indigo', primary: '#4f46e5', gradient: ['#6366f1', '#4338ca'] },      
  { name: 'cyber-purple', primary: '#8b5cf6', gradient: ['#a78bfa', '#7c3aed'] },
  { name: 'teal', primary: '#0d9488', gradient: ['#14b8a6', '#0f766e'] },       
] as const;

export const THEME_MAP = Object.fromEntries(
  userThemes.map((t) => [t.name, t])
);