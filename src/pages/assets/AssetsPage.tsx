import { Link, useParams } from "react-router-dom";
import { Button, Col, Divider, Image, Layout, Popconfirm, Progress, Result, Row, Space, Spin, Statistic, Table, TableColumnsType, Tabs } from "antd";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Unit } from "../../models/Unit";
import { Asset, AssetStatus } from "../../models/Asset";
import { StatusIndicator } from "../../components/StatusIndicator";
import AssetDetailsModal from "./AssetDetailsModal";

const { Content } = Layout;
const { TabPane } = Tabs;

const AssetsPage: React.FC = () => {
   
   const { companyId, unitId } = useParams()
   const [isLoading, setIsLoading] = useState(true);
   const [unit, setUnit] = useState<Unit | undefined>();
   const [errorMessage, setErrorMessage] = useState<string | undefined>();
   
   const [assets, setAssets] = useState<Asset[]>();
   const [isLoadingAssets, setIsLoadingAssets] = useState(true);
   
   const [isAssetDetailsModalVisible, setAssetDetailsModalVisible] = useState(false);
   const [assetDetailsToShow, setAssetDetailsToShow] = useState<Asset>();
   
   const closeAssetDetailsModal = () => {
      setAssetDetailsModalVisible(false);
   }
   
   useEffect(() => {
      
      apiService.getUnitById(companyId!, unitId!)
      .then((unit) => {
         setUnit(unit);
         setIsLoading(false);
      })
      .catch(err => {
         console.log(err);
         
         setUnit(undefined);
         setErrorMessage(err.message);
         setIsLoading(false);
         
      });

      apiService.getAssets(companyId!, unitId!)
      .then((assets) => {
         
         setAssets(assets);
         setErrorMessage(undefined);
         setIsLoadingAssets(false);
         
      })
      .catch(err => {
         console.log(err);
         
         setAssets([]);
         setErrorMessage(err.message);
         setIsLoadingAssets(false);
         
      });
      
   }, [ companyId, unitId ]);
   
   // TODO show company name

   const showAssetDetails = (asset: Asset) => {
      setAssetDetailsToShow(asset);
      setAssetDetailsModalVisible(true);
   }
   
   const assetsTableCols: TableColumnsType<Asset> = [
      {
         title: 'Image',
         dataIndex: 'imageUrl',
         render: (imageUrl: string) => (<Image width={'150px'} src={imageUrl} />)
      },
      {
         title: 'Model',
         dataIndex: 'model'
      },
      {
         title: 'Name',
         dataIndex: 'name'
      },
      {
         title: "Health Level",
         render: (asset: Asset) => (<Progress type="circle" width={50} percent={asset.healthLevel} status={ asset.healthLevel <= 50 ? 'exception' : 'normal' } />)
      },
      {
         title: 'Status',
         dataIndex: 'status',
         render: (status: AssetStatus) => (<StatusIndicator assetStatus={status} />)
      },
      {
         title: 'Actions',
         render: (asset: Asset) => (
            <Space>
               
               <Button type="primary" icon={<EyeOutlined />} onClick={() => showAssetDetails(asset)}></Button>
               
               <Button
                  type="default"
                  icon={ <EditOutlined /> }
                  // onClick={() => editAsset(asset)}
               />
               
               <Popconfirm
                  title="Are you sure to delete this user?"
                  // onConfirm={() => deleteAsset(asset)}
                  okText="Yes"
                  cancelText="No"
               >
                  <Button type="default" danger icon={ <DeleteOutlined /> }></Button>
               </Popconfirm>
               
            </Space>
         )
      }
   ];
   
   return (<Content style={{ padding: '20px', textAlign: unit ? 'inherit' : 'center' }}>
      {isLoading && <Spin tip="Loading unit data..." style={{ marginTop: '20px' }} />}
      {errorMessage && <Result
         title="Error"
         status='error'
         subTitle={errorMessage}
         extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}

      />}
      {unit && <div>
         
         <Row>
            <Col span={16} style={{ marginBottom: '10px' }}>
               <Statistic title="Unit name" value={unit.name} />
            </Col>
            <Col xs={12} md={4}>
               <Statistic title="Created At" value={unit.createdAt?.toLocaleDateString()} />
            </Col>
            <Col xs={12} md={4}>
               <Statistic title="Updated At" value={unit.updatedAt?.toLocaleDateString()} />
            </Col>
         </Row>

         <Divider />
         
         <Tabs type="line" tabPosition="top" defaultValue={0}>
            <TabPane tab="Assets" key="1">
               
               <Table
                  locale={{ emptyText: 'No assets found' }}
                  style={{ marginTop: '10px' }}
                  rowKey={(asset: Asset) => asset.id}
                  loading={isLoadingAssets}
                  columns={assetsTableCols}
                  dataSource={assets}
               />
               
            </TabPane>
         </Tabs>

         <AssetDetailsModal
            companyId={companyId!}
            asset={assetDetailsToShow!}
            visible={isAssetDetailsModalVisible}
            onModalClose={closeAssetDetailsModal}
         />
         
      </div>}
   </Content>)
}

export default AssetsPage;
