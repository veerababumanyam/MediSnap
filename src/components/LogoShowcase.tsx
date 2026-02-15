import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { Logo, LogoImage } from './LogoImage';
import { LOGO_PATHS, BRAND_COLORS, BRAND_NAME, BRAND_TAGLINE } from '../constants/branding';

/**
 * Logo showcase component - demonstrates all logo variations
 * This is for testing/demo purposes
 */
export const LogoShowcase: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{BRAND_NAME}</h1>
        <p className="text-xl text-gray-600 mb-8">{BRAND_TAGLINE}</p>

        {/* SVG Icon Component */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">SVG Icon Component (LogoIcon)</h2>
          <p className="text-gray-600 mb-4">Vector-based, scalable, and styleable with CSS</p>
          <div className="flex gap-8 items-center flex-wrap">
            <div className="text-center">
              <LogoIcon className="w-12 h-12 text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">48px Blue</p>
            </div>
            <div className="text-center">
              <LogoIcon className="w-16 h-16 text-green-600 mb-2" />
              <p className="text-sm text-gray-500">64px Green</p>
            </div>
            <div className="text-center">
              <LogoIcon className="w-24 h-24 text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">96px Purple</p>
            </div>
            <div className="text-center bg-gray-900 p-4 rounded">
              <LogoIcon className="w-16 h-16 text-white mb-2" />
              <p className="text-sm text-gray-400">White on Dark</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-100 p-3 rounded font-mono text-sm">
            {'<LogoIcon className="w-12 h-12 text-blue-600" />'}
          </div>
        </section>

        {/* PNG Logo Component - Preset Sizes */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">PNG Logo - Preset Sizes</h2>
          <p className="text-gray-600 mb-4">Optimized PNG versions with automatic size selection</p>
          <div className="flex gap-8 items-end flex-wrap">
            <div className="text-center">
              <Logo.Small className="mb-2" />
              <p className="text-sm text-gray-500">Small (48px)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{'<Logo.Small />'}</code>
            </div>
            <div className="text-center">
              <Logo.Medium className="mb-2" style={{ width: 100, height: 'auto' }} />
              <p className="text-sm text-gray-500">Medium (180px)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{'<Logo.Medium />'}</code>
            </div>
            <div className="text-center">
              <Logo.Large className="mb-2" style={{ width: 150, height: 'auto' }} />
              <p className="text-sm text-gray-500">Large (512px)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{'<Logo.Large />'}</code>
            </div>
          </div>
        </section>

        {/* All Available Sizes */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">All Icon Sizes</h2>
          <p className="text-gray-600 mb-4">Complete set of generated icons for all platforms</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries({
              'Favicon 16': LOGO_PATHS.favicon16,
              'Favicon 32': LOGO_PATHS.favicon32,
              'Favicon 48': LOGO_PATHS.favicon48,
              'Apple Touch': LOGO_PATHS.appleTouchIcon,
              'Android 192': LOGO_PATHS.androidChrome192,
              'Android 512': LOGO_PATHS.androidChrome512,
              'MS Icon 144': LOGO_PATHS.msIcon144,
              'MS Icon 310': LOGO_PATHS.msIcon310,
            }).map(([name, path]) => (
              <div key={name} className="text-center p-4 border rounded">
                <img src={path} alt={name} className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-gray-500 break-all mt-1">{path}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Colors */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div 
                className="w-full h-24 rounded-lg mb-2" 
                style={{ backgroundColor: BRAND_COLORS.primary }}
              />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs font-mono text-gray-500">{BRAND_COLORS.primary}</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-24 rounded-lg mb-2" 
                style={{ backgroundColor: BRAND_COLORS.primaryDark }}
              />
              <p className="text-sm font-medium">Primary Dark</p>
              <p className="text-xs font-mono text-gray-500">{BRAND_COLORS.primaryDark}</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-24 rounded-lg mb-2" 
                style={{ backgroundColor: BRAND_COLORS.primaryLight }}
              />
              <p className="text-sm font-medium">Primary Light</p>
              <p className="text-xs font-mono text-gray-500">{BRAND_COLORS.primaryLight}</p>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-24 rounded-lg mb-2 border-2" 
                style={{ backgroundColor: BRAND_COLORS.background }}
              />
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs font-mono text-gray-500">{BRAND_COLORS.background}</p>
            </div>
          </div>
        </section>

        {/* Social Media Preview */}
        <section className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Social Media Preview</h2>
          <p className="text-gray-600 mb-4">Open Graph image (1200×630) for Facebook, Twitter, LinkedIn</p>
          <div className="max-w-2xl">
            <img 
              src="/og-image.png" 
              alt="Open Graph Preview" 
              className="w-full border rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Import and use SVG icon:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { LogoIcon } from './components/icons/LogoIcon';

<LogoIcon className="w-8 h-8 text-blue-600" />`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Import and use PNG logo:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { Logo, LogoImage } from './components/LogoImage';

// Preset sizes
<Logo.Small />
<Logo.Medium className="rounded-lg" />
<Logo.Large />

// Custom configuration
<LogoImage 
  size="medium" 
  width={200} 
  rounded={true}
  className="shadow-lg" 
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Import brand constants:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { 
  LOGO_PATHS, 
  BRAND_COLORS, 
  BRAND_NAME 
} from './constants/branding';

<img src={LOGO_PATHS.appleTouchIcon} />
<div style={{ color: BRAND_COLORS.primary }}>
  {BRAND_NAME}
</div>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
