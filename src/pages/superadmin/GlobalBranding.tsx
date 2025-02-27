import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DEFAULT_BRANDING } from '../../config/constants';
import { Save, RefreshCw } from 'lucide-react';

const GlobalBranding: React.FC = () => {
  const [branding, setBranding] = useState({
    primaryColor: DEFAULT_BRANDING.primaryColor,
    secondaryColor: DEFAULT_BRANDING.secondaryColor,
    accentColor: DEFAULT_BRANDING.accentColor,
    textColor: DEFAULT_BRANDING.textColor,
    backgroundColor: DEFAULT_BRANDING.backgroundColor,
    logo: null as File | null,
    logoPreview: '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setBranding({
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      textColor: DEFAULT_BRANDING.textColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      logo: null,
      logoPreview: '',
    });
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout title="Global Branding">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Branding Settings</h2>
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

              <div className="flex justify-end space-x-3">
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
    </DashboardLayout>
  );
};

export default GlobalBranding;
