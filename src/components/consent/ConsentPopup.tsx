import React from 'react';

interface ConsentPopupProps {
  position: 'bottom' | 'top' | 'center' | 'bottom-right' | 'bottom-left';
  theme: 'light' | 'dark' | 'minimal' | 'colorful';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  logo?: string;
  companyName: string;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSavePreferences: () => void;
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({
  position,
  theme,
  primaryColor,
  secondaryColor,
  accentColor,
  textColor,
  backgroundColor,
  logo,
  companyName,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
}) => {
  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg';
      case 'bottom-right':
        return 'bottom-4 right-4 max-w-sm';
      case 'bottom-left':
        return 'bottom-4 left-4 max-w-sm';
      case 'bottom':
      default:
        return 'bottom-0 left-0 right-0';
    }
  };

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-gray-800 text-white',
          header: 'border-gray-700',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            tertiary: 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700',
          },
        };
      case 'minimal':
        return {
          container: 'bg-white text-gray-800 shadow-sm',
          header: 'border-gray-200',
          button: {
            primary: 'bg-gray-800 hover:bg-gray-900 text-white',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
            tertiary: 'bg-transparent text-gray-600 hover:text-gray-800',
          },
        };
      case 'colorful':
        return {
          container: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
          header: 'border-blue-400',
          button: {
            primary: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
            secondary: 'bg-purple-700 hover:bg-purple-800 text-white',
            tertiary: 'bg-transparent border border-white text-white hover:bg-white hover:text-purple-600',
          },
        };
      case 'light':
      default:
        return {
          container: 'bg-white text-gray-800 shadow-lg',
          header: 'border-gray-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
            tertiary: 'bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-100',
          },
        };
    }
  };

  const positionStyles = getPositionStyles();
  const themeStyles = getThemeStyles();

  // Custom styles based on props
  const customStyles = {
    container: {
      backgroundColor: backgroundColor,
      color: textColor,
    },
    header: {
      backgroundColor: primaryColor,
      color: '#ffffff',
    },
    primaryButton: {
      backgroundColor: secondaryColor,
      color: '#ffffff',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: accentColor,
      border: `1px solid ${accentColor}`,
    },
    tertiaryButton: {
      backgroundColor: 'transparent',
      color: textColor,
      border: `1px solid ${textColor}`,
      opacity: 0.7,
    },
  };

  return (
    <div
      className={`fixed ${positionStyles} z-50 overflow-hidden rounded-lg shadow-xl`}
      style={customStyles.container}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 flex items-center" style={customStyles.header}>
          {logo && <img src={logo} alt={`${companyName} logo`} className="h-6 mr-2" />}
          <span className="font-medium text-white">{companyName || 'Cookie Consent'}</span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">We value your privacy</h3>
          <p className="text-sm mb-4">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>

          {/* Cookie categories */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="necessary"
                checked
                disabled
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="necessary" className="ml-2 block text-sm">
                Necessary (Required)
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="preferences"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="preferences" className="ml-2 block text-sm">
                Preferences
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="statistics"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="statistics" className="ml-2 block text-sm">
                Statistics
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketing"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="marketing" className="ml-2 block text-sm">
                Marketing
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onAcceptAll}
              className="px-4 py-2 text-sm font-medium rounded-md"
              style={customStyles.primaryButton}
            >
              Accept All
            </button>
            <button
              onClick={onSavePreferences}
              className="px-4 py-2 text-sm font-medium rounded-md"
              style={customStyles.secondaryButton}
            >
              Save Preferences
            </button>
            <button
              onClick={onRejectAll}
              className="px-4 py-2 text-sm font-medium rounded-md"
              style={customStyles.tertiaryButton}
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;
