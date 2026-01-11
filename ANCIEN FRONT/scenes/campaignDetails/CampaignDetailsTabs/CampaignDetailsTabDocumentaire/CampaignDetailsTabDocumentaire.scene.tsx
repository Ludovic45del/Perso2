import { Box } from "@mui/material";
import DataTableRow from "../../../../core/datatable/DataTableRow";
import { useCampaignDocumentContext } from "../../../../hooks/contexts/CampaignDocument.context";
import { DOCUMENTS_COLUMNS } from "../DocumentsTable.const";
import { useEffect, useState } from "react";
import DocumentsRow from "../DocumentsRow";
import { DocumentTypeEnum } from "../../../../core/enums/documentType.enum";
import {CampaignDocumentsModel} from "../../../../core/domain/campaign/CampaignDocuments.model.ts";

export default function CampaignDetailsTabDocumentaire() {
  const [documents, setDocuments] = useState<CampaignDocumentsModel[]>([]);

  const campaignDocuments = useCampaignDocumentContext(DocumentTypeEnum.DOCUMENTAIRE);

  useEffect(() => {
    setDocuments(campaignDocuments.filteredCampaignDocuments);
  }, [campaignDocuments]);

  return (
    <Box>
      <DataTableRow
        RowComponent={DocumentsRow}
        rowsData={documents}
        setRows={setDocuments}
        columns={DOCUMENTS_COLUMNS}
      />
    </Box>
  );
}
