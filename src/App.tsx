import React, { useEffect, useState } from 'react';
import './App.css';
import { UserOutlined } from '@ant-design/icons';

import { Layout, Space } from 'antd';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/company/CompanyPage';
import Company from './models/Company';
import apiService from './services/apiService';
const { Header, Footer } = Layout;

function App() {
  
  const location = useLocation()
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>();
  
  useEffect(
    () => {
      
      // TODO probably need to use a better way to do this
      const params = location.pathname.split('/');
      
      if (params.length >= 2) {
        
        if (!currentCompany || currentCompany.id != params[1]) {
          apiService.getCompanyById(params[1]).then((company) => {
            setCurrentCompany(company);
          });
        }
        
      } else {
        setCurrentCompany(undefined);
      }
      
    },
    [location]
  );
  
  return (
    <Layout className="layout">
    <Header className='main-header'>
      <div className='menu-title'>
        <Link to='/'>Challenge Tractian</Link>
      </div>
      <div>
        {currentCompany && <Space>
          <UserOutlined />
          <span>{currentCompany.name}</span>
        </Space>}
      </div>
    </Header>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:companyId" element={<CompanyPage />} />
    </Routes>
    <Footer style={{ textAlign: 'center' }}>Eduardo Donelli Pellenz @ 2022</Footer>
  </Layout>
  );
}

export default App;
