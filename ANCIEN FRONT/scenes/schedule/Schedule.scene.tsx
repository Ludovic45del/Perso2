import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, Button,
  IconButton, Tooltip, Stack, TextField, Autocomplete, Menu, MenuItem, Chip,
  Box, Popover, CircularProgress, LinearProgress
} from "@mui/material";
import {
  ArrowBackIosNew, ArrowForwardIos, RestartAlt, InfoOutlined, ArrowForward, Remove, ExpandMore
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { getAllCampaigns } from "../../services/campaign/campaign.service";
import { getAllFsecs } from "../../services/fsec/fsec.service";
import "../scenes.scss";

dayjs.locale("fr");

// --------- CONSTANTES ----------
const COLORS = {
  white: "#FFF", grey: "#eceaf5", accent: "#1b336c", blue: "#3e4a84",
  card: "#F7F7FA", orange: "#fff7b9"
};
const MEMBRE_COL_WIDTH = 210, FONCTION_COL_WIDTH = 180, COL_MIN_WIDTH = 28;
const CAMPAGNE_COL_WIDTH = 220, ETAPE_COL_WIDTH = 185;
const SHOWN_WEEKS = 13, COMMENT_CHAR_LIMIT = 200;

const FONCTIONS = [
  { label: "RCE", color: "#3270A6" },
  { label: "Assembleur", color: "#5EADF2" },
  { label: "Technicien", color: "#77ABD9" },
  { label: "Sécurité", color: "#FFD700" }
];
const PERIODES = [
  { label: "Congés", value: "congés", color: "#ffcb90" },
  { label: "Mission", value: "mission", color: "#8ee8ff" },
  { label: "Formation", value: "formation", color: "#d9b5fd" }
];
const ETAPES = [
  { label: "Assemblage", color: "#3270A6", fsecKey: "assemblyStep" },
  { label: "Métrologie", color: "#5EADF2", fsecKey: "metrologyStep" },
  { label: "Livraison", color: "#77ABD9" },
  { label: "Tir", color: "#79B4D9", fsecKey: "shotStep" },
  { label: "Réception cibles", color: "#F0F2F0" }
];

// --------- UTILS ----------
const getWeeksOfYear = y => {
  const ws = [], d = dayjs(`${y}-01-01`), e = dayjs(`${y}-12-31`);
  for (let curr = d; curr.isBefore(e) || curr.isSame(e, "day"); curr = curr.add(7, "day")) ws.push(curr);
  return ws;
};
const getMonthsHeadersByWeeks = weeks => {
  if (!weeks.length) return [];
  const res = [];
  let m = weeks[0]?.format("MMMM"), s = 0;
  weeks.forEach((w, i) => {
    let n = w.format("MMMM");
    if (n !== m || i === weeks.length - 1) {
      res.push({ month: m[0].toUpperCase() + m.slice(1), colSpan: (i === weeks.length - 1) ? weeks.length - s : i - s });
      m = n; s = i;
    }
  });
  return res;
};
const useSyncedGrisedWeeks = () => {
  const [grisedWeeks, setGrisedWeeks] = useState({});
  const handleGrise = useCallback((week, type) => {
    setGrisedWeeks(old => !type ? Object.fromEntries(Object.entries(old).filter(([k]) => k !== week)) : { ...old, [week]: type });
  }, []);
  return [grisedWeeks, handleGrise];
};
const isFsecAtStep = (fsec, stepKey) =>
  !!(fsec && stepKey && (
    (stepKey === "assemblyStep" && Array.isArray(fsec.assemblyStep) && fsec.assemblyStep.length) ||
    (stepKey === "metrologyStep" && Array.isArray(fsec.metrologyStep) && fsec.metrologyStep.length) ||
    (stepKey === "shotStep" && fsec.shotStep)
  ));
const getWeeksInYearForCampaign = (s, e, shownWeeks, shownWeekNums) => {
  if (!s || !e) return [];
  const st = dayjs(s), en = dayjs(e);
  return shownWeeks.map((d, i) =>
    (d.add(6, "day").isBefore(st) || d.isAfter(en)) ? null : shownWeekNums[i]
  ).filter(Boolean);
};

// --------- TABLE ÉQUIPE (générique) ----------
function PlanningTableMembres({
  titre, membresInit, shownWeeks, shownWeekNums, monthsHeaders,
  weekColWidth, currentShownIdx, grisedWeeks, onGriseWeek,
  localMode = false, localColLabel = "Membre", fonctionColLabel = "Fonction"
}) {
  // Pour "localMode", on attend membresInit sous la forme [{ local, activite }]
  const [membres, setMembres] = useState(membresInit || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleFonction, setNouvelleFonction] = useState(FONCTIONS[0]);
  const [nouveauLocal, setNouveauLocal] = useState("");
  const [nouvelleActivite, setNouvelleActivite] = useState("");
  const [periodesCell, setPeriodesCell] = useState({});
  const [editPopover, setEditPopover] = useState({ anchorEl: null, membre: null, weekNum: null });
  const [infoPopover, setInfoPopover] = useState({ anchorEl: null, commentaire: "" });
  const [menuState, setMenuState] = useState({ anchorEl: null, week: null });
  const [periodeTypeDraft, setPeriodeTypeDraft] = useState(null);
  const [periodeCommentDraft, setPeriodeCommentDraft] = useState("");

  useEffect(() => {
    if (editPopover.membre && editPopover.weekNum != null) {
      const key = localMode
        ? `${editPopover.membre.local}#${editPopover.membre.activite}#S${editPopover.weekNum}`
        : `${editPopover.membre.nom}#S${editPopover.weekNum}`;
      const cell = periodesCell[key];
      setPeriodeTypeDraft(cell ? PERIODES.find(p => p.value === cell.type) : null);
      setPeriodeCommentDraft(cell?.commentaire || "");
    }
  }, [editPopover, periodesCell, localMode]);

  // Styles factorisés
  const cellBaseSx = { border: `1px solid ${COLORS.grey}`, fontSize: 13, textAlign: "center", color: "#222", py: 0 };
  const headerSx = { ...cellBaseSx, fontWeight: 700, background: COLORS.white, color: COLORS.accent, whiteSpace: "nowrap" };
  const weekCellSx = { ...headerSx, p: 0, width: weekColWidth, minWidth: weekColWidth, maxWidth: weekColWidth, overflow: "hidden" };

  // Callbacks
  const handleWeekHeaderContextMenu = useCallback((week, e) => {
    e.preventDefault(); setMenuState({ anchorEl: e.currentTarget, week });
  }, []);
  const handleMenuSelect = useCallback(type => {
    onGriseWeek(menuState.week, type);
    setMenuState({ anchorEl: null, week: null });
  }, [menuState.week, onGriseWeek]);
  const handleAjouterMembre = () => {
    if (localMode) {
      if (!nouveauLocal.trim() || !nouvelleActivite.trim()) return;
      setMembres(m => [...m, { local: nouveauLocal.trim(), activite: nouvelleActivite.trim() }]);
      setDialogOpen(false); setNouveauLocal(""); setNouvelleActivite("");
    } else {
      if (!nouveauNom.trim() || !nouvelleFonction) return;
      setMembres(m => [...m, { nom: nouveauNom, fonction: nouvelleFonction.label }]);
      setDialogOpen(false); setNouveauNom(""); setNouvelleFonction(FONCTIONS[0]);
    }
  };
  const handleCellEdit = (e, membre, weekNum) => setEditPopover({ anchorEl: e.currentTarget, membre, weekNum });
  const handleValidateEdit = (type, commentaire) => {
    const key = localMode
      ? `${editPopover.membre.local}#${editPopover.membre.activite}#S${editPopover.weekNum}`
      : `${editPopover.membre.nom}#S${editPopover.weekNum}`;
    setPeriodesCell(prev => type
      ? { ...prev, [key]: { type: type.value, commentaire } }
      : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    );
    setEditPopover({ anchorEl: null, membre: null, weekNum: null });
  };
  const handleShowInfo = (e, commentaire) => setInfoPopover({ anchorEl: e.currentTarget, commentaire });
  const handleCloseInfo = () => setInfoPopover({ anchorEl: null, commentaire: "" });

  // Construction des cellules avec fusion par type de période
  function getRowWithMergedCells(membre, idx, rowSpan = 1) {
    const cells = [];
    for (let i = 0; i < shownWeekNums.length;) {
      const weekNum = shownWeekNums[i];
      const key = localMode
        ? `${membre.local}#${membre.activite}#S${weekNum}`
        : `${membre.nom}#S${weekNum}`;
      const cell = periodesCell[key];
      let colSpan = 1;
      if (cell && cell.type) {
        while (i + colSpan < shownWeekNums.length &&
          periodesCell[localMode
            ? `${membre.local}#${membre.activite}#S${shownWeekNums[i + colSpan]}`
            : `${membre.nom}#S${shownWeekNums[i + colSpan]}`
          ]?.type === cell.type) colSpan++;
      }
      const bg = grisedWeeks[weekNum] === "vacances" ? "#f0f3fa"
        : grisedWeeks[weekNum] === "fermeture" ? "#c6c7cc"
          : (i === currentShownIdx) ? COLORS.orange : undefined;
      if (!cell || !cell.type) {
        cells.push(
          <TableCell key={weekNum} sx={{ ...weekCellSx, backgroundColor: bg, cursor: "pointer", py: 0 }}
            onClick={e => handleCellEdit(e, membre, weekNum)}
            onContextMenu={e => handleWeekHeaderContextMenu(weekNum, e)} />);
        i++;
      } else {
        const periodeMeta = PERIODES.find(p => p.value === cell.type);
        let content = cell.commentaire?.length > COMMENT_CHAR_LIMIT ?
          <Tooltip title="Voir le commentaire">
            <IconButton size="small" onClick={e => { e.stopPropagation(); handleShowInfo(e, cell.commentaire); }} sx={{ p: 0.3 }}>
              <InfoOutlined fontSize="small" sx={{ color: "#444" }} />
            </IconButton>
          </Tooltip> : cell.commentaire && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{cell.commentaire}</span>;
        cells.push(
          <TableCell key={weekNum} colSpan={colSpan}
            sx={{
              ...weekCellSx, backgroundColor: periodeMeta?.color ?? bg,
              cursor: "pointer", py: 0, textAlign: "center"
            }}
            onClick={e => handleCellEdit(e, membre, weekNum)}
            onContextMenu={e => handleWeekHeaderContextMenu(weekNum, e)}>
            {content}
          </TableCell>
        );
        i += colSpan;
      }
    }
    return cells;
  }

  // Préparation fusion cellules (localMode seulement)
  let rowsToRender = [];
  if (localMode) {
    // Grouper par local
    const grouped = membres.reduce((acc, curr) => {
      acc[curr.local] = acc[curr.local] || [];
      acc[curr.local].push(curr);
      return acc;
    }, {});
    Object.entries(grouped).forEach(([local, activities]) => {
      activities.forEach((activity, idx) => {
        rowsToRender.push({
          ...activity,
          rowSpan: idx === 0 ? activities.length : 0, // rowSpan uniquement sur la première ligne du groupe
          isFirst: idx === 0,
          groupLength: activities.length
        });
      });
    });
  } else {
    rowsToRender = membres.map(m => ({ ...m, rowSpan: 1, isFirst: true }));
  }

  // Rendu
  return (
    <Box>
      <div style={{ fontWeight: 700, fontSize: 18, margin: "12px 0 10px 0", color: COLORS.blue }}>{titre}</div>
      <Paper elevation={0} sx={{
        borderRadius: 0, boxShadow: "none", border: "none", background: "#fff", width: "100%",
        maxWidth: "100%", minHeight: "120px", marginRight: "8px"
      }}>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, width: MEMBRE_COL_WIDTH, borderRight: `2px solid ${COLORS.grey}` }} rowSpan={2}>{localColLabel}</TableCell>
              <TableCell sx={{ ...headerSx, width: FONCTION_COL_WIDTH, borderRight: `2px solid ${COLORS.grey}` }} rowSpan={2}>{fonctionColLabel}</TableCell>
              {monthsHeaders.map(({ month, colSpan }, i) =>
                <TableCell key={month + i} colSpan={colSpan} align="center"
                  sx={{ ...headerSx, borderLeft: i === 0 ? undefined : "1px solid #eceaf5", fontSize: 14, background: "#F5F6FA", color: "#3e4a84" }}>
                  {month}
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              {shownWeekNums.map((s, i) => (
                <TableCell key={i} sx={{
                  ...weekCellSx,
                  borderLeft: i === 0 ? undefined : "1px solid #eceaf5",
                  background: "#F5F6FA", color: "#3e4a84", cursor: "context-menu",
                  backgroundColor: (i === currentShownIdx) ? COLORS.orange :
                    grisedWeeks[s] === "vacances" ? "#f0f3fa" :
                      grisedWeeks[s] === "fermeture" ? "#c6c7cc" : undefined
                }}
                  title="Semaine"
                  onContextMenu={e => handleWeekHeaderContextMenu(s, e)}
                >{`S${s}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToRender.map((membre, idx) => {
              // Couleurs activité : pour localMode tu peux personnaliser selon activité si besoin
              const fctMeta = FONCTIONS.find(f => f.label === membre.fonction) || { label: membre.fonction, color: "#e2e6f2" };
              return (
                <TableRow key={(localMode ? membre.local + membre.activite : membre.nom + membre.fonction) + idx} hover>
                  {localMode && membre.isFirst
                    ? (
                      <TableCell sx={{
                        ...cellBaseSx, fontWeight: 600, borderRight: `2px solid ${COLORS.grey}`,
                        width: MEMBRE_COL_WIDTH, color: COLORS.accent, background: COLORS.white, textAlign: "center", py: 0
                      }} rowSpan={membre.rowSpan}>
                        {membre.local}
                      </TableCell>
                    )
                    : !localMode &&
                    <TableCell sx={{
                      ...cellBaseSx, fontWeight: 600, borderRight: `2px solid ${COLORS.grey}`,
                      width: MEMBRE_COL_WIDTH, color: COLORS.accent, background: COLORS.white, textAlign: "center", py: 0
                    }}>
                      {membre.nom}
                    </TableCell>
                  }
                  <TableCell sx={{
                    ...cellBaseSx, fontWeight: 500, borderRight: `2px solid ${COLORS.grey}`,
                    width: FONCTION_COL_WIDTH, color: COLORS.accent, background: COLORS.white, p: 0, py: 0
                  }}>
                    {localMode ? membre.activite :
                      <Chip size="small" label={fctMeta.label} sx={{
                        background: fctMeta.color, color: "#222", fontWeight: 600, fontSize: 13,
                        borderRadius: 2, px: 1.5, width: "100%", justifyContent: "flex-start",
                        whiteSpace: "normal", overflow: "visible", height: 20, minHeight: 18
                      }} />}
                  </TableCell>
                  {getRowWithMergedCells(membre, idx, membre.rowSpan)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* Popup d'édition cell */}
        <Popover
          open={!!editPopover.anchorEl}
          anchorEl={editPopover.anchorEl}
          onClose={() => setEditPopover({ anchorEl: null, membre: null, weekNum: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ p: 2, minWidth: 220, display: "flex", flexDirection: "column", gap: 1 }}>
            <Autocomplete options={PERIODES}
              value={periodeTypeDraft}
              onChange={(_, v) => setPeriodeTypeDraft(v)}
              getOptionLabel={o => o ? o.label : ""}
              renderInput={params => <TextField {...params} label="Type de période" size="small" />}
              size="small" isOptionEqualToValue={(o, v) => o?.value === v?.value}
            />
            <TextField label="Commentaire" value={periodeCommentDraft}
              onChange={e => setPeriodeCommentDraft(e.target.value)}
              size="small" multiline minRows={1} maxRows={3} />
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button variant="outlined" color="inherit" size="small"
                sx={{ fontSize: 13, textTransform: "none" }}
                onClick={() => setEditPopover({ anchorEl: null, membre: null, weekNum: null })}
              >Annuler</Button>
              <Button variant="contained" size="small" sx={{
                bgcolor: "#3e4a84", color: "#fff", fontWeight: 700, borderRadius: 2,
                px: 2, textTransform: "none", fontSize: 13,
                "&:hover": { bgcolor: "#293567" }
              }} onClick={() => handleValidateEdit(periodeTypeDraft, periodeCommentDraft)}>Valider</Button>
            </Box>
          </Box>
        </Popover>
        {/* Popup info commentaire */}
        <Popover open={!!infoPopover.anchorEl} anchorEl={infoPopover.anchorEl}
          onClose={handleCloseInfo}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}>
          <Box sx={{ p: 2, minWidth: 180, fontSize: 13 }}>{infoPopover.commentaire}</Box>
        </Popover>
        {/* Menu contextuel */}
        <Menu open={!!menuState.anchorEl} anchorEl={menuState.anchorEl} onClose={() => setMenuState({ anchorEl: null, week: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
          <MenuItem onClick={() => handleMenuSelect("vacances")}>Vacances scolaires</MenuItem>
          <MenuItem onClick={() => handleMenuSelect("fermeture")}>Fermeture du centre</MenuItem>
          <MenuItem onClick={() => handleMenuSelect(null)}>Aucun</MenuItem>
        </Menu>
      </Paper>
      {/* Dialog d’ajout membre/activité */}
      {dialogOpen && (
        <Box component="form" sx={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", bgcolor: "rgba(0,0,0,0.12)", zIndex: 1200,
          display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={() => setDialogOpen(false)}>
          <Box sx={{
            bgcolor: "#fff", borderRadius: 2, boxShadow: 5, p: 3, minWidth: 340,
            display: "flex", flexDirection: "column", gap: 2
          }} onClick={e => e.stopPropagation()}>
            {localMode ? (
              <>
                <TextField label="Local" value={nouveauLocal}
                  onChange={e => setNouveauLocal(e.target.value)}
                  size="small" fullWidth />
                <TextField label="Activité" value={nouvelleActivite}
                  onChange={e => setNouvelleActivite(e.target.value)}
                  size="small" fullWidth />
              </>
            ) : (
              <>
                <Autocomplete options={FONCTIONS}
                  value={nouvelleFonction}
                  onChange={(_, v) => setNouvelleFonction(v)}
                  getOptionLabel={o => o ? o.label : ""}
                  isOptionEqualToValue={(o, v) => o?.label === v?.label}
                  renderInput={p => <TextField {...p} label="Fonction" size="small" />}
                />
                <TextField label="Nom" value={nouveauNom}
                  onChange={e => setNouveauNom(e.target.value)}
                  size="small" fullWidth />
              </>
            )}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button onClick={() => setDialogOpen(false)} variant="outlined" size="small"
                sx={{
                  bgcolor: "#ececec", color: "#222", borderRadius: 2, px: 2, fontSize: 13,
                  fontWeight: 600, textTransform: "none"
                }}>Annuler</Button>
              <Button onClick={handleAjouterMembre} variant="contained" size="small"
                sx={{
                  bgcolor: "#388e3c", color: "#fff", borderRadius: 2, px: 2, fontSize: 13,
                  fontWeight: 700, textTransform: "none",
                  "&:hover": { bgcolor: "#27612d" }
                }} disabled={localMode
                  ? (!nouveauLocal.trim() || !nouvelleActivite.trim())
                  : !nouveauNom.trim()}>Ajouter</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// --------- TABLE CAMPAGNES ----------
// ********** INCLUS ICI EN ENTIER **********
function PlanningTableCampagnes({
  shownWeeks, shownWeekNums, monthsHeaders, weekColWidth, currentShownIdx,
  filters, stepFilter, setFilters, setStepFilter, years,
  canGoPrev, canGoNext, setMonthOffset, loading, grisedWeeks, onGriseWeek
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [allFsecs, setAllFsecs] = useState([]);
  const [cellText, setCellText] = useState({});
  const [fsecCellLinks, setFsecCellLinks] = useState({});
  const [popoverState, setPopoverState] = useState({ anchorEl: null, semaine: null, campagne: null, etape: null });
  const [popoverFsecs, setPopoverFsecs] = useState([]);
  const [popoverFsecsLoading, setPopoverFsecsLoading] = useState(false);
  const [menuState, setMenuState] = useState({ anchorEl: null, week: null });
  const navigate = useNavigate();

  useEffect(() => {
    getAllCampaigns().then(setCampaigns);
    getAllFsecs().then(setAllFsecs);
  }, []);

  const filteredCampaigns = useMemo(() =>
    campaigns.filter(x =>
      filters.installations.includes(x.installation?.label) &&
      (filters.year == null || x.year === filters.year)
    ).sort((a, b) =>
      (!a.startDate ? 1 : !b.startDate ? -1 : new Date(a.startDate) - new Date(b.startDate))
    ), [campaigns, filters]
  );
  const filteredEtapes = useMemo(() => {
    const filterSet = new Set(stepFilter.map(e => e.label));
    return ETAPES.filter(e => filterSet.has(e.label));
  }, [stepFilter]);
  const cellBaseSx = useMemo(() => ({
    border: `1px solid ${COLORS.grey}`, fontSize: 13, textAlign: "center", color: "#222", p: .5
  }), []);
  const headerSx = useMemo(() => ({ ...cellBaseSx, fontWeight: 700, background: COLORS.white, color: COLORS.accent, whiteSpace: "nowrap" }), [cellBaseSx]);
  const weekCellSx = useMemo(() => ({ ...headerSx, p: 0, width: weekColWidth, minWidth: weekColWidth, maxWidth: weekColWidth, overflow: "hidden" }), [headerSx, weekColWidth]);
  const handleWeekHeaderContextMenu = useCallback((week, e) => { e.preventDefault(); setMenuState({ anchorEl: e.currentTarget, week }); }, []);
  const handleMenuSelect = useCallback(type => { onGriseWeek(menuState.week, type); setMenuState({ anchorEl: null, week: null }); }, [menuState.week, onGriseWeek]);

  // Fond de cellule
  const getBg = useCallback((week, isPeriode, isCurrent, cellKey, etape) => {
    if (isCurrent) return COLORS.orange;
    if (fsecCellLinks[cellKey]?.length) return etape.color || "#e2e6f2";
    return isPeriode ? "#e2e6f2"
      : grisedWeeks[week] === "vacances" ? "#f0f3fa"
        : grisedWeeks[week] === "fermeture" ? "#c6c7cc" : undefined;
  }, [grisedWeeks, fsecCellLinks]);

  // Popover FSEC
  const handleCellClick = useCallback(async (event, semaine, campagne, etape) => {
    setPopoverState({ anchorEl: event.currentTarget, semaine, campagne, etape });
    setPopoverFsecs([]); setPopoverFsecsLoading(true);
    if (campagne?.uuid) {
      try {
        const all = await getAllFsecs();
        setPopoverFsecs(all.filter(f => f.campaign?.uuid === campagne.uuid));
      } catch { setPopoverFsecs([]); }
    }
    setPopoverFsecsLoading(false);
  }, []);
  const handlePopoverClose = useCallback(() => {
    setPopoverState({ anchorEl: null, semaine: null, campagne: null, etape: null });
    setPopoverFsecs([]);
  }, []);
  const handlePopoverTextChange = e => {
    const key = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
    setCellText(ct => ({ ...ct, [key]: e.target.value }));
  };
  const handleLinkFsec = fsec => {
    const key = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
    setFsecCellLinks(prev => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(fsec.fsecUuid) ? arr.filter(id => id !== fsec.fsecUuid) : [...arr, fsec.fsecUuid] };
    });
  };
  const renderStepChip = etape => (
    <Chip size="small" label={etape.label} sx={{
      background: etape.color, color: "#222", fontWeight: 600, fontSize: 13, borderRadius: 2, px: 1.5,
      width: "100%", justifyContent: "flex-start", whiteSpace: "normal", overflow: "visible"
    }} />
  );
  const renderCampagneChips = campagne => (
    <Stack direction="column" spacing={0.3} alignItems="center" sx={{ width: "100%" }}>
      {campagne.installation?.label &&
        <Chip size="small" label={campagne.installation.label}
          sx={{ bgcolor: campagne.installation.label === "LMJ" ? "#1976d2" : "#ff9800", color: "#fff", fontWeight: 700, mb: 0.5 }} />}
      {campagne.type?.label &&
        <Chip size="small" label={campagne.type.label} sx={{ bgcolor: "#8e24aa", color: "#fff", mb: 0.5 }} />}
      {campagne.status?.label &&
        <Chip size="small" label={campagne.status.label}
          sx={{
            bgcolor: campagne.status.label === "En cours" ? "#388e3c"
              : campagne.status.label === "Terminée" ? "#607d8b"
                : campagne.status.label === "Annulée" ? "#d32f2f" : "#0097a7", color: "#fff"
          }} />}
    </Stack>
  );
  const mergedColSpan = 2 + shownWeeks.length;

  // Rendu
  return (
    <Box sx={{ width: "100%", marginRight: "20px" }}>
      <Paper elevation={0} sx={{
        borderRadius: 0, boxShadow: "none", border: "none", background: "#fff", width: "100%",
        maxWidth: "100%", minHeight: "160px", marginRight: "8px"
      }}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerSx, width: CAMPAGNE_COL_WIDTH, borderRight: `2px solid ${COLORS.grey}` }} rowSpan={2}>Campagne</TableCell>
              <TableCell sx={{ ...headerSx, width: ETAPE_COL_WIDTH, borderRight: `2px solid ${COLORS.grey}` }} rowSpan={2}>Étape</TableCell>
              {monthsHeaders.map(({ month, colSpan }, i) =>
                <TableCell key={month + i} colSpan={colSpan} align="center"
                  sx={{ ...headerSx, borderLeft: i === 0 ? undefined : "1px solid #eceaf5", fontSize: 14, background: "#F5F6FA", color: "#3e4a84" }}>
                  {month}
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              {shownWeekNums.map((s, i) => (
                <TableCell key={i} sx={{
                  ...weekCellSx,
                  borderLeft: i === 0 ? undefined : "1px solid #eceaf5",
                  background: "#F5F6FA", color: "#3e4a84", cursor: "context-menu",
                  backgroundColor: (i === currentShownIdx) ? COLORS.orange :
                    grisedWeeks[s] === "vacances" ? "#f0f3fa" :
                      grisedWeeks[s] === "fermeture" ? "#c6c7cc" : undefined
                }}
                  onContextMenu={e => handleWeekHeaderContextMenu(s, e)}
                  title="Clic droit : définir vacances/fermeture/aucun"
                >{`S${s}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && !filteredCampaigns.length &&
              <TableRow>
                <TableCell colSpan={mergedColSpan} sx={{ color: COLORS.grey, py: 3 }}>Aucune campagne pour ce filtre</TableCell>
              </TableRow>
            }
            {filteredCampaigns.map(campagne =>
              filteredEtapes.map((etape, j, visibleEtapes) => {
                const isFirst = j === 0, periode = getWeeksInYearForCampaign(campagne.startDate, campagne.endDate, shownWeeks, shownWeekNums);
                return (
                  <TableRow key={`${campagne.name}-${etape.label}`}>
                    {isFirst &&
                      <TableCell rowSpan={visibleEtapes.length}
                        sx={{
                          ...cellBaseSx, fontWeight: 600, borderRight: `2px solid ${COLORS.grey}`,
                          width: CAMPAGNE_COL_WIDTH, color: COLORS.accent, background: COLORS.white,
                          textAlign: "center", verticalAlign: "middle", px: 1, py: 1, cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5ff" }
                        }}
                        onClick={() => navigate(`/campagne-details/${campagne.year}-${campagne.installation?.label}_${campagne.name.replace(/\s+/g, "_")}/overview`)}>
                        <div style={{ fontWeight: 600, marginBottom: 10, textAlign: "center", fontSize: 15, wordBreak: "break-word" }}>{campagne.name}</div>
                        {renderCampagneChips(campagne)}
                      </TableCell>
                    }
                    <TableCell sx={{
                      ...cellBaseSx, fontWeight: 500, borderRight: `2px solid ${COLORS.grey}`,
                      width: ETAPE_COL_WIDTH, color: COLORS.accent, background: COLORS.white, p: 0
                    }}>
                      {renderStepChip(etape)}
                    </TableCell>
                    {shownWeekNums.map((weekNum, idx) => {
                      const isPeriode = periode.includes(weekNum), cellKey = `${campagne.name}#${etape.label}#S${weekNum}`,
                        highlight = cellText[cellKey]?.length > 0, isCurrent = (idx === currentShownIdx),
                        linkedFsecUuids = fsecCellLinks[cellKey] || [],
                        linkedFsecs = allFsecs.filter(fsec => linkedFsecUuids.includes(fsec.fsecUuid)),
                        n = etape.fsecKey ? linkedFsecs.filter(fsec => isFsecAtStep(fsec, etape.fsecKey)).length : 0,
                        N = linkedFsecs.length;
                      return (
                        <TableCell key={idx}
                          sx={{
                            ...weekCellSx, backgroundColor: isCurrent ? COLORS.orange :
                              (N > 0 ? etape.color : (highlight ? etape.color : getBg(weekNum, isPeriode, false, cellKey, etape))),
                            cursor: "pointer", "&:hover": { backgroundColor: "#f5f5ff" },
                            transition: "background-color 0.2s", fontWeight: N > 0 ? 700 : undefined,
                            color: N > 0 ? "#000" : undefined, fontSize: 17, position: "relative"
                          }}
                          onClick={e => handleCellClick(e, weekNum, campagne, etape)}
                          onContextMenu={e => handleWeekHeaderContextMenu(weekNum, e)}>
                          {N > 0 && etape.fsecKey ?
                            <Box sx={{ position: "relative", width: "100%", height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ zIndex: 2 }}>{`${n}/${N}`}</span>
                              <LinearProgress variant="determinate" value={N ? 100 * n / N : 0}
                                sx={{
                                  width: "100%", height: 7, position: "absolute", left: 0, bottom: 2, bgcolor: "#cfe3fa",
                                  "& .MuiLinearProgress-bar": { bgcolor: "#1976d2" }, borderRadius: 5
                                }} />
                            </Box>
                            : (N > 0 ? N : cellText[cellKey])
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {/* Popover semaine */}
        <Popover open={!!popoverState.anchorEl} anchorEl={popoverState.anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}>
          <div style={{ padding: 20, minWidth: 280, maxWidth: 360 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {popoverState.campagne?.name}{popoverState.campagne && " – "}
              {popoverState.etape &&
                <Chip size="small" label={popoverState.etape.label}
                  sx={{ background: popoverState.etape.color, color: "#222", fontWeight: 600, fontSize: 13, borderRadius: 2, px: 1.5 }} />}
            </div>
            <div>Semaine : <b>S{popoverState.semaine}</b></div>
            <TextField label="Commentaire" variant="standard"
              value={cellText[`${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`] || ""}
              onChange={handlePopoverTextChange} fullWidth sx={{ mt: 2 }} placeholder="Texte affiché en cellule" />
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 14 }}>FSEC de la campagne :</div>
              <Box sx={{ border: '1px solid #ececec', borderRadius: 2, overflow: 'hidden', mb: 1, background: "#f8fafc" }}>
                <Table size="small"><TableBody>
                  {popoverFsecsLoading &&
                    <TableRow><TableCell colSpan={2} align="center" sx={{ fontSize: 13 }}>Chargement…</TableCell></TableRow>}
                  {!popoverFsecsLoading && popoverFsecs.length === 0 &&
                    <TableRow><TableCell colSpan={2} align="center" sx={{ fontSize: 13, color: "#888" }}>Aucun FSEC lié</TableCell></TableRow>}
                  {!popoverFsecsLoading && popoverFsecs.length > 0 && popoverFsecs.map(fsec => {
                    let nomComplet = fsec.campaign?.name
                      ? `${fsec.campaign.year}-${fsec.campaign.installation?.label}_${fsec.campaign.name}${fsec.name ? '-' + fsec.name : ''}` : fsec.name;
                    const cellKey = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
                    const isLinked = fsecCellLinks[cellKey]?.includes(fsec.fsecUuid);
                    return (
                      <TableRow key={fsec.fsecUuid}>
                        <TableCell sx={{ fontSize: 13, color: "#222", whiteSpace: "normal", fontWeight: isLinked ? 600 : undefined }}>{nomComplet}</TableCell>
                        <TableCell align="right" sx={{ width: 36, pr: 0 }}>
                          <Tooltip title={isLinked ? "Dissocier de la cellule" : "Associer à la cellule"}>
                            <IconButton size="small" onClick={() => handleLinkFsec(fsec)} color={isLinked ? "success" : "default"}>
                              <ArrowForward fontSize="small" sx={{ color: isLinked ? "#388e3c" : "#7e8ba3" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody></Table>
              </Box>
            </div>
          </div>
        </Popover>
        <Menu open={!!menuState.anchorEl} anchorEl={menuState.anchorEl} onClose={() => setMenuState({ anchorEl: null, week: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
          <MenuItem onClick={() => handleMenuSelect("vacances")}>Vacances scolaires</MenuItem>
          <MenuItem onClick={() => handleMenuSelect("fermeture")}>Fermeture du centre</MenuItem>
          <MenuItem onClick={() => handleMenuSelect(null)}>Aucun</MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
}

// --------- COMPOSANT PRINCIPAL ----------
export default function PlanningEquipeEtCampagnes() {
  const [filters, setFilters] = useState({ installations: ["LMJ", "OMEGA"], year: null, etapes: ETAPES });
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    setLoading(true);
    getAllCampaigns().then(setCampaigns).finally(() => setLoading(false));
  }, []);
  const year = filters.year || dayjs().year();
  const allWeeks = useMemo(() => getWeeksOfYear(year), [year]);
  const now = dayjs();
  const currentWeekIdx = useMemo(() => allWeeks.findIndex(w => now.isSame(w, "week")), [allWeeks, now]);
  const firstMonthDate = useMemo(() => now.add(monthOffset, 'month').startOf('month'), [now, monthOffset]);
  const firstWeekIdx = useMemo(() =>
    allWeeks.findIndex(w => w.isSame(firstMonthDate, "week") || w.isAfter(firstMonthDate, "day")),
    [allWeeks, firstMonthDate]
  );
  const shownWeeks = allWeeks.slice(Math.max(0, firstWeekIdx), Math.min(allWeeks.length, firstWeekIdx + SHOWN_WEEKS));
  const shownWeekNums = useMemo(() => shownWeeks.map(w => allWeeks.indexOf(w) + 1), [shownWeeks, allWeeks]);
  const monthsHeaders = useMemo(() => getMonthsHeadersByWeeks(shownWeeks), [shownWeeks]);
  const tableWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const weekColWidth = useMemo(() =>
    Math.max(COL_MIN_WIDTH, Math.floor((tableWidth - MEMBRE_COL_WIDTH - FONCTION_COL_WIDTH) / shownWeeks.length)),
    [tableWidth, shownWeeks.length]
  );
  const canGoPrev = useMemo(() => firstWeekIdx > 0, [firstWeekIdx]);
  const canGoNext = useMemo(() => firstWeekIdx + SHOWN_WEEKS < allWeeks.length, [firstWeekIdx, allWeeks.length]);
  const currentShownIdx = useMemo(() =>
    shownWeekNums.findIndex(n => n === (currentWeekIdx + 1)), [shownWeekNums, currentWeekIdx]
  );
  const years = useMemo(() =>
    [...new Set(campaigns.filter(x => filters.installations.includes(x.installation?.label)).map(x => x.year))].sort((a, b) => b - a),
    [campaigns, filters.installations]
  );
  const [stepFilter, setStepFilter] = useState(ETAPES);

  const [grisedWeeks, handleGriseWeek] = useSyncedGrisedWeeks();
  const [collapsedEquipe1, setCollapsedEquipe1] = React.useState(false);
  const [collapsedVieLabo, setCollapsedVieLabo] = React.useState(false);

  // Définition des données "Vie Labo" (local + activité)
  const vieLaboData = [
    { local: "Salle A", activite: "Expériences optiques" },
    { local: "Salle A", activite: "Entretien matériel" },
    { local: "Salle B", activite: "Stockage produits" },
    { local: "Salle C", activite: "Support IT" },
  ];

  return (
    <>
      {/* === Équipe 1 === */}
      <Box className="scene-container" sx={{
        position: 'sticky', top: 100, zIndex: 10,
        background: 'var(--scene-background-color)', boxShadow: "none", padding: "12px", marginBottom: 3,
        width: "99%", maxWidth: "99%", overflow: "hidden",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>Équipe</div>
          <IconButton onClick={() => setCollapsedEquipe1(v => !v)}>
            {collapsedEquipe1 ? <ExpandMore /> : <Remove />}
          </IconButton>
        </Box>
        {!collapsedEquipe1 &&
          <PlanningTableMembres
            membresInit={[
              { nom: "Jean Dupont", fonction: "Responsable" },
              { nom: "Alice Martin", fonction: "Ingénieur" },
              { nom: "Paul Durant", fonction: "Technicien" }
            ]}
            shownWeeks={shownWeeks}
            shownWeekNums={shownWeekNums}
            monthsHeaders={monthsHeaders}
            weekColWidth={weekColWidth}
            currentShownIdx={currentShownIdx}
            grisedWeeks={grisedWeeks}
            onGriseWeek={handleGriseWeek}
          />}
      </Box>
      {/* === Vie Labo === */}
      <Box className="scene-container" sx={{
        background: "var(--scene-background-color)", boxShadow: "none", padding: "12px", marginBottom: 3,
        width: "99%", maxWidth: "99%", overflow: "hidden",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>Vie Labo</div>
          <IconButton onClick={() => setCollapsedVieLabo(v => !v)}>
            {collapsedVieLabo ? <ExpandMore /> : <Remove />}
          </IconButton>
        </Box>
        {!collapsedVieLabo &&
          <PlanningTableMembres
            membresInit={vieLaboData}
            shownWeeks={shownWeeks}
            shownWeekNums={shownWeekNums}
            monthsHeaders={monthsHeaders}
            weekColWidth={weekColWidth}
            currentShownIdx={currentShownIdx}
            grisedWeeks={grisedWeeks}
            onGriseWeek={handleGriseWeek}
            localMode
            localColLabel="Local"
            fonctionColLabel="Activités"
          />}
      </Box>
      {/* === Filtres + Campagnes === */}
      <Box className="scene-container" sx={{
        background: "var(--scene-background-color)", borderRadius: "9px",
        boxShadow: "0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12)",
        padding: "16px", marginBottom: 0, width: "99%", maxWidth: "99%", overflow: "visible", marginRight: "20px"
      }}>
        {/* Filtres */}
        <Box sx={{
          display: "flex", alignItems: "center", mb: 2, gap: 1, flexWrap: "wrap",
          justifyContent: "center", width: "100%", maxWidth: "100%", mx: "auto"
        }}>
          <Stack direction="row" spacing={1}>
            {["LMJ", "OMEGA"].map(label =>
              <Button key={label}
                variant={filters.installations.length === 2 || filters.installations.includes(label) ? "contained" : "outlined"}
                sx={{
                  minWidth: 64, fontWeight: 700,
                  bgcolor: (filters.installations.length === 2 || filters.installations.includes(label))
                    ? (label === "LMJ" ? "#1976d2" : "#ff9800") : undefined,
                  color: (filters.installations.length === 2 || filters.installations.includes(label)) ? "#fff" : COLORS.accent,
                  borderColor: label === "LMJ" ? "#1976d2" : "#ff9800",
                  '&:hover': { bgcolor: label === "LMJ" ? "#1257a8" : "#cc7a00" }
                }}
                onClick={() => setFilters(f =>
                  f.installations.length === 2
                    ? { ...f, installations: [label] }
                    : f.installations[0] === label
                      ? { ...f, installations: ["LMJ", "OMEGA"] }
                      : { ...f, installations: [label] }
                )}
              >{label}</Button>
            )}
          </Stack>
          <Autocomplete options={years}
            value={filters.year}
            onChange={(_, v) => setFilters(s => ({ ...s, year: v ?? null }))}
            renderInput={p => <TextField {...p} label="Année" size="small" />}
            getOptionLabel={o => o ? o.toString() : ""}
            sx={{ minWidth: 130, bgcolor: COLORS.white, borderRadius: 2, ml: 2 }}
            size="small" isOptionEqualToValue={(o, v) => o === v}
          />
          <Autocomplete multiple options={ETAPES} value={stepFilter}
            onChange={(_, v) => setStepFilter(v.length ? v : ETAPES)}
            getOptionLabel={option => option.label} disableCloseOnSelect size="small"
            sx={{ minWidth: 120, maxWidth: 280, bgcolor: COLORS.white, borderRadius: 2, ml: 2, "& .MuiInputBase-root": { p: 0.2, pl: 1 } }}
            renderTags={value =>
              value.length === ETAPES.length
                ? null
                : value.map((etape, idx) => (
                  <Chip size="small" key={etape.label} label={etape.label}
                    sx={{
                      background: etape.color, color: "#222", borderRadius: 2, fontWeight: 600,
                      fontSize: 13, px: 1.5, mr: 0.5
                    }} />
                ))
            }
            renderInput={p => <TextField {...p} label="Étape" size="small" />}
          />
          <Button variant="contained" startIcon={<RestartAlt />}
            onClick={() => { setFilters({ year: null, installations: ["LMJ", "OMEGA"], etapes: ETAPES }); setMonthOffset(0); setStepFilter(ETAPES); }}
            sx={{ bgcolor: "#3e4a84", color: "#fff", fontWeight: 700, borderRadius: 2, minHeight: 38, boxShadow: "none", px: 2.5, ml: 2, "&:hover": { bgcolor: "#293567" } }}>
            RÉINITIALISER
          </Button>
          <Tooltip title="Mois précédent">
            <span>
              <IconButton sx={{ ml: 2 }} onClick={() => setMonthOffset(v => v - 1)} disabled={!canGoPrev}>
                <ArrowBackIosNew />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Mois suivant">
            <span>
              <IconButton onClick={() => setMonthOffset(v => v + 1)} disabled={!canGoNext}>
                <ArrowForwardIos />
              </IconButton>
            </span>
          </Tooltip>
          <div style={{ flex: 1 }} />
          {loading && <CircularProgress size={20} sx={{ color: COLORS.accent, ml: 2 }} />}
        </Box>
        {/* Tableau campagnes */}
        <PlanningTableCampagnes
          shownWeeks={shownWeeks}
          shownWeekNums={shownWeekNums}
          monthsHeaders={monthsHeaders}
          weekColWidth={weekColWidth}
          currentShownIdx={currentShownIdx}
          filters={filters}
          stepFilter={stepFilter}
          setFilters={setFilters}
          setStepFilter={setStepFilter}
          years={years}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          setMonthOffset={setMonthOffset}
          loading={loading}
          grisedWeeks={grisedWeeks}
          onGriseWeek={handleGriseWeek}
        />
      </Box>
    </>
  );
}
