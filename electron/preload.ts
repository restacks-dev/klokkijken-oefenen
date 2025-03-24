import { contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    getResourcePath: () => {
      if (process.env.VITE_DEV_SERVER_URL) {
        return '';
      }
      return process.resourcesPath + '/';
    }
  }
); 