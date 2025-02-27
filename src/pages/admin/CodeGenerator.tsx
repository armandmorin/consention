import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ConsentScript from '../../components/consent/ConsentScript';
import ConsentPopup from '../../components/consent/ConsentPopup';
import { POPUP_POSITIONS, POPUP_THEMES } from '../../config/constants';
import { Copy, Check, Globe, Code } from 'lucide-react';

const CodeGenerator: React.FC = () => {
  const { clientId } = useParams<{ clientId?: string }>();
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Mock client data
  const client = {
    id: clientId || 'client123',
    name: 'Example Client',
    domain: 'example.com',
    settings: {
      position: 'bottom',
      theme: 'light',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      textColor: '#1F2937',
      backgroundColor: '#F9FAFB',
    }
  };

  const [settings, setSettings] = useState(client.settings);

  const handleCopyCode = () => {
    const scriptElement = document.getElementById('consent-script');
    if (scriptElement) {
      const scriptText = scriptElement.textContent || '';
      navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DashboardLayout title="Code Generator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  JavaScript Code Snippet
                </h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-500 mb-4">
                Add this code snippet to your website's <code><head></code> section to implement the consent popup.
              </p>
              <div id="consent-script" className="relative">
                <ConsentScript
                  clientId={client.id}
                  domain={client.domain}
                  position={settings.position}
                  theme={settings.theme}
                  primaryColor={settings.primaryColor}
                  secondaryColor={settings.secondaryColor}
                  accentColor={settings.accentColor}
                  textColor={settings.textColor}
                  backgroundColor={settings.backgroundColor}
                />
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Installation Instructions</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                    <li>Copy the code snippet above.</li>
                    <li>Paste it into the <code><head></code> section of your website's HTML.</li>
                    <li>The consent popup will automatically appear to visitors who haven't provided consent yet.</li>
                    <li>You can customize the appearance and behavior of the popup using the settings panel.</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Platform-specific Instructions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">WordPress</h5>
                    <p className="text-xs text-gray-600">
                      Add the code to your theme's header.php file or use a plugin like "Insert Headers and Footers".
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Shopify</h5>
                    <p className="text-xs text-gray-600">
                      Go to Online Store > Themes > Edit HTML/CSS > theme.liquid and add the code just before the closing </head> tag.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Wix</h5>
                    <p className="text-xs text-gray-600">
                      Go to Settings > Advanced > Custom Code and add the code to the Head section.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Squarespace</h5>
                    <p className="text-xs text-gray-600">
                      Go to Settings > Advanced > Code Injection and add the code to the Header section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customize Settings
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  value={settings.position}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {POPUP_POSITIONS.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {POPUP_THEMES.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                  Primary Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleSettingChange}
                    className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={handleSettingChange}
                    name="primaryColor"
                    className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                  Secondary Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleSettingChange}
                    className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={handleSettingChange}
                    name="secondaryColor"
                    className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">
                  Accent Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    value={settings.accentColor}
                    onChange={handleSettingChange}
                    className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={handleSettingChange}
                    name="accentColor"
                    className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">
                  Text Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="textColor"
                    name="textColor"
                    value={settings.textColor}
                    onChange={handleSettingChange}
                    className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.textColor}
                    onChange={handleSettingChange}
                    name="textColor"
                    className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    value={settings.backgroundColor}
                    onChange={handleSettingChange}
                    className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={handleSettingChange}
                    name="backgroundColor"
                    className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Update Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
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
                position={settings.position as any}
                theme={settings.theme as any}
                primaryColor={settings.primaryColor}
                secondaryColor={settings.secondaryColor}
                accentColor={settings.accentColor}
                textColor={settings.textColor}
                backgroundColor={settings.backgroundColor}
                companyName={client.name}
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

export default CodeGenerator;
