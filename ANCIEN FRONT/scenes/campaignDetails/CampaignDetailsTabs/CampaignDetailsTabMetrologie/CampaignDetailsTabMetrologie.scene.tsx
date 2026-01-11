import { useEffect, useState } from "react";
import { useCampaignDocumentContext } from "../../../../hooks/contexts/CampaignDocument.context";
import { Box } from "@mui/material";
import DataTableRow from "../../../../core/datatable/DataTableRow";
import DocumentsRow from "../DocumentsRow";
import { DOCUMENTS_COLUMNS } from "../DocumentsTable.const";
import { DocumentTypeEnum } from "../../../../core/enums/documentType.enum";
import {CampaignDocumentsModel} from "../../../../core/domain/campaign/CampaignDocuments.model.ts";

export default function CampaignDetailsTabMetrologie() {
    const [documents, setDocuments] = useState<CampaignDocumentsModel[]>([]);

    const campaignDocuments = useCampaignDocumentContext(DocumentTypeEnum.METROLOGIE);
  
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
