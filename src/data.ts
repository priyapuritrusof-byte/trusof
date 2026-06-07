/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile } from './types';

// Let's preserve the original 8 core profiles so existing operations don't break.
const CORE_PROFILES: Profile[] = [
  {
    id: 'prof_1',
    name: 'Aishwarya Sharma',
    gender: 'Female',
    age: 26,
    height: "5'5\"",
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Saraswat',
    motherTongue: 'Hindi',
    location: 'Delhi, India',
    education: 'MBA (FMS Delhi)',
    occupation: 'Financial Analyst at EY',
    income: '18 LPA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'An optimistic, family-oriented individual who balances modern career outlook with traditional family values. I enjoy reading classical literature and exploring historical monuments.',
    verified: true,
    premium: true,
    horoscopeMatch: 'Manglik (Anshik)',
    compatibilityScore: 92,
    phoneVerified: true,
    phone: '+91 98765 43210',
    email: 'aishwarya.sharma@shaadi.trusof.com',
    online: true,
    lastActiveText: 'Online now',
    hasPhoto: true
  },
  {
    id: 'prof_2',
    name: 'Rahul Singhania',
    gender: 'Male',
    age: 29,
    height: "5'11\"",
    religion: 'Hindu',
    caste: 'Rajput',
    subCaste: 'Shekhawat',
    motherTongue: 'Hindi',
    location: 'Mumbai, Maharashtra',
    education: 'B.Tech + MS in Computer Science',
    occupation: 'Lead Architect at AWS',
    income: '45 LPA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Tech enthusiast who loves coffee, tennis, and long drives. Looking for a partner who is cheerful, understanding, and loves to challenge themselves creatively.',
    verified: true,
    premium: true,
    horoscopeMatch: 'Vrishabha',
    compatibilityScore: 88,
    phoneVerified: true,
    phone: '+91 99887 76655',
    email: 'rahul.singh@shaadi.trusof.com',
    online: true,
    lastActiveText: 'Active 5m ago',
    hasPhoto: true
  },
  {
    id: 'prof_3',
    name: 'Priya Iyer',
    gender: 'Female',
    age: 27,
    height: "5'3\"",
    religion: 'Hindu',
    caste: 'Iyer',
    subCaste: 'Vadama',
    motherTongue: 'Tamil',
    location: 'Bengaluru, Karnataka',
    education: 'M.S. in UX/UI Design (NID)',
    occupation: 'Senior UX Designer at Google',
    income: '28 LPA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
    bio: 'Passionate designer, Carnatic singer, and a yoga practitioner. Believes in mutual respect and growth in a relationship. I value honesty and a good sense of humor.',
    verified: true,
    premium: false,
    horoscopeMatch: 'Kanya',
    compatibilityScore: 95,
    phoneVerified: true,
    phone: '+91 91234 56789',
    email: 'priya.iyer@shaadi.trusof.com',
    online: false,
    lastActiveText: 'Active 4h ago',
    hasPhoto: true
  },
  {
    id: 'prof_4',
    name: 'Arjun Mehta',
    gender: 'Male',
    age: 28,
    height: "5'9\"",
    religion: 'Hindu',
    caste: 'Gujarati Vaishnav',
    subCaste: 'Shah',
    motherTongue: 'Gujarati',
    location: 'Ahmedabad, Gujarat',
    education: 'Chartered Accountant (CA)',
    occupation: 'Partner at Family CA Firm',
    income: '24 LPA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'Grounded business professional with deeply rooted traditional family values. Lover of vegetarian delicacies and exploring offbeat weekend getaways.',
    verified: true,
    premium: false,
    horoscopeMatch: 'Singh',
    compatibilityScore: 84,
    phoneVerified: true,
    phone: '+91 98980 12345',
    email: 'arjun.mehta@shaadi.trusof.com',
    online: false,
    lastActiveText: 'Active 1d ago',
    hasPhoto: true
  },
  {
    id: 'prof_5',
    name: 'Simran Kaur',
    gender: 'Female',
    age: 25,
    height: "5'6\"",
    religion: 'Sikh',
    caste: 'Jat Sikh',
    subCaste: 'Gill',
    motherTongue: 'Punjabi',
    location: 'Chandigarh, Punjab',
    education: 'M.D. Pediatrics',
    occupation: 'Resident Doctor',
    income: '15 LPA',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
    bio: 'Dedicated pediatrician who loves kids and animals. Enthusiastic about continuous learning, bhangra, and wellness. Seeking an active, supportively aligned career professional.',
    verified: true,
    premium: true,
    horoscopeMatch: 'Mesh',
    compatibilityScore: 91,
    phoneVerified: false,
    phone: '+91 88776 65544',
    email: 'simran.kaur@shaadi.trusof.com',
    online: true,
    lastActiveText: 'Online now',
    hasPhoto: true
  },
  {
    id: 'prof_6',
    name: 'Vikramjit Chatterjee',
    gender: 'Male',
    age: 31,
    height: "6'0\"",
    religion: 'Hindu',
    caste: 'Bengali Brahmin',
    subCaste: 'Mukherjee',
    motherTongue: 'Bengali',
    location: 'Kolkata, West Bengal',
    education: 'BFA & Masters in Fine Arts',
    occupation: 'Creative Art Director',
    income: '16 LPA',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'Intellectual with a deep love for independent cinema, Rabindra Sangeet, and organic framing. Friendly, calm, and respects individual personal space.',
    verified: false,
    premium: false,
    horoscopeMatch: 'Mithun',
    compatibilityScore: 80,
    phoneVerified: true,
    phone: '+91 90070 12345',
    email: 'vikram.chatt@shaadi.trusof.com',
    online: false,
    lastActiveText: 'Active 12h ago',
    hasPhoto: true
  },
  {
    id: 'prof_7',
    name: 'Dr. Aditi Rao',
    gender: 'Female',
    age: 28,
    height: "5'4\"",
    religion: 'Hindu',
    caste: 'Reddy',
    subCaste: 'Ganga',
    motherTongue: 'Telugu',
    location: 'Hyderabad, Telangana',
    education: 'MBBS, DNB Cardinals',
    occupation: 'Consulting Cardiologist',
    income: '35 LPA',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    bio: 'Balanced medical professional. I value work-life equilibrium and family weekend picnics. Looking for an educated, understanding partner with positive vibes.',
    verified: true,
    premium: true,
    horoscopeMatch: 'Tula',
    compatibilityScore: 89,
    phoneVerified: true,
    phone: '+91 94440 55667',
    email: 'aditi.rao@shaadi.trusof.com',
    online: true,
    lastActiveText: 'Active 12m ago',
    hasPhoto: true
  },
  {
    id: 'prof_8',
    name: 'Zafar Khan',
    gender: 'Male',
    age: 30,
    height: "5'10\"",
    religion: 'Muslim',
    caste: 'Pathan',
    subCaste: 'Khan',
    motherTongue: 'Urdu',
    location: 'Lucknow, Uttar Pradesh',
    education: 'M.Tech (IIT Delhi)',
    occupation: 'Data Scientist at Microsoft',
    income: '38 LPA',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    bio: 'Tech professional but poet at heart. I love Urdu poetry, gourmet food, and playing badminton. Seeking a partner with a sweet voice and modern progressive outlook.',
    verified: true,
    premium: true,
    horoscopeMatch: 'None',
    compatibilityScore: 87,
    phoneVerified: true,
    phone: '+91 70010 20304',
    email: 'zafar.khan@shaadi.trusof.com',
    online: false,
    lastActiveText: 'Active 3d ago',
    hasPhoto: true
  }
];

// Seed lists to support programmatic generation of highly realistic profiles
const femaleFirstNames = [
  'Priya', 'Neha', 'Pooja', 'Sneha', 'Riya', 'Anjali', 'Divya', 'Aarti', 'Preeti', 'Shreya',
  'Aanchal', 'Sakshi', 'Kajol', 'Muskan', 'Bhavya', 'Komal', 'Kiran', 'Jyoti', 'Shivani', 'Tanya',
  'Shweta', 'Nisha', 'Mansi', 'Payal', 'Megha', 'Tanvi', 'Pallavi', 'Ritu', 'Garima', 'Khushboo',
  'Swati', 'Deepa', 'Rekha', 'Anita', 'Sunita', 'Kavita', 'Sangeeta', 'Shailja', 'Rashmi', 'Srishti',
  'Kriti', 'Sonali', 'Shruti', 'Aditi', 'Swara', 'Vaishali', 'Prachi', 'Akanksha', 'Ishita', 'Rashi',
  'Meera', 'Rupali', 'Nandini', 'Gayatri', 'Kavya', 'Sanya', 'Aradhana', 'Charu', 'Riddhi', 'Siddhi',
  'Sheetal', 'Krutika', 'Nivedita', 'Alka', 'Bhumika', 'Seema', 'Poonam', 'Anushree', 'Snehal', 'Tripti',
  'Meenakshi', 'Urvashi', 'Amrita', 'Prerna', 'Kanika', 'Richa', 'Himani', 'Mona', 'Saloni', 'Niharika',
  'Juhi', 'Karishma', 'Urmila', 'Sushmita', 'Raveena', 'Vidya', 'Pranali', 'Esha', 'Gautami', 'Sujata',
  'Kalpana', 'Sunanda', 'Hema', 'Dhara', 'Kirti', 'Radhika', 'Nupur', 'Suman', 'Gauri', 'Sayali'
];

const maleFirstNames = [
  'Rahul', 'Rohit', 'Amit', 'Vikas', 'Sunil', 'Sanjay', 'Anil', 'Sandeep', 'Deepak', 'Ajay',
  'Vijay', 'Rajesh', 'Manish', 'Abhishek', 'Sunny', 'Ashish', 'Ramesh', 'Suresh', 'Dinesh', 'Naresh',
  'Mukesh', 'Pawan', 'Puneet', 'Gaurav', 'Saurav', 'Raj', 'Varun', 'Siddharth', 'Nikhil', 'Kartik',
  'Akshay', 'Karan', 'Arjun', 'Aditya', 'Harsh', 'Ayush', 'Aman', 'Rohan', 'Kabir', 'Kunal',
  'Sameer', 'Pranav', 'Piyush', 'Vivek', 'Sachin', 'Vikrant', 'Dev', 'Shivam', 'Shaurya', 'Madhav',
  'Raghav', 'Prashant', 'Aniket', 'Tarun', 'Anurag', 'Mayank', 'Sumit', 'Yash', 'Mohit', 'Ritesh',
  'Tushar', 'Pankaj', 'Hemant', 'Girish', 'Harish', 'Lalit', 'Manoj', 'Nitin', 'Pradeep', 'Rajiv',
  'Sanjeev', 'Satish', 'Sharad', 'Subhash', 'Vinay', 'Yogesh', 'Alok', 'Arvind', 'Bhupesh', 'Chaitanya',
  'Dushyant', 'Inder', 'Jitendra', 'Kailash', 'Lokesh', 'Mahendra', 'Pushkar', 'Raman', 'Shailendra', 'Umesh'
];

type CasteGroup = { caste: string; subCastes: string[] };

const HINDU_CASTES: CasteGroup[] = [
  { caste: 'Brahmin', subCastes: ['Saraswat', 'Kanyakubj', 'Gaur', 'Dubey', 'Tiwari', 'Pandey', 'Mishra', 'Shukla', 'Pathak'] },
  { caste: 'Rajput', subCastes: ['Chauhan', 'Rathore', 'Solanki', 'Tomar', 'Shekhawat', 'Sisodia', 'Chandel', 'Hada', 'Bhati'] },
  { caste: 'Vaishnav', subCastes: ['Agrawal', 'Gupta', 'Garg', 'Goel', 'Bansal', 'Singhal', 'Mittal', 'Jindal', 'Shah'] },
  { caste: 'Kayastha', subCastes: ['Srivastava', 'Saxena', 'Bhatnagar', 'Mathur', 'Nigam', 'Prasad', 'Verma'] },
  { caste: 'Reddy', subCastes: ['Ganga', 'Chittoor', 'Nellore', 'Kamma', 'Goud'] },
  { caste: 'Iyer', subCastes: ['Vadama', 'Vathima', 'Ashtasahasram', 'Brihacharanam'] },
  { caste: 'Patel', subCastes: ['Leva', 'Kadva', 'Amin', 'Charotar'] },
  { caste: 'Maratha', subCastes: ['Patil', 'Deshmukh', 'Shinde', 'Chavan', 'Pawar', 'Jadhav', 'More', 'Bhosale'] },
  { caste: 'Bengali Kayastha', subCastes: ['Bose', 'Ghosh', 'Mitra', 'Dutta', 'Roy', 'Sen'] }
];

const SIKH_CASTES: CasteGroup[] = [
  { caste: 'Jat Sikh', subCastes: ['Gill', 'Sidhu', 'Sandhu', 'Dhillon', 'Grewal', 'Chahal', 'Mann', 'Brar'] },
  { caste: 'Khatri Sikh', subCastes: ['Sodhi', 'Bedi', 'Ahluwalia', 'Kapoor', 'Khanna', 'Sethi'] },
  { caste: 'Arora Sikh', subCastes: ['Batra', 'Chawla', 'Grover', 'Mehta', 'Taneja'] }
];

const MUSLIM_CASTES: CasteGroup[] = [
  { caste: 'Sunni Pathan', subCastes: ['Khan', 'Sheikh', 'Pathan', 'Syed', 'Ansari', 'Siddiqui'] },
  { caste: 'Shia Syed', subCastes: ['Syed', 'Zaidi', 'Rizvi', 'Naqvi', 'Jafri'] }
];

const CHRISTIAN_CASTES: CasteGroup[] = [
  { caste: 'Roman Catholic', subCastes: ['Fernandes', 'D\'Souza', 'Pinto', 'Rodrigues', 'Gonsalves', 'Lobo'] },
  { caste: 'Protestant', subCastes: ['Thomas', 'Mathew', 'Kurian', 'George', 'Varghese', 'Joseph'] }
];

const JAIN_CASTES: CasteGroup[] = [
  { caste: 'Oswal Jain', subCastes: ['Shah', 'Mehta', 'Kothari', 'Chordia', 'Bafna', 'Bhandari'] },
  { caste: 'Digambar', subCastes: ['Jain', 'Singhal', 'Kansal', 'Goyal'] }
];

// Profile Avatars - high-quality curated portraits from Unsplash to look premium and authentic
const femaleUnsplashIds = [
  'photo-1534528741775-53994a69daeb', 'photo-1494790108377-be9c29b29330', 'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9', 'photo-1573496359142-b8d87734a5a2', 'photo-1544005313-94ddf0286df2',
  'photo-1580489944761-15a19d654956', 'photo-1614283233556-f35b0c801ef1', 'photo-1619380061814-58f03707f082',
  'photo-1607746882042-944635dfe10e', 'photo-1611590027211-b954fd027b51', 'photo-1508214751196-bcfd4ca60f91',
  'photo-1541185933-ef5d8ed016c2', 'photo-1551836022-d5d88e9218df', 'photo-1531746020798-e6953c6e8e04',
  'photo-1567532939604-b6b5b0db2604', 'photo-1587614382346-4ec70e388b28', 'photo-1594744803329-e58b31de215f',
  'photo-1598550874175-4d0ef436c909', 'photo-1601412436009-d964bd02edbc', 'photo-1620550478065-27a42b100780',
  'photo-1609505848912-f7c3b891d635', 'photo-1621572458462-fc8e330cac9f', 'photo-1619194617062-5a61b9c6a049',
  'photo-1601288496920-b6154fe3626a', 'photo-1593104547489-5cfb3839a3b5', 'photo-1438761681033-6461ffad8d80',
  'photo-1554151228-14d9def656e4', 'photo-1548142813-c348350df52b', 'photo-1542909168-82c3e7fdca5c'
];

const maleUnsplashIds = [
  'photo-1507003211169-0a1dd7228f2d', 'photo-1500648767791-00dcc994a43e', 'photo-1519085360753-af0119f7cbe7',
  'photo-1539571696357-5a69c17a67c6', 'photo-1506794778202-cad84cf45f1d', 'photo-1599566150163-29194dcaad36',
  'photo-1531427186611-ecfd6d936c79', 'photo-1492562080023-ab3db95bfbce', 'photo-1480427496522-8a491e59cd7f',
  'photo-1560250097-0b93528c311a', 'photo-1472099645785-5658abf4ff4e', 'photo-1513956589380-bad6acb9b9d4',
  'photo-1519345182560-3f2917c472ef', 'photo-1504257404165-0d530124b111', 'photo-1552058544-f2b08422138a',
  'photo-1501196354995-cbb51c65aaea', 'photo-1522075469751-3a6694fb2f61', 'photo-1500048993953-d23a436266cf',
  'photo-1521119989659-a83eee488004', 'photo-1542156822-6924d1a71aba', 'photo-1618015358954-115ef1ed1515',
  'photo-1618336753974-aae8e04506aa', 'photo-1511551203524-9a24350a5e83', 'photo-1534030347204-5240cfeb5747'
];

// Content phrases for high quality auto-generated matchmaking bios
const introFemales = [
  "An optimistic, well-educated, and self-dependent individual.",
  "Believes in balancing professional growth with deeply rooted cultural family values.",
  "A bubbly corporate professional who enjoys painting, music, and home gardening.",
  "Simple, caring daughter from a decent upper-middle-class family background.",
  "Modern in thoughts but values traditions and respects elder family blessings.",
  "Independent thinker, active IT professional, and a trained classical dancer.",
  "Quiet, artistic, and loves spending weekends exploring historic architectural spots.",
  "Dedicated and career-oriented, looking to share life with an equally motivated companion."
];

const introMales = [
  "Focused career-driven individual who loves playing badminton, trekking, and technology.",
  "Simple, energetic, and family-oriented person rooted in traditional values.",
  "Warm, outgoing software professional with a passion for cooking and weekend escapes.",
  "Well-settled professional from a polite business class household.",
  "Ambitious but humble, loves playing musical instruments and outdoor adventures.",
  "Enjoys filter coffee, reading books on history, and daily fitness routines.",
  "Honest, cheerful partner with progressive outlook and a strong work-life balance.",
  "A friendly gentleman looking for a meaningful compatibility match to settle down with."
];

const interestsList = [
  "enjoys reading classical literature, listening to soulful music, and traveling to mountains.",
  "passionate about gourmet cooking, continuous learning, and active fitness.",
  "loves world cinema, photography, and exploring offbeat culinary trails.",
  "enjoys practicing morning yoga, playing chess, and weekend trekking.",
  "interested in music concerts, long drives, and local community volunteer work.",
  "loves sketching, playing table tennis, and brewing specialty tea and coffee."
];

const partnerExps = [
  "Looking for an understanding, broad-minded, and stable companion to share a beautiful life journey.",
  "Seeking an educated, warm, and loving partner who respects family values and individual growth.",
  "Hoping to meet a happy, supportive soul with career ambitions and positive vibes.",
  "Looking for someone emotionally mature, caring, and ready to walk together through thick and thin.",
  "Seeking a sweet, genuine partner who has independent opinions and respects elders."
];

const educationDegrees = [
  'B.Tech in Computer Science', 'M.Tech / ME Specialist', 'MBA (IIM Alumnus)', 'MBA from Tier-1 b-school',
  'Chartered Accountant (CA)', 'M.S. in Software Systems', 'MBBS, Resident Surgeon', 'M.D. Cardiologist',
  'BFA, Senior Visualizer', 'MCA Post-Graduate', 'B.Com & Finance Consultant', 'Ph.D in Applied Sciences'
];

const occupations = [
  'Senior Software Engineer', 'Product Manager at MNC', 'Investment Banker', 'Chartered Accountant Partner',
  'Lead UX Architect', 'Consultant Doctor', 'Strategy Lead', 'Brand Manager', 'AI Data Scientist',
  'Business Advisor', 'Civil Services Officer', 'Research Scientist'
];

const HOROSCOPES = [
  'Mesh / Bharani', 'Vrishabha / Rohini', 'Mithun / Ardra', 'Karka / Pushya', 'Simha / Magha',
  'Kanya / Hasta', 'Tula / Chitra', 'Vrishchik / Anuradha', 'Dhanu / Mula', 'Makar / Shravana',
  'Kumbh / Shatabhisha', 'Meen / Revati'
];

// Simple, deterministic seed random generator so the data remains consistent across client sessions
let seedIndex = 12948;
function seedRand() {
  const x = Math.sin(seedIndex++) * 10000;
  return x - Math.floor(x);
}

function selectRandom<T>(arr: T[]): T {
  return arr[Math.floor(seedRand() * arr.length)];
}

function selectRandomRange(min: number, max: number): number {
  return Math.floor(seedRand() * (max - min + 1)) + min;
}

// Prepare dynamic additions to reach exactly 305 females and 205 males
const extraProfiles: Profile[] = [];

// To reach exactly 305 Females, we need to generate: 305 - 4 (from CORE_PROFILES that are female) = 301 females
// profiles: spec 1 (Female: ID prof_1, prof_3, prof_5, prof_7)
const totalFemaleTarget = 301;
const femaleFirstNamesCount = femaleFirstNames.length;

for (let i = 1; i <= totalFemaleTarget; i++) {
  const firstName = femaleFirstNames[(i - 1) % femaleFirstNamesCount];
  // Determine location, mother tongue, religion
  const rel = selectRandom(['Hindu', 'Hindu', 'Hindu', 'Hindu', 'Sikh', 'Muslim', 'Christian', 'Jain']);
  
  let loc = selectRandom([
    'Delhi, India', 'Mumbai, Maharashtra', 'Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Ahmedabad, Gujarat',
    'Chandigarh, Punjab', 'Kolkata, West Bengal', 'Lucknow, Uttar Pradesh', 'Pune, Maharashtra', 'Chennai, Tamil Nadu'
  ]);
  
  let motherTongue = 'Hindi';
  let casteGroup: CasteGroup = selectRandom(HINDU_CASTES);
  let caste = casteGroup.caste;
  let subCaste = selectRandom(casteGroup.subCastes);
  let lastName = selectRandom(casteGroup.subCastes);

  if (rel === 'Sikh') {
    loc = selectRandom(['Chandigarh, Punjab', 'Delhi, India']);
    motherTongue = 'Punjabi';
    casteGroup = selectRandom(SIKH_CASTES);
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = selectRandom(['Kaur', 'Gill', 'Sidhu', 'Sandhu', 'Dhillon', 'Grewal', 'Sodhi', 'Ahluwalia']);
  } else if (rel === 'Muslim') {
    motherTongue = selectRandom(['Urdu', 'Hindi', 'English']);
    casteGroup = selectRandom(MUSLIM_CASTES);
    caste = 'Muslim';
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else if (rel === 'Christian') {
    loc = selectRandom(['Goa, India', 'Chennai, Tamil Nadu', 'Bengaluru, Karnataka', 'Mumbai, Maharashtra']);
    motherTongue = 'English';
    casteGroup = selectRandom(CHRISTIAN_CASTES);
    caste = 'Christian';
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else if (rel === 'Jain') {
    loc = selectRandom(['Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Mumbai, Maharashtra']);
    motherTongue = selectRandom(['Gujarati', 'Hindi']);
    casteGroup = selectRandom(JAIN_CASTES);
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else {
    // Hindu with regional adjustments
    if (loc.includes('Bengaluru') || loc.includes('Chennai') || loc.includes('Hyderabad')) {
      motherTongue = selectRandom(['Tamil', 'Telugu', 'Kannada']);
      const southCastes = HINDU_CASTES.filter(cg => ['Iyer', 'Reddy', 'Kayastha'].includes(cg.caste));
      casteGroup = southCastes.length > 0 ? selectRandom(southCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Kolkata')) {
      motherTongue = 'Bengali';
      const bCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Bengali'));
      casteGroup = bCastes.length > 0 ? selectRandom(bCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Ahmedabad')) {
      motherTongue = 'Gujarati';
      const gCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Patel') || cg.caste.includes('Vaishnav'));
      casteGroup = gCastes.length > 0 ? selectRandom(gCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Mumbai') || loc.includes('Pune')) {
      motherTongue = selectRandom(['Marathi', 'Hindi']);
      const mCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Maratha'));
      casteGroup = mCastes.length > 0 ? selectRandom(mCastes) : HINDU_CASTES[0];
    } else {
      motherTongue = 'Hindi';
      const nCastes = HINDU_CASTES.filter(cg => ['Brahmin', 'Rajput', 'Vaishnav', 'Kayastha'].includes(cg.caste));
      casteGroup = nCastes.length > 0 ? selectRandom(nCastes) : HINDU_CASTES[0];
    }
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  }

  const age = selectRandomRange(21, 31);
  const ft = selectRandomRange(5, 5);
  const inch = selectRandomRange(0, 8);
  const height = `${ft}'${inch}"`;
  
  const incomeLPA = selectRandomRange(6, 40);
  const income = `${incomeLPA} LPA`;

  const bio = `${selectRandom(introFemales)} I am someone who ${selectRandom(interestsList)} ${selectRandom(partnerExps)}`;
  const avatarId = femaleUnsplashIds[i % femaleUnsplashIds.length];
  const avatarUrl = `https://images.unsplash.com/${avatarId}?q=80&w=400&fit=crop&auto=format`;

  extraProfiles.push({
    id: `female_${i}`,
    name: `${firstName} ${lastName}`,
    gender: 'Female',
    age,
    height,
    religion: rel,
    caste,
    subCaste,
    motherTongue,
    location: loc,
    education: selectRandom(educationDegrees),
    occupation: selectRandom(occupations),
    income,
    avatar: avatarUrl,
    bio,
    verified: seedRand() > 0.15, // 85% verified status
    premium: seedRand() > 0.4, // 60% premium status
    horoscopeMatch: selectRandom(HOROSCOPES),
    compatibilityScore: selectRandomRange(74, 98),
    phoneVerified: seedRand() > 0.1,
    phone: `+91 90155 ${String(50000 + i)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@shaadi.trusof.com`,
    online: seedRand() > 0.65,
    lastActiveText: selectRandom(['Online now', 'Active 10m ago', 'Active 1h ago', 'Active yesterday', 'Online now']),
    hasPhoto: true
  });
}

// To reach exactly 205 Males, we need to generate: 205 - 4 (from CORE_PROFILES that are male) = 201 males
// profiles: spec 2 (Male: ID prof_2, prof_4, prof_6, prof_8)
const totalMaleTarget = 201;
const maleFirstNamesCount = maleFirstNames.length;

for (let i = 1; i <= totalMaleTarget; i++) {
  const firstName = maleFirstNames[(i - 1) % maleFirstNamesCount];
  const rel = selectRandom(['Hindu', 'Hindu', 'Hindu', 'Hindu', 'Sikh', 'Muslim', 'Christian', 'Jain']);
  
  let loc = selectRandom([
    'Delhi, India', 'Mumbai, Maharashtra', 'Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Ahmedabad, Gujarat',
    'Chandigarh, Punjab', 'Kolkata, West Bengal', 'Lucknow, Uttar Pradesh', 'Pune, Maharashtra', 'Chennai, Tamil Nadu'
  ]);
  
  let motherTongue = 'Hindi';
  let casteGroup: CasteGroup = selectRandom(HINDU_CASTES);
  let caste = casteGroup.caste;
  let subCaste = selectRandom(casteGroup.subCastes);
  let lastName = selectRandom(casteGroup.subCastes);

  if (rel === 'Sikh') {
    loc = selectRandom(['Chandigarh, Punjab', 'Delhi, India']);
    motherTongue = 'Punjabi';
    casteGroup = selectRandom(SIKH_CASTES);
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = selectRandom(['Singh', 'Gill', 'Sidhu', 'Sandhu', 'Dhillon', 'Grewal', 'Sodhi', 'Ahluwalia']);
  } else if (rel === 'Muslim') {
    motherTongue = selectRandom(['Urdu', 'Hindi', 'English']);
    casteGroup = selectRandom(MUSLIM_CASTES);
    caste = 'Muslim';
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else if (rel === 'Christian') {
    loc = selectRandom(['Goa, India', 'Chennai, Tamil Nadu', 'Bengaluru, Karnataka', 'Mumbai, Maharashtra']);
    motherTongue = 'English';
    casteGroup = selectRandom(CHRISTIAN_CASTES);
    caste = 'Christian';
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else if (rel === 'Jain') {
    loc = selectRandom(['Ahmedabad, Gujarat', 'Jaipur, Rajasthan', 'Mumbai, Maharashtra']);
    motherTongue = selectRandom(['Gujarati', 'Hindi']);
    casteGroup = selectRandom(JAIN_CASTES);
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  } else {
    // Hindu with regional adjustments
    if (loc.includes('Bengaluru') || loc.includes('Chennai') || loc.includes('Hyderabad')) {
      motherTongue = selectRandom(['Tamil', 'Telugu', 'Kannada']);
      const southCastes = HINDU_CASTES.filter(cg => ['Iyer', 'Reddy', 'Kayastha'].includes(cg.caste));
      casteGroup = southCastes.length > 0 ? selectRandom(southCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Kolkata')) {
      motherTongue = 'Bengali';
      const bCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Bengali'));
      casteGroup = bCastes.length > 0 ? selectRandom(bCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Ahmedabad')) {
      motherTongue = 'Gujarati';
      const gCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Vaishnav') || cg.caste.includes('Patel'));
      casteGroup = gCastes.length > 0 ? selectRandom(gCastes) : HINDU_CASTES[0];
    } else if (loc.includes('Mumbai') || loc.includes('Pune')) {
      motherTongue = selectRandom(['Marathi', 'Hindi']);
      const mCastes = HINDU_CASTES.filter(cg => cg.caste.includes('Maratha'));
      casteGroup = mCastes.length > 0 ? selectRandom(mCastes) : HINDU_CASTES[0];
    } else {
      motherTongue = 'Hindi';
      const nCastes = HINDU_CASTES.filter(cg => ['Brahmin', 'Rajput', 'Vaishnav', 'Kayastha'].includes(cg.caste));
      casteGroup = nCastes.length > 0 ? selectRandom(nCastes) : HINDU_CASTES[0];
    }
    caste = casteGroup.caste;
    subCaste = selectRandom(casteGroup.subCastes);
    lastName = subCaste;
  }

  const age = selectRandomRange(24, 35);
  const ft = selectRandomRange(5, 6);
  const inch = selectRandomRange(ft === 6 ? 0 : 5, ft === 6 ? 3 : 11);
  const height = `${ft}'${inch}"`;
  
  const incomeLPA = selectRandomRange(10, 80);
  const income = `${incomeLPA} LPA`;

  const bio = `${selectRandom(introMales)} I am someone who ${selectRandom(interestsList)} ${selectRandom(partnerExps)}`;
  const avatarId = maleUnsplashIds[i % maleUnsplashIds.length];
  const avatarUrl = `https://images.unsplash.com/${avatarId}?q=80&w=400&fit=crop&auto=format`;

  extraProfiles.push({
    id: `male_${i}`,
    name: `${firstName} ${lastName}`,
    gender: 'Male',
    age,
    height,
    religion: rel,
    caste,
    subCaste,
    motherTongue,
    location: loc,
    education: selectRandom(educationDegrees),
    occupation: selectRandom(occupations),
    income,
    avatar: avatarUrl,
    bio,
    verified: seedRand() > 0.15,
    premium: seedRand() > 0.4,
    horoscopeMatch: selectRandom(HOROSCOPES),
    compatibilityScore: selectRandomRange(74, 98),
    phoneVerified: seedRand() > 0.1,
    phone: `+91 90155 ${String(60000 + i)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@shaadi.trusof.com`,
    online: seedRand() > 0.65,
    lastActiveText: selectRandom(['Online now', 'Active 15m ago', 'Active 4h ago', 'Active yesterday', 'Online now']),
    hasPhoto: true
  });
}

// Assemble full export array (Deterministic consistent compilation)
export const INITIAL_PROFILES: Profile[] = [
  ...CORE_PROFILES,
  ...extraProfiles
];

export const RELIGIONS = ['All', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi'];

export const MOTHER_TONGUES = [
  'All',
  'Hindi',
  'Punjabi',
  'Bengali',
  'Gujarati',
  'Tamil',
  'Telugu',
  'Kannada',
  'Marathi',
  'Malayalam',
  'Urdu',
  'English'
];

export const LOCATIONS = [
  'All',
  'Delhi, India',
  'Mumbai, Maharashtra',
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Ahmedabad, Gujarat',
  'Chandigarh, Punjab',
  'Kolkata, West Bengal',
  'Lucknow, Uttar Pradesh',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu'
];
