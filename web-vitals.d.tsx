declare module 'web-vitals' {
    export function getCLS(onCLSReport: (metric: any) => void): void;
    export function getFID(onFIDReport: (metric: any) => void): void;
    export function getLCP(onLCPReport: (metric: any) => void): void;
  }
  