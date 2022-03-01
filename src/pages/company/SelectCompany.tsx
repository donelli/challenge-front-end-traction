import { List, Button, Row, Col, Typography, message, Popconfirm, Alert, Result } from "antd";

import { useEffect, useState } from "react";
import Company from "../../models/Company";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import CompanyModalForm from "./CompanyModalForm";

const { Title } = Typography;

const SelectCompany: React.FC = () => {

   const [isLoadingCompanies, setLoadingCompanies] = useState(true);
   const [companies, setCompanies] = useState<Company[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isSavingData, setSavingData] = useState(false);
   const [modalErrorMessage, setModalErrorMessage] = useState("");
   const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
   const [companiesError, setCompaniesError] = useState("");

   useEffect(() => {
      
      apiService.getCompanies()
      .then(companies => {
         setCompanies(companies);
         setLoadingCompanies(false);
      })
      .catch(err => {
         console.error(err);
         setCompaniesError(err.message);
      })

   }, [])

   const deleteCompany = (company: Company) => {
      
      setLoadingCompanies(true);   
   
      apiService.deleteCompany(company.id)
      .then(() => {
         setCompanies(companies.filter(c => c.id !== company.id));
         setLoadingCompanies(false);
      })
      .catch(err => {
         message.error(err.message);
         setLoadingCompanies(false);
      })
      
   }

   const closeCompanyModal = () => {
      setEditingCompany(undefined);
      setModalErrorMessage('');
      setIsModalVisible(false);
   }

   const createNewCompany = () => {
      setEditingCompany(undefined);
      setIsModalVisible(true);
   }

   const editCompany = (company: Company) => {
      setEditingCompany(company);
      setIsModalVisible(true);
   };

   const createEditCompany = (oldCompany: Company | undefined, companyName: string) => {
      
      setSavingData(true);
      
      if (oldCompany) {
         
         apiService.updateCompany(companyName, oldCompany.id)
         .then(newCompany => {
            
            const newCompanies = [...companies];
            newCompanies.splice(newCompanies.indexOf(oldCompany), 1, newCompany);
            
            setCompanies(newCompanies);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      } else {
         
         apiService.createNewCompany(companyName)
         .then(newCompany => {
            setCompanies([...companies, newCompany]);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      }
      
   };

   if (companiesError) {
      return (
         <div>

            <Result
               title="Error"
               status='error'
               subTitle={companiesError}
            />
            
         </div>
      );
   }

   return (
      <div>
         
         <Title level={4}>
            Select a company in the list to access details or create a new one:
         </Title>

         <Row justify="center" style={{ margin: '20px 0' }}>
            <Col xs={24} md={16} lg={12} xl={10}>
               
               <List
                  loading={isLoadingCompanies}
                  itemLayout="horizontal"
                  dataSource={companies}
                  bordered
                  renderItem={item => (
                     <List.Item
                        actions={[
                           
                           <Link to={"/" + item.id}>
                              <Button type="primary">Select</Button>
                           </Link>,
                           
                           <Button type="default" icon={ <EditOutlined /> } onClick={() => editCompany(item)}></Button>,
                           
                           <Popconfirm
                              title="Are you sure to delete this company?"
                              onConfirm={() => deleteCompany(item)}
                              okText="Yes"
                              cancelText="No"
                           >
                              <Button type="default" danger icon={ <DeleteOutlined /> }></Button>
                           </Popconfirm>,
                           
                        ]}
                     >
                        { item.name }
                     </List.Item>
                  )}
               />
               
            </Col>
         </Row>

         <Button type="primary" onClick={createNewCompany}>Create new company</Button>

         <CompanyModalForm
            visible={isModalVisible}
            onCancel={closeCompanyModal}
            company={editingCompany}
            savingData={isSavingData}
            onCreateEditSubmit={createEditCompany}
            errorMessage={modalErrorMessage}
         ></CompanyModalForm>
         
      </div>
   )
}

export default SelectCompany;