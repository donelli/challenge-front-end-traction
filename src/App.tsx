import React from 'react';
import './App.css';

import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import CompanyList from './pages/company/CompanyList';
const { Header, Footer } = Layout;

function App() {
  
  return (
    <Layout className="layout">
    <Header>
      <div className='menu-title'>
        Challenge Tractian
      </div>
    </Header>
    {/* <Content style={{ padding: '0 50px' }}> */}
      <Routes>
        <Route path="/" element={<CompanyList />} />
      </Routes>
    {/* </Content> */}
    <Footer style={{ textAlign: 'center' }}>Eduardo Donelli Pellenz @ 2022</Footer>
  </Layout>
  );
}

export default App;
