import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

interface BackButtonProps {
   title: string
   to: string;
}

const BackButton: React.FC<BackButtonProps> = ({ title, to }) => {

   return (
      <Row style={{ width: '100%' }}>
         <Col span={24} style={{ textAlign: 'left' }}>
            <Link to={to}>
               <Button
                  className="back-button"
                  type="link"
                  icon={<ArrowLeftOutlined />}
               >
                  {title}
               </Button>
            </Link>
         </Col>
      </Row>
   );
   
}

export default BackButton;
