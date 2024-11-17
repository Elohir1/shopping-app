import { getCLS, getFID, getLCP } from 'web-vitals';

// Funkce pro odesílání webových metrik
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);  // Metriky pro CLS
    getFID(onPerfEntry);  // Metriky pro FID
    getLCP(onPerfEntry);  // Metriky pro LCP
  }
};

export { reportWebVitals };
