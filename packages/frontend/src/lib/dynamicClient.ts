export const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || 'your-environment-id-here';

export const dynamicSettings = {
  environmentId: DYNAMIC_ENVIRONMENT_ID,
  
  cssOverrides: `
    .dynamic-widget { display: none !important; }
    .dynamic-modal { display: none !important; }
    .dynamic-auth-flow { display: none !important; }
    .dynamic-connect-button { display: none !important; }
  `,
}; 