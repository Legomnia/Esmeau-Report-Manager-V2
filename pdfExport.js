import { jsPDF } from 'jspdf';

// ── Couleurs ESMEAU ──────────────────────────────────────────
const C = {
  blue:      [14,  116, 189],
  blueDark:  [10,   80, 140],
  blueLight: [219, 238, 252],
  slate:     [71,   85, 105],
  slateLight:[148, 163, 184],
  white:     [255, 255, 255],
  black:     [15,  23,  42],
  green:     [34, 197,  94],
  orange:    [249, 115, 22],
};

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── Helpers ──────────────────────────────────────────────────
function rgb(doc, color) { doc.setTextColor(...color); }
function fill(doc, color) { doc.setFillColor(...color); }
function stroke(doc, color) { doc.setDrawColor(...color); }

function addPage(doc) {
  doc.addPage();
  return MARGIN + 10;
}

function checkPageBreak(doc, y, needed = 20) {
  if (y + needed > 272) return addPage(doc);
  return y;
}

function sectionTitle(doc, y, text) {
  y = checkPageBreak(doc, y, 16);
  fill(doc, C.blue);
  doc.roundedRect(MARGIN, y, CONTENT_W, 8, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  rgb(doc, C.white);
  doc.text(text.toUpperCase(), MARGIN + 3, y + 5.5);
  return y + 12;
}

function label(doc, y, text) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  rgb(doc, C.slate);
  doc.text(text, MARGIN, y);
}

function value(doc, y, text, indent = 0) {
  if (!text?.trim()) return y;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  rgb(doc, C.black);
  const lines = doc.splitTextToSize(text, CONTENT_W - indent);
  lines.forEach((line, i) => {
    y = checkPageBreak(doc, y, 6);
    doc.text(line, MARGIN + indent, y);
    y += 5;
  });
  return y;
}

function field(doc, y, labelText, valueText) {
  if (!valueText?.trim()) return y;
  y = checkPageBreak(doc, y, 10);
  label(doc, y, labelText);
  y += 4.5;
  y = value(doc, y, valueText, 2);
  return y + 1;
}

function twoCol(doc, y, left, right) {
  const colW = CONTENT_W / 2 - 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  rgb(doc, C.slate);
  doc.text(left.label, MARGIN, y);
  doc.text(right.label, MARGIN + colW + 6, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  rgb(doc, C.black);
  const lLines = doc.splitTextToSize(left.value || '—', colW);
  const rLines = doc.splitTextToSize(right.value || '—', colW);
  const rows = Math.max(lLines.length, rLines.length);
  for (let i = 0; i < rows; i++) {
    y = checkPageBreak(doc, y, 5);
    if (lLines[i]) doc.text(lLines[i], MARGIN + 2, y);
    if (rLines[i]) doc.text(rLines[i], MARGIN + colW + 8, y);
    y += 5;
  }
  return y + 1;
}

// ── En-tête de page ──────────────────────────────────────────
function drawHeader(doc, report) {
  // Bande bleue
  fill(doc, C.blueDark);
  doc.rect(0, 0, PAGE_W, 22, 'F');

  // Nom société
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  rgb(doc, C.white);
  doc.text('ESMEAU', MARGIN, 10);

  // Sous-titre
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  rgb(doc, [180, 210, 240]);
  doc.text('Bureau d\'études — Expertise hydraulique & plomberie', MARGIN, 15);

  // Référence rapport
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  rgb(doc, C.white);
  doc.text(`Rapport ${report.id}`, PAGE_W - MARGIN, 10, { align: 'right' });

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  rgb(doc, [180, 210, 240]);
  const dateStr = report.date
    ? new Date(report.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
  doc.text(dateStr, PAGE_W - MARGIN, 15, { align: 'right' });
}

// ── Pied de page ─────────────────────────────────────────────
function drawFooter(doc, pageNum, totalPages) {
  const y = 287;
  stroke(doc, C.blueLight);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 3, PAGE_W - MARGIN, y - 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  rgb(doc, C.slateLight);
  doc.text('ESMEAU — Bureau d\'études hydraulique', MARGIN, y + 1);
  doc.text(`Page ${pageNum} / ${totalPages}`, PAGE_W - MARGIN, y + 1, { align: 'right' });
}

// ── Badge statut ─────────────────────────────────────────────
function statusBadge(doc, y, status) {
  const colors = {
    'finalisé':  C.green,
    'en cours':  C.orange,
    'brouillon': C.slateLight,
  };
  const color = colors[status] ?? C.slateLight;
  fill(doc, color);
  doc.roundedRect(MARGIN, y, 28, 6, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  rgb(doc, C.white);
  doc.text((status ?? '').toUpperCase(), MARGIN + 14, y + 4.2, { align: 'center' });
  return y + 9;
}

// ── Tableau dégâts / investigation ──────────────────────────
function drawTable(doc, y, rows) {
  if (!rows?.length) return y;
  const colW = [CONTENT_W * 0.5, CONTENT_W * 0.2, CONTENT_W * 0.3];
  const headers = ['Nature', 'Niveau', 'Occupant'];

  // En-tête tableau
  fill(doc, C.blueLight);
  doc.rect(MARGIN, y, CONTENT_W, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  rgb(doc, C.blueDark);
  let x = MARGIN + 2;
  headers.forEach((h, i) => { doc.text(h, x, y + 4.2); x += colW[i]; });
  y += 6;

  rows.forEach((row, idx) => {
    y = checkPageBreak(doc, y, 7);
    fill(doc, idx % 2 === 0 ? [248, 250, 252] : C.white);
    doc.rect(MARGIN, y, CONTENT_W, 6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    rgb(doc, C.black);
    x = MARGIN + 2;
    [row.nature, row.niveau, row.occupant].forEach((v, i) => {
      const lines = doc.splitTextToSize(v || '', colW[i] - 2);
      doc.text(lines[0] || '', x, y + 4.2);
      x += colW[i];
    });
    y += 6;
  });
  return y + 3;
}

// ── Moyens techniques ────────────────────────────────────────
function drawMoyens(doc, y, moyens) {
  if (!moyens) return y;
  const labels = {
    humidimetre:      'Humidimètre',
    hygrometre:       'Hygromètre',
    manometre:        'Manomètre',
    endoscope:        'Endoscope',
    cameraTher_visu:  'Caméra thermique visuelle',
    cameraTher_reseau:'Caméra thermique réseau',
    ecouteElectro:    'Écoute électroacoustique',
    miseEnEau:        'Mise en eau',
    colorant:         'Colorant',
    fumigene:         'Fumigène',
    testPression:     'Test de pression',
    detecteurCourant: 'Détecteur de courant',
  };
  const actifs = Object.entries(moyens).filter(([, v]) => v).map(([k]) => labels[k] ?? k);
  if (!actifs.length) return y;

  const itemW = 55;
  let x = MARGIN;
  actifs.forEach((m, i) => {
    if (i > 0 && i % 3 === 0) { x = MARGIN; y += 7; }
    y = checkPageBreak(doc, y, 7);
    fill(doc, C.blueLight);
    doc.roundedRect(x, y, itemW - 2, 5.5, 1, 1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    rgb(doc, C.blueDark);
    doc.text(m, x + itemW / 2 - 1, y + 3.8, { align: 'center' });
    x += itemW;
  });
  return y + 9;
}

// ── Étapes d'investigation ───────────────────────────────────
function drawEtapes(doc, y, etapes) {
  if (!etapes?.length) return y;
  etapes.forEach((etape, i) => {
    const hasContent = etape.methodologie || etape.resultat || etape.conclusion;
    if (!hasContent) return;
    y = checkPageBreak(doc, y, 20);

    // Titre étape
    fill(doc, C.blueLight);
    doc.roundedRect(MARGIN, y, CONTENT_W, 7, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    rgb(doc, C.blueDark);
    doc.text(`Étape ${i + 1} — ${etape.titre ?? ''}`, MARGIN + 3, y + 5);
    y += 10;

    if (etape.methodologie) y = field(doc, y, 'Méthodologie', etape.methodologie);
    if (etape.resultat)     y = field(doc, y, 'Résultat', etape.resultat);
    if (etape.conclusion)   y = field(doc, y, 'Conclusion', etape.conclusion);
    y += 2;
  });
  return y;
}

// ── Export principal ─────────────────────────────────────────
export function generateReportPDF(report) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Page 1 : Informations générales ─────────────────────
  drawHeader(doc, report);
  let y = 30;

  // Titre rapport
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  rgb(doc, C.blueDark);
  doc.text('RAPPORT D\'EXPERTISE', MARGIN, y);
  y += 7;

  y = statusBadge(doc, y, report.status);

  // Infos client
  y = sectionTitle(doc, y, '1. Informations générales');
  y = twoCol(doc, y,
    { label: 'Client', value: `${report.clientCivilite ?? ''} ${report.clientNom ?? ''} ${report.clientPrenom ?? ''}`.trim() },
    { label: 'Téléphone', value: report.clientPhone }
  );
  y = twoCol(doc, y,
    { label: 'Adresse', value: report.address },
    { label: 'Email', value: report.clientEmail }
  );
  if (report.interventionAddress && report.interventionAddress !== report.address) {
    y = field(doc, y, 'Adresse d\'intervention', report.interventionAddress);
  }
  if (report.problemType) y = field(doc, y, 'Problème signalé', report.problemType);
  if (report.batiment)    y = field(doc, y, 'Bâtiment', report.batiment);

  // Objet
  if (report.objet) {
    y = sectionTitle(doc, y, '2. Objet de l\'intervention');
    y = value(doc, y, report.objet);
  }

  // Constatations
  if (report.constatations) {
    y = sectionTitle(doc, y, '3. Constatations sur place');
    y = value(doc, y, report.constatations);
  }

  // Dégâts
  if (report.degats?.some(d => d.nature)) {
    y = sectionTitle(doc, y, '4. Dégâts constatés');
    y = drawTable(doc, y, report.degats);
  }

  // Alimentation
  const hasAlimentation = report.alimentationConfig || report.alimentationComposition ||
    report.alimentationPointsAcces || report.alimentationNotes;
  if (hasAlimentation) {
    y = sectionTitle(doc, y, '5. Réseau d\'alimentation eau potable');
    if (report.alimentationConfig)       y = field(doc, y, 'Configuration générale', report.alimentationConfig);
    if (report.alimentationComposition)  y = field(doc, y, 'Composition', report.alimentationComposition);
    if (report.alimentationPointsAcces)  y = field(doc, y, 'Points d\'accès', report.alimentationPointsAcces);
    if (report.alimentationNotes)        y = field(doc, y, 'Observations', report.alimentationNotes);
  }

  // ECS / Chauffage / Évacuations
  const hasReseau2 = report.alimentationECS || report.alimentationChauffage ||
    report.alimentationEvacuations || report.alimentationIsolation;
  if (hasReseau2) {
    y = sectionTitle(doc, y, '6. Évacuations, ECS & Chauffage');
    if (report.alimentationECS)         y = field(doc, y, 'Eau Chaude Sanitaire', report.alimentationECS);
    if (report.alimentationChauffage)   y = field(doc, y, 'Chauffage', report.alimentationChauffage);
    if (report.alimentationEvacuations) y = field(doc, y, 'Évacuations', report.alimentationEvacuations);
    if (report.alimentationIsolation)   y = field(doc, y, 'Isolation tuyauteries', report.alimentationIsolation);
  }

  // Moyens techniques
  if (report.moyens && Object.values(report.moyens).some(Boolean)) {
    y = sectionTitle(doc, y, '7. Moyens techniques mis en œuvre');
    y = drawMoyens(doc, y, report.moyens);
  }

  // Étapes d'investigation
  if (report.etapes?.some(e => e.methodologie || e.resultat || e.conclusion)) {
    y = sectionTitle(doc, y, '8. Investigation technique');
    y = drawEtapes(doc, y, report.etapes);
  }

  // Conclusion
  if (report.conclusion) {
    y = sectionTitle(doc, y, '9. Conclusion');
    y = value(doc, y, report.conclusion);
  }

  // Recommandations
  if (report.recommandations) {
    y = sectionTitle(doc, y, '10. Recommandations');
    y = value(doc, y, report.recommandations);
  }

  // Risque résiduel & assurabilité
  if (report.riskResiduel || report.assurabilite) {
    y = sectionTitle(doc, y, '11. Risques & Assurabilité');
    if (report.riskResiduel)  y = field(doc, y, 'Risque résiduel', report.riskResiduel);
    if (report.assurabilite)  y = field(doc, y, 'Assurabilité', report.assurabilite);
  }

  // ── Pieds de page sur toutes les pages ───────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total);
  }

  return doc;
}

// Téléchargement direct
export function downloadReportPDF(report) {
  const doc = generateReportPDF(report);
  const filename = `Rapport_${report.id?.replace(/\//g, '-')}_${report.clientNom ?? 'client'}.pdf`;
  doc.save(filename);
}

// Retourne un Blob pour l'upload Google Drive
export function getReportPDFBlob(report) {
  const doc = generateReportPDF(report);
  return doc.output('blob');
}
