import { Link, useParams } from "react-router-dom";
import { Button, Col, Divider, Layout, Result, Row, Spin, Statistic, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import apiService from "../../services/apiService";
import Company from "../../models/Company";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const { Content } = Layout;
const { TabPane } = Tabs;

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

const CompanyPage: React.FC = () => {
   
   const { companyId } = useParams()
   const [isLoading, setIsLoading] = useState(true);
   const [company, setCompany] = useState<Company | undefined>();
   const [errorMessage, setErrorMessage] = useState<string | undefined>();
   
   const [averageTempPerHourData, setAverageTempPerHourData] = useState<number[]>();
   const [isLoadingAverageTempData, setLoadingAverageTempData] = useState(true);
   
   const [assetsPerStatus, setAssetsPerStatus] = useState<AssetPerStatus[]>();
   const [isLoadingAssetsPerStatus, setLoadingAssetsPerStatus] = useState(true);
   
   useEffect(() => {
      
      apiService.getCompanyById(companyId!)
      .then((company) => {
         setCompany(company);
         setIsLoading(false);
         
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
            // TODO handle error
         });
         
      })
      .catch(err => {
         console.log(err);
         
         setCompany(undefined);
         setErrorMessage(err.message);
         setIsLoading(false);
         
      });
      
   }, [ companyId ]);
   
   const tempPerHourChartComponentRef = useRef<HighchartsReact.RefObject>(null);
   const statusChartComponentRef = useRef<HighchartsReact.RefObject>(null);

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
   
   return (<Content style={{ padding: '20px', textAlign: company ? 'inherit' : 'center' }}>
      {isLoading && <Spin tip="Loading company data..." style={{ marginTop: '20px' }} />}
      {errorMessage && <Result
         title="Error"
         status='error'
         subTitle={errorMessage}
         extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}

      />}
      {company && <div>
         
         <Row>
            <Col span={24} style={{ marginBottom: '10px' }}>
               <Statistic title="Company name" value={company.name} />
            </Col>
            <Col xs={24} md={6}>
               <Statistic title="Created At" value={company.createdAt?.toLocaleDateString()} />
            </Col>
            <Col xs={24} md={6}>
               <Statistic title="Updated At" value={company.updatedAt?.toLocaleDateString()} />
            </Col>
            <Col xs={24} md={6}>
               <Statistic title="Units count" value={company.unitCount} />
            </Col>
            <Col xs={24} md={6}>
               <Statistic title="Users count" value={company.userCount} />
            </Col>
         </Row>

         <Divider />

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
         
         <Tabs type="line" tabPosition="left" defaultValue={0}>
            <TabPane tab="Units" key="1">
               
               List of units
               
            </TabPane>
            <TabPane tab="Users" key="2">
               
               List of users
               
            </TabPane>
            <TabPane tab="Assets" key="3">
               
               List of all assets
               
            </TabPane>
         </Tabs>
         
      </div>}
   </Content>)
}

export default CompanyPage;
