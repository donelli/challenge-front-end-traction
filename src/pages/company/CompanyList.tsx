import { Breadcrumb, Table, Space, Button, Row, Col, Divider } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState, useEffect } from 'react';
import { EyeOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import Company from '../../models/Company';
import apiService from '../../services/apiService';
import { ColumnsType } from 'antd/lib/table';
import { formatDate } from '../../utils';

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
         render: (_, record) => (<span>{formatDate(record.createdAt!)}</span>)
      },
      {
         title: 'Updated At',
         dataIndex: 'updatedAt',
         key: 'updateddAt',
         render: (_, record) => (<span>{formatDate(record.updatedAt!)}</span>)
      },
      {
         title: 'Actions',
         key: 'actions',
         render: (text: string, record: any) => ( <Button shape="default" icon={<EyeOutlined />} /> )
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
                  <Button color='primary' icon={ <RedoOutlined /> } onClick={loadCompanies} disabled={isLoading}></Button>
                  <Button type='primary' color='primary' disabled={isLoading}>New Company</Button>
               </Space>
            </Col>
         </Row>
         
         <Table columns={columns} rowKey="id" loading={isLoading} dataSource={companies} />
         
      </Content>
   )
}

export default CompanyList