// Intégration Google Drive — OAuth via GIS + upload via Drive API REST
// Le Client ID vient de .env.local (VITE_GOOGLE_CLIENT_ID)

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

let tokenClient = null;
let accessToken = null;

// ── Chargement du script Google Identity Services ────────────
function loadGISScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Impossible de charger Google Identity Services.'));
    document.head.appendChild(script);
  });
}

// ── Initialisation du client OAuth ──────────────────────────
async function initTokenClient() {
  await loadGISScript();
  return new Promise((resolve) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) throw new Error(response.error);
        accessToken = response.access_token;
        resolve(accessToken);
      },
    });
  });
}

// ── Obtenir un access token (popup Google si nécessaire) ─────
export async function getGoogleAccessToken() {
  if (!CLIENT_ID) {
    throw new Error('Client ID Google non configuré. Ajoutez VITE_GOOGLE_CLIENT_ID dans .env.local.');
  }
  await initTokenClient();
  return new Promise((resolve, reject) => {
    tokenClient.callback = (response) => {
      if (response.error) { reject(new Error(response.error)); return; }
      accessToken = response.access_token;
      resolve(accessToken);
    };
    // Si on a déjà un token valide, on le réutilise sans popup
    if (accessToken) {
      resolve(accessToken);
    } else {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  });
}

// ── Upload un fichier PDF vers Google Drive ──────────────────
export async function uploadPDFToDrive(pdfBlob, filename) {
  const token = await getGoogleAccessToken();

  // Métadonnées du fichier
  const metadata = {
    name: filename,
    mimeType: 'application/pdf',
  };

  // Requête multipart : métadonnées + contenu binaire
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', pdfBlob, filename);

  const response = await fetch(DRIVE_UPLOAD_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Erreur Drive (${response.status})`);
  }

  const file = await response.json();

  // Rendre le fichier accessible en lecture via lien
  await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  return {
    id: file.id,
    name: file.name,
    url: `https://drive.google.com/file/d/${file.id}/view`,
  };
}

// ── Vérifie si Google Drive est configuré ───────────────────
export function isDriveConfigured() {
  return Boolean(CLIENT_ID);
}

// ── Déconnexion (révoque le token en mémoire) ────────────────
export function signOutGoogle() {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken);
  }
  accessToken = null;
}
