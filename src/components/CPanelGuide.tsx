import { useState } from 'react';
import { Download, Server, Key, FolderOpen, CheckCircle, Smartphone, Globe, ArrowRight, HelpCircle, FileJson, Copy, Check } from 'lucide-react';

export default function CPanelGuide() {
  const [copiedHtaccessResult, setCopiedHtaccessResult] = useState(false);
  
  const htaccessContent = `# TRUSOF MATRIMONY REWRITE RULES FOR CPANEL
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>`;

  const copyHtaccess = () => {
    navigator.clipboard.writeText(htaccessContent);
    setCopiedHtaccessResult(true);
    setTimeout(() => setCopiedHtaccessResult(false), 2000);
  };

  const downloadHtaccess = () => {
    const element = document.createElement('a');
    const file = new Blob([htaccessContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '.htaccess';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm" id="cpanel-guide-section">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-rose-50 mb-6 gap-4">
        <div>
          <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <Server className="w-3.5 h-3.5" /> Direct Deploy Guide
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mt-2 tracking-tight">
            cPanel Hosting Par Website Upload Kaise Karein?
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Apni Trusof Matrimony (shaadi.trusof.com) site ko cPanel high-speed hosting par live karne ke pure steps niche diye gye hain.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs sm:text-sm">
        {/* Step 1 Build */}
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm shadow-sm">
            1
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900">1. Production Build Taiyar Karein</h4>
            <p className="text-gray-600 leading-relaxed text-[13px]">
              Sabse pehle project ke options ya settings menu se <strong>Export ZIP</strong> par click karke pure code ko download kijiye, ya is directory ka static copy banaiye. Terminal m command run karein:
            </p>
            <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] block select-all">
              npm run build
            </div>
            <p className="text-[11px] text-gray-500 italic">
              Yeh command aapko pure code ka ek optimized bundle file generate karke degi jise direct browser bin support karta h.
            </p>
          </div>
        </div>

        {/* Step 2 Locate dist */}
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm shadow-sm">
            2
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900">2. Locate and Zip the &quot;dist/&quot; folder</h4>
            <p className="text-gray-600 leading-relaxed text-[13px]">
              Build hone ke baad workspace root ke andar ek naya <strong>dist/</strong> folder ban jata h. 
            </p>
            <ul className="list-disc pl-4 text-[12px] text-gray-500 space-y-1">
              <li>Is <strong>dist</strong> folder ke andar ke sabhi files ko select karein.</li>
              <li>Sari files (index.html, assets, dynamic assets etc) ko <strong>ZIP Archive</strong> format m compress karein (e.g., <code>site.zip</code>).</li>
            </ul>
          </div>
        </div>

        {/* Step 3 Login cPanel */}
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm shadow-sm">
            3
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900">3. cPanel File Manager and Subdomain Setup</h4>
            <p className="text-gray-600 leading-relaxed text-[13px]">
              Apne control panel login karke <strong>File Manager</strong> open karein.
            </p>
            <ul className="list-disc pl-4 text-[12px] text-gray-500 space-y-1">
              <li>Aapka primary domain ho ya subdomain <code>shaadi.trusof.com</code>:</li>
              <li>Aapke subdomain ka custom folder locate karein (normally standard path <code>public_html/shaadi</code> ya direct <code>public_html</code> hota h).</li>
              <li>Waha apna compressed <code>site.zip</code> upload karke use <strong>Extract (Unzip)</strong> karein.</li>
            </ul>
          </div>
        </div>

        {/* Step 4 SPA Routing Custom Htaccess */}
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm shadow-sm">
            4
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-900">4. SPA Routing Setup (.htaccess)</h4>
            <p className="text-gray-600 leading-relaxed text-[13px]">
              Kyunki React ek Single Page Application h, cPanel Apache servers ko client-side URL parameters fallback ke liye ek <code>.htaccess</code> file ki jarurat hoti h.
            </p>
            <p className="text-[12px] text-rose-600 font-semibold">
              Isse direct page open karne par &quot;404 Not Found&quot; error nhi aayega! Niche se humara pre-generated rule download karein block ke liye.
            </p>
          </div>
        </div>
      </div>

      {/* HTACCESS GENERATOR SUB-BLOCK */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-5 mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-rose-600" />
            <span className="font-bold text-gray-800 text-sm">Download .htaccess File (For cPanel)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyHtaccess}
              className="py-1 px-3 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              {copiedHtaccessResult ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHtaccessResult ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={downloadHtaccess}
              className="py-1 px-3 rounded-lg text-xs font-semibold bg-rose-600 text-white flex items-center gap-1.5 hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
        <pre className="bg-slate-900 text-slate-300 p-3.5 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-40">
          {htaccessContent}
        </pre>
        <div className="text-[12px] text-slate-600 flex items-start gap-1.5">
          <span className="inline-block mt-1 font-bold text-rose-600">Pro-Tip:</span>
          <span>Is `.htaccess` file ko uncompressed site files ke sath hi root subfolder ke andar upload karein jisse sub-paths perfectly dynamic reload handle karein!</span>
        </div>
      </div>

      {/* TRUSOF BRAND ASSURANCE */}
      <div className="mt-8 border-t border-rose-50 pt-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Trusof Compatibility Assurance</h5>
          <p className="text-gray-500 text-[11px] sm:text-xs">
            Humara dynamic architecture fully lightweight single bundle compile hota h jo normal cheap shared hosting, cPanel server ya VPS hosting par 100% stable performance deta h.
          </p>
        </div>
      </div>
    </div>
  );
}
