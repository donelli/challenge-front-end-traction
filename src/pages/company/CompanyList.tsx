import { Breadcrumb, Table, Space, Button, Row, Col, Divider } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState, useEffect } from 'react';
import { EyeOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import Company from '../../models/Company';
import apiService from '../../services/apiService';
import { ColumnsType } from 'antd/lib/table';

function CompanyList() {

   const loadCompanies = () => {
      
      setIsLoading(true)
      
      apiService.getCompanies()
         .then(companies => setCompanies(companies))
         .catch(err => console.log(err))
         .finally(() => setIsLoading(false));
         
   }
   
   const [ isLoading, setIsLoading ] = useState<boolean>(true);
   const [ companies, setCompanies ] = useState<Company[]>([]);
   
   useEffect(() => {
      loadCompanies();
   }, []);

   const columns: ColumnsType<Company> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
         title: 'Created At',
         dataIndex: 'createdAt',
         key: 'createdAt',
         render: (_, record) => (<span>{record.createdAt!.toLocaleString()}</span>)
       },
      {
         title: 'Actions',
         key: 'actions',
         render: (text: string, record: any) => (
            <Space size="small">
               <Button shape="default" icon={<EyeOutlined />} />
               <Button color='danger' shape="default" icon={<DeleteOutlined />} danger />
            </Space>
         ),
      }
   ];

   return (
      <Content style={{ padding: '0 10px' }}>

         <Row align='middle'>
            <Col span={12}>
               <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Companies</Breadcrumb.Item>
               </Breadcrumb>
            </Col>
            <Col style={{ textAlign: 'right' }} span={12}>
               <Space size="small">
                  <Button color='primary' icon={ <RedoOutlined /> } onClick={loadCompanies}></Button>
                  <Button type='primary' color='primary'>New Company</Button>
               </Space>
            </Col>
         </Row>
         
         <Table columns={columns} rowKey="id" loading={isLoading} dataSource={companies} />
         
      </Content>
   )
}

export default CompanyList