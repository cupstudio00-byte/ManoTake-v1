import sharp from 'sharp';

const THEMES = {
  dark: { bg: '#0a0e27', text: '#ffffff', accent: '#00ff88', secondary: '#00d4ff' },
  light: { bg: '#f5f5f5', text: '#1a1a1a', accent: '#0066ff', secondary: '#ff6b00' },
  neon: { bg: '#000000', text: '#00ff00', accent: '#ff00ff', secondary: '#00ffff' },
  sunset: { bg: '#1a0a0f', text: '#ffeee8', accent: '#ff6b6b', secondary: '#ffa500' },
  ocean: { bg: '#0d1b2a', text: '#e0f2f1', accent: '#00bcd4', secondary: '#4fc3f7' }
};

export async function generateCardImage(build, theme = 'dark', format = 'desktop') {
  const colors = THEMES[theme] || THEMES.dark;
  const { width, height } = format === 'mobile' 
    ? { width: 900, height: 600 } 
    : { width: 1400, height: 850 };
  
  const cpu = build.components?.cpu?.name || 'N/A';
  const gpu = build.components?.gpu?.name || 'N/A';
  const evaluation = build.evaluation || {};
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1f3a;stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.accent}" stroke-width="0.5" opacity="0.08"/>
        </pattern>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      <rect width="${width}" height="${height}" fill="url(#grid)"/>
      
      <!-- Top Border Accent -->
      <line x1="0" y1="0" x2="${width}" y2="0" stroke="${colors.accent}" stroke-width="3"/>
      
      <!-- Header Section -->
      <text x="${width/2}" y="50" font-size="42" fill="${colors.accent}" text-anchor="middle" font-weight="bold" font-family="Arial, sans-serif">ManoTake</text>
      <text x="${width/2}" y="85" font-size="16" fill="${colors.secondary}" text-anchor="middle" opacity="0.9">PC BUILD ANALYZER</text>
      
      <!-- CPU Section -->
      <rect x="40" y="120" width="${(width-120)/2}" height="180" fill="${colors.accent}" opacity="0.1" rx="8" stroke="${colors.accent}" stroke-width="2"/>
      <circle cx="70" cy="155" r="12" fill="${colors.accent}"/>
      <text x="95" y="165" font-size="16" fill="${colors.accent}" font-weight="bold">PROCESSOR</text>
      <text x="95" y="190" font-size="13" fill="${colors.text}">${cpu.substring(0, 30)}</text>
      <text x="95" y="212" font-size="11" fill="${colors.text}" opacity="0.7">Cores: ${build.components?.cpu?.specs?.cores || '?'} | TDP: ${build.components?.cpu?.specs?.tdp || '?'}W</text>
      <text x="95" y="235" font-size="10" fill="${colors.secondary}" opacity="0.8">Performance: ${Math.round((build.components?.cpu?.specs?.performanceScore || 50)/10)}/10</text>
      <text x="95" y="255" font-size="10" fill="${colors.secondary}" opacity="0.8">Price: \$${build.components?.cpu?.price || '?'}</text>
      
      <!-- GPU Section -->
      <rect x="${(width-120)/2 + 70}" y="120" width="${(width-120)/2}" height="180" fill="${colors.secondary}" opacity="0.1" rx="8" stroke="${colors.secondary}" stroke-width="2"/>
      <circle cx="${(width-120)/2 + 100}" cy="155" r="12" fill="${colors.secondary}"/>
      <text x="${(width-120)/2 + 125}" y="165" font-size="16" fill="${colors.secondary}" font-weight="bold">GRAPHICS</text>
      <text x="${(width-120)/2 + 125}" y="190" font-size="13" fill="${colors.text}">${gpu.substring(0, 30)}</text>
      <text x="${(width-120)/2 + 125}" y="212" font-size="11" fill="${colors.text}" opacity="0.7">VRAM: ${build.components?.gpu?.specs?.vram || '?'}GB | CUDA: ${build.components?.gpu?.specs?.cudaCores || '?'}</text>
      <text x="${(width-120)/2 + 125}" y="235" font-size="10" fill="${colors.secondary}" opacity="0.8">Performance: ${Math.round((build.components?.gpu?.specs?.performanceScore || 50)/10)}/10</text>
      <text x="${(width-120)/2 + 125}" y="255" font-size="10" fill="${colors.secondary}" opacity="0.8">Price: \$${build.components?.gpu?.price || '?'}</text>
      
      <!-- Performance Metrics -->
      <text x="40" y="330" font-size="18" fill="${colors.accent}" font-weight="bold">⚡ PERFORMANCE ANALYSIS</text>
      
      <rect x="40" y="350" width="${(width-120)/3}" height="100" fill="${colors.accent}" opacity="0.05" rx="6" stroke="${colors.accent}" stroke-width="1"/>
      <text x="60" y="375" font-size="12" fill="${colors.text}">Overall Score</text>
      <text x="60" y="405" font-size="32" fill="${colors.accent}" font-weight="bold">${evaluation.performanceScore || 0}</text>
      <text x="60" y="425" font-size="10" fill="${colors.text}" opacity="0.6">/100</text>
      
      <rect x="${(width-120)/3 + 50}" y="350" width="${(width-120)/3}" height="100" fill="${colors.secondary}" opacity="0.05" rx="6" stroke="${colors.secondary}" stroke-width="1"/>
      <text x="${(width-120)/3 + 70}" y="375" font-size="12" fill="${colors.text}">Gaming (1080p)</text>
      <text x="${(width-120)/3 + 70}" y="405" font-size="32" fill="${colors.secondary}" font-weight="bold">${evaluation.gaming?.fps1080p || 0}</text>
      <text x="${(width-120)/3 + 70}" y="425" font-size="10" fill="${colors.text}" opacity="0.6">FPS</text>
      
      <rect x="${(width-120)/3*2 + 60}" y="350" width="${(width-120)/3}" height="100" fill="${colors.accent}" opacity="0.05" rx="6" stroke="${colors.accent}" stroke-width="1"/>
      <text x="${(width-120)/3*2 + 80}" y="375" font-size="12" fill="${colors.text}">Power</text>
      <text x="${(width-120)/3*2 + 80}" y="405" font-size="32" fill="${colors.accent}" font-weight="bold">${evaluation.powerConsumption || 0}</text>
      <text x="${(width-120)/3*2 + 80}" y="425" font-size="10" fill="${colors.text}" opacity="0.6">Watts</text>
      
      <!-- Bottleneck Info -->
      <text x="40" y="480" font-size="14" fill="${colors.text}" opacity="0.8">Bottleneck - CPU: ${evaluation.bottleneck?.cpuToGpu || 0}% | GPU: ${evaluation.bottleneck?.gpuToCpu || 0}%</text>
      <text x="40" y="505" font-size="14" fill="${colors.text}" opacity="0.8">PSU Headroom: ${evaluation.powerHeadroom || 0}% | Thermals: ${evaluation.thermals || 'Normal'}</text>
      
      <!-- Recommendation -->
      <rect x="40" y="530" width="${width-80}" height="80" fill="${colors.accent}" opacity="0.12" rx="8" stroke="${colors.accent}" stroke-width="2"/>
      <text x="60" y="560" font-size="14" fill="${colors.accent}" font-weight="bold">💡 VERDICT</text>
      <text x="60" y="590" font-size="15" fill="${colors.text}" font-weight="bold">${evaluation.recommendation || 'Analyzing...'}</text>
      
      <!-- Footer -->
      <line x1="40" y1="${height-30}" x2="${width-40}" y2="${height-30}" stroke="${colors.accent}" stroke-width="1" opacity="0.3"/>
      <text x="40" y="${height-10}" font-size="10" fill="${colors.text}" opacity="0.5">Generated by ManoTake © 2026 | Professional PC Build Analysis</text>
    </svg>
  `;
  
  return await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toBuffer();
}
