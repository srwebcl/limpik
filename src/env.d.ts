/// <reference types="astro/client" />

interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __limpikLoadGTM?: () => void;
    __gtmLoaded?: boolean;
}
