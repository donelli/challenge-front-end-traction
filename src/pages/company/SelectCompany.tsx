import { List, Button, Row, Col, Modal, Form, Input, Typography } from "antd";

import { useCallback, useEffect, useState } from "react";
import Company from "../../models/Company";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Title } = Typography;

interface CompanyModalFormProps {
   company?: Company;
   visible: boolean;
   onCancel: () => void;
}

interface CompanyFormData {
   name: string;
}

const CompanyModalForm: React.FC<CompanyModalFormProps> = ({ visible, onCancel, company }) => {
   
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
 
   return (
     <Modal title={ company ? 'Edit company' : 'New company' } visible={visible} onOk={onOk} onCancel={onCancel}>
         <Form form={form} layout="vertical" name="companyForm" initialValues={{ name: company ? company.name : '' }}>
            
            <Form.Item name="name" label="Company Name" rules={[{ required: true, message: 'Please input the company name!' }]}>
               <Input />
            </Form.Item>
            
         </Form>
     </Modal>
   );
};

const SelectCompany: React.FC = () => {

   const [isLoadingCompanies, setLoadingCompanies] = useState(true);
   const [companies, setCompanies] = useState<Company[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);

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
      
      confirm({
         title: 'Are you sure on deleting this company?',
         icon: <ExclamationCircleOutlined />,
         okText: 'Yes',
         okType: 'danger',
         cancelText: 'No',
         onOk() {
            
            // TODO delete
            
         }
       });     
      
   }

   const closeCompanyModal = () => {
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
                           <Button type="default" danger icon={ <DeleteOutlined /> } onClick={ () => deleteCompany(item) }></Button>
                        ]}
                     >
                        { item.name }
                     </List.Item>
                  )}
               />
               
            </Col>
         </Row>

         <Button type="primary" onClick={createNewCompany}>Create new company</Button>

         <CompanyModalForm visible={isModalVisible} onCancel={closeCompanyModal} company={editingCompany}></CompanyModalForm>
         
      </div>
   )
}

export default SelectCompany;