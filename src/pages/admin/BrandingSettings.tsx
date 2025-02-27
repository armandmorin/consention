import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DEFAULT_BRANDING } from '../../config/constants';
import { Save, RefreshCw } from 'lucide-react';
import ConsentPopup from '../../components/consent/ConsentPopup';

const BrandingSettings: React.FC = () => {
  // Load saved branding from localStorage or use defaults
  const [branding, setBranding] = useState(() => {
    const savedBranding = localStorage.getItem('adminBranding');
    if (savedBranding) {
      try {
        const parsed = JSON.parse(savedBranding);
        return {
          ...parsed,
          logo: null as File | null // File can't be stored in localStorage
        };
      } catch (e) {
        console.error('Error parsing saved branding:', e);
      }
    }
    return {
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      textColor: DEFAULT_BRANDING.textColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      logo: null as File | null,
      logoPreview: '',
      position: 'bottom',
      theme: 'light',
    };
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Apply branding settings when component mounts
  useEffect(() => {
    // Apply the current branding settings to CSS variables
    document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor);
    
    // Log loaded settings
    console.log('Branding settings loaded:', branding);
    
    // Cleanup when component unmounts
    return () => {
      // If needed, cleanup CSS variables
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranding({
      ...branding,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBranding({
      ...branding,
      [name]: value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBranding({
        ...branding,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleReset = () => {
    // Reset to defaults
    const defaultBranding = {
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      textColor: DEFAULT_BRANDING.textColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      logo: null,
      logoPreview: '',
      position: 'bottom',
      theme: 'light',
    };
    
    setBranding(defaultBranding);
    
    // Clear saved settings
    localStorage.removeItem('adminBranding');
    console.log('Branding settings reset to defaults');
    
    // Show success message
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = () => {
    setSaving(true);
    
    try {
      // Save branding settings to localStorage
      const brandingToSave = { ...branding };
      delete brandingToSave.logo; // Can't store File object
      
      localStorage.setItem('adminBranding', JSON.stringify(brandingToSave));
      console.log('Branding settings saved to localStorage:', brandingToSave);
      
      // Apply the branding settings to the document if needed
      document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor);
      
      // Show success feedback
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving branding settings:', error);
      alert('Failed to save branding settings. Please try again.');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Branding Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customize Your Consent Popup</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    {branding.logoPreview ? (
                      <img src={branding.logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-gray-400">No logo</span>
                    )}
                  </div>
                  <div className="ml-5">
                    <div className="relative bg-white rounded-md shadow-sm">
                      <input
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="logo"
                        className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Choose file
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={branding.position}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="bottom">Bottom Banner</option>
                    <option value="top">Top Banner</option>
                    <option value="center">Center Modal</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={branding.theme}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="minimal">Minimal</option>
                    <option value="colorful">Colorful</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={branding.primaryColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={handleColorChange}
                      name="primaryColor"
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="secondaryColor"
                      name="secondaryColor"
                      value={branding.secondaryColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={handleColorChange}
                      name="secondaryColor"
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="accentColor"
                      name="accentColor"
                      value={branding.accentColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={handleColorChange}
                      name="accentColor"
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="textColor"
                      name="textColor"
                      value={branding.textColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.textColor}
                      onChange={handleColorChange}
                      name="textColor"
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="backgroundColor"
                      name="backgroundColor"
                      value={branding.backgroundColor}
                      onChange={handleColorChange}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.backgroundColor}
                      onChange={handleColorChange}
                      name="backgroundColor"
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Preview
                </button>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
            <div 
              className="border rounded-lg overflow-hidden" 
              style={{ backgroundColor: branding.backgroundColor }}
            >
              <div 
                className="p-3 flex items-center" 
                style={{ backgroundColor: branding.primaryColor }}
              >
                {branding.logoPreview && (
                  <img src={branding.logoPreview} alt="Logo" className="h-6 mr-2" />
                )}
                <span className="font-medium text-white">ConsentHub</span>
              </div>
              <div className="p-4">
                <h3 
                  className="text-sm font-medium mb-2" 
                  style={{ color: branding.textColor }}
                >
                  Cookie Consent
                </h3>
                <p 
                  className="text-xs mb-3" 
                  style={{ color: branding.textColor }}
                >
                  We use cookies to enhance your experience on our website. By clicking "Accept All", you consent to the use of all cookies.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="text-xs px-3 py-1 rounded-md"
                    style={{ 
                      backgroundColor: branding.secondaryColor,
                      color: 'white'
                    }}
                  >
                    Accept All
                  </button>
                  <button
                    className="text-xs px-3 py-1 rounded-md"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: branding.accentColor,
                      border: `1px solid ${branding.accentColor}`
                    }}
                  >
                    Customize
                  </button>
                  <button
                    className="text-xs px-3 py-1 rounded-md"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: branding.textColor,
                      border: `1px solid ${branding.textColor}`,
                      opacity: 0.7
                    }}
                  >
                    Reject All
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Branding Presets</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="p-3 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setBranding({
                      ...branding,
                      primaryColor: '#3B82F6',
                      secondaryColor: '#1E40AF',
                      accentColor: '#60A5FA',
                      textColor: '#1F2937',
                      backgroundColor: '#F9FAFB',
                    });
                  }}
                >
                  <div className="flex space-x-1 mb-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-800"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-xs text-gray-700">Blue Theme</span>
                </button>
                
                <button
                  type="button"
                  className="p-3 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setBranding({
                      ...branding,
                      primaryColor: '#10B981',
                      secondaryColor: '#065F46',
                      accentColor: '#34D399',
                      textColor: '#1F2937',
                      backgroundColor: '#F9FAFB',
                    });
                  }}
                >
                  <div className="flex space-x-1 mb-1">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="w-4 h-4 rounded-full bg-green-800"></div>
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs text-gray-700">Green Theme</span>
                </button>
                
                <button
                  type="button"
                  className="p-3 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setBranding({
                      ...branding,
                      primaryColor: '#8B5CF6',
                      secondaryColor: '#5B21B6',
                      accentColor: '#A78BFA',
                      textColor: '#1F2937',
                      backgroundColor: '#F9FAFB',
                    });
                  }}
                >
                  <div className="flex space-x-1 mb-1">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-800"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                  </div>
                  <span className="text-xs text-gray-700">Purple Theme</span>
                </button>
                
                <button
                  type="button"
                  className="p-3 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setBranding({
                      ...branding,
                      primaryColor: '#111827',
                      secondaryColor: '#374151',
                      accentColor: '#6B7280',
                      textColor: '#F9FAFB',
                      backgroundColor: '#1F2937',
                    });
                  }}
                >
                  <div className="flex space-x-1 mb-1">
                    <div className="w-4 h-4 rounded-full bg-gray-900"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-700"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  </div>
                  <span className="text-xs text-gray-700">Dark Theme</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-auto relative">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">This is your website content</p>
              </div>
              <ConsentPopup
                position={branding.position as any}
                theme={branding.theme as any}
                primaryColor={branding.primaryColor}
                secondaryColor={branding.secondaryColor}
                accentColor={branding.accentColor}
                textColor={branding.textColor}
                backgroundColor={branding.backgroundColor}
                logo={branding.logoPreview}
                companyName="Your Company"
                onAcceptAll={() => {}}
                onRejectAll={() => {}}
                onSavePreferences={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BrandingSettings;
