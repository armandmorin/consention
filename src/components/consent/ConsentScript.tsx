import React from 'react';

interface ConsentScriptProps {
  clientId: string;
  domain: string;
  brandingSettings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    position: string;
    theme: string;
    logo?: string;
  };
}

const ConsentScript: React.FC<ConsentScriptProps> = ({ clientId, domain, brandingSettings }) => {
  const scriptCode = `
<script>
  (function() {
    // ConsentHub Script
    var ch = document.createElement('script');
    ch.type = 'text/javascript';
    ch.async = true;
    ch.src = 'https://cdn.consenthub.com/loader.js';
    ch.setAttribute('data-client-id', '${clientId}');
    ch.setAttribute('data-domain', '${domain}');
    
    // Branding settings
    ch.setAttribute('data-primary-color', '${brandingSettings.primaryColor}');
    ch.setAttribute('data-secondary-color', '${brandingSettings.secondaryColor}');
    ch.setAttribute('data-accent-color', '${brandingSettings.accentColor}');
    ch.setAttribute('data-text-color', '${brandingSettings.textColor}');
    ch.setAttribute('data-background-color', '${brandingSettings.backgroundColor}');
    ch.setAttribute('data-position', '${brandingSettings.position}');
    ch.setAttribute('data-theme', '${brandingSettings.theme}');
    ${brandingSettings.logo ? `ch.setAttribute('data-logo', '${brandingSettings.logo}');` : ''}
    
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ch, s);
  })();
</script>
  `;

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
      <pre>{scriptCode}</pre>
    </div>
  );
};

export default ConsentScript;
