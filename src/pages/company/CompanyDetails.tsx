import { Breadcrumb, Col, Row, Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import apiService from "../../services/apiService";

function CompanyDetails() {

   const { id } = useParams();
   const [isLoading, setIsLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");
   
   useEffect(() => {
      
      apiService.getCompanyById(id!)
      .then(company => {
         
         // TODO continue here
         
         console.log(company);
         
      })
      .catch(error => {
         
         console.log(error);
         
      })
      
   }, []);

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
         </Row>
         {isLoading
            ? <div className="textCenter"><Spin /></div>
            : !!errorMessage
               ? <ErrorAlert message={errorMessage} />
               : <div>Dados</div>
         }

      </Content>
   )
}

export default CompanyDetails;