import { Breadcrumb, Col, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import { Link, useParams } from "react-router-dom";

function CompanyDetails() {

   const { id } = useParams();
   
   return (
      <Content style={{ padding: '0 10px' }}>

         <Row align='middle'>
            <Col span={24}>
               <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>
                     <Link to="/">Companies</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{id}</Breadcrumb.Item>
               </Breadcrumb>
            </Col>
            {/* <Col style={{ textAlign: 'right' }} span={12}>
               <Space size="small">
                  <Button color='primary' icon={ <RedoOutlined /> } onClick={loadCompanies} disabled={isLoading}></Button>
                  <Button type='primary' color='primary' disabled={isLoading}>New Company</Button>
               </Space>
            </Col> */}
         </Row>
         
      </Content>
   )
}

export default CompanyDetails;