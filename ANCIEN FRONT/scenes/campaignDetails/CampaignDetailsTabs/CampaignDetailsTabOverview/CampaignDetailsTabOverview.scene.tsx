import { useCampaignContext } from "../../../../hooks/contexts/Campaign.context";
import { Box, Card, CardContent, Divider, FormLabel } from "@mui/material";
import { useCampaignTeamContext } from "../../../../hooks/contexts/CampaignTeam.context";
import { useEffect, useState } from "react";
import CampaignModel from "../../../../core/domain/campaign/Campaign.model";
import CampaignTeamModel from "../../../../core/domain/campaign/CampaignTeam.model";
import "./CampaignDetailsTabOverview.scene.scss";

export default function CampaignDetailsTabOverview() {
  const [campaign, setCampaign] = useState<CampaignModel>(null);
  const [team, setCampaignTeam] = useState<CampaignTeamModel[]>([]);

  const campaignContext = useCampaignContext();
  const teamContext = useCampaignTeamContext();

  useEffect(() => {
    setCampaign(campaignContext.campaign);
  }, [campaignContext]);

  useEffect(() => {
    setCampaignTeam(teamContext.campaignTeam);
  }, [teamContext]);

  return (
    <Box className="overview--main-container">
      <Box className="overview--left-container">
        <FormLabel>Semestre de planification</FormLabel>
        <h2>
          {campaign?.semester}/{campaign?.year}
        </h2>

        <FormLabel>MOE</FormLabel>
        <h4>{team?.find((obj) => obj.role.label === "MOE")?.name}</h4>

        <FormLabel>RCE</FormLabel>
        <h4>{team?.find((obj) => obj.role.label === "RCE")?.name}</h4>

        <FormLabel>IEC</FormLabel>
        <h4>{team?.find((obj) => obj.role.label === "IEC")?.name}</h4>
      </Box>
      <Box className="overview--right-container">
        <Box>
          <Card>
            <CardContent className="overview--card-content">
              <Box>
                <span>Total</span>
                <Divider orientation="vertical" flexItem />
                <span>11</span>
              </Box>

              <Divider />
              <Box>
                <span>Cibles tirées</span>
                <Divider orientation="vertical" flexItem />
                <span>4</span>
              </Box>
              <Divider />
              <Box>
                <span>Cibles prêtes</span>
                <Divider orientation="vertical" flexItem />
                <span>2</span>
              </Box>
              <Divider />
              <Box>
                <span>Cibles en fabrication</span>
                <Divider orientation="vertical" flexItem />
                <span>3</span>
              </Box>
              <Divider />
              <Box>
                <span>Cibles HS</span>
                <Divider orientation="vertical" flexItem />
                <span>2</span>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
