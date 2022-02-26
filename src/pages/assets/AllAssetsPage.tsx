import { useEffect, useRef, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import apiService from "../../services/apiService";
import { Divider, Row, Col, Spin, Table, TableColumnsType, Result, Button, Image } from "antd";
import { Asset, AssetStatus } from "../../models/Asset";
import { Unit } from "../../models/Unit";
import { StatusIndicator } from "../../components/StatusIndicator";
import AssetDetailsModal from "./AssetDetailsModal";

interface AllAssetsPageProps {
   companyId: string;
}

interface AssetPerStatus {
   status: string;
   count: number;
   color: string
}

const getStatusColor = (status: string) => {
   switch (status) {
      case 'RUNNING':
         return '#52c41a';
      case 'STOPPED':
         return '#f5222d';
      case 'ALERT':
         return '#faad14';
      default:
         return '#1890ff';
   }
}

const AllAssetsPage: React.FC<AllAssetsPageProps> = ({ companyId }) => {
   
   const [averageTempPerHourData, setAverageTempPerHourData] = useState<number[]>();
   const [isLoadingAverageTempData, setLoadingAverageTempData] = useState(true);
   
   const [assetsPerStatus, setAssetsPerStatus] = useState<AssetPerStatus[]>();
   const [isLoadingAssetsPerStatus, setLoadingAssetsPerStatus] = useState(true);
   
   const [assets, setAssets] = useState<Asset[]>();
   const [isLoadingAssets, setLoadingAssets] = useState(true);

   const [isAssetDetailsModalVisible, setAssetDetailsModalVisible] = useState(false);
   const [assetDetailsToShow, setAssetDetailsToShow] = useState<Asset>();
   
   const tempPerHourChartComponentRef = useRef<HighchartsReact.RefObject>(null);
   const statusChartComponentRef = useRef<HighchartsReact.RefObject>(null);

   const [error, setError] = useState("");

   useEffect(() => {
      
      apiService.getAssetStatusSummary(companyId!)
      .then(data => {

         setAssetsPerStatus(data.map(status => {
            return {
               status: status.status,
               count: status.count,
               color: getStatusColor(status.status)
            }
         }));
         setLoadingAssetsPerStatus(false);
         
         setAverageTempPerHourData([ 25, 27, 24, 32, 37, 45, 40, 25, 27, 28, 30, 29, 28, 28, 27, 25, 19, 21, 25, 28, 27, 29, 32, 35, 40, 55, 51, 52, 49 ])
         setLoadingAverageTempData(false);
         
      })
      .catch(err => {
         setError(err.message);
      });
      
      apiService.getAssetsFromCompany(companyId!)
      .then(data => {
         
         setAssets(data)
         setLoadingAssets(false);
         
      })
      .catch(err => {
         setError(err.message);
      });
      
   }, [ companyId ]);

   const statusChartOptions: Highcharts.Options = {
      title: {
         text: 'Assets per status'
      },
      chart: {
         plotShadow: false,
         type: 'pie'
     },
     series: [{
         type: 'pie',
         name: 'Assets',
         data: assetsPerStatus?.map(asset => {
            return {
               name: asset.status,
               y: asset.count,
               color: asset.color
            }
         })
     }]
   };
   
   const tempPerHouroptions: Highcharts.Options = {
      title: {
         text: 'Average temperature per hour'
      },
      subtitle: {
         text: 'Example data'
      },
      series: [{
         type: 'line',
         name: 'Temperature (°C)',
         data: averageTempPerHourData
      }],
      xAxis: {
         type: 'datetime',
         labels: {
            overflow: 'justify'
         }
      }, 
      tooltip: {
         valueSuffix: ' °C'
      },
      plotOptions: {
         series: {
            label: {
               connectorAllowed: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2022, 2, 20, 7, 0, 0)
        }
      }
   };

   const openAssetDetailsModal = (asset: Asset) => {
      setAssetDetailsToShow(asset);
      setAssetDetailsModalVisible(true);
   }

   const closeAssetDetailsModal = () => {
      setAssetDetailsModalVisible(false);
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
         title: 'Status',
         dataIndex: 'status',
         render: (status: AssetStatus) => (<StatusIndicator assetStatus={status} />)
      },
      {
         title: 'Unit',
         dataIndex: 'unit',
         render: (unit: Unit) => unit.name
      },
      {
         title: 'Actions',
         dataIndex: 'id',
         render: (id: string, asset: Asset) => (<Button type="link" onClick={() => openAssetDetailsModal(asset)}>Details</Button>)
      }
   ];
   
   if (error) {
      return (
         <Row>
            <Col span={24}>
               
               <Result
                  status="error"
                  title="Error loading assets"
                  subTitle="An error ocurred while loading the assets. Please try again later."
               />
               
            </Col>
         </Row>
      );
   }
   
   return (
      <div>

         <Row>
            <Col xs={24} lg={7} style={{ marginBottom: '10px' }}>
               
               <Spin spinning={isLoadingAssetsPerStatus}>
                  <HighchartsReact
                     highcharts={Highcharts}
                     options={statusChartOptions}
                     ref={statusChartComponentRef}
                  />
               </Spin>

            </Col>
            <Col xs={22} offset={1} lg={16} style={{ marginBottom: '10px' }}>
            
               <Spin spinning={isLoadingAverageTempData}>
                  <HighchartsReact
                     highcharts={Highcharts}
                     options={tempPerHouroptions}
                     ref={tempPerHourChartComponentRef}
                  />
               </Spin>
               
            </Col>
         </Row>

         <Divider />

         <Table
            locale={{ emptyText: 'No assets found' }}
            style={{ marginTop: '10px' }}
            rowKey={(asset: Asset) => asset.id}
            loading={isLoadingAssets}
            columns={assetsTableCols}
            dataSource={assets}
         />
         
         <AssetDetailsModal
            companyId={companyId}
            asset={assetDetailsToShow!}
            visible={isAssetDetailsModalVisible}
            onModalClose={closeAssetDetailsModal}
         />
         
      </div>
   )
}

export default AllAssetsPage;
