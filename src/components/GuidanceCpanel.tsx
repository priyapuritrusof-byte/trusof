/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CloudLightning, FolderTree, BookOpen, Download, HardDriveUpload, Check, ShieldCheck, ArrowRight, Video, FileCode } from 'lucide-react';

export default function GuidanceCpanel() {
  const [lang, setLang] = useState<'hindi' | 'english'>('english');
  const [activeStep, setActiveStep] = useState(1);

  const STEPS = [
    {
      num: 1,
      title: 'Export ZIP from AI Studio',
      titleHindi: 'AI Studio se ZIP Export karein',
      desc: 'In AI Studio, look at the top-right settings dropdown. Click on "Export project as ZIP" option. This will download a self-contained React directory containing all codebase structures immediately to your laptop/local system disk.',
      descHindi: 'AI Studio ke settings menu (downward arrow or config cog) par click kijiye aur "Export Project as ZIP" select karein. Isse aapki coding files instant download ho jayengi aapke local computer m.',
      icon: Download
    },
    {
      num: 2,
      title: 'Local Compiler Build',
      titleHindi: 'Local Build and Compile',
      desc: 'Extract your downloaded ZIP. In your command terminal, navigate to the extracted directory and run "npm install" followed by "npm run build" compilation script. This creates a clean optimized "dist/" directory containing single production html/js/css nodes.',
      descHindi: 'Downloaded file ko extract karein. Terminals me folder open karke do standard terminal commands run karein: "npm install" fir "npm run build". Isey code build hokar ek clean "dist/" automatic folder banayega jisme static responsive system files hongi.',
      icon: FileCode
    },
    {
      num: 3,
      title: 'Upload to cPanel File Manager',
      titleHindi: 'cPanel File Manager me Upload karein',
      desc: 'Log in to your web hosting account cPanel. Locate "File Manager" and click on "public_html" or your active subdomain subfolder (e.g. "shaadi.trusof.com"). Click upload, drag/drop the compressed ZIP of your compiled "dist/" folder there, and extract it.',
      descHindi: 'Apne hosting portal cPanel me log in karein. "File Manager" icon choose karein, fir "public_html" directory open karein (Subdomain h to "shaadi" folder control open karein). Compiled "dist/" directory ke contents ko zip banakar Upload karein aur wahan extract (unzip) kr dein.',
      icon: HardDriveUpload
    }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden p-6 sm:p-8">
      
      {/* Upper header information */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-50 pb-6 mb-6">
        <div className="flex items-center space-x-3.5 text-center md:text-left">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
            <CloudLightning className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
              cPanel Hosting Deployment Guide Hub
            </h3>
            <p className="text-xs text-slate-500 mt-1">Deploy shaadi.trusof.com interactive code correctly in 3 basic intervals</p>
          </div>
        </div>

        {/* Hindi / English translation selectors tabs */}
        <div className="flex bg-indigo-50/50 p-1 rounded-xl border border-indigo-150 text-xs font-bold gap-1 self-center scale-95">
          <button 
            type="button" 
            onClick={() => setLang('english')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${lang === 'english' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            English Guide
          </button>
          
          <button 
            type="button" 
            onClick={() => setLang('hindi')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${lang === 'hindi' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-950'}`}
          >
            हिन्दी गाइड (Hindi)
          </button>
        </div>
      </div>

      {/* Main explanation body */}
      <div className="space-y-6">
        
        {lang === 'hindi' ? (
          <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-50 text-xs sm:text-xs text-indigo-900 space-y-1.5">
            <p className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>cPanel me static React App setup karna behad aasaan hai!</span>
            </p>
            <p className="leading-relaxed">
              Kyunki humne is code ko <strong>Single Page React application</strong> system par deploy kiya hai, isko cPanel pe host karne ke liye koi costly VPS server ya dynamic NodeJS operations jaruri nhi hain. Aap pure setup ko simple static HTML folder download karke free hosting domain folder pe run kr sakte hain.
            </p>
          </div>
        ) : (
          <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-50 text-xs sm:text-xs text-indigo-900 space-y-1.5 font-sans">
            <p className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Hosting dynamic React apps on cPanel is simple &amp; cost-free!</span>
            </p>
            <p className="leading-relaxed">
              This application compiles into 100% static client-side single-page codes. You do not need expensive Node VPS servers on cPanel. Simply download, build static HTML components, upload directly using File Manager, and your matrimonial product shaadi.trusof.com is live in milliseconds!
            </p>
          </div>
        )}

        {/* Step by step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {STEPS.map((step) => {
            const S_Icon = step.icon;
            const heading = lang === 'hindi' ? step.titleHindi : step.title;
            const description = lang === 'hindi' ? step.descHindi : step.desc;
            const isActive = activeStep === step.num;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`text-left p-5 border rounded-2xl transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-indigo-950 shadow-md scale-102 font-bold'
                    : 'bg-white border-slate-100/70 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                  <S_Icon className="w-4 h-4" />
                </div>
                
                <h4 className="font-display font-extrabold text-sm mb-2">
                  Step {step.num}: {heading}
                </h4>

                <p className={`text-[11px] leading-relaxed font-sans font-medium line-clamp-4 ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {description}
                </p>
              </button>
            );
          })}
        </div>

        {/* File tree visual representation guide */}
        <div className="bg-slate-900 text-slate-400 rounded-2xl p-5 font-mono text-[11px] sm:text-xs space-y-3.5 border border-slate-850">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-white font-bold flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Expected cPanel public_html/ Directory Output</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded-sm">Vite Production</span>
          </div>

          <pre className="overflow-x-auto text-emerald-300">
{`📂 [public_html / or subdomain folder "shaadi.trusof.com"]
 ├── 📂 assets/              # Compressed single bundles (compiled JS and styles CSS)
 ├── 📄 index.html           # Main initial landing viewport entry gate
 ├── 📄 favicon.ico          # Mini browser tab icon
 └── 📄 .htaccess            # Optional Apache redirection file`}
          </pre>

          <p className="text-[10px] text-gray-500 font-sans tracking-wide leading-relaxed">
            * Tip: In cPanel, if you refresh any subpages and see a 404, create an `.htaccess` file in the same directory and add standard SPA rewrite rules:
            <code className="block bg-slate-950 text-slate-300 p-2 rounded-md mt-1 font-mono text-[9px]">
{`RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]`}
            </code>
          </p>
        </div>

        {/* Support escalation notice */}
        <div className="border border-indigo-150 bg-indigo-50/20 rounded-2xl p-4 flex items-center space-x-3 text-xs justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-slate-700">Need direct professional upload configuration support on shaadi.trusof.com?</span>
          </div>
          <a
            href="mailto:priyapuritrusof@gmail.com"
            className="bg-indigo-600 hover:bg-slate-900 text-white font-black px-4 py-2 rounded-xl text-[10.5px] uppercase transition-colors shrink-0"
          >
            Email Support Unit
          </a>
        </div>

      </div>

    </div>
  );
}
