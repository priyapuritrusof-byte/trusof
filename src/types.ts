/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string; // e.g. "5'6\"" or "5'11\""
  religion: string;
  caste: string;
  subCaste?: string;
  motherTongue: string;
  location: string;
  education: string;
  occupation: string;
  income: string; // e.g. "12 LPA", "8-10 LPA", "Business"
  avatar: string; // portrait Unsplash URL
  bio: string;
  verified: boolean;
  premium: boolean;
  horoscopeMatch?: string; // Gothra or Zodiac Sign
  compatibilityScore: number; // calculated dynamically
  phoneVerified: boolean;
  phone: string; // hidden by default, visible on "View Contact"
  email: string; // hidden by default, visible on "View Contact"
  ownerId?: string; // firebase user reference ID
  online?: boolean;
  lastActiveText?: string;
  hasPhoto?: boolean;
}

export interface SearchFilters {
  gender: 'All' | 'Male' | 'Female';
  ageMin: number;
  ageMax: number;
  religion: string;
  motherTongue: string;
  location: string;
  query: string;
}

export interface UserBiodata {
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  location: string;
  education: string;
  occupation: string;
  income: string;
  bio: string;
  horoscope: string;
  phone: string;
}
