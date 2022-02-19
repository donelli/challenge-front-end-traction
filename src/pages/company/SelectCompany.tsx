import { List, Button, Row, Col, Modal, Form, Input, Typography, message, Popconfirm, Alert } from "antd";

import { useEffect, useState } from "react";
import Company from "../../models/Company";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Title } = Typography;

interface CompanyModalFormProps {
   company?: Company;
   visible: boolean;
   savingData: boolean;
   onCancel: () => void;
   onCreateEditSubmit: (oldCompany: Company | undefined, companyName: string) => void;
   errorMessage: string;
}

interface CompanyFormData {
   name: string;
}

const CompanyModalForm: React.FC<CompanyModalFormProps> = ({ visible, onCancel, company, savingData, errorMessage, onCreateEditSubmit }) => {
   
   const [form] = Form.useForm<CompanyFormData>();
   
   useEffect(() => {

      if (company) {
         form.setFieldsValue({ name: company.name });
      } else {
         form.setFieldsValue({ name: '' });
      }
      
   }, [ company, form ])
 
   const onOk = () => {
     form.submit();
   };

   const onFinish = () => {
      onCreateEditSubmit(company, form.getFieldValue('name') as string);
   }
   
   return (
     <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ company ? 'Edit company' : 'New company' }
         visible={visible}
         onOk={savingData ? undefined : onOk}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
      >
         <Form form={form} layout="vertical" name="companyForm" initialValues={{ name: company ? company.name : '' }} onFinish={onFinish}>
            
            <Form.Item name="name" label="Company Name" rules={[{ required: true, message: 'Please input the company name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   );
};

const SelectCompany: React.FC = () => {

   const [isLoadingCompanies, setLoadingCompanies] = useState(true);
   const [companies, setCompanies] = useState<Company[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isSavingData, setSavingData] = useState(false);
   const [modalErrorMessage, setModalErrorMessage] = useState("");
   
   const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);

   useEffect(() => {
      
      apiService.getCompanies()
      .then(companies => {
         setCompanies(companies);
         setLoadingCompanies(false);
      })
      .catch(err => {
         // TODO handle error
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

   return (
      <div>
         
         <Title level={4}>
            To start, select a company in the list to "log in" or you could create a new one:
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
                           <Button type="primary">Select</Button>,
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