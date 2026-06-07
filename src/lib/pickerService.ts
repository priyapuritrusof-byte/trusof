/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import firebaseConfig from '../../firebase-applet-config.json';

// Declare types for gapi and google picker to prevent TypeScript compilation errors
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let pickerApiLoaded = false;

/**
 * Loads the Google GAPI script and initialises the Picker library.
 */
export function loadGooglePickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (pickerApiLoaded && window.gapi && window.gapi.load) {
      resolve();
      return;
    }

    // Check if script is already present
    const existingScript = document.getElementById('google-gapi-script');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.gapi && window.gapi.load) {
          clearInterval(checkInterval);
          window.gapi.load('picker', {
            callback: () => {
              pickerApiLoaded = true;
              resolve();
            },
            onerror: () => reject(new Error('Failed to load Google Picker via existing script')),
          });
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gapi-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load('picker', {
        callback: () => {
          pickerApiLoaded = true;
          resolve();
        },
        onerror: () => {
          reject(new Error('Failed to initialize Google Picker client library'));
        }
      });
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google API script'));
    };
    document.body.appendChild(script);
  });
}

export interface PickerParams {
  accessToken: string;
  mimeTypeFilter?: string; // e.g. "application/json" or "image/*"
  onSelect: (fileId: string, fileName: string, viewUrl?: string) => void;
  onCancel?: () => void;
}

/**
 * Renders the native Google Picker UI inside the browser window.
 */
export async function showGooglePicker({
  accessToken,
  mimeTypeFilter,
  onSelect,
  onCancel
}: PickerParams): Promise<void> {
  try {
    await loadGooglePickerApi();
    
    if (!window.google || !window.google.picker) {
      throw new Error('Google Picker library is not loaded properly');
    }

    const apiKey = firebaseConfig.apiKey;
    const projectId = firebaseConfig.projectId;

    // Create a view filter based on the mimeType requirement
    let view;
    if (mimeTypeFilter && mimeTypeFilter.includes('image')) {
      view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES);
    } else {
      // Default to general docs / folders or specifically JSON
      view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
      if (mimeTypeFilter) {
        view.setMimeTypes(mimeTypeFilter);
      }
    }

    // Set view constraints
    view.setMode(window.google.picker.DocsViewMode.LIST);

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .setAppId(projectId)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          const id = doc[window.google.picker.Document.ID];
          const name = doc[window.google.picker.Document.NAME];
          const url = doc[window.google.picker.Document.URL] || `https://drive.google.com/file/d/${id}/view`;
          onSelect(id, name, url);
        } else if (data.action === window.google.picker.Action.CANCEL) {
          if (onCancel) onCancel();
        }
      })
      .build();

    picker.setVisible(true);
    
    // Position/display hacks inside iframe environments if necessary
    const pickerFrames = document.getElementsByClassName('picker-dialog');
    if (pickerFrames && pickerFrames.length > 0) {
      for (let i = 0; i < pickerFrames.length; i++) {
        const frame = pickerFrames[i] as HTMLElement;
        frame.style.zIndex = '10000'; // Bring picker to top above any dialogs
      }
    }
  } catch (error) {
    console.error('Error starting Google Picker:', error);
    throw error;
  }
}
