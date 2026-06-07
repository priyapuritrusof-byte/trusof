/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile } from '../types';

export interface DriveFileSummary {
  id: string;
  name: string;
  mimeType: string;
}

/**
 * Ensures the "Trusof_Shaadi_Biodatas" folder exists in the user's Google Drive.
 * Returns the folder ID.
 */
export async function getOrCreateDriveFolder(accessToken: string): Promise<string> {
  const folderName = 'Trusof_Shaadi_Biodatas';
  const query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!searchRes.ok) {
      throw new Error(`Failed to search Drive folder: ${searchRes.statusText}`);
    }
    
    const searchResult = await searchRes.json();
    if (searchResult.files && searchResult.files.length > 0) {
      return searchResult.files[0].id;
    }
    
    // Create new folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    
    if (!createRes.ok) {
      throw new Error(`Failed to create Drive folder: ${createRes.statusText}`);
    }
    
    const folderData = await createRes.json();
    return folderData.id;
  } catch (err) {
    console.error('Error in getOrCreateDriveFolder:', err);
    throw err;
  }
}

/**
 * Saves or updates a JSON biodata file in the "Trusof_Shaadi_Biodatas" folder.
 */
export async function saveBiodataToDrive(
  accessToken: string,
  profile: Profile,
  fileName: string = 'My_Biodata_Trusof_Shaadi.json'
): Promise<string> {
  try {
    // 1. Get or create parent folder
    const folderId = await getOrCreateDriveFolder(accessToken);
    
    // 2. Search if file already exists in folder to update instead of duplicate
    const fileQuery = `name = '${fileName}' and '${folderId}' in parents and trashed = false`;
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fileQuery)}&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    let fileId = '';
    if (searchRes.ok) {
      const searchResult = await searchRes.json();
      if (searchResult.files && searchResult.files.length > 0) {
        fileId = searchResult.files[0].id;
      }
    }
    
    const contentString = JSON.stringify(profile, null, 2);
    
    if (fileId) {
      // Overwrite existing file content
      const updateContentRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: contentString,
        }
      );
      
      if (!updateContentRes.ok) {
        throw new Error(`Failed to update biodata file: ${updateContentRes.statusText}`);
      }
      return fileId;
    } else {
      // Create metadata first
      const createMetaRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: 'application/json',
          parents: [folderId],
        }),
      });
      
      if (!createMetaRes.ok) {
        throw new Error(`Failed to create file metadata: ${createMetaRes.statusText}`);
      }
      
      const fileData = await createMetaRes.json();
      fileId = fileData.id;
      
      // Upload media content
      const uploadMediaRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: contentString,
        }
      );
      
      if (!uploadMediaRes.ok) {
        throw new Error(`Failed to upload file content: ${uploadMediaRes.statusText}`);
      }
      return fileId;
    }
  } catch (err) {
    console.error('Error in saveBiodataToDrive:', err);
    throw err;
  }
}

/**
 * Saves a stylized plain text biodata file of a candidate profile for human reading on Drive.
 */
export async function saveProfileSummaryToDrive(
  accessToken: string,
  profile: Profile
): Promise<string> {
  const fileName = `Biodata_${profile.name.replace(/\s+/g, '_')}_TS_${profile.id.replace('prof_', '')}.txt`;
  
  try {
    const folderId = await getOrCreateDriveFolder(accessToken);
    
    // Draft beautiful human-readable text
    const textContent = `=====================================================
            TRUSOF SHAADI MATRIMONIAL PORTAL (VERIFIED BIODATA)
=====================================================
Candidate Ref ID: #${profile.id.replace('prof_', 'TS-')}
Name            : ${profile.name}
Gender          : ${profile.gender}
Age             : ${profile.age} Years
Height          : ${profile.height}
Religion        : ${profile.religion}
Caste           : ${profile.caste} (${profile.subCaste || 'N/A'})
Mother Tongue   : ${profile.motherTongue}
Current Location: ${profile.location}

PROFESSIONAL BACKGROUND
-----------------------------------------------------
Highest Education: ${profile.education}
Current Occupation: ${profile.occupation}
Annual Income    : ${profile.income}

HOROSCOPE & COMPATIBILITY
-----------------------------------------------------
Horoscope Match   : ${profile.horoscopeMatch || 'Aries'}
Compatibility Score: ${profile.compatibilityScore || 95}% Match

PERSONAL BIO STATEMENT
-----------------------------------------------------
"${profile.bio}"

-----------------------------------------------------
For verified connection support, please reach out to:
Support Phone No : +91 9015558820
Website          : https://ai.studio/build
=====================================================`;

    // Create Metadata
    const createMetaRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        mimeType: 'text/plain',
        parents: [folderId],
      }),
    });
    
    if (!createMetaRes.ok) {
      throw new Error(`Failed to create plain text file metadata on Drive: ${createMetaRes.statusText}`);
    }
    
    const fileData = await createMetaRes.json();
    const fileId = fileData.id;
    
    // Upload Content
    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
        body: textContent,
      }
    );
    
    if (!uploadRes.ok) {
      throw new Error(`Failed to upload text biodata content: ${uploadRes.statusText}`);
    }
    return fileId;
    
  } catch (err) {
    console.error('Error in saveProfileSummaryToDrive:', err);
    throw err;
  }
}

/**
 * Lists all biodata JSON files saved in the "Trusof_Shaadi_Biodatas" folder.
 */
export async function listBiodataFilesOnDrive(accessToken: string): Promise<DriveFileSummary[]> {
  try {
    const folderId = await getOrCreateDriveFolder(accessToken);
    const query = `'${folderId}' in parents and mimeType = 'application/json' and trashed = false`;
    
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)&orderBy=modifiedTime desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!res.ok) {
      throw new Error(`Failed to list files: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Error in listBiodataFilesOnDrive:', err);
    return [];
  }
}

/**
 * Downloads and parses a JSON biodata file from Google Drive.
 */
export async function downloadBiodataFromDrive(accessToken: string, fileId: string): Promise<Partial<Profile>> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to download biodata: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error downloading biodata from Drive:', err);
    throw err;
  }
}
