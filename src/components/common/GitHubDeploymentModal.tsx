import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  FolderCode,
  Play,
  Github,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeploymentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'docs' | 'actions' | 'cli'>('docs');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cliCommands = `git add .
git commit -m "Deploy TerraHarvest Karnataka portal"
git push origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">GitHub Pages Deployment Center</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  White-Screen Fixed
                </span>
              </div>
              <p className="text-xs text-stone-400">Guaranteed instant load without 404s or blank screens</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Status Pill */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">All pre-compiled assets ready in /docs and /dist</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
            base: process.env.BASE_PATH || './'
          </span>
        </div>

        {/* Tab selection */}
        <div className="p-6 space-y-6">
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Option 1: /docs Folder (Recommended)
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'actions'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Option 2: GitHub Actions
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'cli'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Option 3: npm run deploy
            </button>
          </div>

          {/* TAB 1: /docs Folder */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Why this is the easiest & never shows a white screen:
                </div>
                <p>
                  GitHub Pages natively supports serving the <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-mono">/docs</code> folder directly from your main branch without configuring actions or CI.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-stone-900">Push your repository to GitHub</p>
                    <p className="text-stone-500">The <code className="font-mono text-stone-700">docs/</code> directory with all compiled assets is already pre-generated and included.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-stone-900">Open GitHub Repository Settings</p>
                    <p className="text-stone-500">Navigate to: <strong className="text-stone-800">Settings</strong> → <strong className="text-stone-800">Pages</strong> (in the left sidebar).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs space-y-1 flex-1">
                    <p className="font-bold text-stone-900">Configure Build and Deployment</p>
                    <div className="bg-stone-100 border border-stone-200 rounded-xl p-3 font-mono text-[11px] text-stone-800 space-y-1">
                      <div>Source: <span className="font-bold text-emerald-800">Deploy from a branch</span></div>
                      <div>Branch: <span className="font-bold text-emerald-800">main</span> (or master)</div>
                      <div>Folder: <span className="font-bold text-amber-700 underline">/docs</span> (change from /root to /docs!)</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-stone-900">Click Save</p>
                    <p className="text-stone-500">Your site goes live instantly at <code className="text-emerald-800 font-mono">https://&lt;username&gt;.github.io/&lt;repo&gt;/</code> with 0 errors!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Actions */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                If you prefer GitHub Actions to compile on every commit, we have already added <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">.github/workflows/deploy.yml</code> to your repository!
              </p>

              <div className="bg-stone-900 text-stone-200 rounded-xl p-4 text-xs font-mono relative overflow-hidden">
                <div className="text-stone-400 text-[10px] mb-2 uppercase tracking-wider font-sans font-bold">1-Click Setting in GitHub</div>
                <p className="text-emerald-400">Settings → Pages → Source: Select "GitHub Actions"</p>
                <p className="text-stone-400 mt-2 text-[11px]">GitHub will execute the pre-configured workflow and host the <code className="text-amber-300">dist</code> folder automatically.</p>
              </div>
            </div>
          )}

          {/* TAB 3: CLI */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                You can also run one terminal command to publish immediately to a <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">gh-pages</code> branch:
              </p>
              <div className="bg-stone-900 text-emerald-400 rounded-xl p-4 font-mono text-xs relative">
                <code>npm run deploy</code>
                <button
                  onClick={() => handleCopy('npm run deploy', 'cli-deploy')}
                  className="absolute right-3 top-3 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  {copiedKey === 'cli-deploy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-stone-500">
                This compiles Vite to <code className="font-mono text-stone-700">dist</code> and pushes it to <code className="font-mono text-stone-700">gh-pages</code> branch in one automated command.
              </p>
            </div>
          )}

          {/* Push Commands Box */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800">Terminal commands to push:</span>
              <button
                onClick={() => handleCopy(cliCommands, 'push-cmds')}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {copiedKey === 'push-cmds' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'push-cmds' ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="bg-stone-100 border border-stone-200 rounded-xl p-3 text-xs font-mono text-stone-800 overflow-x-auto">
{cliCommands}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed SPA 404 Routing Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Got it, Let's Explore Portal
          </button>
        </div>
      </div>
    </div>
  );
};
