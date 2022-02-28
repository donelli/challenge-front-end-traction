import { Alert } from "antd";
import React from "react"
import { AssetStatus } from "../models/AssetStatus";

interface StatusIndicatorProps {
   assetStatus: AssetStatus
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ assetStatus }) => {
   
   switch (assetStatus) {
      case AssetStatus.STOPPED:
         return (<Alert message="Stopped" type="error" showIcon />)
      case AssetStatus.ALERTING:
         return (<Alert message="Alerting" type="warning" showIcon />)
      case AssetStatus.RUNNING:
         return (<Alert message="Running" type="success" showIcon />)
   }
   
}