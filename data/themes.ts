export const userThemes = [
  { 
    name: 'electric-blue', 
    primary: '#3b82f6',
    darkPrimary: '#1d4ed8',
    gradient: ['#60a5fa', '#2563eb'], 
    background: '#dbeafe',       
    darkBackground: '#090d16',    
    text: ['#0c4a6e', '#dbeafe'],
    darkText: ['#93c5fd', '#e2e8f0']
  },
  { 
    name: 'cyan', 
    primary: '#06b6d4',
    darkPrimary: '#0e7490',
    gradient: ['#22d3ee', '#0891b2'], 
    background: '#cffafe', 
    darkBackground: '#08131a',     
    text: ['#164e63', '#cffafe'],
    darkText: ['#67e8f9', '#e2e8f0'] 
  },       
  { 
    name: 'indigo', 
    primary: '#4f46e5',
    darkPrimary: '#3730a3',
    gradient: ['#6366f1', '#4338ca'], 
    background: '#e0e7ff', 
    darkBackground: '#0e0e1b',     
    text: ['#312e81', '#e0e7ff'],
    darkText: ['#a5b4fc', '#e2e8f0'] 
  },      
  { 
    name: 'cyber-purple', 
    primary: '#8b5cf6',
    darkPrimary: '#6d28d9',
    gradient: ['#a78bfa', '#7c3aed'], 
    background: '#f3e8ff', 
    darkBackground: '#130d1d',     
    text: ['#581c87', '#f3e8ff'],
    darkText: ['#c4b5fd', '#e2e8f0'] 
  },
  { 
    name: 'teal', 
    primary: '#0d9488',
    darkPrimary: '#0f766e',
    gradient: ['#14b8a6', '#0f766e'], 
    background: '#ccfbf1', 
    darkBackground: '#061513',     
    text: ['#134e4a', '#ccfbf1'],
    darkText: ['#5eead4', '#e2e8f0'] 
  },   
  { 
    name: 'vibrant-orange', 
    primary: '#f97316',
    darkPrimary: '#c2410c',
    gradient: ['#fb923c', '#c2410c'], 
    background: '#ffedd5', 
    darkBackground: '#160d08',      
    text: ['#7c2d12', '#ffedd5'],
    darkText: ['#fdba74', '#e2e8f0'] 
  },
  { 
    name: 'amber-gold', 
    primary: '#f59e0b',
    darkPrimary: '#b45309',
    gradient: ['#fbbf24', '#b45309'], 
    background: '#fef3c7', 
    darkBackground: '#161107',     
    text: ['#78350f', '#fef3c7'],
    darkText: ['#fcd34d', '#e2e8f0'] 
  },
  { 
    name: 'crimson-red', 
    primary: '#dc2626',
    darkPrimary: '#991b1b',
    gradient: ['#ef4444', '#b91c1c'], 
    background: '#fee2e2', 
    darkBackground: '#160808',      
    text: ['#7f1d1d', '#fee2e2'],
    darkText: ['#fca5a5', '#e2e8f0'] 
  },
  { 
    name: 'sunset-rose', 
    primary: '#e11d48',
    darkPrimary: '#9f1239',
    gradient: ['#fb7185', '#be123c'], 
    background: '#ffe4e6', 
    darkBackground: '#16080a',     
    text: ['#881337', '#ffe4e6'],
    darkText: ['#fda4af', '#e2e8f0'] 
  },
] as const;

export const THEME_MAP = Object.fromEntries(
  userThemes.map((t) => [t.name, t])
);

export const VARIANT_ANGLES = [15, 75, 135, 210, 300] as const;

export function buildGradientSvg(
  colors: readonly [string, string],
  angle: number
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${colors[0]}" />
        <stop offset="100%" stop-color="${colors[1]}" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grad)" />
  </svg>`;
}

export function getGradientDataUrl(themeName: string, variantIndex: number): string {
  const theme = THEME_MAP[themeName] ?? userThemes[0];
  const safeIndex = ((variantIndex % VARIANT_ANGLES.length) + VARIANT_ANGLES.length) % VARIANT_ANGLES.length;
  const svg = buildGradientSvg(theme.gradient, VARIANT_ANGLES[safeIndex]);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}