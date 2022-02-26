import { Button, Col, Input, message, Popconfirm, Row, Space, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import User from "../../models/User";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Unit } from "../../models/Unit";
import UnitModalForm from "./UnitModalForm";
import { Link } from "react-router-dom";

const { Search } = Input;

interface UnitsPageProps {
   companyId: string;
}

const UnitsPage: React.FC<UnitsPageProps> = ({ companyId }) => {
   
   const [isLoading, setIsLoading] = useState(true);
   const [units, setUnits] = useState<Unit[]>([]);
   const [filterValue, setFilterValue] = useState('');
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isSavingData, setSavingData] = useState(false);
   const [modalErrorMessage, setModalErrorMessage] = useState("");
   const [editingUnit, setEditingUnit] = useState<Unit>();

   useEffect(() => {
      
      apiService.getUnits(companyId)
      .then(units => {
         
         setUnits(units);
         setIsLoading(false);
         
      })
      .catch(err => {
         // TODO handle error
         console.error(err);
      })
      
   }, [ companyId ]);

   const onSearch = (value: string) => {
      setFilterValue(value);
   }

   const filteredUnits = units.filter(unit => {
      
      if (!filterValue || unit.name.toLowerCase().includes(filterValue.toLowerCase())) {
         return true;
      }
      
      return false;
   });
   
   const closeUnitModal = () => {
      setEditingUnit(undefined);
      setModalErrorMessage('');
      setIsModalVisible(false);
   }

   const createNewUnit = () => {
      setEditingUnit(undefined);
      setIsModalVisible(true);
   }

   const editUnit = (unit: Unit) => {
      setEditingUnit(unit);
      setIsModalVisible(true);
   };

   const deleteUnit = (unit: Unit) => {
      
      setIsLoading(true);   
   
      apiService.deleteUnit(companyId, unit.id)
      .then(() => {
         setUnits(units.filter(u => u.id !== unit.id));
         setIsLoading(false);
      })
      .catch(err => {
         message.error(err.message);
         setIsLoading(false);
      })
      
   }
   
   const createEditUnit = (oldUnit: Unit | undefined, unitName: string) => {
      
      setSavingData(true);
      
      if (oldUnit) {
         
         apiService.updateUnit(companyId, oldUnit.id, unitName)
         .then(newUnit => {
            
            const newUnits = [...units];
            newUnits.splice(newUnits.indexOf(oldUnit), 1, newUnit);
            
            setUnits(newUnits);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      } else {
         
         apiService.createNewUnit(companyId, unitName)
         .then(newUnit => {
            setUnits([...units, newUnit]);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      }
      
   }

   const columns: TableColumnsType<Unit> = [
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
         title: 'Created At',
         dataIndex: 'createdAt',
         render: (createdAt: Date) => <span>{createdAt.toLocaleString()}</span>
      },
      {
         title: 'Updated At',
         dataIndex: 'updatedAt',
         render: (createdAt: Date) => <span>{createdAt.toLocaleString()}</span>
      },
      {
         title: 'Action',
         key: 'action',
         render: (text, unit) => (
            <Space size="small">
               
               <Link to={`/${companyId}/${unit.id}/assets`}>
                  <Button type="primary" icon={<EyeOutlined />}></Button>
               </Link>
               
               <Button type="default" icon={ <EditOutlined /> } onClick={() => editUnit(unit)}></Button>
               
               <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => deleteUnit(unit)}
                  okText="Yes"
                  cancelText="No"
               >
                  <Button type="default" danger icon={ <DeleteOutlined /> }></Button>
               </Popconfirm>
               
            </Space>
         ),
      }
   ];

   return (<div>
      
      <Row>
         <Col xs={18} md={20}>
            <Search
               placeholder="Filter users"
               allowClear
               onSearch={onSearch}
            />
         </Col>
         <Col xs={6} md={4} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={createNewUnit}>New unit</Button>
         </Col>
      </Row>
      
      <Table
         style={{ marginTop: '10px' }}
         rowKey={(user: User) => user.id}
         loading={isLoading}
         columns={columns}
         dataSource={filteredUnits}
      />

      <UnitModalForm
         visible={isModalVisible}
         onCancel={closeUnitModal}
         unit={editingUnit}
         savingData={isSavingData}
         onCreateEditSubmit={createEditUnit}
         errorMessage={modalErrorMessage}
      ></UnitModalForm>
      
   </div>)
}

export default UnitsPage;
