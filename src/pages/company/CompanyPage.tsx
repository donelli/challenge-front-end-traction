import { Link, useParams } from "react-router-dom";
import { Button, Col, Divider, Layout, Result, Row, Spin, Statistic, Tabs } from "antd";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import Company from "../../models/Company";
import UsersPage from "../users/UsersPage";
import AllAssetsPage from "../assets/AllAssetsPage";

const { Content } = Layout;
const { TabPane } = Tabs;

const CompanyPage: React.FC = () => {
   
   const { companyId } = useParams()
   const [isLoading, setIsLoading] = useState(true);
   const [company, setCompany] = useState<Company | undefined>();
   const [errorMessage, setErrorMessage] = useState<string | undefined>();
   
   useEffect(() => {
      
      apiService.getCompanyById(companyId!)
      .then((company) => {
         setCompany(company);
         setIsLoading(false);
      })
      .catch(err => {
         console.log(err);
         
         setCompany(undefined);
         setErrorMessage(err.message);
         setIsLoading(false);
         
      });
      
   }, [ companyId ]);
   
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
         
         <Tabs type="line" tabPosition="top" defaultValue={0}>
            <TabPane tab="Users" key="1">
               
               <UsersPage companyId={companyId!} />
               
            </TabPane>
            <TabPane tab="Units" key="2">
               
               List of units
               
            </TabPane>
            <TabPane tab="Assets" key="3">
               
               <AllAssetsPage companyId={companyId!} />
               
            </TabPane>
         </Tabs>
         
      </div>}
   </Content>)
}

export default CompanyPage;
