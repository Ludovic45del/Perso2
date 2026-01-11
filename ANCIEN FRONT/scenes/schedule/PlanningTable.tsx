import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress,
  IconButton, Tooltip, Stack, Button, TextField, Autocomplete, Menu, MenuItem, Chip, Popover, Box, LinearProgress
} from "@mui/material";
import { LockOutlined, LockOpenOutlined, RestartAlt, ArrowBackIosNew, ArrowForwardIos, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { getAllCampaigns } from "../../services/campaign/campaign.service";
import { getAllFsecs } from "../../services/fsec/fsec.service";
import '../scenes.scss';

dayjs.locale("fr");

const ETAPES = [
  { label: "Assemblage", color: "#3270A6", fsecKey: "assemblyStep" },
  { label: "Métrologie", color: "#5EADF2", fsecKey: "metrologyStep" },
  { label: "Livraison", color: "#77ABD9" },
  { label: "Tir", color: "#79B4D9", fsecKey: "shotStep" },
  { label: "Réception cibles", color: "#F0F2F0" }
];

const COLORS = {
  white: "#FFF", grey: "#eceaf5", accent: "#1b336c", blue: "#5a6494",
  card: "#F7F7FA", orange: "#fff7b9"
};
const CAMPAGNE_COL_WIDTH = 210, ETAPE_COL_WIDTH = 180, COL_MIN_WIDTH = 28;

function getWeeksOfYear(y) {
  const ws = [], d = dayjs(`${y}-01-01`), e = dayjs(`${y}-12-31`);
  for (let curr = d; curr.isBefore(e) || curr.isSame(e, "day"); curr = curr.add(7, "day")) ws.push(curr);
  return ws;
}
function getMonthsHeadersByWeeks(weeks) {
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
}
function getWeeksInYearForCampaign(s, e, shownWeeks, shownWeekNums) {
  if (!s || !e) return [];
  const st = dayjs(s), en = dayjs(e);
  return shownWeeks.map((d, i) =>
    (d.add(6, "day").isBefore(st) || d.isAfter(en)) ? null : shownWeekNums[i]
  ).filter(Boolean);
}

// Aide: vérifie si la FSEC est à la step cible
function isFsecAtStep(fsec, stepKey, etapeLabel) {
  if (!fsec || !stepKey) return false;
  if (stepKey === "assemblyStep") return Array.isArray(fsec.assemblyStep) && fsec.assemblyStep.length > 0;
  if (stepKey === "metrologyStep") return Array.isArray(fsec.metrologyStep) && fsec.metrologyStep.length > 0;
  if (stepKey === "shotStep") return !!fsec.shotStep; // typiquement objet ou bool
  // Tu peux étendre ici pour les autres étapes
  return false;
}

export default function PlanningTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState({ year: null, installations: ["LMJ", "OMEGA"] });
  const [stepFilter, setStepFilter] = useState(ETAPES);
  const [grisedWeeks, setGrisedWeeks] = useState({});
  const [menuState, setMenuState] = useState({ anchorEl: null, week: null });
  const [tableWidth, setTableWidth] = useState(window.innerWidth);
  const [cellText, setCellText] = useState({});
  const [popoverState, setPopoverState] = useState({
    anchorEl: null, semaine: null, campagne: null, etape: null
  });
  const [popoverFsecs, setPopoverFsecs] = useState([]);
  const [popoverFsecsLoading, setPopoverFsecsLoading] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [fsecCellLinks, setFsecCellLinks] = useState({});

  // ** Tu peux stocker en mémoire toutes les FSEC ici pour calcul rapide du ratio **
  const [allFsecs, setAllFsecs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () =>
      setTableWidth(document.querySelector('.scene-container')?.offsetWidth || window.innerWidth);
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 10);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    getAllCampaigns().then(setCampaigns).finally(() => setLoading(false));
    getAllFsecs().then(setAllFsecs);
  }, []);

  // Memo calculs
  const year = filters.year || dayjs().year();
  const allWeeks = useMemo(() => getWeeksOfYear(year), [year]);
  const now = dayjs();
  const currentWeekIdx = useMemo(() => allWeeks.findIndex(w => now.isSame(w, "week")), [allWeeks, now]);
  const centerWeekIdx = useMemo(() => {
    if (currentWeekIdx === -1) return Math.floor(allWeeks.length / 2);
    return currentWeekIdx;
  }, [currentWeekIdx, allWeeks.length]);
  useEffect(() => {
    if (allWeeks.length === 0) return;
    const weekStart = Math.max(0, centerWeekIdx - Math.floor(13 / 2));
    const centerDate = allWeeks[weekStart + Math.floor(13 / 2)];
    setMonthOffset(centerDate ? centerDate.month() - now.month() : 0);
    // eslint-disable-next-line
  }, [year, filters.year, allWeeks.length]);
  const firstMonthDate = useMemo(() => {
    const ref = now.add(monthOffset, 'month').startOf('month');
    return ref;
  }, [now, monthOffset]);
  const firstWeekIdx = useMemo(() =>
    allWeeks.findIndex(w => w.isSame(firstMonthDate, "week") || w.isAfter(firstMonthDate, "day")),
    [allWeeks, firstMonthDate]
  );
  const shownWeeks = allWeeks.slice(
    Math.max(0, firstWeekIdx),
    Math.min(allWeeks.length, firstWeekIdx + 13)
  );
  const shownWeekNums = useMemo(() => shownWeeks.map((w, i) => allWeeks.indexOf(w) + 1), [shownWeeks, allWeeks]);
  const monthsHeaders = useMemo(() => getMonthsHeadersByWeeks(shownWeeks), [shownWeeks]);
  const weekColWidth = useMemo(() =>
    Math.max(COL_MIN_WIDTH, Math.floor((tableWidth - CAMPAGNE_COL_WIDTH - ETAPE_COL_WIDTH) / shownWeeks.length)),
    [tableWidth, shownWeeks.length]
  );
  const years = useMemo(() =>
    [...new Set(campaigns.filter(x => filters.installations.includes(x.installation?.label)).map(x => x.year))].sort((a, b) => b - a),
    [campaigns, filters.installations]
  );
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
    border: `1px solid ${COLORS.grey}`,
    fontSize: 13,
    textAlign: "center",
    color: "#222",
    p: .5
  }), []);
  const headerSx = useMemo(() => ({
    ...cellBaseSx,
    fontWeight: 700,
    background: COLORS.white,
    color: COLORS.accent,
    whiteSpace: "nowrap"
  }), [cellBaseSx]);
  const weekCellSx = useMemo(() => ({
    ...headerSx,
    p: 0,
    width: weekColWidth,
    minWidth: weekColWidth,
    maxWidth: weekColWidth,
    overflow: "hidden"
  }), [headerSx, weekColWidth]);
  const handleToggleInstall = useCallback(label => setFilters(f =>
    f.installations.length === 2
      ? { ...f, installations: [label] }
      : f.installations[0] === label
        ? { ...f, installations: ["LMJ", "OMEGA"] }
        : { ...f, installations: [label] }
  ), []);
  const handleWeekHeaderContextMenu = useCallback((week, e) => {
    e.preventDefault(); setMenuState({ anchorEl: e.currentTarget, week });
  }, []);
  const handleMenuSelect = useCallback(type => {
    setGrisedWeeks(w => {
      const week = menuState.week;
      if (!type) { const clone = { ...w }; delete clone[week]; return clone; }
      return { ...w, [week]: type };
    });
    setMenuState({ anchorEl: null, week: null });
  }, [menuState.week]);
  const getBg = useCallback((week, isPeriode, isCurrent, cellKey, etape) => {
    if (isCurrent) return COLORS.orange;
    if (fsecCellLinks[cellKey] && fsecCellLinks[cellKey].length > 0) {
      return etape.color || "#e2e6f2";
    }
    return isPeriode ? "#e2e6f2"
      : grisedWeeks[week] === "vacances" ? "#f0f3fa"
        : grisedWeeks[week] === "fermeture" ? "#c6c7cc" : undefined;
  }, [grisedWeeks, fsecCellLinks]);
  // POPUP: fetch FSEC à l'ouverture du popover
  const handleCellClick = useCallback(async (event, semaine, campagne, etape) => {
    setPopoverState({
      anchorEl: event.currentTarget,
      semaine,
      campagne,
      etape,
    });
    setPopoverFsecs([]);
    setPopoverFsecsLoading(true);
    if (campagne?.uuid) {
      try {
        const all = await getAllFsecs();
        const fsecs = all.filter(f => f.campaign?.uuid === campagne.uuid);
        setPopoverFsecs(fsecs);
      } catch {
        setPopoverFsecs([]);
      }
    }
    setPopoverFsecsLoading(false);
  }, []);
  const handlePopoverClose = useCallback(() => {
    setPopoverState({
      anchorEl: null,
      semaine: null,
      campagne: null,
      etape: null,
    });
    setPopoverFsecs([]);
  }, []);
  const handlePopoverTextChange = (e) => {
    const key = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
    setCellText(ct => ({ ...ct, [key]: e.target.value }));
  };
  const handleLinkFsec = (fsec) => {
    const key = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
    setFsecCellLinks(prev => {
      const arr = prev[key] || [];
      if (arr.includes(fsec.fsecUuid)) {
        return { ...prev, [key]: arr.filter(id => id !== fsec.fsecUuid) };
      } else {
        return { ...prev, [key]: [...arr, fsec.fsecUuid] };
      }
    });
  };
  const renderStepChip = useCallback((etape) => (
    <Chip
      size="small"
      label={etape.label}
      sx={{
        background: etape.color,
        color: "#222",
        fontWeight: 600,
        fontSize: 13,
        borderRadius: 2,
        px: 1.5,
        width: "100%",
        justifyContent: "flex-start",
        whiteSpace: "normal",
        overflow: "visible"
      }}
    />
  ), []);
  const renderCampagneChips = useCallback((campagne) => (
    <Stack direction="column" spacing={0.3} alignItems="center" sx={{ width: "100%" }}>
      {campagne.installation?.label &&
        <Chip size="small" label={campagne.installation.label}
          sx={{
            bgcolor: campagne.installation.label === "LMJ" ? "#1976d2" : "#ff9800",
            color: "#fff", fontWeight: 700, mb: 0.5
          }} />}
      {campagne.type?.label &&
        <Chip size="small" label={campagne.type.label} sx={{ bgcolor: "#8e24aa", color: "#fff", mb: 0.5 }} />}
      {campagne.status?.label &&
        <Chip size="small" label={campagne.status.label}
          sx={{
            bgcolor: campagne.status.label === "En cours" ? "#388e3c"
              : campagne.status.label === "Terminée" ? "#607d8b"
                : campagne.status.label === "Annulée" ? "#d32f2f"
                  : "#0097a7",
            color: "#fff"
          }} />}
    </Stack>
  ), []);
  const mergedColSpan = 2 + shownWeeks.length;
  const canGoPrev = useMemo(() => firstWeekIdx > 0, [firstWeekIdx]);
  const canGoNext = useMemo(() => firstWeekIdx + 13 < allWeeks.length, [firstWeekIdx, allWeeks.length]);
  const currentShownIdx = useMemo(() =>
    shownWeekNums.findIndex(n => n === (currentWeekIdx + 1)), [shownWeekNums, currentWeekIdx]
  );

  return (
    <div className="scene-container">
      {/* ... barre de filtres, flèches, cadenas ... */}
      {/* (ne change rien ici, cf. code précédents) */}
      <div style={{
        display: "flex", alignItems: "center", marginBottom: 16, gap: 8, flexWrap: "wrap"
      }}>
        <Stack direction="row" spacing={1}>
          {["LMJ", "OMEGA"].map(label =>
            <Button
              key={label}
              variant={filters.installations.length === 2 || filters.installations.includes(label) ? "contained" : "outlined"}
              sx={{
                minWidth: 64, fontWeight: 700,
                bgcolor: (filters.installations.length === 2 || filters.installations.includes(label))
                  ? (label === "LMJ" ? "#1976d2" : "#ff9800") : undefined,
                color: (filters.installations.length === 2 || filters.installations.includes(label)) ? "#fff" : COLORS.accent,
                borderColor: label === "LMJ" ? "#1976d2" : "#ff9800",
                '&:hover': { bgcolor: label === "LMJ" ? "#1257a8" : "#cc7a00" }
              }}
              onClick={() => handleToggleInstall(label)}
            >{label}</Button>
          )}
        </Stack>
        <Autocomplete options={years}
          value={filters.year}
          onChange={(_, v) => setFilters(s => ({ ...s, year: v ?? null }))}
          renderInput={p => <TextField {...p} label="Année" size="small" />}
          getOptionLabel={o => o ? o.toString() : ""}
          sx={{ minWidth: 130, bgcolor: COLORS.white, borderRadius: 2, ml: 2 }}
          size="small"
          isOptionEqualToValue={(o, v) => o === v}
        />
        <Autocomplete
          multiple
          options={ETAPES}
          value={stepFilter}
          onChange={(_, v) => setStepFilter(v.length ? v : ETAPES)}
          getOptionLabel={option => option.label}
          disableCloseOnSelect
          size="small"
          sx={{ minWidth: 120, maxWidth: 280, bgcolor: COLORS.white, borderRadius: 2, ml: 2, "& .MuiInputBase-root": { p: 0.2, pl: 1 } }}
          renderTags={value =>
            value.length === ETAPES.length
              ? null
              : value.map((etape, idx) => (
                <Chip
                  size="small"
                  key={etape.label}
                  label={etape.label}
                  sx={{
                    background: etape.color,
                    color: "#222",
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: 13,
                    px: 1.5,
                    mr: 0.5
                  }}
                />
              ))
          }
          renderInput={p => <TextField {...p} label="Étape" size="small" />}
        />
        <Button variant="contained" startIcon={<RestartAlt />} onClick={() => {
          setFilters({ year: null, installations: ["LMJ", "OMEGA"] });
          setStepFilter(ETAPES);
          setCellText({});
          setMonthOffset(0);
          setFsecCellLinks({});
        }}
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
        <Tooltip title={editMode ? "Mode modification" : "Mode visualisation"}>
          <IconButton onClick={() => setEditMode(m => !m)}>
            {editMode ? <LockOpenOutlined sx={{ color: COLORS.blue }} /> : <LockOutlined sx={{ color: COLORS.accent }} />}
          </IconButton>
        </Tooltip>
        {loading && <CircularProgress size={20} sx={{ color: COLORS.accent, ml: 2 }} />}
      </div>
      <Paper elevation={0} sx={{
        borderRadius: 0,
        boxShadow: "none",
        border: "none",
        background: "#fff",
        width: 1,
        overflowX: "hidden"
      }}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            {/* ... En-têtes identiques ... */}
            <TableRow>
              <TableCell sx={{
                ...headerSx, width: CAMPAGNE_COL_WIDTH, minWidth: CAMPAGNE_COL_WIDTH, maxWidth: CAMPAGNE_COL_WIDTH,
                borderRight: `2px solid ${COLORS.grey}`,
                background: COLORS.white
              }} rowSpan={2}>Campagne</TableCell>
              <TableCell sx={{
                ...headerSx, width: ETAPE_COL_WIDTH, minWidth: ETAPE_COL_WIDTH, maxWidth: ETAPE_COL_WIDTH,
                borderRight: `2px solid ${COLORS.grey}`,
                background: COLORS.white
              }} rowSpan={2}>Étape</TableCell>
              {monthsHeaders.map(({ month, colSpan }, i) =>
                <TableCell key={month + i} colSpan={colSpan} align="center"
                  sx={{ ...headerSx, borderLeft: i === 0 ? undefined : "1px solid #eceaf5", fontSize: 14, background: "#F5F6FA", color: "#3e4a84" }}>{month}</TableCell>
              )}
            </TableRow>
            <TableRow>
              {shownWeekNums.map((s, i) => (
                <TableCell key={i}
                  sx={{
                    ...weekCellSx,
                    borderLeft: i === 0 ? undefined : "1px solid #eceaf5",
                    background: "#F5F6FA", color: "#3e4a84",
                    cursor: "context-menu",
                    backgroundColor: (i === currentShownIdx) ? COLORS.orange : getBg(s, false, false)
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
                <TableCell colSpan={mergedColSpan} sx={{ color: COLORS.grey, py: 3 }}>
                  Aucune campagne pour ce filtre
                </TableCell>
              </TableRow>
            }
            {filteredCampaigns.map(campagne =>
              filteredEtapes.map((etape, j, visibleEtapes) => {
                const isFirst = j === 0;
                const periode = getWeeksInYearForCampaign(
                  campagne.startDate, campagne.endDate, shownWeeks, shownWeekNums
                );
                return (
                  <TableRow key={`${campagne.name}-${etape.label}`}>
                    {isFirst &&
                      <TableCell
                        rowSpan={visibleEtapes.length}
                        sx={{
                          ...cellBaseSx, fontWeight: 600, borderRight: `2px solid ${COLORS.grey}`,
                          width: CAMPAGNE_COL_WIDTH, minWidth: CAMPAGNE_COL_WIDTH, maxWidth: CAMPAGNE_COL_WIDTH,
                          color: COLORS.accent, background: COLORS.white,
                          textAlign: "center", verticalAlign: "middle", px: 1, py: 1, cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5ff" }
                        }}
                        onClick={() => navigate(`/campagne-details/${campagne.year}-${campagne.installation?.label}_${campagne.name.replace(/\s+/g, "_")}/overview`)}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 10, textAlign: "center", fontSize: 15, wordBreak: "break-word" }}>{campagne.name}</div>
                        {renderCampagneChips(campagne)}
                      </TableCell>
                    }
                    <TableCell
                      sx={{
                        ...cellBaseSx,
                        fontWeight: 500,
                        borderRight: `2px solid ${COLORS.grey}`,
                        width: ETAPE_COL_WIDTH, minWidth: ETAPE_COL_WIDTH, maxWidth: ETAPE_COL_WIDTH,
                        color: COLORS.accent, background: COLORS.white,
                        p: 0
                      }}
                    >
                      {renderStepChip(etape)}
                    </TableCell>
                    {shownWeekNums.map((weekNum, idx) => {
                      const isPeriode = periode.includes(weekNum);
                      const cellKey = `${campagne.name}#${etape.label}#S${weekNum}`;
                      const highlight = cellText[cellKey]?.length > 0;
                      const isCurrent = (idx === currentShownIdx);

                      // Liste des FSEC associées à cette cellule
                      const linkedFsecUuids = fsecCellLinks[cellKey] || [];
                      const linkedFsecs = allFsecs.filter(fsec => linkedFsecUuids.includes(fsec.fsecUuid));

                      // Ratio n/N
                      const n = etape.fsecKey
                        ? linkedFsecs.filter(fsec => isFsecAtStep(fsec, etape.fsecKey, etape.label)).length
                        : 0;
                      const N = linkedFsecs.length;

                      return (
                        <TableCell
                          key={idx}
                          sx={{
                            ...weekCellSx,
                            backgroundColor: isCurrent
                              ? COLORS.orange
                              : (N > 0
                                ? etape.color
                                : (highlight ? etape.color : getBg(weekNum, isPeriode, false, cellKey, etape))),
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f5ff" },
                            transition: "background-color 0.2s",
                            fontWeight: N > 0 ? 700 : undefined,
                            color: N > 0 ? "#000" : undefined,
                            fontSize: 17,
                            position: "relative"
                          }}
                          onClick={e => handleCellClick(e, weekNum, campagne, etape)}
                        >
                          {N > 0 && etape.fsecKey ?
                            <Box sx={{ position: "relative", width: "100%", height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ zIndex: 2 }}>{`${n}/${N}`}</span>
                              <LinearProgress
                                variant="determinate"
                                value={N ? 100 * n / N : 0}
                                sx={{
                                  width: "100%",
                                  height: 7,
                                  position: "absolute",
                                  left: 0,
                                  bottom: 2,
                                  bgcolor: "#cfe3fa",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: "#1976d2"
                                  },
                                  borderRadius: 5
                                }}
                              />
                            </Box>
                            :
                            (N > 0 ? N : cellText[cellKey])
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
        <Popover
          open={Boolean(popoverState.anchorEl)}
          anchorEl={popoverState.anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div style={{ padding: 20, minWidth: 280, maxWidth: 360 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {popoverState.campagne?.name}
              {popoverState.campagne && " – "}
              {popoverState.etape &&
                <Chip
                  size="small"
                  label={popoverState.etape.label}
                  sx={{
                    background: popoverState.etape.color,
                    color: "#222",
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 2,
                    px: 1.5
                  }}
                />}
            </div>
            <div>
              Semaine : <b>S{popoverState.semaine}</b>
            </div>
            <TextField
              label="Commentaire"
              variant="standard"
              value={cellText[`${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`] || ""}
              onChange={handlePopoverTextChange}
              fullWidth
              sx={{ mt: 2 }}
              placeholder="Texte affiché en cellule"
            />
            {/* Tableau FSECs */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 14 }}>FSEC de la campagne :</div>
              <Box sx={{
                border: '1px solid #ececec', borderRadius: 2, overflow: 'hidden', mb: 1,
                background: "#f8fafc"
              }}>
                <Table size="small">
                  <TableBody>
                    {popoverFsecsLoading &&
                      <TableRow><TableCell colSpan={2} align="center" sx={{ fontSize: 13 }}>Chargement…</TableCell></TableRow>
                    }
                    {!popoverFsecsLoading && popoverFsecs.length === 0 &&
                      <TableRow><TableCell colSpan={2} align="center" sx={{ fontSize: 13, color: "#888" }}>Aucun FSEC lié</TableCell></TableRow>
                    }
                    {!popoverFsecsLoading && popoverFsecs.length > 0 && popoverFsecs.map(fsec => {
                      let nomComplet = fsec.name;
                      if (fsec.campaign?.name) {
                        nomComplet = `${fsec.campaign.year}-${fsec.campaign.installation?.label}_${fsec.campaign.name}${fsec.name ? '-' + fsec.name : ''}`;
                      }
                      const cellKey = `${popoverState.campagne?.name}#${popoverState.etape?.label}#S${popoverState.semaine}`;
                      const isLinked = fsecCellLinks[cellKey]?.includes(fsec.fsecUuid);
                      return (
                        <TableRow key={fsec.fsecUuid}>
                          <TableCell sx={{
                            fontSize: 13,
                            color: "#222",
                            whiteSpace: "normal",
                            fontWeight: isLinked ? 600 : undefined
                          }}>
                            {nomComplet}
                          </TableCell>
                          <TableCell align="right" sx={{ width: 36, pr: 0 }}>
                            <Tooltip title={isLinked ? "Dissocier de la cellule" : "Associer à la cellule"}>
                              <IconButton size="small" onClick={() => handleLinkFsec(fsec)} color={isLinked ? "success" : "default"}>
                                <ArrowForward fontSize="small" sx={{
                                  color: isLinked ? "#388e3c" : "#7e8ba3"
                                }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </div>
          </div>
        </Popover>
        {/* Menu contextuel pour marquer vacances/fermeture/aucun */}
        <Menu open={!!menuState.anchorEl} anchorEl={menuState.anchorEl} onClose={() => setMenuState({ anchorEl: null, week: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
          <MenuItem onClick={() => handleMenuSelect("vacances")}>Vacances scolaires</MenuItem>
          <MenuItem onClick={() => handleMenuSelect("fermeture")}>Fermeture du centre</MenuItem>
          <MenuItem onClick={() => handleMenuSelect(null)}>Aucun</MenuItem>
        </Menu>
      </Paper>
    </div>
  );
}
export { PlanningTable };