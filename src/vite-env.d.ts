/// <reference types="vite/client" />

// Add interface augmentation for window to include React globally
interface Window {
  React: typeof import('react');
}

// Make sure .jsx files are properly typed with React
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
