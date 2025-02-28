import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { DEFAULT_BRANDING } from '../../config/constants';
import { Save, RefreshCw, RefreshCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const GlobalBranding: React.FC = () => {
  const { user } = useAuth();
  
  // Load saved branding from Supabase or use defaults
  const [branding, setBranding] = useState(() => {
    return {
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      textColor: DEFAULT_BRANDING.textColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      logo: null as File | null,
      logoPreview: '',
      appDomain: '',
    };
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load branding settings from Supabase and apply them when component mounts
  useEffect(() => {
    // Safety mechanism to clear loading state if it gets stuck
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Loading state was stuck, forcing it to false");
        setLoading(false);
      }
    }, 3000);
    
    // Start loading the branding settings from Supabase
    const loadBrandingSettings = async () => {
      console.log("Loading branding settings from Supabase");
      setLoading(true);
      setError('');
      
      try {
        // First check if there's any settings in sessionStorage (for immediate display)
        const cachedSettings = sessionStorage.getItem('global_branding_settings');
        if (cachedSettings) {
          try {
            const parsedCache = JSON.parse(cachedSettings);
            console.log('Using cached branding settings:', parsedCache);
            
            setBranding(prev => ({
              ...prev,
              primaryColor: parsedCache.primaryColor || prev.primaryColor,
              secondaryColor: parsedCache.secondaryColor || prev.secondaryColor,
              accentColor: parsedCache.accentColor || prev.accentColor,
              textColor: parsedCache.textColor || prev.textColor,
              backgroundColor: parsedCache.backgroundColor || prev.backgroundColor,
              logoPreview: parsedCache.logoPreview || prev.logoPreview,
              appDomain: parsedCache.appDomain || prev.appDomain,
              logo: null as File | null
            }));
          } catch (cacheErr) {
            console.error('Error parsing cached settings:', cacheErr);
          }
        }
        
        // Get branding settings from Supabase (even if we used cache)
        const { data, error } = await supabase
          .from('global_settings')
          .select('*')
          .eq('type', 'branding')
          .single();
        
        if (error) {
          // If no settings found, this is likely the first time - not an error
          if (error.code === 'PGRST116') {
            console.log('No branding settings found, using defaults');
          } else {
            console.error('Error loading settings from Supabase:', error);
            throw error;
          }
        }
        
        // If we have data, use it
        if (data && data.settings) {
          console.log('Loaded branding from Supabase:', data.settings);
          
          // Validate the parsed data
          try {
            const settings = typeof data.settings === 'string' 
              ? JSON.parse(data.settings) 
              : data.settings;
              
            if (typeof settings === 'object' && settings !== null) {
              // Save to sessionStorage for quick access on page refresh
              sessionStorage.setItem('global_branding_settings', JSON.stringify(settings));
              
              setBranding(prev => ({
                ...prev,
                // Only apply valid properties
                primaryColor: settings.primaryColor || prev.primaryColor,
                secondaryColor: settings.secondaryColor || prev.secondaryColor,
                accentColor: settings.accentColor || prev.accentColor,
                textColor: settings.textColor || prev.textColor,
                backgroundColor: settings.backgroundColor || prev.backgroundColor,
                logoPreview: settings.logoPreview || prev.logoPreview,
                appDomain: settings.appDomain || prev.appDomain,
                logo: null as File | null
              }));
              
              // If logoPreview is a blob URL, try to convert it to a data URL
              if (settings.logoPreview && settings.logoPreview.startsWith('blob:')) {
                try {
                  console.log('Converting blob URL to data URL for persistence');
                  // This will only work if the blob is still available
                  const response = await fetch(settings.logoPreview);
                  const blob = await response.blob();
                  const reader = new FileReader();
                  reader.onload = function() {
                    const dataUrl = reader.result as string;
                    setBranding(prev => ({
                      ...prev,
                      logoPreview: dataUrl
                    }));
                    
                    // Update the saved settings with the data URL
                    const updatedSettings = {
                      ...settings,
                      logoPreview: dataUrl
                    };
                    sessionStorage.setItem('global_branding_settings', JSON.stringify(updatedSettings));
                  };
                  reader.readAsDataURL(blob);
                } catch (blobError) {
                  console.error('Error converting blob URL:', blobError);
                  // Blob might be gone, which is expected - ignore the error
                }
              }
            } else {
              throw new Error('Invalid branding data format');
            }
          } catch (e) {
            console.error('Error parsing saved global branding from Supabase:', e);
            // Fallback to defaults on error
            setBranding(prev => ({
              ...prev,
              primaryColor: DEFAULT_BRANDING.primaryColor,
              secondaryColor: DEFAULT_BRANDING.secondaryColor,
              accentColor: DEFAULT_BRANDING.accentColor,
              textColor: DEFAULT_BRANDING.textColor,
              backgroundColor: DEFAULT_BRANDING.backgroundColor,
            }));
            setError('Error loading saved branding settings, reverting to defaults');
          }
        }
        
        // If we reach here with no data, defaults will be used (already set in useState)
      } catch (err) {
        console.error('Error loading global branding:', err);
        setError('Failed to load branding settings');
      } finally {
        // Always ensure loading state is set to false
        setLoading(false);
      }
    };
    
    // Load settings when the component mounts
    loadBrandingSettings();
    
    // Clean up timer on unmount
    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);
  
  // Apply branding settings whenever they change
  useEffect(() => {
    // Apply the current branding settings to CSS variables
    document.documentElement.style.setProperty('--global-primary-color', branding.primaryColor);
    document.documentElement.style.setProperty('--global-secondary-color', branding.secondaryColor);
    
    // Log applied settings
    console.log('Applied global branding settings:', branding);
  }, [branding.primaryColor, branding.secondaryColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranding({
      ...branding,
      [name]: value,
    });
  };
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBranding({
      ...branding,
      appDomain: value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Convert the file to a data URL for better persistence
      const reader = new FileReader();
      reader.onload = function() {
        const dataUrl = reader.result as string;
        
        setBranding({
          ...branding,
          logo: file,
          logoPreview: dataUrl, // Use data URL instead of blob URL
        });
        
        // Save to session storage
        const currentSettings = JSON.parse(sessionStorage.getItem('global_branding_settings') || '{}');
        const updatedSettings = {
          ...currentSettings,
          logoPreview: dataUrl
        };
        sessionStorage.setItem('global_branding_settings', JSON.stringify(updatedSettings));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleReset = async () => {
    // Reset to defaults
    const defaultBranding = {
      primaryColor: DEFAULT_BRANDING.primaryColor,
      secondaryColor: DEFAULT_BRANDING.secondaryColor,
      accentColor: DEFAULT_BRANDING.accentColor,
      textColor: DEFAULT_BRANDING.textColor,
      backgroundColor: DEFAULT_BRANDING.backgroundColor,
      logo: null,
      logoPreview: '',
      appDomain: '',
    };
    
    setBranding(defaultBranding);
    setSaving(true);
    
    try {
      // Delete the settings from Supabase
      const { error } = await supabase
        .from('global_settings')
        .delete()
        .eq('type', 'branding');
        
      if (error) {
        console.error('Error deleting branding settings from Supabase:', error);
        throw error;
      }
      
      // Also update brandSettings for components
      localStorage.setItem('brandSettings', JSON.stringify({
        logo: '',
        primaryColor: DEFAULT_BRANDING.primaryColor,
        secondaryColor: DEFAULT_BRANDING.secondaryColor,
      }));
      
      console.log('Global branding settings reset to defaults');
      
      // Show success message
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error resetting branding settings:', error);
      setError('Failed to reset branding settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      // Prepare branding object for saving - create a safe copy
      const brandingToSave = {
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        accentColor: branding.accentColor,
        textColor: branding.textColor,
        backgroundColor: branding.backgroundColor,
        logoPreview: branding.logoPreview,
        appDomain: branding.appDomain
      };
      
      // Save to sessionStorage immediately to preserve across page refresh
      sessionStorage.setItem('global_branding_settings', JSON.stringify(brandingToSave));
      
      // Check if settings already exist for update or insert
      const { data: existingSettings } = await supabase
        .from('global_settings')
        .select('id')
        .eq('type', 'branding')
        .single();
      
      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('global_settings')
          .update({ 
            settings: brandingToSave,
            updated_at: new Date().toISOString()
          })
          .eq('type', 'branding');
      } else {
        // Insert new settings
        result = await supabase
          .from('global_settings')
          .insert([{ 
            type: 'branding', 
            settings: brandingToSave,
            created_by: user?.id || null
          }]);
      }
      
      if (result.error) {
        console.error('Error saving branding to Supabase:', result.error);
        throw result.error;
      }
      
      console.log('Global branding settings saved to Supabase:', brandingToSave);
      
      // Also update brandSettings in localStorage for UI components that use it
      localStorage.setItem('brandSettings', JSON.stringify({
        logo: brandingToSave.logoPreview,
        primaryColor: brandingToSave.primaryColor,
        secondaryColor: brandingToSave.secondaryColor,
      }));
      
      // Apply the branding settings to the document
      document.documentElement.style.setProperty('--global-primary-color', branding.primaryColor);
      document.documentElement.style.setProperty('--global-secondary-color', branding.secondaryColor);
      
      // Show success feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving global branding settings:', error);
      setError('Failed to save branding settings. Please try again.');
    } finally {
      // Always set saving to false at the end
      setSaving(false);
    }
  };

  // Reset loading state and refresh branding settings from Supabase
  const handleRefreshBranding = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch the latest settings from Supabase
      const { data, error } = await supabase
        .from('global_settings')
        .select('*')
        .eq('type', 'branding')
        .single();
      
      if (error) {
        // If no settings found, this might be the first time - not an error
        if (error.code === 'PGRST116') {
          console.log('No branding settings found in database');
          // Revert to defaults
          setBranding({
            primaryColor: DEFAULT_BRANDING.primaryColor,
            secondaryColor: DEFAULT_BRANDING.secondaryColor,
            accentColor: DEFAULT_BRANDING.accentColor,
            textColor: DEFAULT_BRANDING.textColor,
            backgroundColor: DEFAULT_BRANDING.backgroundColor,
            logo: null,
            logoPreview: '',
            appDomain: '',
          });
        } else {
          console.error('Error fetching branding settings:', error);
          throw error;
        }
      } else if (data && data.settings) {
        // Process the settings
        console.log('Refreshed branding from Supabase:', data.settings);
        
        // Handle different formats (string or object)
        const settings = typeof data.settings === 'string' 
          ? JSON.parse(data.settings) 
          : data.settings;
        
        // Validate and apply the settings
        if (typeof settings === 'object' && settings !== null) {
          setBranding(prev => ({
            ...prev,
            // Only apply valid properties
            primaryColor: settings.primaryColor || prev.primaryColor,
            secondaryColor: settings.secondaryColor || prev.secondaryColor,
            accentColor: settings.accentColor || prev.accentColor,
            textColor: settings.textColor || prev.textColor,
            backgroundColor: settings.backgroundColor || prev.backgroundColor,
            logoPreview: settings.logoPreview || prev.logoPreview,
            appDomain: settings.appDomain || prev.appDomain,
            logo: null as File | null
          }));
          
          // Update brandSettings in localStorage for components
          localStorage.setItem('brandSettings', JSON.stringify({
            logo: settings.logoPreview,
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
          }));
          
          // Apply to CSS variables
          document.documentElement.style.setProperty('--global-primary-color', settings.primaryColor);
          document.documentElement.style.setProperty('--global-secondary-color', settings.secondaryColor);
        } else {
          throw new Error('Invalid branding data format');
        }
      }
    } catch (err) {
      console.error('Error refreshing branding settings:', err);
      setError('Failed to refresh branding settings from the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Global Branding">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Branding Settings</h2>
              <button 
                onClick={handleRefreshBranding} 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
            
            {loading && (
              <div className="mb-4 flex items-center text-blue-500">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span>Loading settings...</span>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}
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

              <div>
                <label htmlFor="appDomain" className="block text-sm font-medium text-gray-700 mb-1">
                  App Domain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="appDomain"
                    name="appDomain"
                    value={branding.appDomain}
                    onChange={handleDomainChange}
                    placeholder="https://your-app-domain.com"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  The domain where your consent script will be hosted. Used to generate code snippets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
            
            {branding.appDomain && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Installation Code</h3>
                <code className="block p-2 bg-gray-100 rounded border text-xs overflow-x-auto whitespace-pre">
                  {`<script src="${branding.appDomain.replace(/\/$/, '')}/consent.js"></script>
<script>
  window.ConsentHub.init({
    clientId: "YOUR_CLIENT_ID"
  });
</script>`}
                </code>
              </div>
            )}
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
