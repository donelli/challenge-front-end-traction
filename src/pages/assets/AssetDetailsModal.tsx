import { Asset } from "../../models/Asset";
import { Alert, Col, Descriptions, Image, Modal, Progress, Row, Spin, Statistic } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";
import { StatusIndicator } from "../../components/StatusIndicator";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import User from "../../models/User";

interface AssetDetailsModalProps {
   companyId: string;
   asset: Asset;
   visible: boolean;
   onModalClose: () => void;
}

const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ companyId, asset, visible, onModalClose }) => {

   const isMobile = useIsMobile();

   const [loadingOwner, setLoadingOwner] = useState(true);
   const [assetOwner, setAssetOwner] = useState<User>();
   const [ownerError, setOwnerError] = useState("");

   useEffect(() => {
      
      setLoadingOwner(true);
      
      if (!asset) {
         return;
      }
      
      apiService.getUserById(companyId, asset.ownerId)
      .then(user => {
         setAssetOwner(user);
         setLoadingOwner(false);
      })
      .catch(err => {
         setOwnerError(err.message);
         setLoadingOwner(false);
      });
      
   }, [ asset, companyId ]);
   
   if (!asset) {
      return null;
   }

   return (<Modal
      title={ 'Asset details' }
      visible={visible}
      okButtonProps={{ style: { display: 'none' } }}
      cancelText={ 'Close' }
      onCancel={onModalClose}
      width={isMobile ? '90%' : '80%'}
   >
      
      <Descriptions bordered layout="horizontal">
         <Descriptions.Item label="Model" span={3}>{asset.model}</Descriptions.Item>
         <Descriptions.Item label="Name" span={3}>{asset.name}</Descriptions.Item>
         <Descriptions.Item label="Description" span={3}>{asset.description}</Descriptions.Item>
         <Descriptions.Item label="Unit" span={3}>{asset.unit.name}</Descriptions.Item>
         <Descriptions.Item label="Owner" span={3}>
            
            {
               loadingOwner
               ? <Spin size="small" />
               : (ownerError
                  ? <Alert type="error" message={ownerError} showIcon/>
                  : <div>{assetOwner?.name}</div>)
            }
            
         </Descriptions.Item>
         <Descriptions.Item label="Status" span={3}>
            <StatusIndicator assetStatus={asset.status} />
         </Descriptions.Item>
         
         <Descriptions.Item label="Health level" span={isMobile ? 3 : 1}>
            <Progress type="circle" percent={asset.healthLevel} status={ asset.healthLevel <= 50 ? 'exception' : 'normal' } />
         </Descriptions.Item>
         
         <Descriptions.Item label="Image" span={isMobile ? 3 : 1}>
            <Image src={asset.imageUrl} width="200px" />
         </Descriptions.Item>
         
      </Descriptions>
      
   </Modal>)
}

export default AssetDetailsModal;
