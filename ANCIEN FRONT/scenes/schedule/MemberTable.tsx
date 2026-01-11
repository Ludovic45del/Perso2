import React, { useMemo, useState, useEffect } from "react";
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, Button,
  IconButton, Tooltip, Stack, TextField, Autocomplete, Chip,
  Box, Popover, CircularProgress
} from "@mui/material";
import {
  ArrowBackIosNew, ArrowForwardIos, RestartAlt, InfoOutlined
} from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { getAllCampaigns } from "../../services/campaign/campaign.service";
import "../scenes.scss"; // <-- SCSS GLOBAL

dayjs.locale("fr");

// ----------------------------- CONSTANTES ------------------------------------
const COLORS = {
  white: "#FFF", grey: "#eceaf5", accent: "#1b336c", blue: "#3e4a84",
  card: "#F7F7FA", orange: "#fff7b9"
};
const MEMBRE_COL_WIDTH = 210, FONCTION_COL_WIDTH = 180, COL_MIN_WIDTH = 28;
const SHOWN_WEEKS = 13;
const COMMENT_CHAR_LIMIT = 20;

const FONCTIONS = [
  { label: "Responsable", color: "#3270A6" },
  { label: "Ingénieur", color: "#5EADF2" },
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

// ---------------------------- OUTILS DATES -----------------------------------
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

// -------------------- COMPONENT PLANNING MEMBRES ------------------------
function PlanningTableMembres({
  titre,
  membresInit,
  shownWeeks,
  shownWeekNums,
  monthsHeaders,
  weekColWidth,
  currentShownIdx
}) {
  const [membres, setMembres] = useState(membresInit || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleFonction, setNouvelleFonction] = useState(FONCTIONS[0]);
  const [periodesCell, setPeriodesCell] = useState({});
  const [editPopover, setEditPopover] = useState({ anchorEl: null, membre: null, weekNum: null });
  const [infoPopover, setInfoPopover] = useState({ anchorEl: null, commentaire: "" });

  const cellBaseSx = {
    border: `1px solid ${COLORS.grey}`,
    fontSize: 13,
    textAlign: "center",
    color: "#222",
    py: 0
  };
  const headerSx = {
    ...cellBaseSx,
    fontWeight: 700,
    background: COLORS.white,
    color: COLORS.accent,
    whiteSpace: "nowrap"
  };
  const weekCellSx = {
    ...headerSx,
    p: 0,
    width: weekColWidth,
    minWidth: weekColWidth,
    maxWidth: weekColWidth,
    overflow: "hidden"
  };

  const handleAjouterMembre = () => {
    if (!nouveauNom.trim() || !nouvelleFonction) return;
    setMembres((m) => [...m, { nom: nouveauNom, fonction: nouvelleFonction.label }]);
    setDialogOpen(false);
    setNouveauNom("");
    setNouvelleFonction(FONCTIONS[0]);
  };

  const handleCellEdit = (e, membre, weekNum) => {
    setEditPopover({ anchorEl: e.currentTarget, membre, weekNum });
  };
  const handleValidateEdit = (type, commentaire) => {
    const key = `${editPopover.membre.nom}#S${editPopover.weekNum}`;
    if (type) {
      setPeriodesCell((prev) => ({
        ...prev,
        [key]: { type: type.value, commentaire }
      }));
    } else {
      setPeriodesCell((prev) => {
        const clone = { ...prev };
        delete clone[key];
        return clone;
      });
    }
    setEditPopover({ anchorEl: null, membre: null, weekNum: null });
  };
  const handleShowInfo = (e, commentaire) => setInfoPopover({ anchorEl: e.currentTarget, commentaire });
  const handleCloseInfo = () => setInfoPopover({ anchorEl: null, commentaire: "" });

  function getRowWithMergedCells(membre) {
    const cells = [];
    let i = 0;
    while (i < shownWeekNums.length) {
      const weekNum = shownWeekNums[i];
      const key = `${membre.nom}#S${weekNum}`;
      const cell = periodesCell[key];
      let colSpan = 1;
      if (cell && cell.type) {
        while (
          i + colSpan < shownWeekNums.length &&
          periodesCell[`${membre.nom}#S${shownWeekNums[i + colSpan]}`]?.type === cell.type
        ) {
          colSpan++;
        }
      }
      if (!cell || !cell.type) {
        cells.push(
          <TableCell
            key={weekNum}
            sx={{
              ...weekCellSx,
              backgroundColor: (i === currentShownIdx) ? COLORS.orange : undefined,
              cursor: "pointer",
              py: 0
            }}
            onClick={e => handleCellEdit(e, membre, weekNum)}
          />
        );
        i++;
      } else {
        const periodeMeta = PERIODES.find(p => p.value === cell.type);
        let content = null;
        if (cell.commentaire && cell.commentaire.length > 0) {
          if (cell.commentaire.length <= COMMENT_CHAR_LIMIT) {
            content = <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{cell.commentaire}</span>;
          } else {
            content = (
              <Tooltip title="Voir le commentaire">
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); handleShowInfo(e, cell.commentaire); }}
                  sx={{ p: 0.3 }}
                >
                  <InfoOutlined fontSize="small" sx={{ color: "#444" }} />
                </IconButton>
              </Tooltip>
            );
          }
        }
        cells.push(
          <TableCell
            key={weekNum}
            colSpan={colSpan}
            sx={{
              ...weekCellSx,
              backgroundColor: periodeMeta ? periodeMeta.color : (i === currentShownIdx) ? COLORS.orange : undefined,
              cursor: "pointer",
              py: 0,
              textAlign: "center"
            }}
            onClick={e => handleCellEdit(e, membre, weekNum)}
          >
            {content}
          </TableCell>
        );
        i += colSpan;
      }
    }
    return cells;
  }

  // ----------- Edition (popup) -----------
  const [periodeTypeDraft, setPeriodeTypeDraft] = useState(null);
  const [periodeCommentDraft, setPeriodeCommentDraft] = useState("");
  useEffect(() => {
    if (editPopover.membre && editPopover.weekNum != null) {
      const key = `${editPopover.membre.nom}#S${editPopover.weekNum}`;
      const cell = periodesCell[key];
      setPeriodeTypeDraft(cell ? PERIODES.find(p => p.value === cell.type) : null);
      setPeriodeCommentDraft(cell?.commentaire || "");
    }
  }, [editPopover, periodesCell]);
  // ----------------------------------------

  return (
    <Box className="scene-table-card">
      <div style={{ fontWeight: 700, fontSize: 18, margin: "12px 0 10px 0", color: COLORS.blue }}>{titre}</div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#3e4a84",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 2,
            minHeight: 32,
            boxShadow: "none",
            px: 2,
            textTransform: "none",
            fontSize: 13,
            "&:hover": { bgcolor: "#293567" }
          }}
          onClick={() => setDialogOpen(true)}
        >
          Ajouter un membre
        </Button>
      </Box>
      <Paper elevation={0} sx={{
        borderRadius: 0,
        boxShadow: "none",
        border: "none",
        background: "#fff",
        width: 1,
        overflowX: "hidden"
      }}>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{
                ...headerSx, width: MEMBRE_COL_WIDTH, minWidth: MEMBRE_COL_WIDTH, maxWidth: MEMBRE_COL_WIDTH,
                borderRight: `2px solid ${COLORS.grey}`,
                background: COLORS.white,
                py: 0
              }} rowSpan={2}>Membre</TableCell>
              <TableCell sx={{
                ...headerSx, width: FONCTION_COL_WIDTH, minWidth: FONCTION_COL_WIDTH, maxWidth: FONCTION_COL_WIDTH,
                borderRight: `2px solid ${COLORS.grey}`,
                background: COLORS.white,
                py: 0
              }} rowSpan={2}>Fonction</TableCell>
              {monthsHeaders.map(({ month, colSpan }, i) =>
                <TableCell key={month + i} colSpan={colSpan} align="center"
                  sx={{
                    ...headerSx,
                    borderLeft: i === 0 ? undefined : "1px solid #eceaf5",
                    fontSize: 14,
                    background: "#F5F6FA",
                    color: "#3e4a84",
                    py: 0
                  }}>{month}</TableCell>
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
                    backgroundColor: (i === currentShownIdx) ? COLORS.orange : undefined,
                    py: 0
                  }}
                  title="Semaine"
                >{`S${s}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {membres.map((membre, idx) => {
              const fctMeta = FONCTIONS.find(f => f.label === membre.fonction) || { label: membre.fonction, color: "#e2e6f2" };
              return (
                <TableRow key={membre.nom + membre.fonction + idx} hover>
                  <TableCell
                    sx={{
                      ...cellBaseSx,
                      fontWeight: 600,
                      borderRight: `2px solid ${COLORS.grey}`,
                      width: MEMBRE_COL_WIDTH, minWidth: MEMBRE_COL_WIDTH, maxWidth: MEMBRE_COL_WIDTH,
                      color: COLORS.accent, background: COLORS.white,
                      textAlign: "center", verticalAlign: "middle", py: 0
                    }}
                  >
                    {membre.nom}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellBaseSx,
                      fontWeight: 500,
                      borderRight: `2px solid ${COLORS.grey}`,
                      width: FONCTION_COL_WIDTH, minWidth: FONCTION_COL_WIDTH, maxWidth: FONCTION_COL_WIDTH,
                      color: COLORS.accent, background: COLORS.white,
                      p: 0, py: 0
                    }}
                  >
                    <Chip
                      size="small"
                      label={fctMeta.label}
                      sx={{
                        background: fctMeta.color,
                        color: "#222",
                        fontWeight: 600,
                        fontSize: 13,
                        borderRadius: 2,
                        px: 1.5,
                        width: "100%",
                        justifyContent: "flex-start",
                        whiteSpace: "normal",
                        overflow: "visible",
                        height: 20,
                        minHeight: 18,
                      }}
                    />
                  </TableCell>
                  {getRowWithMergedCells(membre)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* Popup d'édition cell */}
        <Popover
          open={Boolean(editPopover.anchorEl)}
          anchorEl={editPopover.anchorEl}
          onClose={() => setEditPopover({ anchorEl: null, membre: null, weekNum: null })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ p: 2, minWidth: 220, display: "flex", flexDirection: "column", gap: 1 }}>
            <Autocomplete
              options={PERIODES}
              value={periodeTypeDraft}
              onChange={(_, v) => setPeriodeTypeDraft(v)}
              getOptionLabel={o => o ? o.label : ""}
              renderInput={params => <TextField {...params} label="Type de période" size="small" />}
              size="small"
              isOptionEqualToValue={(o, v) => o?.value === v?.value}
            />
            <TextField
              label="Commentaire"
              value={periodeCommentDraft}
              onChange={e => setPeriodeCommentDraft(e.target.value)}
              size="small"
              multiline
              minRows={1}
              maxRows={3}
            />
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
        <Popover
          open={Boolean(infoPopover.anchorEl)}
          anchorEl={infoPopover.anchorEl}
          onClose={handleCloseInfo}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ p: 2, minWidth: 180, fontSize: 13 }}>
            {infoPopover.commentaire}
          </Box>
        </Popover>
      </Paper>
      {/* Dialog d’ajout membre */}
      {dialogOpen && (
        <Box
          component="form"
          sx={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            bgcolor: "rgba(0,0,0,0.12)", zIndex: 1200,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setDialogOpen(false)}
        >
          <Box
            sx={{
              bgcolor: "#fff", borderRadius: 2, boxShadow: 5, p: 3, minWidth: 340,
              display: "flex", flexDirection: "column", gap: 2
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, fontSize: 17 }}>Ajouter un membre</div>
            <TextField
              label="Nom du membre"
              value={nouveauNom}
              onChange={e => setNouveauNom(e.target.value)}
              size="small"
              fullWidth
            />
            <Autocomplete
              options={FONCTIONS}
              value={nouvelleFonction}
              onChange={(_, v) => setNouvelleFonction(v)}
              getOptionLabel={o => o ? o.label : ""}
              isOptionEqualToValue={(o, v) => o?.label === v?.label}
              renderInput={p => <TextField {...p} label="Fonction" size="small" />}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: "#ececec", color: "#222", borderRadius: 2, px: 2, fontSize: 13,
                  fontWeight: 600, textTransform: "none"
                }}
              >Annuler</Button>
              <Button
                onClick={handleAjouterMembre}
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#388e3c", color: "#fff", borderRadius: 2, px: 2, fontSize: 13,
                  fontWeight: 700, textTransform: "none",
                  "&:hover": { bgcolor: "#27612d" }
                }}
                disabled={!nouveauNom.trim()}
              >Ajouter</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// --------------------- PAGE PRINCIPALE SYNCHRO ---------------------------------
export default function PlanningEquipeEtCampagnes() {
  const [filters, setFilters] = useState({ installations: ["LMJ", "OMEGA"], year: null, etapes: ETAPES });
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    setLoading(true);
    getAllCampaigns().then((res) => setCampaigns(res)).finally(() => setLoading(false));
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
  const shownWeeks = allWeeks.slice(
    Math.max(0, firstWeekIdx),
    Math.min(allWeeks.length, firstWeekIdx + SHOWN_WEEKS)
  );
  const shownWeekNums = useMemo(() => shownWeeks.map((w) => allWeeks.indexOf(w) + 1), [shownWeeks, allWeeks]);
  const monthsHeaders = useMemo(() => getMonthsHeadersByWeeks(shownWeeks), [shownWeeks]);
  const tableWidth = window.innerWidth;
  const weekColWidth = useMemo(() =>
    Math.max(COL_MIN_WIDTH, Math.floor((tableWidth - MEMBRE_COL_WIDTH - FONCTION_COL_WIDTH) / shownWeeks.length)),
    [tableWidth, shownWeeks.length]
  );
  const canGoPrev = useMemo(() => firstWeekIdx > 0, [firstWeekIdx]);
  const canGoNext = useMemo(() => firstWeekIdx + SHOWN_WEEKS < allWeeks.length, [firstWeekIdx, allWeeks.length, SHOWN_WEEKS]);
  const currentShownIdx = useMemo(() =>
    shownWeekNums.findIndex(n => n === (currentWeekIdx + 1)), [shownWeekNums, currentWeekIdx]
  );
  const years = useMemo(() =>
    [...new Set(campaigns.filter(x => filters.installations.includes(x.installation?.label)).map(x => x.year))].sort((a, b) => b - a),
    [campaigns, filters.installations]
  );

  return (
    <Box className="scene-container" sx={{ maxWidth: 2000, mx: "auto" }}>
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
      />
      <PlanningTableMembres
        membresInit={[
          { nom: "Martine Blanc", fonction: "Responsable" },
          { nom: "Alex Leroy", fonction: "Ingénieur" },
        ]}
        shownWeeks={shownWeeks}
        shownWeekNums={shownWeekNums}
        monthsHeaders={monthsHeaders}
        weekColWidth={weekColWidth}
        currentShownIdx={currentShownIdx}
      />
      {/* ------------------------- BARRE DE FILTRES TOUT EN BAS -------------------------- */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1, flexWrap: "wrap" }}>
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
          size="small"
          isOptionEqualToValue={(o, v) => o === v}
        />
        <Autocomplete
          multiple
          options={ETAPES}
          value={filters.etapes}
          onChange={(_, v) => setFilters(s => ({ ...s, etapes: v.length ? v : ETAPES }))}
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
          setFilters({ year: null, installations: ["LMJ", "OMEGA"], etapes: ETAPES });
          setMonthOffset(0);
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
        {loading && <CircularProgress size={20} sx={{ color: COLORS.accent, ml: 2 }} />}
      </Box>
    </Box>
  );
}
