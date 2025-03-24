interface ElectronAPI {
  getResourcePath: () => string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {}; 