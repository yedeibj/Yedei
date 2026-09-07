"use client";

import { useEffect, useState } from "react";

export default function InstallAppButtons() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: any) {
      e.preventDefault();
      setInstallPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleAndroidInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleAndroidInstall}
          disabled={!installPrompt}
          className="border border-paper/40 px-6 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {installPrompt ? "Installer sur Android" : "Ouvrir depuis Chrome Android"}
        </button>
        <button
          type="button"
          onClick={() => setShowIosGuide(true)}
          className="border border-paper/40 px-6 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-paper hover:text-ink"
        >
          Installer sur iPhone
        </button>
      </div>

      {showIosGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-white p-6 text-[#181715] sm:rounded-2xl"
          >
            <h3 className="font-display text-xl italic">Installer sur iPhone</h3>
            <ol className="mt-4 space-y-3 text-sm text-[#8C8579]">
              <li>1. Ouvre ce site dans <span className="font-medium text-[#181715]">Safari</span> (pas Chrome).</li>
              <li>2. Appuie sur l'icône <span className="font-medium text-[#181715]">Partager</span> (le carré avec une flèche vers le haut).</li>
              <li>3. Fais défiler et choisis <span className="font-medium text-[#181715]">"Sur l'écran d'accueil"</span>.</li>
              <li>4. Confirme en appuyant sur <span className="font-medium text-[#181715]">"Ajouter"</span>.</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="mt-6 w-full rounded-md bg-[#006400] py-3 text-sm uppercase tracking-wide text-white hover:opacity-90"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
