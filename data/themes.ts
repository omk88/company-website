export const userThemes = [
  { name: 'electric-blue', primary: '#2563eb', gradient: ['#3b82f6', '#1d4ed8'], background: '#dbeafe', text: ['#0c4a6e', '#dbeafe']  },
  { name: 'cyan', primary: '#06b6d4', gradient: ['#22d3ee', '#0891b2'], background: '#cffafe', text: ['#164e63', '#cffafe'] },       
  { name: 'indigo', primary: '#4f46e5', gradient: ['#6366f1', '#4338ca'], background: '#e0e7ff', text: ['#312e81', '#e0e7ff'] },      
  { name: 'cyber-purple', primary: '#8b5cf6', gradient: ['#a78bfa', '#7c3aed'], background: '#f3e8ff', text: ['#581c87', '#f3e8ff'] },
  { name: 'teal', primary: '#0d9488', gradient: ['#14b8a6', '#0f766e'], background: '#ccfbf1', text: ['#134e4a', '#ccfbf1'] },   
  
  { name: 'vibrant-orange', primary: '#f97316', gradient: ['#fb923c', '#c2410c'], background: '#ffedd5', text: ['#7c2d12', '#ffedd5'] },
  { name: 'amber-gold', primary: '#f59e0b', gradient: ['#fbbf24', '#b45309'], background: '#fef3c7', text: ['#78350f', '#fef3c7'] },
  { name: 'crimson-red', primary: '#dc2626', gradient: ['#ef4444', '#b91c1c'], background: '#fee2e2', text: ['#7f1d1d', '#fee2e2'] },
  { name: 'sunset-rose', primary: '#e11d48', gradient: ['#fb7185', '#be123c'], background: '#ffe4e6', text: ['#881337', '#ffe4e6'] },
] as const;

export const THEME_MAP = Object.fromEntries(
  userThemes.map((t) => [t.name, t])
);