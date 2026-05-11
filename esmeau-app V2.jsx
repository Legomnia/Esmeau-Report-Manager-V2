import React from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createRoot } from 'react-dom/client';
import { Plus, Search, Camera, Mic, MicOff, ArrowLeft, ArrowRight, Save, Edit, Eye, Trash2, CheckCircle, Clock, X, Check, Share2, Printer, Mail, Settings, FileText, CheckCircle2, PenTool, BarChart3, AlertCircle, MapPin, Calendar, LayoutGrid, CalendarDays } from "lucide-react";

// Supabase sera intégré ultérieurement - localStorage uniquement pour le moment
const isSupabaseConfigured = () => false;
const reportsAPI = { getAll: async () => null, create: async () => null, update: async () => null, delete: async () => null };

/* ═══════════════════════════════════════════════════════
   CONTEXTUAL SVG ICON SYSTEM  —  all 24×24, stroke-based
   Each icon is purpose-built for its section context
   ═══════════════════════════════════════════════════════ */
const WI = ({ name, size = 20, color = "currentColor", className = "" }) => {
  const s = { width:size, height:size, viewBox:"0 0 24 24", fill:"none",
    stroke:color, strokeWidth:"1.7", strokeLinecap:"round", strokeLinejoin:"round", className };
  const icons = {

    /* ─────────────────────────────────────────────────────
       SECTION ICONS
       ───────────────────────────────────────────────────── */

    /* §0 Informations générales — identity card / dossier */
    id_card: <svg {...s}>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <circle cx="8" cy="11" r="2.5"/>
      <path d="M5.5 17c0-2 1.2-3.5 2.5-3.5s2.5 1.5 2.5 3.5"/>
      <path d="M14 9h5M14 13h5M14 16.5h3.5"/>
    </svg>,

    /* §1 Objet de l'intervention — clipboard with water drop complaint */
    clipboard_drop: <svg {...s}>
      <rect x="8" y="2" width="8" height="4" rx="1.5"/>
      <path d="M8 4H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3"/>
      <path d="M12 10c0 0-2.5 3.2-2.5 4.8a2.5 2.5 0 0 0 5 0C14.5 13.2 12 10 12 10z"
        fill={color} fillOpacity=".2" strokeWidth="1.5"/>
      <path d="M9 19h6" strokeWidth="1.3"/>
    </svg>,

    /* §2 Constatations sur place — magnifying glass with water mark */
    magnify: <svg {...s}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.5" y2="16.5" strokeWidth="2"/>
      <path d="M8 11c0-1.7 1.3-3 3-3" strokeWidth="1.5"/>
    </svg>,

    /* §3 Configuration des lieux — architectural floor plan */
    floor_plan: <svg {...s}>
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <path d="M3 10h18M10 10v11M10 3v7"/>
      <path d="M17 10v11M17 3v7"/>
      <path d="M3 17h7M17 17h4"/>
      <circle cx="6.5" cy="13.5" r="1.2" fill={color} fillOpacity=".6" stroke="none"/>
    </svg>,

    /* §4 Alimentation eau potable — pipe network: meter → pump → distribution */
    pipe_net: <svg {...s}>
      <path d="M2 9h4"/>
      <rect x="6" y="7" width="4" height="4" rx=".8"/>
      <path d="M10 9h2.5"/>
      <circle cx="15" cy="9" r="2.5"/>
      <path d="M17.5 9h1.5"/>
      <path d="M19 6v6"/>
      <path d="M19 6h3M19 9h3M19 12h3"/>
      <circle cx="22" cy="6" r="1" fill={color} fillOpacity=".8" stroke="none"/>
      <circle cx="22" cy="9" r="1" fill={color} fillOpacity=".8" stroke="none"/>
      <circle cx="22" cy="12" r="1" fill={color} fillOpacity=".8" stroke="none"/>
    </svg>,

    /* §5 Moyens techniques — toolbox with instruments */
    toolbox: <svg {...s}>
      <rect x="2" y="10" width="20" height="11" rx="2"/>
      <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
      <line x1="2" y1="15" x2="22" y2="15"/>
      <rect x="10" y="13" width="4" height="4" rx=".5"/>
    </svg>,

    /* §6 Étape 1 – Vérification compteur — analog water meter with dial */
    meter: <svg {...s}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 4v1.5M12 18.5v1.5M4 12h1.5M18.5 12h1.5"/>
      <path d="M6.8 6.8l1.1 1.1M16.1 6.8l-1.1 1.1"/>
      <path d="M12 12l-3-3.5" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill={color} stroke="none"/>
      <path d="M9 15.5h6" strokeWidth="1.2"/>
    </svg>,

    /* §7 Étape 2 – Pression réseau — pressure gauge / manometer */
    gauge: <svg {...s}>
      <path d="M5.5 17a7 7 0 1 1 13 0"/>
      <path d="M12 10.5v3.5" strokeWidth="2.2"/>
      <path d="M8.8 10.5l.7.7M15.2 10.5l-.7.7"/>
      <path d="M5 17h1.5M17.5 17H19"/>
      <circle cx="12" cy="14" r="1.5" fill={color} stroke="none"/>
      <path d="M9 20h6" strokeWidth="1.2"/>
    </svg>,

    /* §8 Étape 3 – Infiltration — moisture drops seeping through wall */
    drip: <svg {...s}>
      <rect x="2" y="7" width="20" height="5" rx="1"/>
      <path d="M6 12v2.2c0 1.6-2 2.8-2 2.8s-2-1.2-2-2.8V12"/>
      <path d="M12 12v2.2c0 1.6-2 2.8-2 2.8s-2-1.2-2-2.8V12"/>
      <path d="M18 12v2.2c0 1.6-2 2.8-2 2.8s-2-1.2-2-2.8V12"/>
      <path d="M6 7V5M10 7V3.5M14 7V5M18 7V6" strokeWidth="1.3"/>
    </svg>,

    /* §9 Étape 4 – Origine fuite — crosshair targeting a pipe section */
    pipe_target: <svg {...s}>
      <path d="M2 10h7M15 10h7"/>
      <rect x="7" y="7" width="10" height="6" rx="1.5"/>
      <circle cx="12" cy="10" r="3"/>
      <circle cx="12" cy="10" r=".9" fill={color} stroke="none"/>
      <path d="M12 7v6M9 10h6" strokeWidth="1.2"/>
    </svg>,

    /* §10 Conclusion — document with prominent checkmark seal */
    doc_check: <svg {...s}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M8 12.5l2.5 2.5 5.5-5.5" strokeWidth="2"/>
      <path d="M8 17.5h8" strokeWidth="1.3"/>
    </svg>,

    /* §11 Recommandations — task checklist with multiple items */
    checklist: <svg {...s}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M8 12l1.2 1.2 2.3-2.3"/>
      <path d="M13 11.5h3.5"/>
      <path d="M8 16.5l1.2 1.2 2.3-2.3"/>
      <path d="M13 16h3.5"/>
    </svg>,

    /* ─────────────────────────────────────────────────────
       DASHBOARD STAT ICONS
       ───────────────────────────────────────────────────── */

    /* Total rapports — stack of report files */
    files: <svg {...s}>
      <path d="M5 5H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h10" strokeDasharray="2.5 1.5"/>
      <path d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-6z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M9 13h7M9 17h5"/>
    </svg>,

    /* Finalisés — shield with checkmark */
    shield_ok: <svg {...s}>
      <path d="M12 2L4 6v6c0 5.5 4.5 9.5 8 10.5 3.5-1 8-5 8-10.5V6z"/>
      <path d="M8.5 12l2.5 2.5 5-5" strokeWidth="2"/>
    </svg>,

    /* En cours — document with pen */
    doc_edit: <svg {...s}>
      <path d="M11 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"/>
      <path d="M17.5 3L21 6.5l-8.5 8.5-4 1 1-4 8.5-8.5z"/>
      <path d="M7 12h4M7 16h3"/>
    </svg>,

    /* ─────────────────────────────────────────────────────
       UTILITY ICONS
       ───────────────────────────────────────────────────── */

    /* Leak card icon — water drop with crack indicator */
    leak_card: <svg {...s}>
      <path d="M12 2c0 0-8 9.5-8 14a8 8 0 0 0 16 0c0-4.5-8-14-8-14z"/>
      <path d="M12 8.5l-2 3" strokeWidth="1.5" strokeDasharray="1.5 1"/>
      <path d="M9.5 18a3.5 3.5 0 0 0 3 2" strokeWidth="1.5"/>
    </svg>,

    /* Camera — for photo sections */
    camera: <svg {...s}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>,

    /* Valve — for water access points */
    valve: <svg {...s}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 8v-5M12 16v5M8 12H3M16 12h5"/>
      <path d="M10.5 10.5l-1-1M13.5 13.5l1 1M13.5 10.5l1-1M10.5 13.5l-1 1" strokeWidth="1.2"/>
    </svg>,

    /* Water drop */
    drop: <svg {...s}>
      <path d="M12 2c0 0-8 9-8 14a8 8 0 0 0 16 0c0-5-8-14-8-14z"
        fill={color} fillOpacity=".15"/>
      <path d="M9 18a3 3 0 0 0 3 2" strokeWidth="1.5"/>
    </svg>,

    /* Wrench */
    wrench: <svg {...s}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.95 7.95L6.6 20.5a2.12 2.12 0 0 1-3-3l6.95-6.95a6 6 0 0 1 7.95-7.95l-3.8 3.8z"/>
    </svg>,

    /* Eye — inspect */
    eye: <svg {...s}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>,

    /* Seal / closed pipe */
    sealed: <svg {...s}>
      <path d="M4 10h16M4 14h16M4 10v4M20 10v4"/>
      <rect x="4" y="10" width="16" height="4" rx=".5"/>
      <circle cx="12" cy="12" r="1.2" fill={color} stroke="none"/>
      <path d="M15 8l2-2M15 16l2 2M9 8L7 6M9 16l-2 2" strokeWidth="1.2"/>
    </svg>,

    /* Settings gear */
    settings: <svg {...s}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
    </svg>,

    /* Reports document */
    reports: <svg {...s}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M9 13h6M9 17h6"/>
    </svg>,
  };
  return icons[name] ?? <svg {...s}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01" strokeWidth="2"/></svg>;
};

/* ─── UTILITIES ─── */
const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const nl  = s => esc(s).replace(/\n/g,'<br>');
const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '';
const cb  = v => v ? '&#9632;' : '&#9633;';
const logoSVG = `<img src="/images/logo.svg" alt="ESMEAU Logo" style="width:148px;height:40px;" />`;

/* ─── ERROR BOUNDARY ─── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-2">Une erreur est survenue</h2>
            <p className="text-red-700 mb-4">L'application a rencontré un problème inattendu.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── VALIDATION ─── */
const validators = {
  required: (value) => value && value.trim().length > 0 ? null : 'Ce champ est requis',
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email invalide';
  },
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[0-9\s\-\+\(\)]{7,20}$/;
    return phoneRegex.test(value) ? null : 'Numéro de téléphone invalide';
  },
  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Minimum ${min} caractères requis`;
  }
};

const validateReport = (report) => {
  const errors = {};
  if (validators.required(report.clientNom)) errors.clientNom = validators.required(report.clientNom);
  if (report.clientEmail && validators.email(report.clientEmail)) errors.clientEmail = validators.email(report.clientEmail);
  if (report.clientPhone && validators.phone(report.clientPhone)) errors.clientPhone = validators.phone(report.clientPhone);
  if (validators.required(report.address)) errors.address = validators.required(report.address);
  return errors;
};

/* ─── PDF GENERATOR ─── */
const generatePrintHTML = r => {
  const pg = (arr=[]) => arr.length===0 ? '' :
    `<div style="display:flex;flex-wrap:wrap;gap:8pt;margin:8pt 0 12pt;">${arr.map(p=>`<div style="width:30%;"><img src="${p.url}" style="width:100%;height:75pt;object-fit:cover;border:.5pt solid #bbb;border-radius:3pt;display:block;"/>${p.comment?`<p style="font-size:7.5pt;color:#555;font-style:italic;margin-top:3pt;">${esc(p.comment)}</p>`:''}</div>`).join('')}</div>`;
  const recs=(r.recommandations||'').split('\n').filter(Boolean);
  const sp=r.sectionPhotos||{};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Rapport ESMEAU – ${esc(r.id)}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#111;line-height:1.5;background:#fff;padding-bottom:38pt;}@page{size:A4;margin:12mm 16mm 32mm 16mm;}.ft{position:fixed;bottom:0;left:0;right:0;border-top:.75pt solid #999;background:#fff;padding:5pt 0 3pt;text-align:center;font-size:7pt;color:#555;}.hdr{background:#DBEAFE;padding:10pt 14pt;display:flex;align-items:center;justify-content:space-between;border-bottom:3pt solid #0891B2;margin-bottom:14pt;}.title{color:#1E3A5F;font-size:14pt;font-weight:900;text-align:right;}.sep{border:none;border-top:1.5pt solid #0891B2;margin:10pt 0;}.sh{font-weight:bold;text-decoration:underline;margin:14pt 0 5pt;font-size:10pt;}.tbl{width:100%;border-collapse:collapse;font-size:8.5pt;margin:5pt 0 10pt;}.tbl th{background:#DBEAFE;padding:4pt 7pt;text-align:left;border:.5pt solid #93C5FD;font-weight:bold;}.tbl td{padding:4pt 7pt;border:.5pt solid #CBD5E1;vertical-align:top;}.tbl .grp{background:#0891B2;color:#fff;font-weight:bold;text-align:center;padding:3pt 7pt;}.step{font-weight:bold;font-style:italic;text-decoration:underline;margin:11pt 0 4pt;font-size:10pt;}.ol{font-weight:bold;font-size:9pt;margin-bottom:2pt;margin-top:6pt;}.conc{background:#F0F9FF;border-left:3pt solid #0891B2;padding:6pt 10pt;margin:7pt 0;font-size:9pt;}.recs{list-style:none;counter-reset:rc;margin:5pt 0;}.recs li{counter-increment:rc;padding:4pt 0 4pt 22pt;position:relative;border-bottom:.3pt solid #E2E8F0;}.recs li::before{content:counter(rc)'.';position:absolute;left:0;font-weight:bold;color:#0891B2;}.disc{font-size:7.5pt;color:#555;font-style:italic;margin-top:12pt;border-top:.5pt solid #ccc;padding-top:7pt;}.info2{display:table;width:100%;margin:10pt 0;}.info2 .c{display:table-cell;width:50%;vertical-align:top;padding-right:12pt;}.info2 .lbl{font-weight:bold;font-size:8.5pt;color:#555;margin-bottom:2pt;}.client-box{border:.5pt solid #CBD5E1;border-radius:4pt;padding:9pt 11pt;margin:10pt 0;font-size:9pt;line-height:1.8;}.alim{background:#F0F9FF;border:.5pt solid #93C5FD;border-radius:4pt;padding:9pt 11pt;margin:10pt 0;font-size:9pt;}</style></head><body>
<div class="ft">Ent. ESMEAU - RCCM&nbsp;: SN.DKR.2022.A.17941 – NINEA&nbsp;: 009436561 1Y1 &nbsp;|&nbsp; Non assujetti à la TVA (Régime CGU) - BRS à reverser à la DGID - Article 321 du CGI</div>
<div class="hdr"><div>${logoSVG}</div><div class="title">RAPPORT DE RECHERCHE<br>DE FUITES</div></div>
<table style="width:100%;font-size:9.5pt;margin-bottom:8pt;"><tr><td style="width:50%;"><b>N de dossier&nbsp;: ${esc(r.id)}</b></td><td><b>Nom du Client&nbsp;: ${esc(r.clientCivilite)} ${esc(r.clientNom)}</b><br>Adresse&nbsp;: ${esc(r.address)}</td></tr></table>
<p style="margin-bottom:10pt;">Votre chercheur de fuites&nbsp;:<br><b>Société ESMEAU</b></p>
<hr class="sep">
<div class="info2"><div class="c"><div class="lbl">Date d'intervention&nbsp;:</div>${fmtDate(r.date)}</div><div class="c"><div class="lbl">Adresse d'intervention&nbsp;:</div>${nl(r.interventionAddress)}</div></div>
<div class="client-box"><b>Coordonnées du client sinistré&nbsp;:</b><br><br><b>Nom&nbsp;:</b> ${esc(r.clientCivilite)} ${esc(r.clientNom)} ${esc(r.clientPrenom)}&nbsp;&nbsp;<b>Tél&nbsp;:</b> ${esc(r.clientPhone)||'N/A'}&nbsp;&nbsp;<b>E-mail&nbsp;:</b> ${esc(r.clientEmail)||'N/A'}</div>
${pg(sp.infos)}
<p class="sh">1.&nbsp;&nbsp;OBJET DE L'INTERVENTION&nbsp;:</p><p style="text-align:justify;">${nl(r.objet)}</p>${pg(sp.objet)}
<p class="sh">2.&nbsp;&nbsp;CONSTATATIONS SUR PLACE&nbsp;:</p><p style="text-align:justify;">${nl(r.constatations)}</p>${pg(sp.constatations)}
<p class="sh">3.&nbsp;&nbsp;CONFIGURATION DES LIEUX&nbsp;:</p>
<table class="tbl"><tr><td colspan="3" class="grp">BÂTIMENT</td></tr><tr><td colspan="3">${esc(r.batiment)}</td></tr><tr><td colspan="3" class="grp">OÙ SONT SITUÉS LES DÉGÂTS&nbsp;?</td></tr><tr><th>Nature du lieu</th><th>Niveau</th><th>Occupant</th></tr>${(r.degats||[]).map(d=>`<tr><td>${esc(d.nature)}</td><td>${esc(d.niveau)}</td><td>${esc(d.occupant)}</td></tr>`).join('')}<tr><td colspan="3" class="grp">OÙ AVONS-NOUS INVESTIGUÉ&nbsp;?</td></tr><tr><th>Nature du lieu</th><th>Niveau</th><th>Occupant</th></tr>${(r.investigation||[]).map(d=>`<tr><td>${esc(d.nature)}</td><td>${esc(d.niveau)}</td><td>${esc(d.occupant)}</td></tr>`).join('')}</table>${pg(sp.config)}
<p class="sh">4.&nbsp;&nbsp;CONFIGURATION DE L'ALIMENTATION EN EAU POTABLE</p>
${r.alimentationConfig||r.alimentationComposition||r.alimentationPointsAcces?`<div class="alim">${r.alimentationConfig?`<p style="margin-bottom:6pt;"><b>Schéma&nbsp;:</b>&nbsp;${nl(r.alimentationConfig)}</p>`:''}${r.alimentationComposition?`<p style="margin-bottom:6pt;"><b>Composition&nbsp;:</b>&nbsp;${nl(r.alimentationComposition)}</p>`:''}${r.alimentationPointsAcces?`<p style="margin-bottom:6pt;"><b>Points d'accès&nbsp;:</b>&nbsp;${nl(r.alimentationPointsAcces)}</p>`:''}${r.alimentationNotes?`<p><b>Observations&nbsp;:</b>&nbsp;${nl(r.alimentationNotes)}</p>`:''}</div>`:'<p style="font-style:italic;color:#666;font-size:9pt;">Non renseigné</p>'}
${pg(sp.alimentation)}
<p class="sh">5.&nbsp;&nbsp;MOYENS TECHNIQUES UTILISÉS</p>
<table style="width:100%;"><tr><td style="vertical-align:top;width:50%;padding-right:14pt;"><p style="text-decoration:underline;font-weight:bold;font-size:9pt;margin-bottom:4pt;">Mesures d'humidité</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.humidimetre)} Humidimètre</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.hygrometre)} Hygromètre</p><br><p style="text-decoration:underline;font-weight:bold;font-size:9pt;margin-bottom:4pt;">Tests de réseaux</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.manometre)} Manomètre Digital</p><br><p style="text-decoration:underline;font-weight:bold;font-size:9pt;margin-bottom:4pt;">Visualisation</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.endoscope)} Endoscope à fibre optique</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.cameraTher_visu)} Caméra Thermique</p></td><td style="vertical-align:top;"><p style="text-decoration:underline;font-weight:bold;font-size:9pt;margin-bottom:4pt;">Recherche de réseaux</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.ecouteElectro)} Écoute électroacoustique</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.cameraTher_reseau)} Caméra Thermique</p><br><p style="text-decoration:underline;font-weight:bold;font-size:9pt;margin-bottom:4pt;">Test d'étanchéité</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.miseEnEau)} Mise en eau</p><p style="margin:2pt 0;font-size:9pt;">${cb(r.moyens?.colorant)} Colorant</p></td></tr></table>${pg(sp.moyens)}
<p class="sh" style="margin-top:16pt;">6.&nbsp;&nbsp;MÉTHODOLOGIE &amp; RÉSULTATS</p>
${(r.etapes||[]).map((e,i)=>`<p class="step">&#10003;&nbsp; Etape ${i+1}&nbsp;: ${esc(e.titre)}</p>${pg(e.photos)}${e.methodologie?`<p class="ol">o&nbsp; Méthodologie&nbsp;:</p><p style="text-align:justify;margin-bottom:5pt;">${nl(e.methodologie)}</p>`:''} ${e.resultat?`<p class="ol">o&nbsp; Résultat&nbsp;:</p><p style="text-align:justify;margin-bottom:5pt;">${nl(e.resultat)}</p>`:''} ${e.conclusion?`<div class="conc">&#8594;&nbsp; <b>Conclusion&nbsp;:</b><br>${nl(e.conclusion)}</div>`:''}`).join('')}
<p class="sh">7.&nbsp;&nbsp;CONCLUSION DE L'INTERVENTION</p><p style="text-align:justify;">${nl(r.conclusion)}</p>${pg(sp.conclusion)}
<p class="sh">8.&nbsp;&nbsp;RECOMMANDATIONS</p>${recs.length?`<ol class="recs">${recs.map(l=>`<li>${esc(l.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>`:'<p style="font-style:italic;">Aucune recommandation.</p>'}
<div class="disc">Les recommandations formulées ci-dessus constituent des préconisations fournies par la société ESMEAU à titre informatif. Leur mise en œuvre relève exclusivement de la responsabilité du client.</div>
<script>window.onload=()=>setTimeout(()=>window.print(),700);</script></body></html>`;
};

const doPrint=r=>{const w=window.open('','_blank','width=900,height=750');if(!w){alert("Autorisez les pop-ups.");return;}w.document.write(generatePrintHTML(r));w.document.close();};
const doWhatsApp=r=>{if(!settingsWhatsAppEnabled){alert("Le partage WhatsApp n'est pas activé dans les paramètres.");return;}const phoneNumber=settingsWhatsAppNumber.trim();if(!phoneNumber){alert("Veuillez configurer le numéro WhatsApp dans les paramètres.");return;}const recs=(r.recommandations||'').split('\n').filter(Boolean).slice(0,4).map(l=>`  • ${l.replace(/^\d+\.\s*/,'')}`).join('\n');const txt=[`📋 *RAPPORT ${settingsCompanyName} – ${r.id}*`,``,`*Client :* ${r.clientCivilite} ${r.clientNom}`.trim(),`*Date :* ${fmtDate(r.date)}`,`*Adresse :* ${r.interventionAddress||r.address}`,``,`*Problème :*`,r.problemType,``,`*Conclusion :*`,(r.conclusion||'').slice(0,280)+(r.conclusion?.length>280?'…':''),``,`*Recommandations :*`,recs,``,settingsWhatsAppMessage?`_${settingsWhatsAppMessage}_`:`_Société ${settingsCompanyName} – RCCM ${settingsCompanyRCCM}_`].join('\n');window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,'_blank');};
const doEmail=r=>{if(!settingsEmailEnabled){alert("Le partage Email n'est pas activé dans les paramètres.");return;}const subj=`Rapport ${settingsCompanyName} – N° ${r.id} – ${r.clientCivilite} ${r.clientNom}`;const signature=[``,`─────────────────────────`,settingsEmailSignature,``,`Ent. ${settingsCompanyName} – RCCM : ${settingsCompanyRCCM} – NINEA : ${settingsCompanyNINEA}`,`Non assujetti à la TVA (Régime CGU) - BRS à reverser à la DGID - Article 321 du CGI`].join('\n');const body=[`RAPPORT DE RECHERCHE DE FUITES – ${settingsCompanyName}`,``,`N° dossier : ${r.id}  |  Date : ${fmtDate(r.date)}`,`Client : ${r.clientCivilite} ${r.clientNom} ${r.clientPrenom}`.trim(),`Tél : ${r.clientPhone||'N/A'}  |  Email : ${r.clientEmail||'N/A'}`,`Adresse : ${r.interventionAddress||r.address}`,``,`1. OBJET`,r.objet||'',``,`2. CONSTATATIONS`,r.constatations||'',``,`3. BÂTIMENT : ${r.batiment}`,``,`4. ALIMENTATION EAU POTABLE`,`Schéma : ${r.alimentationConfig||''}`,`Composition : ${r.alimentationComposition||''}`,`Points d'accès : ${r.alimentationPointsAcces||''}`,`Observations : ${r.alimentationNotes||''}`,``,`5. MÉTHODOLOGIE & RÉSULTATS`,...(r.etapes||[]).flatMap((e,i)=>[`Étape ${i+1} : ${e.titre}`,`  Méthode : ${e.methodologie}`,`  Résultat : ${e.resultat}`,`  Conclusion : ${e.conclusion}`,``]),`6. CONCLUSION`,r.conclusion||'',``,`7. RECOMMANDATIONS`,r.recommandations||'',signature].join('\n');window.location.href=`mailto:${r.clientEmail||''}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;};

const defSP = () => ({infos:[],objet:[],constatations:[],config:[],alimentation:[],moyens:[],conclusion:[],recommandations:[]});

/* ─── SAMPLE DATA ─── */
const INITIAL_REPORTS=[
  {id:"001/PTE/1025",date:"2025-11-13",clientCivilite:"Mme",clientNom:"DORSEMAINE",clientPrenom:"Marise",clientPhone:"77 372 95 49",clientEmail:"",address:"28 rue 111, Dakar Point E",interventionAddress:"Appartement C5, 28 rue 111, Dakar Point E",problemType:"Infiltrations d'eau au plafond autour du climatiseur – gonflement de peinture, moisissures",status:"finalisé",objet:"La cliente Marise DORSEMAINE, propriétaire d'un appartement F4 nommé C5, a sollicité la société ESMEAU suite à des infiltrations d'eau sur son plafond autour de son climatiseur provoquant gonflement de la peinture et moisissures.",constatations:"Importante infiltration constatée au plafond et aux murs du salon de l'appartement de Mme DORSEMAINE.",batiment:"Immeuble de R+6",degats:[{nature:"Appartement au 5ème étage",niveau:"5",occupant:"Locataire de l'appartement de Mme DORSEMAINE"}],investigation:[{nature:"Appartement au 5ème étage",niveau:"5",occupant:"Locataire de l'appartement de Mme DORSEMAINE"}],alimentationConfig:"Compteur (Sen'Eau) → Suppresseur (immeuble) → Distribution par étage",alimentationComposition:"Appartement F4 (C5) : salon, 3 chambres, 2 salles de bains, cuisine",alimentationPointsAcces:"Compteur commun immeuble (RDC). Nourrice de distribution au 5ème étage. Arrivée eau potable WC et cuisine.",alimentationNotes:"Les conduites d'évacuation des condensats des climatiseurs sont entièrement encastrées dans les murs, sans sortie extérieure classique.",moyens:{humidimetre:true,hygrometre:true,manometre:true,endoscope:true,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},etapes:[{titre:"Vérification compteur",methodologie:"Lecture du compteur après fermeture de tous les robinets et points d'eau de l'appartement C5.",resultat:"À 8h45 : compteur fixe. À 9h00 : aucune consommation supplémentaire.",conclusion:"Aucune fuite détectée sur le réseau intérieur d'eau potable.",photos:[]},{titre:"Pression réseau intérieur",methodologie:"Essai de pression au manomètre digital raccordé sur l'arrivée d'eau des toilettes.",resultat:"9h10 : 1.95 bar → 9h25 : 1.91 bar. Différence de 0,04 bar négligeable.",conclusion:"Pression stable. Pas de fuite d'eau sur le réseau intérieur.",photos:[]},{titre:"État de l'infiltration",methodologie:"Mesure d'humidité des parois et relevé hygrométrique ambiant.",resultat:"Infiltration ancienne, actuellement en cours de séchage.",conclusion:"La fuite ne provient pas de l'appartement C5.",photos:[]},{titre:"Origine de la fuite",methodologie:"Inspection visuelle faux-plafond et climatiseur + caméra endoscopique. Vérification appartement C6.",resultat:"Faux-plafond : dégâts importants, affaissement des bords, risque d'effondrement. Fuite probable conduite condensats C6.",conclusion:"Fuite issue de la conduite d'évacuation des condensats du climatiseur de l'appartement C6.",photos:[]}],conclusion:"La fuite provient de la conduite d'évacuation des condensats du climatiseur de l'appartement C6 – entièrement encastrée dans le mur.",recommandations:"1. Ouvrir le faux-plafond du C5 dans l'axe de la conduite encastrée.\n2. Ouvrir la paroi du C6 si nécessaire.\n3. Remplacer entièrement la conduite d'évacuation des condensats du climatiseur C6.\n4. Vérifier la pente interne de toute la gaine encastrée.\n5. Déposer rapidement les plaques du faux-plafond endommagées (risque d'effondrement).\n6. Effectuer après travaux : test d'écoulement, inspection caméra, contrôle d'humidité.\n7. Informer le propriétaire du C6 : toute utilisation sans réparation génèrera de nouvelles infiltrations.",sectionPhotos:defSP()},
  {id:"003/PTE/0226",date:"2026-02-17",clientCivilite:"M.",clientNom:"KANE",clientPrenom:"",clientPhone:"77 258 47 68",clientEmail:"",address:"Impasse, Point E",interventionAddress:"Impasse, Point E",problemType:"Factures d'eau anormalement élevées (250 000 FCFA/période en moyenne)",status:"finalisé",objet:"Monsieur KANE, propriétaire d'une maison R+1 à Point E, a sollicité ESMEAU suite à des factures d'eau anormalement élevées. Un plombier avait déjà réparé une fuite, mais les factures demeurent élevées.",constatations:"Première intervention plombier réalisée mais inefficace. Factures d'eau toujours anormalement élevées.",batiment:"Maison R+1",degats:[{nature:"Maison R+1",niveau:"Tous niveaux",occupant:"Propriétaire"}],investigation:[{nature:"Maison R+1",niveau:"Tous niveaux",occupant:"Propriétaire"}],alimentationConfig:"Compteur → Suppresseur → Réservoirs de stockage (toiture) + Bassin tampon de la piscine à débordement",alimentationComposition:"6 chambres avec salles de bains (RDC : chambre personnel / 1er étage : chambre enfants, adulte 1, adulte 2, master bedroom 1, master bedroom 2), 2 cuisines",alimentationPointsAcces:"Compteur principal (extérieur). Suppresseur (local technique). Réservoirs toiture (2 unités). Bassin tampon piscine (enterré, dalle extérieure).",alimentationNotes:"Le suppresseur alimente simultanément les réservoirs de stockage et le bassin tampon. La piscine fonctionne en circuit fermé : bassin tampon → pompe filtration → piscine → débordement → retour bassin tampon.",moyens:{humidimetre:false,hygrometre:false,manometre:true,endoscope:false,cameraTher_visu:false,cameraTher_reseau:true,ecouteElectro:false,miseEnEau:false,colorant:false},etapes:[{titre:"Vérification des installations sanitaires",methodologie:"Contrôle des raccords, joints, chasses d'eau des 6 chambres.",resultat:"5 chambres conformes. Master Bedroom 2 : traces d'eau séchée observées.",conclusion:"Installations globalement conformes.",photos:[]},{titre:"Vérification compteur",methodologie:"Relevé compteur après fermeture des robinets. Test suppresseur arrêt puis en marche.",resultat:"Suppresseur arrêt : stable. Suppresseur en marche : gros volumes enregistrés → perte sur circuit piscine.",conclusion:"Fuite active sur le réseau alimentant le système de la piscine.",photos:[]},{titre:"Pression réseau intérieur",methodologie:"Manomètre digital raccordé à l'arrivée WC Master Bedroom 2, suppresseur à l'arrêt.",resultat:"09h40 : 0.36 bar → 09h55 : 0.36 bar. Aucune diminution.",conclusion:"Aucune fuite sur le réseau intérieur domestique.",photos:[]},{titre:"Vérification installation piscine",methodologie:"Inspection circuit piscine : Compteur → Suppresseur → Bassin tampon → Pompe → Piscine.",resultat:"Dysfonctionnement des flotteurs. Raccords dégradés. Remplissage continu du bassin tampon.",conclusion:"Surconsommation d'eau due au système hydraulique de la piscine.",photos:[]}],conclusion:"La surconsommation d'eau provient du système hydraulique de la piscine. Aucune fuite sur le réseau intérieur domestique.",recommandations:"1. Remplacement immédiat des flotteurs mécaniques et électroniques du bassin tampon.\n2. Mise à l'arrêt temporaire du système piscine pour test d'étanchéité.\n3. Test d'étanchéité sectorisé : isolation canalisation refoulement.\n4. Inspection structurelle du bassin tampon (recherche fissures).\n5. Contrôle des canalisations enterrées par mise en pression contrôlée.",sectionPhotos:defSP()},
  {id:"004/PTE/0526",date:"2026-05-15",clientCivilite:"M.",clientNom:"SALL",clientPrenom:"Amadou",clientPhone:"77 555 12 34",clientEmail:"",address:"45 Rue de Ngor, Dakar",interventionAddress:"45 Rue de Ngor, Dakar",problemType:"Fuite d'eau au niveau de la cuisine",status:"en cours",objet:"Client signale une fuite d'eau sous l'évier de la cuisine.",constatations:"À confirmer lors de l'intervention.",batiment:"Villa F3",degats:[],investigation:[],alimentationConfig:"",alimentationComposition:"",alimentationPointsAcces:"",alimentationNotes:"",moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],conclusion:"",recommandations:"",sectionPhotos:defSP()},
  {id:"005/PTE/0526",date:"2026-05-20",clientCivilite:"Mme",clientNom:"DIOP",clientPrenom:"Fatou",clientPhone:"77 666 55 44",clientEmail:"",address:"Sacré-Cœur, Dakar",interventionAddress:"Sacré-Cœur, Dakar",problemType:"Infiltrations d'eau au mur extérieur",status:"brouillon",objet:"Humidité et traces d'eau sur mur extérieur sud.",constatations:"À constater sur place.",batiment:"Immeuble R+3",degats:[],investigation:[],alimentationConfig:"",alimentationComposition:"",alimentationPointsAcces:"",alimentationNotes:"",moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],conclusion:"",recommandations:"",sectionPhotos:defSP()},
  {id:"006/PTE/0526",date:"2026-05-28",clientCivilite:"M.",clientNom:"GUEYE",clientPrenom:"Ibrahima",clientPhone:"77 777 99 11",clientEmail:"",address:"Plateau, Dakar",interventionAddress:"Plateau, Dakar",problemType:"Surconsommation d'eau anormale",status:"brouillon",objet:"Client déclare une surconsommation importante d'eau.",constatations:"À vérifier.",batiment:"Maison R+2",degats:[],investigation:[],alimentationConfig:"",alimentationComposition:"",alimentationPointsAcces:"",alimentationNotes:"",moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],conclusion:"",recommandations:"",sectionPhotos:defSP()},
];

const newReport=()=>({id:`${String(Math.floor(Math.random()*900)+100).padStart(3,"0")}/PTE/${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,"0")}`,date:new Date().toISOString().split("T")[0],clientCivilite:"M.",clientNom:"",clientPrenom:"",clientPhone:"",clientEmail:"",address:"",interventionAddress:"",problemType:"",status:"brouillon",tiersType:"",tiersNom:"",tiersContact:"",tiersAssurance:"",demandeurType:"",demandeurNom:"",demandeurContact:"",dateFirstManif:"",interventionsAntérieures:"",objet:"",constatations:"",surfaceAffectee:"",signesAlerte:"",batiment:"",degats:[{nature:"",niveau:"",occupant:""}],investigation:[{nature:"",niveau:"",occupant:""}],alimentationConfig:"",alimentationComposition:"",alimentationPointsAcces:"",alimentationNotes:"",alimentationECS:"",alimentationECSType:"",alimentationChauffage:"",alimentationChauffageType:"",alimentationEvacuations:"",alimentationEvacuationsNotes:"",alimentationIsolation:"",moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false,fumigene:false,testPression:false,detecteurCourant:false},etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",seuilNormal:"",notes:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",seuilNormal:"2-3 bar",notes:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",seuilHumidite:"",notes:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",notes:"",photos:[]}],conclusion:"",recommandations:"",riskResiduel:"",urgence:"",responsabiliteExecution:"",sectionPhotos:defSP()});

/* ─── SECTIONS — 15 with specific icons ─── */
const SECTIONS=[
  {id:0,  icon:"id_card",       label:"Informations générales"},
  {id:1,  icon:"id_card",       label:"Tiers responsables"},
  {id:2,  icon:"clipboard_drop",label:"Objet de l'intervention"},
  {id:3,  icon:"magnify",       label:"Constatations sur place"},
  {id:4,  icon:"floor_plan",    label:"Configuration des lieux"},
  {id:5,  icon:"pipe_net",      label:"Alimentation eau potable"},
  {id:6,  icon:"pipe_net",      label:"Évacuations & ECS/Chauffage"},
  {id:7,  icon:"toolbox",       label:"Moyens techniques"},
  {id:8,  icon:"meter",         label:"Étape 1 · Compteur"},
  {id:9,  icon:"gauge",         label:"Étape 2 · Pression"},
  {id:10, icon:"drip",          label:"Étape 3 · Infiltration"},
  {id:11, icon:"pipe_target",   label:"Étape 4 · Origine"},
  {id:12, icon:"doc_check",     label:"Conclusion"},
  {id:13, icon:"checklist",     label:"Recommandations"},
];
const STEP_ICONS=["meter","gauge","drip","pipe_target"];

/* ─── LOGO ─── */
const Logo=()=>(<img src="/images/logo.svg" alt="ESMEAU Logo" style={{width:"148px",height:"40px"}} />);

/* ─── STATUS BADGE ─── */
const StatusBadge=({status})=>{const cfg={brouillon:{cls:"bg-slate-100 text-slate-500",l:"Brouillon",i:<Clock size={11}/>},"en cours":{cls:"bg-sky-100 text-sky-700",l:"En cours",i:<Edit size={11}/>},finalisé:{cls:"bg-blue-800 text-white",l:"Finalisé",i:<CheckCircle size={11}/>}};const s=cfg[status]||cfg.brouillon;return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>{s.i}{s.l}</span>;};

/* ─── VOICE BUTTON ─── */
const VoiceButton=({onTranscript})=>{const [rec,setRec]=useState(false);const ref=useRef(null);const toggle=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert("Reconnaissance vocale non disponible (Chrome recommandé).");return;}if(rec){ref.current?.stop();setRec(false);return;}const r=new SR();r.lang="fr-FR";r.continuous=false;r.interimResults=false;r.onstart=()=>setRec(true);r.onend=()=>setRec(false);r.onerror=()=>setRec(false);r.onresult=e=>onTranscript(e.results[0][0].transcript);ref.current=r;r.start();};return <button onClick={toggle} title="Dicter par reconnaissance vocale" className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${rec?"bg-red-50 text-red-600 border-red-200 animate-pulse":"bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"}`}>{rec?<MicOff size={12}/>:<Mic size={12}/>}{rec?"Arrêter":"Dicter"}</button>;};

const VTA=({label,value,onChange,placeholder="",rows=3})=>(<div className="mb-4"><div className="flex items-center justify-between mb-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label><VoiceButton onTranscript={t=>onChange(value?(value+" "+t):t)}/></div><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none bg-white placeholder-slate-300"/></div>);

/* ─── PHOTO SECTION ─── */
const PhotoSection=({photos=[],onChange,label="Photos"})=>{
  const fileRef=useRef();const [modal,setModal]=useState(null);const [cmt,setCmt]=useState("");const [drag,setDrag]=useState(false);
  const processFiles=files=>Array.from(files).forEach(f=>{const rd=new FileReader();rd.onload=e=>onChange([...photos,{url:e.target.result,comment:"",name:f.name}]);rd.readAsDataURL(f);});
  const openModal=i=>{setModal(i);setCmt(photos[i]?.comment||"");};
  const saveModal=()=>{onChange(photos.map((p,i)=>i===modal?{...p,comment:cmt}:p));setModal(null);};
  const del=(e,i)=>{e.stopPropagation();onChange(photos.filter((_,idx)=>idx!==i));};
  return(<div>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center"><WI name="camera" size={15} color="#2563eb"/></div><span className="text-sm font-semibold text-slate-700">{label}</span>{photos.length>0&&<span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{photos.length}</span>}</div>
      <button onClick={()=>fileRef.current.click()} className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-sm"><Camera size={13}/>Ajouter une photo</button>
      <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={e=>processFiles(e.target.files)}/>
    </div>
    {photos.length===0?(
      <div onDrop={e=>{e.preventDefault();setDrag(false);processFiles(e.dataTransfer.files);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>fileRef.current.click()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${drag?"border-blue-400 bg-blue-50":"border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3"><WI name="camera" size={24} color="#94a3b8"/></div>
        <p className="text-sm font-medium text-slate-500 mb-1">Appuyer pour prendre ou importer une photo</p>
        <p className="text-xs text-slate-400">Glisser-déposer · Appareil photo · Galerie</p>
      </div>
    ):(
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p,i)=>(<div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-square bg-slate-100" onClick={()=>openModal(i)}><img src={p.url} alt={p.name} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center"><div className="opacity-0 group-hover:opacity-100 transition bg-white/90 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium flex items-center gap-1"><Edit size={10}/>Annoter</div></div>{p.comment&&<div className="absolute bottom-0 inset-x-0 bg-black/65 text-white text-xs p-1.5 leading-tight">{p.comment.length>40?p.comment.slice(0,40)+"…":p.comment}</div>}<button onClick={e=>del(e,i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><X size={11}/></button><div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/50 text-white text-xs rounded-full flex items-center justify-center font-bold">{i+1}</div></div>))}
        <div onClick={()=>fileRef.current.click()} className="rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center aspect-square transition-all"><Camera size={20} className="text-slate-300 mb-1"/><span className="text-xs text-slate-400">Ajouter</span></div>
      </div>
    )}
    {modal!==null&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}><div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"><div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">{modal+1}</div><span className="font-semibold text-slate-800 text-sm">Annoter la photo</span></div><button onClick={()=>setModal(null)} className="text-slate-400 p-1"><X size={18}/></button></div><img src={photos[modal]?.url} alt="" className="w-full max-h-56 object-contain bg-slate-100"/><div className="p-4"><div className="flex items-center justify-between mb-1.5"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Commentaire / légende</label><VoiceButton onTranscript={t=>setCmt(cmt?cmt+" "+t:t)}/></div><textarea value={cmt} onChange={e=>setCmt(e.target.value)} rows={3} placeholder="Ex : Traces d'humidité sur le plafond côté climatiseur…" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 mb-3"/><div className="flex gap-2"><button onClick={saveModal} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Enregistrer</button><button onClick={()=>setModal(null)} className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-sm">Annuler</button></div></div></div></div>)}
  </div>);
};

/* ─── SHARE MODAL ─── */
const ShareModal=({report,onClose})=>(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}><div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"><div><div className="font-bold text-slate-800">Partager / Exporter</div><div className="text-xs text-slate-400 mt-0.5">Dossier {report.id}</div></div><button onClick={onClose} className="text-slate-400 p-1"><X size={18}/></button></div><div className="p-5 space-y-3"><button onClick={()=>{doPrint(report);onClose();}} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0"><Printer size={20}/></div><div className="text-left"><div className="font-semibold text-slate-800 text-sm">Générer le PDF</div><div className="text-xs text-slate-400">Aperçu impression → Enregistrer en PDF</div></div></button><button onClick={()=>{doWhatsApp(report);onClose();}} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition"><div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="#16A34A"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div><div className="text-left"><div className="font-semibold text-slate-800 text-sm">Envoyer par WhatsApp</div><div className="text-xs text-slate-400">Résumé structuré + recommandations</div></div></button><button onClick={()=>{doEmail(report);onClose();}} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition"><div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0"><Mail size={20}/></div><div className="text-left"><div className="font-semibold text-slate-800 text-sm">Envoyer par Email</div><div className="text-xs text-slate-400">Rapport complet avec pieds de page légaux</div></div></button></div><div className="px-5 pb-5 text-center text-xs text-slate-300">PDF : dans l'aperçu → « Enregistrer en PDF »</div></div></div>);

/* ─── NAVBAR ─── */
const Navbar = ({ currentView, setView, setReport, setSection, setEditing }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (viewName) => {
    console.log(`Navigation vers: ${viewName}`);
    setView(viewName);
    setMobileMenuOpen(false);
  };

  const handleCreateNewReport = () => {
    console.log("Création d'un nouveau rapport");
    const newReportData = {
      id: `${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}/PTE/${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}`,
      date: new Date().toISOString().split("T")[0],
      clientCivilite: "M.",
      clientNom: "",
      clientPrenom: "",
      clientPhone: "",
      clientEmail: "",
      address: "",
      interventionAddress: "",
      problemType: "",
      status: "brouillon",
      objet: "",
      constatations: "",
      batiment: "",
      degats: [{ nature: "", niveau: "", occupant: "" }],
      investigation: [{ nature: "", niveau: "", occupant: "" }],
      alimentationConfig: "",
      alimentationComposition: "",
      alimentationPointsAcces: "",
      alimentationNotes: "",
      moyens: { humidimetre: false, hygrometre: false, manometre: false, endoscope: false, cameraTher_visu: false, cameraTher_reseau: false, ecouteElectro: false, miseEnEau: false, colorant: false },
      etapes: [
        { titre: "Vérification compteur", methodologie: "", resultat: "", conclusion: "", photos: [] },
        { titre: "Pression réseau intérieur", methodologie: "", resultat: "", conclusion: "", photos: [] },
        { titre: "État de l'infiltration", methodologie: "", resultat: "", conclusion: "", photos: [] },
        { titre: "Origine de la fuite", methodologie: "", resultat: "", conclusion: "", photos: [] }
      ],
      conclusion: "",
      recommandations: "",
      sectionPhotos: { infos: [], objet: [], constatations: [], config: [], alimentation: [], moyens: [], conclusion: [], recommandations: [] }
    };
    setReport(newReportData);
    setSection(0);
    setEditing(true);
    setView("form");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg" role="navigation">
      <div className="flex items-center gap-2 md:gap-4">
        <Logo />
        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleNavigate("dashboard")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === "dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
            aria-label="Tableau de bord"
          >
            <LayoutGrid size={16} strokeWidth={1.5} className={currentView === "dashboard" ? "text-blue-700" : "text-slate-500"} />
            Tableau de bord
          </button>

          <button
            onClick={() => handleNavigate("reports")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === "reports"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
            aria-label="Rapports"
          >
            <WI name="reports" size={16} color={currentView === "reports" ? "#1d4ed8" : "#64748b"} />
            Rapports
          </button>

          <button
            onClick={() => handleNavigate("planning")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === "planning"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
            aria-label="Planning"
          >
            <CalendarDays size={16} strokeWidth={1.5} className={currentView === "planning" ? "text-blue-700" : "text-slate-500"} />
            Planning
          </button>

          <button
            onClick={() => handleNavigate("settings")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === "settings"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
            aria-label="Paramètres"
          >
            <WI name="settings" size={16} color={currentView === "settings" ? "#1d4ed8" : "#64748b"} />
            Paramètres
          </button>
        </div>

        {/* Menu hamburger mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Dropdown menu mobile */}
          {mobileMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => handleNavigate("dashboard")}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  currentView === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={16} strokeWidth={1.5} className={currentView === "dashboard" ? "text-blue-700" : "text-slate-500"} />
                Tableau de bord
              </button>

              <button
                onClick={() => handleNavigate("reports")}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-t border-slate-100 ${
                  currentView === "reports"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <WI name="reports" size={16} color={currentView === "reports" ? "#1d4ed8" : "#64748b"} />
                Rapports
              </button>

              <button
                onClick={() => handleNavigate("planning")}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-t border-slate-100 ${
                  currentView === "planning"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CalendarDays size={16} strokeWidth={1.5} className={currentView === "planning" ? "text-blue-700" : "text-slate-500"} />
                Planning
              </button>

              <button
                onClick={() => handleNavigate("settings")}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-t border-slate-100 ${
                  currentView === "settings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <WI name="settings" size={16} color={currentView === "settings" ? "#1d4ed8" : "#64748b"} />
                Paramètres
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-xs text-slate-400 hidden md:block">Rapports · Recherche de Fuites</span>
        {(currentView === "dashboard" || currentView === "reports" || currentView === "planning") && (
          <button
            onClick={handleCreateNewReport}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-blue-700 text-white rounded-xl text-xs md:text-sm font-semibold hover:bg-blue-800 transition shadow-sm"
            aria-label="Créer un nouveau rapport"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nouveau Rapport</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        )}
      </div>
    </nav>
  );
};

/* ─── SECTION HEADER ─── */
const SH=({icon,title,sub})=>(<div className="mb-6"><div className="flex items-center gap-3 mb-0.5"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-sm"><WI name={icon} size={22}/></div><h2 className="text-lg font-bold text-slate-800">{title}</h2></div>{sub&&<p className="text-xs text-slate-400 ml-13" style={{marginLeft:"52px"}}>{sub}</p>}<div className="h-0.5 bg-gradient-to-r from-sky-400 via-blue-400 to-transparent mt-3 rounded-full" style={{marginLeft:"52px"}}/></div>);

const Card=({children,className=""})=><div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>{children}</div>;

/* ─── CALENDAR HELPER ─── */
const CalendarMonth = ({ year, month, reports, onDateClick }) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const reportsMap = {};
  reports.forEach(r => {
    const dateKey = r.date;
    if (!reportsMap[dateKey]) reportsMap[dateKey] = [];
    reportsMap[dateKey].push(r);
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">{monthNames[month]} {year}</h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
          const dayReports = dateStr ? (reportsMap[dateStr] || []) : [];

          return (
            <div
              key={idx}
              onClick={() => dateStr && onDateClick(dateStr)}
              className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition ${
                day
                  ? dayReports.length > 0
                    ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "border-transparent bg-slate-50"
              }`}
            >
              {day && (
                <>
                  <div>{day}</div>
                  {dayReports.length > 0 && <div className="text-xs text-blue-600 font-bold">{dayReports.length}</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [view,setView]=useState("dashboard");const [reports,setReports]=useState(INITIAL_REPORTS);const [report,setReport]=useState(null);const [editing,setEditing]=useState(false);const [section,setSection]=useState(0);const [search,setSearch]=useState("");const [shareOpen,setShareOpen]=useState(false);
  
  // Hooks for reports view (must be at top level)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReports, setSelectedReports] = useState(new Set());

  // Hooks for planning view (must be at top level)
  const [planningModal, setPlanningModal] = useState(false);
  const [planningDate, setPlanningDate] = useState("");
  const [planningClient, setPlanningClient] = useState({ nom: "", prenom: "" });
  const [planningAddress, setPlanningAddress] = useState("");
  const [planningProblem, setPlanningProblem] = useState("");

  // Hooks for Google Calendar integration
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [googleCalendarEmail, setGoogleCalendarEmail] = useState("");

  // Settings state hooks
  const [settingsAutoSave, setSettingsAutoSave] = useState(true);
  const [settingsWhatsAppEnabled, setSettingsWhatsAppEnabled] = useState(false);
  const [settingsWhatsAppNumber, setSettingsWhatsAppNumber] = useState("");
  const [settingsWhatsAppMessage, setSettingsWhatsAppMessage] = useState("");
  const [settingsEmailEnabled, setSettingsEmailEnabled] = useState(false);
  const [settingsEmailFrom, setSettingsEmailFrom] = useState("contact@esmeau.com");
  const [settingsEmailSignature, setSettingsEmailSignature] = useState("Cordialement,\nL'équipe ESMEAU");
  const [settingsAIEnabled, setSettingsAIEnabled] = useState(false);
  const [settingsAIProvider, setSettingsAIProvider] = useState("claude");
  const [settingsAIModel, setSettingsAIModel] = useState("claude-3.5-sonnet");
  const [settingsAIKey, setSettingsAIKey] = useState("");
  const [settingsAIAssistance_conclusions, setSettingsAIAssistance_conclusions] = useState(false);
  const [settingsAIAssistance_recommendations, setSettingsAIAssistance_recommendations] = useState(false);
  const [settingsAIAssistance_validation, setSettingsAIAssistance_validation] = useState(false);
  const [settingsCompanyName, setSettingsCompanyName] = useState("ESMEAU");
  const [settingsCompanyRCCM, setSettingsCompanyRCCM] = useState("SN.DKR.2022.A.17941");
  const [settingsCompanyNINEA, setSettingsCompanyNINEA] = useState("009436561 1Y1");

  /* ─── LOCAL STORAGE PERSISTENCE ─── */
  useEffect(() => {
    const saved = localStorage.getItem('esmeau_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load reports from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('esmeau_reports', JSON.stringify(reports));
  }, [reports]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('esmeau_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.settingsAutoSave !== undefined) setSettingsAutoSave(settings.settingsAutoSave);
        if (settings.settingsWhatsAppEnabled !== undefined) setSettingsWhatsAppEnabled(settings.settingsWhatsAppEnabled);
        if (settings.settingsWhatsAppNumber !== undefined) setSettingsWhatsAppNumber(settings.settingsWhatsAppNumber);
        if (settings.settingsWhatsAppMessage !== undefined) setSettingsWhatsAppMessage(settings.settingsWhatsAppMessage);
        if (settings.settingsEmailEnabled !== undefined) setSettingsEmailEnabled(settings.settingsEmailEnabled);
        if (settings.settingsEmailFrom !== undefined) setSettingsEmailFrom(settings.settingsEmailFrom);
        if (settings.settingsEmailSignature !== undefined) setSettingsEmailSignature(settings.settingsEmailSignature);
        if (settings.settingsAIEnabled !== undefined) setSettingsAIEnabled(settings.settingsAIEnabled);
        if (settings.settingsAIProvider !== undefined) setSettingsAIProvider(settings.settingsAIProvider);
        if (settings.settingsAIModel !== undefined) setSettingsAIModel(settings.settingsAIModel);
        if (settings.settingsAIKey !== undefined) setSettingsAIKey(settings.settingsAIKey);
        if (settings.settingsAIAssistance_conclusions !== undefined) setSettingsAIAssistance_conclusions(settings.settingsAIAssistance_conclusions);
        if (settings.settingsAIAssistance_recommendations !== undefined) setSettingsAIAssistance_recommendations(settings.settingsAIAssistance_recommendations);
        if (settings.settingsAIAssistance_validation !== undefined) setSettingsAIAssistance_validation(settings.settingsAIAssistance_validation);
        if (settings.settingsCompanyName !== undefined) setSettingsCompanyName(settings.settingsCompanyName);
        if (settings.settingsCompanyRCCM !== undefined) setSettingsCompanyRCCM(settings.settingsCompanyRCCM);
        if (settings.settingsCompanyNINEA !== undefined) setSettingsCompanyNINEA(settings.settingsCompanyNINEA);
      } catch (e) {
        console.error('Failed to load settings from localStorage:', e);
      }
    }
  }, []);

  // Save settings to localStorage with debounce (500ms)
  useEffect(() => {
    const settingsTimeout = setTimeout(() => {
      const allSettings = {
        settingsAutoSave,
        settingsWhatsAppEnabled,
        settingsWhatsAppNumber,
        settingsWhatsAppMessage,
        settingsEmailEnabled,
        settingsEmailFrom,
        settingsEmailSignature,
        settingsAIEnabled,
        settingsAIProvider,
        settingsAIModel,
        settingsAIKey,
        settingsAIAssistance_conclusions,
        settingsAIAssistance_recommendations,
        settingsAIAssistance_validation,
        settingsCompanyName,
        settingsCompanyRCCM,
        settingsCompanyNINEA
      };
      localStorage.setItem('esmeau_settings', JSON.stringify(allSettings));
    }, 500);
    return () => clearTimeout(settingsTimeout);
  }, [settingsAutoSave, settingsWhatsAppEnabled, settingsWhatsAppNumber, settingsWhatsAppMessage, settingsEmailEnabled, settingsEmailFrom, settingsEmailSignature, settingsAIEnabled, settingsAIProvider, settingsAIModel, settingsAIKey, settingsAIAssistance_conclusions, settingsAIAssistance_recommendations, settingsAIAssistance_validation, settingsCompanyName, settingsCompanyRCCM, settingsCompanyNINEA]);

  const openNew=useCallback(()=>{setReport(newReport());setSection(0);setEditing(true);setView("form");}, []);
  const openEdit=useCallback(r=>{setReport({...r});setSection(0);setEditing(true);setView("form");}, []);
  const openView=useCallback(r=>{setReport({...r});setSection(0);setEditing(false);setView("form");}, []);
  const save=useCallback(()=>{
    const errors = validateReport(report);
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.entries(errors).map(([field, msg]) => `${field}: ${msg}`).join('\n');
      alert('Erreurs de validation:\n' + errorMessage);
      return false;
    }
    setReports(prev=>{const i=prev.findIndex(r=>r.id===report.id);return i>=0?prev.map(r=>r.id===report.id?report:r):[report,...prev];});
    setView("dashboard");
    return true;
  }, [report]);
  const del=useCallback(id=>{if(window.confirm("Supprimer ce rapport ?"))setReports(p=>p.filter(r=>r.id!==id));}, []);
  const upd=useCallback((f,v)=>setReport(p=>({...p,[f]:v})), []);
  const updE=useCallback((ei,f,v)=>setReport(p=>({...p,etapes:p.etapes.map((e,i)=>i===ei?{...e,[f]:v}:e)})), []);
  const updSP=useCallback((key,photos)=>setReport(p=>({...p,sectionPhotos:{...(p.sectionPhotos||defSP()),[key]:photos}})), []);
  const filtered=useMemo(() => reports.filter(r=>[r.clientNom,r.clientPrenom,r.id,r.address,r.problemType].join(" ").toLowerCase().includes(search.toLowerCase())), [reports, search]);

  // Google Calendar integration functions
  const generateICSContent = (report) => {
    const dateTime = new Date(report.date);
    const dtstart = dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dtend = new Date(dateTime.getTime() + 60*60000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ESMEAU//Report Manager//EN',
      'BEGIN:VEVENT',
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:Intervention - ${report.clientNom} ${report.clientPrenom}`,
      `DESCRIPTION:Type de problème: ${report.problemType}\\nAdresse: ${report.address}`,
      `LOCATION:${report.address}`,
      `UID:${report.id}@esmeau.local`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return ics;
  };

  const exportToICS = (report) => {
    const icsContent = generateICSContent(report);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent));
    element.setAttribute('download', `${report.id}_intervention.ics`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGoogleCalendarAuth = () => {
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    const REDIRECT_URI = window.location.origin;
    const SCOPE = 'https://www.googleapis.com/auth/calendar';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(SCOPE)}`;

    window.open(authUrl, 'popup', 'width=500,height=600');
  };

  const handleSyncInterventionsToCalendar = () => {
    const upcomingInterventions = reports
      .filter(r => new Date(r.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingInterventions.length === 0) {
      alert('Aucune intervention à venir à synchroniser');
      return;
    }

    upcomingInterventions.forEach(intervention => {
      exportToICS(intervention);
    });

    alert(`${upcomingInterventions.length} intervention(s) exportée(s) en format ICS. Vous pouvez les importer dans votre calendrier Google.`);
  };

  // Reports view useMemo - must be at top level to avoid hooks rule violation
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter(r => {
      const matchesSearch = [r.id, r.clientNom, r.clientPrenom, r.address, r.problemType].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "tous" || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "date") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortBy === "clientNom") {
        aVal = `${a.clientNom} ${a.clientPrenom}`.toLowerCase();
        bVal = `${b.clientNom} ${b.clientPrenom}`.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [reports, filterStatus, sortBy, sortOrder, searchTerm]);

  // Fonction pour créer un nouveau rapport depuis le dashboard
  const handleOpenNew = () => {
    const newReportData = {
      id:`${String(Math.floor(Math.random()*900)+100).padStart(3,"0")}/PTE/${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,"0")}`,
      date:new Date().toISOString().split("T")[0],
      clientCivilite:"M.",
      clientNom:"",
      clientPrenom:"",
      clientPhone:"",
      clientEmail:"",
      address:"",
      interventionAddress:"",
      problemType:"",
      status:"brouillon",
      objet:"",
      constatations:"",
      batiment:"",
      degats:[{nature:"",niveau:"",occupant:""}],
      investigation:[{nature:"",niveau:"",occupant:""}],
      alimentationConfig:"",
      alimentationComposition:"",
      alimentationPointsAcces:"",
      alimentationNotes:"",
      moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},
      etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],
      conclusion:"",
      recommandations:"",
      sectionPhotos:{infos:[],objet:[],constatations:[],config:[],alimentation:[],moyens:[],conclusion:[],recommandations:[]}
    };
    setReport(newReportData);
    setSection(0);
    setEditing(true);
    setView("form");
  };

  /* ── DASHBOARD ── */
  if(view==="dashboard") return(
    <div className="min-h-screen" style={{
      backgroundImage: 'url("/images/background.svg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      <Navbar currentView={view} setView={setView} setReport={setReport} setSection={setSection} setEditing={setEditing} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ── 3 Statistics Cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-3">
              <FileText size={24} className="text-blue-700" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-0.5">{reports.length}</div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total rapports</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-green-300/50 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-3">
              <CheckCircle2 size={24} className="text-green-700" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-0.5">{reports.filter(r=>r.status==="finalisé").length}</div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Rapports finalisés</div>
          </div>
          <div className="bg-white/75 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-3">
              <Clock size={24} className="text-amber-700" strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-bold text-amber-700 mb-0.5">{reports.filter(r=>r.status!=="finalisé").length}</div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">En cours / brouillons</div>
          </div>
        </div>
        
        {/* Actions rapides */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleOpenNew} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg">
            <Plus size={18} strokeWidth={2.5}/>Créer un nouveau rapport
          </button>
          <button onClick={()=>{
            console.log("Clic sur bouton Voir tous les rapports");
            setView("reports");
          }} className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition shadow-sm">
            <FileText size={18} strokeWidth={1.5}/>Voir tous les rapports
          </button>
          <button onClick={()=>setView("planning")} className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm">
            <Calendar size={18} strokeWidth={1.5}/>Voir le planning
          </button>
        </div>

        {/* Aperçu Planning */}
        <div className="mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Prochaines interventions</h3>
            <p className="text-sm text-slate-600">Les interventions programmées pour les jours à venir</p>
          </div>

          {reports.filter(r => new Date(r.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).length > 0 ? (
            <div className="space-y-3">
              {reports.filter(r => new Date(r.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4).map(r => (
                <div key={r.id} className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:shadow-md transition cursor-pointer flex items-center gap-4" onClick={() => openView(r)}>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-blue-700" strokeWidth={1.5}/>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-slate-800">{r.clientNom} {r.clientPrenom}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <MapPin size={12} strokeWidth={1.5} className="text-slate-400"/>
                      {r.address}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-medium text-slate-800">{new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                    <div className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-8 text-center">
              <Calendar size={40} className="text-slate-300 mx-auto mb-3" strokeWidth={1.2}/>
              <p className="text-slate-600 font-medium">Aucune intervention programmée</p>
              <p className="text-sm text-slate-500 mt-1">Créez un nouveau rapport pour en planifier une</p>
            </div>
          )}
        </div>
      </div>
      {shareOpen&&report&&<ShareModal report={report} onClose={()=>setShareOpen(false)}/>}
    </div>
  );

  /* ── REPORTS PAGE ── */
  if(view==="reports") {
    console.log("Vue reports atteinte");
    
    // Inline functions for reports view
    const handleOpenNew = () => {
      console.log("🆕 BOUTON NOUVEAU RAPPORT CLIQUÉ - Création d'un nouveau rapport");
      const newReportData = {
        id:`${String(Math.floor(Math.random()*900)+100).padStart(3,"0")}/PTE/${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,"0")}`,
        date:new Date().toISOString().split("T")[0],
        clientCivilite:"M.",
        clientNom:"",
        clientPrenom:"",
        clientPhone:"",
        clientEmail:"",
        address:"",
        interventionAddress:"",
        problemType:"",
        status:"brouillon",
        objet:"",
        constatations:"",
        batiment:"",
        degats:[{nature:"",niveau:"",occupant:""}],
        investigation:[{nature:"",niveau:"",occupant:""}],
        alimentationConfig:"",
        alimentationComposition:"",
        alimentationPointsAcces:"",
        alimentationNotes:"",
        moyens:{humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},
        etapes:[{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],
        conclusion:"",
        recommandations:"",
        sectionPhotos:{infos:[],objet:[],constatations:[],config:[],alimentation:[],moyens:[],conclusion:[],recommandations:[]}
      };
      setReport(newReportData);
      setSection(0);
      setEditing(true);
      setView("form");
    };
    
    const handleOpenView = (r) => {
      setReport({...r});
      setSection(0);
      setEditing(false);
      setView("form");
    };
    
    const handleOpenEdit = (r) => {
      setReport({...r});
      setSection(0);
      setEditing(true);
      setView("form");
    };
    
    const handleDelete = (id) => {
      if(window.confirm("Supprimer ce rapport ?")) {
        setReports(p=>p.filter(r=>r.id!==id));
      }
    };
    
    const handleShare = (r) => {
      setReport(r);
      setShareOpen(true);
    };
    
    // Helper function to determine current step of a report
    const getReportStep = (report) => {
      if (!report) return { step: 0, label: "Non démarré" };
      
      // Check basic sections
      const basicSections = [
        report.clientNom,
        report.objet,
        report.constatations,
        report.batiment
      ];
      
      const basicCompleted = basicSections.filter(Boolean).length;
      
      if (basicCompleted === 0) return { step: 0, label: "Informations générales" };
      if (basicCompleted < 2) return { step: 1, label: "Objet de l'intervention" };
      if (basicCompleted < 3) return { step: 2, label: "Constatations" };
      if (basicCompleted < 4) return { step: 3, label: "Configuration" };
      
      // Check technical steps
      if (report.etapes && report.etapes.length > 0) {
        let lastCompletedStep = 0;
        for (let i = 0; i < report.etapes.length; i++) {
          const etape = report.etapes[i];
          if (etape.methodologie || etape.resultat || etape.conclusion || (etape.photos && etape.photos.length > 0)) {
            lastCompletedStep = i + 1;
          }
        }
        
        if (lastCompletedStep === 0) return { step: 4, label: "Moyens techniques" };
        if (lastCompletedStep === 1) return { step: 5, label: "Vérification compteur" };
        if (lastCompletedStep === 2) return { step: 6, label: "Pression réseau" };
        if (lastCompletedStep === 3) return { step: 7, label: "Infiltration" };
        if (lastCompletedStep === 4) return { step: 8, label: "Origine fuite" };
      }
      
      // Check conclusion and recommendations
      if (report.conclusion) {
        if (report.recommandations) {
          return { step: 11, label: "Terminé" };
        }
        return { step: 10, label: "Conclusion" };
      }
      
      return { step: 4, label: "Moyens techniques" };
    };

    const toggleSort = (field) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortOrder("desc");
      }
    };

    const toggleReportSelection = (reportId) => {
      const newSelected = new Set(selectedReports);
      if (newSelected.has(reportId)) {
        newSelected.delete(reportId);
      } else {
        newSelected.add(reportId);
      }
      setSelectedReports(newSelected);
    };

    const selectAllReports = () => {
      if (selectedReports.size === filteredAndSortedReports.length) {
        setSelectedReports(new Set());
      } else {
        setSelectedReports(new Set(filteredAndSortedReports.map(r => r.id)));
      }
    };

    const exportSelectedReports = () => {
      const selectedData = reports.filter(r => selectedReports.has(r.id));
      const csv = [
        ["ID", "Client", "Date", "Statut", "Étape", "Adresse", "Problème", "Téléphone", "Email"],
        ...selectedData.map(r => [
          r.id,
          `${r.clientCivilite} ${r.clientNom} ${r.clientPrenom}`,
          new Date(r.date).toLocaleDateString("fr-FR"),
          r.status,
          getReportStep(r).label,
          r.address,
          r.problemType,
          r.clientPhone || "",
          r.clientEmail || ""
        ])
      ].map(row => row.join(";")).join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `rapports-esmeau-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100" style={{
        minHeight: '100vh'
      }}>
        <Navbar currentView={view} setView={setView} setReport={setReport} setSection={setSection} setEditing={setEditing} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with stats and actions */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Rapports</h1>
                <p className="text-slate-600">Gestion complète des rapports de recherche de fuites</p>
              </div>
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm">
                  <Plus size={16}/>Nouveau Rapport
                </button>
                {selectedReports.size > 0 && (
                  <button onClick={exportSelectedReports} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-sm">
                    <Share2 size={16}/>Exporter ({selectedReports.size})
                  </button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <WI name="files" size={18} color="#1d4ed8"/>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{reports.length}</div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <WI name="shield_ok" size={18} color="#059669"/>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{reports.filter(r => r.status === "finalisé").length}</div>
                    <div className="text-xs text-slate-500">Finalisés</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <WI name="doc_edit" size={18} color="#d97706"/>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{reports.filter(r => r.status === "en cours").length}</div>
                    <div className="text-xs text-slate-500">En cours</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <WI name="clock" size={18} color="#64748b"/>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{reports.filter(r => r.status === "brouillon").length}</div>
                    <div className="text-xs text-slate-500">Brouillons</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Recherche</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Client, dossier, adresse..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Statut</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value="finalisé">Finalisés</option>
                    <option value="en cours">En cours</option>
                    <option value="brouillon">Brouillons</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="date">Date</option>
                    <option value="clientNom">Client</option>
                    <option value="id">Numéro dossier</option>
                    <option value="status">Statut</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Ordre</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="desc">Récent → Ancien</option>
                    <option value="asc">Ancien → Récent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
            {filteredAndSortedReports.length === 0 ? (
              <div className="text-center py-16">
                <WI name="files" size={64} className="mx-auto mb-4" color="#cbd5e1"/>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun rapport trouvé</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterStatus !== "tous" 
                    ? "Essayez de modifier vos filtres de recherche" 
                    : "Commencez par créer votre premier rapport de recherche de fuites"}
                </p>
                <button onClick={handleOpenNew} className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition">
                  <Plus size={18}/>Créer un rapport
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedReports.size === filteredAndSortedReports.length && filteredAndSortedReports.length > 0}
                          onChange={selectAllReports}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => toggleSort("id")}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide hover:text-blue-600"
                        >
                          N° Dossier
                          {sortBy === "id" && (
                            <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => toggleSort("clientNom")}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide hover:text-blue-600"
                        >
                          Client
                          {sortBy === "clientNom" && (
                            <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => toggleSort("date")}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide hover:text-blue-600"
                        >
                          Date
                          {sortBy === "date" && (
                            <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Étape
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Adresse
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Problème
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAndSortedReports.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedReports.has(r.id)}
                            onChange={() => toggleReportSelection(r.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-mono text-slate-900 font-medium">{r.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {r.clientCivilite} {r.clientNom} {r.clientPrenom}
                            </div>
                            <div className="text-xs text-slate-500">
                              {r.clientEmail && <span>{r.clientEmail}</span>}
                              {r.clientEmail && r.clientPhone && <span className="mx-1">•</span>}
                              {r.clientPhone && <span>{r.clientPhone}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-900">
                            {new Date(r.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(r.date).toLocaleDateString("fr-FR", {
                              weekday: "short"
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium text-slate-900">
                              {getReportStep(r).label}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                  style={{ width: `${(getReportStep(r).step / 11) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 font-medium">
                                {getReportStep(r).step}/11
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-900 max-w-xs truncate" title={r.address}>
                            {r.address}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-700 max-w-xs truncate" title={r.problemType}>
                            {r.problemType}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            {r.clientPhone && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                {r.clientPhone}
                              </div>
                            )}
                            {r.clientEmail && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                  <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                {r.clientEmail}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenView(r)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Voir le rapport"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(r)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
                              title="Modifier le rapport"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleShare(r)}
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Partager le rapport"
                            >
                              <Share2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Supprimer le rapport"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredAndSortedReports.length > 0 && (
            <div className="mt-4 text-sm text-slate-600 text-center">
              Affichage de {filteredAndSortedReports.length} rapport{filteredAndSortedReports.length > 1 ? 's' : ''} 
              {selectedReports.size > 0 && ` • ${selectedReports.size} sélectionné${selectedReports.size > 1 ? 's' : ''}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Toggle component
  const Toggle = ({ value, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
      <div>
        <div className="font-medium text-slate-800">{label}</div>
        <div className="text-sm text-slate-500">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${
          value ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          value ? 'right-1' : 'left-1'
        }`}/>
      </button>
    </div>
  );

  /* ── SETTINGS PAGE ── */
  if(view==="settings") {
    console.log("Vue settings atteinte");
    return(
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100" style={{
      minHeight: '100vh'
    }}>
      <Navbar currentView={view} setView={setView} setReport={setReport} setSection={setSection} setEditing={setEditing} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Paramètres</h1>
          <p className="text-slate-600">Configurez les préférences de l'application</p>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
                <WI name="settings" size={20} color="#1d4ed8"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Informations de l'entreprise</h2>
                <p className="text-sm text-slate-500">Détails de votre société</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
                <input type="text" value={settingsCompanyName} onChange={(e) => setSettingsCompanyName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RCCM</label>
                <input type="text" value={settingsCompanyRCCM} onChange={(e) => setSettingsCompanyRCCM(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NINEA</label>
                <input type="text" value={settingsCompanyNINEA} onChange={(e) => setSettingsCompanyNINEA(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
                <WI name="files" size={20} color="#1d4ed8"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Gestion des données</h2>
                <p className="text-sm text-slate-500">Stockage et sauvegarde des rapports</p>
              </div>
            </div>
            <div className="space-y-4">
              <Toggle value={settingsAutoSave} onChange={setSettingsAutoSave} label="Sauvegarde automatique" description="Les rapports sont sauvegardés localement" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#16A34A">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Configuration WhatsApp</h2>
                <p className="text-sm text-slate-500">Paramètres pour l'envoi de rapports via WhatsApp</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro WhatsApp par défaut</label>
                <input type="tel" placeholder="+221 77 XXX XX XX" value={settingsWhatsAppNumber} onChange={(e) => setSettingsWhatsAppNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
                <p className="text-xs text-slate-500 mt-1">Avec le code pays (ex: +221 77...)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message personnalisé</label>
                <textarea rows="3" placeholder="Message par défaut pour les rapports WhatsApp..." value={settingsWhatsAppMessage} onChange={(e) => setSettingsWhatsAppMessage(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"></textarea>
              </div>
              <Toggle value={settingsWhatsAppEnabled} onChange={setSettingsWhatsAppEnabled} label="Activer l'envoi WhatsApp" description="Permet d'envoyer les rapports directement via WhatsApp" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <Mail size={20} color="#1d4ed8"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Configuration Email</h2>
                <p className="text-sm text-slate-500">Paramètres pour l'envoi de rapports par email</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email de l'expéditeur</label>
                <input type="email" placeholder="contact@esmeau.com" value={settingsEmailFrom} onChange={(e) => setSettingsEmailFrom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
                <p className="text-xs text-slate-500 mt-1">Adresse email qui apparaîtra dans le rapport</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Signature email</label>
                <textarea rows="3" placeholder="Cordialement,\nL'équipe ESMEAU" value={settingsEmailSignature} onChange={(e) => setSettingsEmailSignature(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"></textarea>
              </div>
              <Toggle value={settingsEmailEnabled} onChange={setSettingsEmailEnabled} label="Activer l'envoi email" description="Permet d'envoyer les rapports directement par email" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                <WI name="settings" size={20} color="#7c3aed"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">API Intelligence Artificielle</h2>
                <p className="text-sm text-slate-500">Configuration pour l'assistance IA dans la rédaction</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fournisseur API</label>
                <select value={settingsAIProvider} onChange={(e) => setSettingsAIProvider(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400">
                  <option value="claude">Anthropic Claude</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Modèle IA</label>
                <input type="text" placeholder="claude-3.5-sonnet" value={settingsAIModel} onChange={(e) => setSettingsAIModel(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
                <p className="text-xs text-slate-500 mt-1">Exemple: claude-3.5-sonnet ou gpt-4o</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Clé API</label>
                <div className="relative">
                  <input type="password" placeholder="sk-..." value={settingsAIKey} onChange={(e) => setSettingsAIKey(e.target.value)} className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1">⚠️ Votre clé API reste confidentielle et stockée localement</p>
              </div>
              <div className="space-y-3">
                <Toggle value={settingsAIAssistance_conclusions} onChange={setSettingsAIAssistance_conclusions} label="Assistance rédaction conclusions" description="L'IA vous aide à rédiger les conclusions des rapports" />
                <Toggle value={settingsAIAssistance_recommendations} onChange={setSettingsAIAssistance_recommendations} label="Assistance rédaction recommandations" description="L'IA suggère des recommandations basées sur les constats" />
                <Toggle value={settingsAIAssistance_validation} onChange={setSettingsAIAssistance_validation} label="Vérification automatique" description="L'IA vérifie la cohérence du rapport" />
              </div>
              <Toggle value={settingsAIEnabled} onChange={setSettingsAIEnabled} label="Activer l'IA" description="Active toutes les fonctionnalités d'assistance IA" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
                <WI name="calendar" size={20} color="#dc2626"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Synchronisation Google Calendar</h2>
                <p className="text-sm text-slate-500">Synchronisez vos interventions avec Google Calendar</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-slate-700 mb-3">
                  Connectez votre compte Google pour synchroniser automatiquement vos interventions programmées avec votre calendrier Google et accéder à vos interventions sur tous vos appareils.
                </p>
                {!googleCalendarConnected ? (
                  <button
                    onClick={handleGoogleCalendarAuth}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    <WI name="mail" size={16} />
                    Connecter Google Calendar
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-sm font-medium text-green-800">✓ Connecté</div>
                      <div className="text-xs text-green-600 mt-1">{googleCalendarEmail}</div>
                    </div>
                    <button
                      onClick={() => {
                        setGoogleCalendarConnected(false);
                        setGoogleCalendarEmail("");
                      }}
                      className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                    >
                      Déconnecter
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Options de synchronisation</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Synchroniser automatiquement</div>
                      <div className="text-xs text-slate-500">Les nouvelles interventions seront ajoutées à votre calendrier</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Inclure les détails du client</div>
                      <div className="text-xs text-slate-500">Ajouter le nom et l'adresse du client dans l'événement</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Recevoir des rappels</div>
                      <div className="text-xs text-slate-500">Notifications 1 jour avant l'intervention</div>
                    </div>
                  </label>
                </div>
              </div>

              {googleCalendarConnected && (
                <button
                  onClick={handleSyncInterventionsToCalendar}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                >
                  <WI name="refresh" size={16} />
                  Synchroniser maintenant
                </button>
              )}

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-sm text-amber-800">
                  <strong>Note:</strong> Vous pouvez également exporter les interventions en format ICS et les importer manuellement dans votre calendrier email (Gmail, Outlook, etc.).
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

  /* ── PLANNING PAGE ── */
  if(view==="planning") {
    const handleScheduleIntervention = () => {
      if (!planningDate || !planningClient.nom || !planningAddress || !planningProblem) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      const newReport = {
        id: `${String(Math.floor(Math.random()*900)+100).padStart(3,"0")}/PTE/${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth()+1).padStart(2,"0")}`,
        date: planningDate,
        clientCivilite: "M.",
        clientNom: planningClient.nom,
        clientPrenom: planningClient.prenom,
        clientPhone: "",
        clientEmail: "",
        address: planningAddress,
        interventionAddress: planningAddress,
        problemType: planningProblem,
        status: "brouillon",
        objet: "",
        constatations: "",
        batiment: "",
        degats: [{nature:"",niveau:"",occupant:""}],
        investigation: [{nature:"",niveau:"",occupant:""}],
        alimentationConfig: "",
        alimentationComposition: "",
        alimentationPointsAcces: "",
        alimentationNotes: "",
        moyens: {humidimetre:false,hygrometre:false,manometre:false,endoscope:false,cameraTher_visu:false,cameraTher_reseau:false,ecouteElectro:false,miseEnEau:false,colorant:false},
        etapes: [{titre:"Vérification compteur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Pression réseau intérieur",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"État de l'infiltration",methodologie:"",resultat:"",conclusion:"",photos:[]},{titre:"Origine de la fuite",methodologie:"",resultat:"",conclusion:"",photos:[]}],
        conclusion: "",
        recommandations: "",
        sectionPhotos: defSP()
      };

      setReports(prev => [newReport, ...prev]);
      setPlanningModal(false);
      setPlanningDate("");
      setPlanningClient({ nom: "", prenom: "" });
      setPlanningAddress("");
      setPlanningProblem("");
      alert("Intervention programmée avec succès!");
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const getMonthDates = (year, month) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const reportsMap = {};
      reports.forEach(r => {
        const dateKey = r.date;
        if (!reportsMap[dateKey]) reportsMap[dateKey] = [];
        reportsMap[dateKey].push(r);
      });

      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return { days, reportsMap };
    };

    const { days, reportsMap } = getMonthDates(currentYear, currentMonth);

    const upcomingInterventions = reports
      .filter(r => new Date(r.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);

    const pastInterventions = reports
      .filter(r => new Date(r.date) < new Date())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    return(
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100" style={{minHeight: '100vh'}}>
        <Navbar currentView={view} setView={setView} setReport={setReport} setSection={setSection} setEditing={setEditing} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Planning</h1>
              <p className="text-slate-600">Gérez votre agenda d'interventions</p>
            </div>
            <button onClick={() => setPlanningModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm">
              <Plus size={16}/>Programmer une intervention
            </button>
          </div>

          {/* Modal Programmer une intervention */}
          {planningModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Programmer une intervention</h2>
                  <button onClick={() => setPlanningModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date d'intervention</label>
                    <input type="date" value={planningDate} onChange={(e) => setPlanningDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nom client</label>
                      <input type="text" value={planningClient.nom} onChange={(e) => setPlanningClient({...planningClient, nom: e.target.value})} placeholder="Ex: SALL" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                      <input type="text" value={planningClient.prenom} onChange={(e) => setPlanningClient({...planningClient, prenom: e.target.value})} placeholder="Ex: Amadou" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                    <input type="text" value={planningAddress} onChange={(e) => setPlanningAddress(e.target.value)} placeholder="Ex: 45 Rue de Ngor, Dakar" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type de problème</label>
                    <input type="text" value={planningProblem} onChange={(e) => setPlanningProblem(e.target.value)} placeholder="Ex: Fuite d'eau, Infiltrations..." className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setPlanningModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
                      Annuler
                    </button>
                    <button onClick={handleScheduleIntervention} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-medium">
                      Programmer
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Calendrier principal */}
            <div className="lg:col-span-2">
              <Card>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{monthNames[currentMonth]} {currentYear}</h2>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(d => <div key={d} className="text-center text-sm font-semibold text-slate-500 py-2">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, idx) => {
                    const dateStr = day ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                    const dayReports = dateStr ? (reportsMap[dateStr] || []) : [];
                    const isToday = day && new Date(currentYear, currentMonth, day).toDateString() === new Date().toDateString();

                    const handleDayClick = () => {
                      if (dateStr) {
                        setPlanningDate(dateStr);
                        setPlanningModal(true);
                      }
                    };

                    return (
                      <div
                        key={idx}
                        onClick={handleDayClick}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition p-2 ${
                          day
                            ? dayReports.length > 0
                              ? isToday
                                ? "border-red-400 bg-red-50 text-red-700 hover:bg-red-100 shadow-md"
                                : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : isToday
                              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            : "border-transparent bg-slate-50"
                        }`}
                      >
                        {day && (
                          <>
                            <div className="font-bold">{day}</div>
                            {dayReports.length > 0 && (
                              <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                                {dayReports.slice(0, 2).map((_, i) => (
                                  <div key={i} className="w-1 h-1 rounded-full bg-current" />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Stats latérales */}
            <div className="space-y-6">
              <Card>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{upcomingInterventions.length}</div>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Interventions à venir</div>
                </div>
              </Card>

              <Card>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-slate-700 mb-1">{pastInterventions.length}</div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Interventions passées</div>
                </div>
              </Card>

              <Card>
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-slate-700 mb-1">{reports.length}</div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total rapports</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Interventions à venir */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-800">Interventions à venir</h2>
              <p className="text-sm text-slate-500">Les 10 prochaines interventions programmées</p>
            </div>

            {upcomingInterventions.length > 0 ? (
              <Card>
                <div className="space-y-3">
                  {upcomingInterventions.map(r => (
                    <div key={r.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100/50 hover:shadow-md transition">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center cursor-pointer" onClick={() => openView(r)}>
                          <WI name="calendar" size={20} color="#1d4ed8" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0 cursor-pointer" onClick={() => openView(r)}>
                        <div className="font-semibold text-slate-800">{r.clientNom} {r.clientPrenom}</div>
                        <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                          <WI name="location" size={14} color="#64748b" />
                          {r.address}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <WI name="calendar" size={12} color="#94a3b8" />
                          {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'finalisé' ? 'bg-green-100 text-green-700' :
                          r.status === 'en cours' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                        <button
                          onClick={() => exportToICS(r)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition text-xs whitespace-nowrap"
                          title="Exporter en ICS"
                        >
                          <WI name="download" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="text-center py-8">
                <div className="text-slate-500">
                  <WI name="calendar" size={32} color="#cbd5e1" className="mx-auto mb-2" />
                  <p>Aucune intervention programmée</p>
                </div>
              </Card>
            )}
          </div>

          {/* Interventions passées */}
          {pastInterventions.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Interventions récentes</h2>
                <p className="text-sm text-slate-500">Les 10 dernières interventions</p>
              </div>

              <Card>
                <div className="space-y-3">
                  {pastInterventions.map(r => (
                    <div key={r.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100/50 hover:shadow-md transition cursor-pointer" onClick={() => openView(r)}>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <WI name="check_circle" size={20} color="#64748b" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-slate-800">{r.clientNom} {r.clientPrenom}</div>
                        <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                          <WI name="location" size={14} color="#64748b" />
                          {r.address}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <WI name="calendar" size={12} color="#94a3b8" />
                          {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'finalisé' ? 'bg-green-100 text-green-700' :
                          r.status === 'en cours' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── FORM VIEW ── */
  if(!report)return null;
  const prog=Math.round((section/(SECTIONS.length-1))*100);
  return(
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {shareOpen&&<ShareModal report={report} onClose={()=>setShareOpen(false)}/>}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button onClick={()=>setView("dashboard")} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"><ArrowLeft size={17}/></button>
        <Logo/>
        <div className="flex-1 min-w-0 ml-1"><div className="text-xs font-mono text-slate-400">{report.id}</div><div className="text-sm font-semibold text-slate-700 truncate">{report.clientCivilite} {report.clientNom||"Nouveau rapport"} {report.clientPrenom}</div></div>
        <StatusBadge status={report.status}/>
        <button onClick={()=>setShareOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition"><Share2 size={13}/>Partager</button>
        {editing?<button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition"><Save size={13}/>Enregistrer</button>:<button onClick={()=>setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"><Edit size={13}/>Modifier</button>}
      </header>
      <div className="h-1 bg-slate-100"><div className="h-full bg-gradient-to-r from-sky-400 to-blue-700 transition-all duration-500 rounded-full" style={{width:`${prog}%`}}/></div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="shrink-0 bg-white border-r border-slate-100 py-3 hidden md:flex flex-col overflow-y-auto" style={{width:"235px"}}>
          {SECTIONS.map(s=>(<button key={s.id} onClick={()=>setSection(s.id)} className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2.5 transition border-r-2 ${section===s.id?"bg-blue-50 text-blue-700 font-semibold border-blue-600":"text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700"}`}><div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${section===s.id?"bg-blue-100":"bg-slate-100"}`}><WI name={s.icon} size={14} color={section===s.id?"#1d4ed8":"#94a3b8"}/></div><span className="leading-tight">{s.label}</span></button>))}
        </aside>
        <main className="flex-1 overflow-y-auto p-5 max-w-3xl">
          <SectionRouter section={section} report={report} editing={editing} upd={upd} updE={updE} updSP={updSP}/>
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button onClick={()=>setSection(Math.max(0,section-1))} disabled={section===0} className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"><ArrowLeft size={13}/>Précédent</button>
            <span className="text-xs text-slate-400">{section+1} / {SECTIONS.length}</span>
            {section<SECTIONS.length-1?<button onClick={()=>setSection(Math.min(SECTIONS.length-1,section+1))} className="flex items-center gap-1.5 px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">Suivant<ArrowRight size={13}/></button>:editing&&<button onClick={save} className="flex items-center gap-1.5 px-5 py-2 text-sm text-white bg-blue-700 rounded-xl hover:bg-blue-800 transition font-semibold"><Save size={13}/>Finaliser le rapport</button>}
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionRouter({section,report,editing,upd,updE,updSP}) {
  const p={report,editing,upd,updE,updSP};
  const map=[<Sec0 {...p}/>,<SecTiers {...p}/>,<Sec1 {...p}/>,<Sec2 {...p}/>,<Sec3 {...p}/>,<SecAlim {...p}/>,<SecEvaluations {...p}/>,<Sec5 {...p}/>,<SecE {...p} ei={0}/>,<SecE {...p} ei={1}/>,<SecE {...p} ei={2}/>,<SecE {...p} ei={3}/>,<Sec10 {...p}/>,<Sec11 {...p}/>];
  return map[section]||null;
}

/* ── SECTION 0 – Informations générales ── */
function Sec0({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  const F=({label,field,type="text",placeholder=""})=>(<div className="mb-4"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{label}</label>{editing?<input type={type} value={report[field]||""} onChange={e=>upd(field,e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/>:<div className="text-sm text-slate-700">{report[field]||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</div>}</div>);
  return(<div><SH icon="id_card" title="Informations générales" sub="Identification du dossier et du client sinistré"/>
    <div className="space-y-4">
      <Card><PhotoSection photos={sp.infos} onChange={p=>updSP("infos",p)} label="Photos du bâtiment / site"/></Card>
      <Card><div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="files" size={14} color="#64748b"/>Dossier</div><div className="grid grid-cols-2 gap-4"><F label="N° de dossier" field="id" placeholder="001/PTE/1025"/><F label="Date d'intervention" field="date" type="date"/></div><F label="Type de problème signalé" field="problemType" placeholder="Ex : Infiltrations d'eau au plafond…"/>{editing&&<div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Statut</label><select value={report.status} onChange={e=>upd("status",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">{["brouillon","en cours","finalisé"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>}</Card>
      <Card><div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="id_card" size={14} color="#64748b"/>Client sinistré</div><div className="grid grid-cols-3 gap-3 mb-3"><div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Civilité</label>{editing?<select value={report.clientCivilite} onChange={e=>upd("clientCivilite",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">{["M.","Mme","Dr","Pr"].map(c=><option key={c}>{c}</option>)}</select>:<div className="text-sm text-slate-700">{report.clientCivilite}</div>}</div><F label="Nom" field="clientNom" placeholder="DUPONT"/><F label="Prénom" field="clientPrenom" placeholder="Jean"/></div><div className="grid grid-cols-2 gap-3"><F label="Téléphone" field="clientPhone" type="tel" placeholder="77 XXX XX XX"/><F label="Email" field="clientEmail" type="email" placeholder="email@exemple.com"/></div></Card>
      <Card><div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="floor_plan" size={14} color="#64748b"/>Adresses</div><F label="Adresse du client" field="address" placeholder="28 rue 111, Dakar Point E"/><F label="Adresse d'intervention" field="interventionAddress" placeholder="Appartement C5, 28 rue 111…"/></Card>
    </div></div>);
}

function SecTiers({report,editing,upd,updSP}) {
  const F=({label,field,type="text",placeholder=""})=>(<div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{label}</label>{editing?<input type={type} value={report[field]||""} onChange={e=>upd(field,e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/>:<div className="text-sm text-slate-700">{report[field]||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</div>}</div>);
  return(<div><SH icon="id_card" title="Tiers responsables & Responsabilité civile" sub="Identification légale des parties et responsables de la sinistralité"/>
    <div className="space-y-4">
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="id_card" size={14} color="#64748b"/>Tiers responsable de la fuite</div>
        {editing?<div><div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type de tiers</label><select value={report.tiersType} onChange={e=>upd("tiersType",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Sélectionner --</option><option value="propriétaire">Propriétaire de l'immeuble</option><option value="copropriétaire">Copropriétaire (autre lot)</option><option value="locataire">Locataire</option><option value="tiers">Tiers (préciser)</option><option value="unknown">Responsabilité à déterminer</option></select></div><F label="Identité du tiers" field="tiersNom" placeholder="Nom, prénom ou entreprise"/><F label="Contact tiers" field="tiersContact" placeholder="Téléphone ou email"/><F label="Assurance du tiers" field="tiersAssurance" placeholder="Ex : AXA, Allianz, etc."/></div>:<><p className="text-sm text-slate-700 mb-2"><strong>Type :</strong> {report.tiersType||"Non spécifié"}</p><p className="text-sm text-slate-700 mb-2"><strong>Identité :</strong> {report.tiersNom||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p><p className="text-sm text-slate-700 mb-2"><strong>Contact :</strong> {report.tiersContact||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p><p className="text-sm text-slate-700"><strong>Assurance :</strong> {report.tiersAssurance||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></>}
      </Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="id_card" size={14} color="#64748b"/>Demandeur d'intervention</div>
        {editing?<div><div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type de demandeur</label><select value={report.demandeurType} onChange={e=>upd("demandeurType",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Sélectionner --</option><option value="client">Client lui-même</option><option value="syndic">Syndic de copropriété</option><option value="assureur">Assureur</option><option value="expert">Expert judiciaire</option><option value="tiers">Autre (préciser)</option></select></div><F label="Identité du demandeur" field="demandeurNom" placeholder="Nom / Organisme"/><F label="Contact demandeur" field="demandeurContact" placeholder="Téléphone ou email"/></div>:<><p className="text-sm text-slate-700 mb-2"><strong>Type :</strong> {report.demandeurType||"Non spécifié"}</p><p className="text-sm text-slate-700 mb-2"><strong>Identité :</strong> {report.demandeurNom||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p><p className="text-sm text-slate-700"><strong>Contact :</strong> {report.demandeurContact||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></>}
      </Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="magnify" size={14} color="#64748b"/>Contexte historique</div>
        {editing?<><F label="Date de première manifestation" field="dateFirstManif" type="date"/><VTA label="Interventions antérieures" value={report.interventionsAntérieures} onChange={v=>upd("interventionsAntérieures",v)} placeholder="Décrivez les interventions précédentes, réparations tentées…" rows={4}/></> :<><p className="text-sm text-slate-700 mb-2"><strong>Première manifestation :</strong> {report.dateFirstManif||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p><p className="text-sm text-slate-700 whitespace-pre-wrap"><strong>Interventions antérieures :</strong> {report.interventionsAntérieures||<span className="text-slate-300 italic text-xs">Aucune</span>}</p></>}
      </Card>
    </div></div>);
}

function Sec1({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  return <div><SH icon="clipboard_drop" title="Objet de l'intervention" sub="Description du problème signalé par le client & Historique"/><div className="space-y-4"><Card><PhotoSection photos={sp.objet} onChange={p=>updSP("objet",p)} label="Photos du problème signalé"/></Card><Card><VTA label="Objet principal" value={report.objet} onChange={v=>upd("objet",v)} placeholder="Décrivez pourquoi le client a sollicité ESMEAU…" rows={5}/></Card></div></div>;
}

function Sec2({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  return <div><SH icon="magnify" title="Constatations sur place" sub="Observations réalisées à l'arrivée sur site"/><div className="space-y-4"><Card><PhotoSection photos={sp.constatations} onChange={p=>updSP("constatations",p)} label="Photos des dommages constatés"/></Card><Card>{editing?<VTA label="Constatations" value={report.constatations} onChange={v=>upd("constatations",v)} placeholder="Décrivez ce qui a été observé à l'arrivée…" rows={7}/>:<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.constatations||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}</Card></div></div>;
}

function Sec3({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  const updRow=(field,idx,key,val)=>upd(field,report[field].map((r,i)=>i===idx?{...r,[key]:val}:r));
  const addRow=field=>upd(field,[...report[field],{nature:"",niveau:"",occupant:""}]);
  const delRow=(field,idx)=>upd(field,report[field].filter((_,i)=>i!==idx));
  const Table=({field,label,accent,ico})=>(<div className="mb-1"><div className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${accent}`}><WI name={ico} size={13}/>{label}</div><table className="w-full text-xs mb-2 border-collapse"><thead><tr className="border-b border-slate-100"><th className="text-left py-1 pr-2 text-slate-400 font-semibold w-2/5">Nature du lieu</th><th className="text-left py-1 pr-2 text-slate-400 font-semibold w-1/6">Niveau</th><th className="text-left py-1 text-slate-400 font-semibold">Occupant</th>{editing&&<th className="w-8"/>}</tr></thead><tbody>{report[field].map((row,i)=>(<tr key={i} className="border-b border-slate-50">{editing?<><td className="py-1 pr-2"><input value={row.nature} onChange={e=>updRow(field,i,"nature",e.target.value)} className="w-full border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"/></td><td className="py-1 pr-2"><input value={row.niveau} onChange={e=>updRow(field,i,"niveau",e.target.value)} className="w-full border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"/></td><td className="py-1"><input value={row.occupant} onChange={e=>updRow(field,i,"occupant",e.target.value)} className="w-full border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"/></td><td className="py-1 pl-1"><button onClick={()=>delRow(field,i)} className="text-red-400 p-0.5"><X size={12}/></button></td></>:<><td className="py-1.5 pr-2 text-slate-700">{row.nature}</td><td className="py-1.5 pr-2 text-slate-700">{row.niveau}</td><td className="py-1.5 text-slate-700">{row.occupant}</td></>}</tr>))}</tbody></table>{editing&&<button onClick={()=>addRow(field)} className="text-xs text-sky-600 flex items-center gap-1"><Plus size={11}/>Ajouter</button>}</div>);
  return(<div><SH icon="floor_plan" title="Configuration des lieux" sub="Bâtiment, localisation des dégâts et zones investiguées"/>
    <div className="space-y-4"><Card><PhotoSection photos={sp.config} onChange={p=>updSP("config",p)} label="Photos du site et plan de configuration"/></Card>
    <Card><div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wide"><WI name="floor_plan" size={14} color="#64748b"/>Bâtiment</div>{editing?<input value={report.batiment} onChange={e=>upd("batiment",e.target.value)} placeholder="Ex : Immeuble de R+6, Maison R+1…" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/>:<p className="text-sm text-slate-700">{report.batiment||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}</Card>
    <Card><Table field="degats" label="Où sont situés les dégâts ?" accent="text-red-500" ico="drip"/></Card>
    <Card><Table field="investigation" label="Où avons-nous investigué ?" accent="text-blue-600" ico="magnify"/></Card>
    </div></div>);
}

/* ── SECTION ALIMENTATION ── */
function SecAlim({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  return(<div><SH icon="pipe_net" title="Alimentation en eau potable" sub="Schéma, points d'accès et configuration de l'installation"/>
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5">
        <PhotoSection photos={sp.alimentation} onChange={p=>updSP("alimentation",p)} label="Photos de l'installation (compteur, suppresseur, réservoirs, vannes…)"/>
      </div>
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><WI name="pipe_net" size={17} color="#1d4ed8"/></div><div><div className="text-sm font-bold text-slate-700">Schéma d'alimentation</div><div className="text-xs text-slate-400">Chaîne complète (ex : Compteur → Suppresseur → Réservoirs → Distribution)</div></div></div>
        {editing?<VTA label="Schéma général" value={report.alimentationConfig} onChange={v=>upd("alimentationConfig",v)} placeholder="Ex : Compteur Sen'Eau → Suppresseur → Réservoirs toiture (×2) → Nourrices par étage" rows={3}/>:<div className="bg-blue-50 rounded-xl p-3"><p className="text-sm text-blue-900 font-mono leading-relaxed">{report.alimentationConfig||<span className="text-slate-300 italic text-xs not-[font-mono]">Non renseigné</span>}</p></div>}
      </Card>
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100"><div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center"><WI name="floor_plan" size={17} color="#0369a1"/></div><div><div className="text-sm font-bold text-slate-700">Composition de l'installation</div><div className="text-xs text-slate-400">Nombre de pièces, salles de bains, cuisines, niveaux…</div></div></div>
        {editing?<VTA label="Composition" value={report.alimentationComposition} onChange={v=>upd("alimentationComposition",v)} placeholder="Ex : 6 chambres avec SDB, 2 cuisines, piscine à débordement" rows={3}/>:<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationComposition||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}
      </Card>
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100"><div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center"><WI name="valve" size={17} color="#0369a1"/></div><div><div className="text-sm font-bold text-slate-700">Points d'accès et vannes</div><div className="text-xs text-slate-400">Localisation du compteur, vannes d'arrêt, nourrices, suppresseur…</div></div></div>
        {editing?<VTA label="Points d'accès" value={report.alimentationPointsAcces} onChange={v=>upd("alimentationPointsAcces",v)} placeholder="Ex : Compteur principal (extérieur). Vanne générale (local technique RDC). Suppresseur (sous-sol). Nourrice par étage en gaine technique." rows={4}/>:<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationPointsAcces||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}
      </Card>
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100"><div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><WI name="magnify" size={17} color="#64748b"/></div><div><div className="text-sm font-bold text-slate-700">Observations complémentaires</div><div className="text-xs text-slate-400">Particularités, anomalies observées, état général…</div></div></div>
        {editing?<VTA label="Observations" value={report.alimentationNotes} onChange={v=>upd("alimentationNotes",v)} placeholder="Ex : Conduites condensats entièrement encastrées. Absence de vanne sectorisée par appartement." rows={4}/>:<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationNotes||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}
      </Card>
    </div></div>);
}

function SecEvaluations({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  const F=({label,field,type="text",placeholder=""})=>(<div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{label}</label>{editing?<input type={type} value={report[field]||""} onChange={e=>upd(field,e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/>:<div className="text-sm text-slate-700 whitespace-pre-wrap">{report[field]||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</div>}</div>);
  return(<div><SH icon="pipe_net" title="Évacuations, ECS & Chauffage" sub="Réseaux d'évacuation, eau chaude sanitaire et circuits de chauffage"/>
    <div className="space-y-4">
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="pipe_net" size={14} color="#64748b"/>Eau chaude sanitaire (ECS)</div>
        {editing?<><div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type d'ECS</label><select value={report.alimentationECSType} onChange={e=>upd("alimentationECSType",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Aucune --</option><option value="accumulateur">Accumulateur</option><option value="instantané">Chauffe-eau instantané</option><option value="ballon">Ballon électrique</option><option value="thermodynamique">Chauffe-eau thermodynamique</option><option value="solaire">Panneaux solaires</option></select></div><VTA label="Configuration ECS" value={report.alimentationECS} onChange={v=>upd("alimentationECS",v)} placeholder="Localisation, tuyauterie, isolation, état général…" rows={3}/></> :<><p className="text-sm text-slate-700 mb-2"><strong>Type :</strong> {report.alimentationECSType||"Aucune ECS"}</p><p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationECS||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></>}
      </Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="pipe_net" size={14} color="#64748b"/>Chauffage & Radiateurs</div>
        {editing?<><div className="mb-3"><label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type de chauffage</label><select value={report.alimentationChauffageType} onChange={e=>upd("alimentationChauffageType",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Aucun --</option><option value="gaz">Chaudière gaz</option><option value="électrique">Radiateurs électriques</option><option value="pompe-chaleur">Pompe à chaleur</option><option value="radiateurs-eau">Radiateurs eau chaude</option><option value="plancher-chauffant">Plancher chauffant</option></select></div><VTA label="Configuration chauffage" value={report.alimentationChauffage} onChange={v=>upd("alimentationChauffage",v)} placeholder="Localisation, tuyauterie, vannes thermostatiques, état…" rows={3}/></> :<><p className="text-sm text-slate-700 mb-2"><strong>Type :</strong> {report.alimentationChauffageType||"Aucun chauffage"}</p><p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationChauffage||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></>}
      </Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="pipe_net" size={14} color="#64748b"/>Réseaux d'évacuation</div>
        {editing?<VTA label="Évacuations (eaux usées, condensats)" value={report.alimentationEvacuations} onChange={v=>upd("alimentationEvacuations",v)} placeholder="Localisation WC, douche, cuisine. État des tuyauteries, joints, pentes…" rows={4}/> :<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationEvacuations||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}
      </Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="magnify" size={14} color="#64748b"/>Isolation & Protection</div>
        {editing?<VTA label="Tuyauteries visibles/encastrées & Isolation" value={report.alimentationIsolation} onChange={v=>upd("alimentationIsolation",v)} placeholder="État corrosion, érosion, calorifugeage, gaines de protection…" rows={3}/> :<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.alimentationIsolation||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p>}
      </Card>
      <Card>
        <PhotoSection photos={sp.alimentation} onChange={p=>updSP("alimentation",p)} label="Photos des circuits secondaires (ECS, chauffage, évacuations)"/>
      </Card>
    </div></div>);
}

function Sec5({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  const tog=f=>upd("moyens",{...report.moyens,[f]:!report.moyens[f]});
  const groups=[{label:"Mesures d'humidité",icon:"drip",items:[{f:"humidimetre",l:"Humidimètre"},{f:"hygrometre",l:"Hygromètre"}]},{label:"Tests de réseaux",icon:"gauge",items:[{f:"manometre",l:"Manomètre Digital"},{f:"testPression",l:"Test pression régulée"}]},{label:"Visualisation",icon:"magnify",items:[{f:"endoscope",l:"Endoscope à fibre optique"},{f:"cameraTher_visu",l:"Caméra Thermique (visualisation)"}]},{label:"Recherche de réseaux",icon:"eye",items:[{f:"ecouteElectro",l:"Écoute électroacoustique"},{f:"cameraTher_reseau",l:"Caméra Thermique (réseaux)"},{f:"detecteurCourant",l:"Détecteur de courant"}]},{label:"Test d'étanchéité & infiltration",icon:"sealed",items:[{f:"miseEnEau",l:"Mise en eau"},{f:"colorant",l:"Colorant"},{f:"fumigene",l:"Fumigène (dépistage fuites air)"}]}];
  return(<div><SH icon="toolbox" title="Moyens techniques utilisés" sub="Équipements et méthodes mis en œuvre lors de l'intervention"/>
    <div className="space-y-4"><Card><PhotoSection photos={sp.moyens} onChange={p=>updSP("moyens",p)} label="Photos des équipements utilisés"/></Card>
    <div className="grid grid-cols-1 gap-4" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
      {groups.map(g=>(<Card key={g.label}><div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wide underline"><WI name={g.icon} size={13} color="#64748b"/>{g.label}</div><div className="space-y-2.5">{g.items.map(it=>(<div key={it.f} className="flex items-center gap-2.5"><div onClick={()=>editing&&tog(it.f)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${report.moyens[it.f]?"bg-blue-600 border-blue-600":"border-slate-300"} ${editing?"cursor-pointer hover:border-blue-400":""}`}>{report.moyens[it.f]&&<Check size={11} className="text-white"/>}</div><span className={`text-sm ${report.moyens[it.f]?"text-slate-800 font-medium":"text-slate-400"}`}>{it.l}</span></div>))}</div></Card>))}
    </div></div></div>);
}

/* ── Étapes 1-4 ── */
function SecE({report,editing,updE,ei}) {
  const etape=report.etapes[ei];if(!etape)return null;
  const stepBg=["from-blue-50 to-sky-50 border-blue-200","from-sky-50 to-cyan-50 border-sky-200","from-cyan-50 to-blue-50 border-cyan-200","from-blue-50 to-indigo-50 border-indigo-200"];
  const stepHints=[
    {label:"Seuil normal",placeholder:"Ex : compteur fixe = aucune fuite"},
    {label:"Seuil normal",placeholder:"Pression normale : 2-3 bar. Chute acceptable < 0,1 bar/5min"},
    {label:"Seuil humidité",placeholder:"HR ambiant < 60%. Humidité murs < 20% (bois) ou < 4% (béton)"},
    {label:"Notes complémentaires",placeholder:"Localisation précise, signes visuels…"}
  ];
  const hint=stepHints[ei];
  return(<div><SH icon={STEP_ICONS[ei]} title={`Étape ${ei+1} : ${etape.titre}`} sub="Photos, méthodologie, résultats, seuils et conclusion"/>
    <div className="space-y-4">
      <div className={`rounded-2xl border-2 bg-gradient-to-br p-5 ${stepBg[ei]}`}>
        <PhotoSection photos={etape.photos||[]} onChange={photos=>updE(ei,"photos",photos)} label={`Photos — Étape ${ei+1} : ${etape.titre}`}/>
      </div>
      <Card>{editing?(<><VTA label="Méthodologie" value={etape.methodologie} onChange={v=>updE(ei,"methodologie",v)} placeholder="Décrivez la méthode utilisée pour cette étape…" rows={4}/><VTA label="Résultat" value={etape.resultat} onChange={v=>updE(ei,"resultat",v)} placeholder="Décrivez les résultats obtenus (mesures, observations, chiffres)…" rows={4}/><div className="mb-4"><label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">{hint.label}</label><input type="text" value={etape.seuilNormal||""} onChange={e=>updE(ei,"seuilNormal",e.target.value)} placeholder={hint.placeholder} className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/></div><VTA label="Notes complémentaires" value={etape.notes} onChange={v=>updE(ei,"notes",v)} placeholder="Observations additionnelles, contexte…" rows={2}/><VTA label="→ Conclusion" value={etape.conclusion} onChange={v=>updE(ei,"conclusion",v)} placeholder="Concluez sur cette étape…" rows={3}/></>):(<div className="space-y-5">{[{l:"Méthodologie",v:etape.methodologie,ico:"wrench"},{l:"Résultat",v:etape.resultat,ico:STEP_ICONS[ei]}].map(f=>(<div key={f.l}><div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5"><WI name={f.ico} size={12} color="#94a3b8"/>{f.l}</div><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{f.v||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></div>))}{etape.seuilNormal&&<div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3"><div className="flex items-center gap-1.5 text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1"><WI name="gauge" size={12} color="#ca8a04"/>Seuil/Norme</div><p className="text-sm text-yellow-900">{etape.seuilNormal}</p></div>}{etape.notes&&<div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Notes</p><p className="text-sm text-slate-700">{etape.notes}</p></div>}{etape.conclusion&&<div className="bg-sky-50 border border-sky-100 rounded-xl p-3"><div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wide mb-1"><WI name="doc_check" size={12} color="#0284c7"/>→ Conclusion</div><p className="text-sm text-sky-900 leading-relaxed">{etape.conclusion}</p></div>}</div>)}</Card>
    </div></div>);
}

function Sec10({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  return <div><SH icon="doc_check" title="Conclusion de l'intervention" sub="Synthèse : origine certifiée, responsabilité et risques résiduels"/>
    <div className="space-y-4">
      <Card><PhotoSection photos={sp.conclusion} onChange={p=>updSP("conclusion",p)} label="Photos illustrant la conclusion"/></Card>
      <Card>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><WI name="doc_check" size={14} color="#64748b"/>Conclusion générale</div>
        {editing?<VTA label="Conclusion" value={report.conclusion} onChange={v=>upd("conclusion",v)} placeholder="1. Origine certifiée de la fuite (où exactement ?)&#10;2. Responsabilité (qui doit réparer ?)&#10;3. Délai d'intervention recommandé&#10;4. Risques structuraux immédiat ?" rows={8}/>:<div className="bg-blue-50 rounded-xl p-4"><p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">{report.conclusion||<span className="text-slate-300 italic text-xs">Non renseigné</span>}</p></div>}
      </Card>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Risques résiduels</label>
            {editing?<textarea value={report.riskResiduel||""} onChange={e=>upd("riskResiduel",e.target.value)} placeholder="Ex : Risque d'extension si non réparé. Dégâts structuraux possibles…" rows={3} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"/>:<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.riskResiduel||<span className="text-slate-300 italic text-xs">Aucun</span>}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Assurabilité</label>
            {editing?<textarea value={report.assurabilite||""} onChange={e=>upd("assurabilite",e.target.value)} placeholder="Ex : Dégâts couverts par assurance responsabilité civile…" rows={3} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"/>:<p className="text-sm text-slate-700 whitespace-pre-wrap">{report.assurabilite||<span className="text-slate-300 italic text-xs">À déterminer</span>}</p>}
          </div>
        </div>
      </Card>
    </div></div>;
}

function Sec11({report,editing,upd,updSP}) {
  const sp=report.sectionPhotos||defSP();
  return(<div><SH icon="checklist" title="Recommandations" sub="Actions préconisées avec hiérarchie, urgence et responsabilité"/>
    <div className="space-y-4">
      <Card><PhotoSection photos={sp.recommandations} onChange={p=>updSP("recommandations",p)} label="Photos des travaux préconisés"/></Card>
      <Card>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Urgence</label>
            {editing?<select value={report.urgence||""} onChange={e=>upd("urgence",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Sélectionner --</option><option value="critique">🔴 Critique (< 24h)</option><option value="haute">🟠 Haute (< 1 sem)</option><option value="moyenne">🟡 Moyenne (< 1 mois)</option><option value="basse">🟢 Basse (≤ 3 mois)</option></select>:<p className="text-sm text-slate-700">{report.urgence||<span className="text-slate-300 italic text-xs">Non défini</span>}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Responsabilité</label>
            {editing?<select value={report.responsabiliteExecution||""} onChange={e=>upd("responsabiliteExecution",e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"><option value="">-- Sélectionner --</option><option value="propriétaire">Propriétaire du bien</option><option value="syndic">Syndic de copropriété</option><option value="copropriétaire-tiers">Copropriétaire (tiers)</option><option value="assurance">Assurance</option><option value="locataire">Locataire</option></select>:<p className="text-sm text-slate-700">{report.responsabiliteExecution||<span className="text-slate-300 italic text-xs">Non défini</span>}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Délai max</label>
            {editing?<input type="text" value={report.delaiMax||""} onChange={e=>upd("delaiMax",e.target.value)} placeholder="Ex : 7 jours" className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"/>:<p className="text-sm text-slate-700">{report.delaiMax||<span className="text-slate-300 italic text-xs">Non défini</span>}</p>}
          </div>
        </div>
      </Card>
      <Card>
        {editing?<VTA label="Recommandations (une par ligne, format: PRIORITÉ - Action)" value={report.recommandations} onChange={v=>upd("recommandations",v)} placeholder="URGENT - Arrêter les fuites condensats C6&#10;ESSENTIEL - Remplacer la conduite d'évacuation&#10;SOUHAITABLE - Vérifier la pente interne" rows={10}/>
        :(<div className="space-y-2">{(report.recommandations||'').split('\n').filter(Boolean).map((line,i)=>(<div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"><div className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i+1}</div><p className="text-sm text-slate-700 leading-relaxed">{line.replace(/^(URGENT|ESSENTIEL|SOUHAITABLE|-)\s*/,"").replace(/^\d+\.\s*/,"")}</p></div>))}{!report.recommandations&&<p className="text-slate-300 italic text-xs">Aucune recommandation</p>}</div>)}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 italic leading-relaxed">Les recommandations formulées ci-dessus constituent des préconisations fournies par la société ESMEAU à titre informatif. Leur mise en œuvre relève exclusivement de la responsabilité du client ou de l'assurance compétente.</p>
          <p className="text-xs text-slate-300 mt-2">Ent. ESMEAU — RCCM : SN.DKR.2022.A.17941 — NINEA : 009436561 1Y1 | Non assujetti à la TVA (Régime CGU) - BRS à reverser à la DGID - Article 321 du CGI</p>
        </div>
      </Card>
    </div></div>);
}

/* ─── RENDER APP TO DOM ─── */
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ErrorBoundary><App /></ErrorBoundary>);
