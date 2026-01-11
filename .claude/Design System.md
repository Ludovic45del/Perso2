# 🎨 Design System - Campaign & FSEC

Guide d'homogénéité pour le développement des modules Campaign et FSEC.

---

## 📦 Composants Partagés

### Niveau 1: Shared UI (`@shared/ui`)

| Composant | Usage | Import |
|-----------|-------|--------|
| **CopyButton** | Copier un chemin vers presse-papiers | `import { CopyButton } from '@shared/ui'` |
| **SearchInput** | Recherche avec icône et placeholder | `import { SearchInput } from '@shared/ui'` |
| **NotificationSnackbar** | Messages de succès/erreur | `import { NotificationSnackbar } from '@shared/ui'` |

```tsx
// CopyButton
<CopyButton path="P:\LMJ\2025\..." />

// SearchInput
<SearchInput 
    value={query} 
    onChange={setQuery} 
    placeholder="Rechercher..." 
/>
```

---

### Niveau 2: Widgets (`@widgets/*`)

| Widget | Usage | Import |
|--------|-------|--------|
| **DataTable** | Tableaux de données avec loading | `import { DataTable } from '@widgets/data-table'` |
| **DataChip** | Chips colorés (statuts, types) | `import { DataChip } from '@widgets/data-chip'` |
| **ChipSelect** | Select avec chips colorés | `import { ChipSelect } from '@widgets/chip-select'` |
| **FolderCard** | Cartes dossiers (grid/list) | `import { FolderCard } from '@widgets/folder-card'` |
| **RoutedTabs** | Tabs avec routing | `import { RoutedTabs } from '@widgets/routed-tabs'` |

```tsx
// DataTable
<DataTable
    columns={[
        { id: 'name', label: 'Nom', render: (row) => row.name },
        { id: 'status', label: 'Statut', render: (row) => <DataChip label={row.status} color="#34C759" /> }
    ]}
    data={items}
    isLoading={loading}
    onRowClick={(row) => navigate(row.uuid)}
    emptyMessage="Aucun élément."
/>

// DataChip
<DataChip label="En cours" color="#007AFF" />
<DataChip label="Terminé" color="#34C759" />

// ChipSelect (dans formulaires)
<ChipSelect
    options={[
        { value: 0, label: 'LMJ', color: '#7ac7f5' },
        { value: 1, label: 'OMEGA', color: '#c9a0dc' },
    ]}
    value={installationId}
    onChange={(e) => setInstallationId(e.target.value)}
/>
```

---

## 🖼️ Patterns UI Standards

### Modales de Création/Modification

```tsx
<Dialog maxWidth="md" fullWidth>
    <DialogTitle sx={{ pb: 0, fontWeight: 600 }}>
        Titre de la Modale
    </DialogTitle>
    
    <DialogContent dividers>
        <Grid container spacing={3}>
            {/* Sections avec Grid item xs={12} md={6} */}
        </Grid>
    </DialogContent>
    
    <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" type="submit">Valider</Button>
    </DialogActions>
</Dialog>
```

### Formulaires avec react-hook-form

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', ... }
});

<Controller
    name="fieldName"
    control={control}
    render={({ field }) => (
        <TextField
            {...field}
            label="Label"
            error={!!errors.fieldName}
            helperText={errors.fieldName?.message}
            fullWidth
        />
    )}
/>
```

---

## 🎨 Couleurs Standards

### Statuts

| Statut | Couleur | Hex |
|--------|---------|-----|
| Brouillon | Gris | `#c3c3c3` |
| En cours | Bleu | `#7a8ce0` |
| Terminé | Vert | `#a2d82b` |
| En attente | Jaune | `#ecce18` |

### Installations

| Type | Couleur |
|------|---------|
| LMJ | `#7ac7f5` |
| OMEGA | `#c9a0dc` |

---

## 📐 Spacing & Layout

```tsx
// Grille 8px (theme.spacing)
sx={{ p: 2 }}      // 16px
sx={{ p: 3 }}      // 24px
sx={{ gap: 2 }}    // 16px

// Container page standard
<Box sx={{ p: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Titre Page
    </Typography>
</Box>

// Toolbar standard
<Paper variant="outlined" sx={{ 
    p: 1.5, px: 2, mb: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64
}}>
```

---

## 🔧 Architecture Backend

### DI Container Pattern

```python
# cible/domain/{module}/container.py
from cible.domain.{module}.container import get_{module}_container

class Controller(ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.repository = get_{module}_container().repository()
```

### Exceptions Centralisées

```python
from cible.domain.exceptions import NotFoundException, ConflictException
```

---

## ✅ Checklist FSEC

- [ ] Utiliser `DataTable` pour tous les tableaux
- [ ] Utiliser `DataChip` pour statuts/types
- [ ] Utiliser `ChipSelect` dans les formulaires
- [ ] Utiliser `CopyButton` pour chemins
- [ ] Container DI pour les repositories
- [ ] Exceptions depuis `domain/exceptions.py`
- [ ] Hooks extraits pour logique complexe
