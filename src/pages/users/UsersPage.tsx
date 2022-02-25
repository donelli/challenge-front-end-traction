import { Alert, Button, Col, Form, Input, message, Popconfirm, Row, Space, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import User from "../../models/User";
import apiService from "../../services/apiService";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Modal from "antd/lib/modal/Modal";

const { Search } = Input;

interface UsersPageProps {
   companyId: string;
}

interface UserModalFormProps {
   user?: User;
   visible: boolean;
   savingData: boolean;
   onCancel: () => void;
   onCreateEditSubmit: (oldUser: User | undefined, userName: string) => void;
   errorMessage: string;
}

interface UserFormData {
   name: string;
}

const UserModalForm: React.FC<UserModalFormProps> = ({ visible, onCancel, user, savingData, errorMessage, onCreateEditSubmit }) => {
   
   const [form] = Form.useForm<UserFormData>();
   
   useEffect(() => {

      if (user) {
         form.setFieldsValue({ name: user.name });
      } else {
         form.setFieldsValue({ name: '' });
      }
      
   }, [ user, form ])
 
   const onOk = () => {
     form.submit();
   };

   const onFinish = () => {
      onCreateEditSubmit(user, form.getFieldValue('name') as string);
   }
   
   return (
     <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ user ? 'Edit user' : 'New user' }
         visible={visible}
         onOk={savingData ? undefined : onOk}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
      >
         <Form form={form} layout="vertical" name="userForm" initialValues={{ name: user ? user.name : '' }} onFinish={onFinish}>
            
            <Form.Item name="name" label="User Name" rules={[{ required: true, message: 'Please input the user name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   );
};

const UsersPage: React.FC<UsersPageProps> = ({ companyId }) => {
   
   const [isLoading, setIsLoading] = useState(true);
   const [users, setUsers] = useState<User[]>([]);
   const [filterValue, setFilterValue] = useState('');
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isSavingData, setSavingData] = useState(false);
   const [modalErrorMessage, setModalErrorMessage] = useState("");
   const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

   useEffect(() => {
      
      apiService.getUsers(companyId)
      .then(users => {
         
         setUsers(users);
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

   const filteredUsers = users.filter(user => {
      
      if (!filterValue || user.name.toLowerCase().includes(filterValue.toLowerCase())) {
         return true;
      }
      
      return false;
   });
   
   const closeUserModal = () => {
      setEditingUser(undefined);
      setModalErrorMessage('');
      setIsModalVisible(false);
   }

   const createNewUser = () => {
      setEditingUser(undefined);
      setIsModalVisible(true);
   }

   const editUser = (user: User) => {
      setEditingUser(user);
      setIsModalVisible(true);
   };

   const deleteUser = (user: User) => {
      
      setIsLoading(true);   
   
      apiService.deleteUser(companyId, user.id)
      .then(() => {
         setUsers(users.filter(u => u.id !== user.id));
         setIsLoading(false);
      })
      .catch(err => {
         message.error(err.message);
         setIsLoading(false);
      })
      
   }
   
   const createEditUser = (oldUser: User | undefined, userName: string) => {
      
      setSavingData(true);
      
      if (oldUser) {
         
         apiService.updateUser(companyId, oldUser.id, userName)
         .then(newUser => {
            
            const newUsers = [...users];
            newUsers.splice(newUsers.indexOf(oldUser), 1, newUser);
            
            setUsers(newUsers);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      } else {
         
         apiService.createNewUser(companyId, userName)
         .then(newUser => {
            setUsers([...users, newUser]);
            setSavingData(false);
            setIsModalVisible(false);
         })
         .catch(err => {
            setModalErrorMessage(err.message);
            setSavingData(false);
         });
         
      }
      
   }

   const columns: TableColumnsType<User> = [
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
         render: (text, user) => (
            <Space size="middle">
               
               <Button type="default" icon={ <EditOutlined /> } onClick={() => editUser(user)}></Button>
               
               <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => deleteUser(user)}
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
               onSearch={onSearch}
            />
         </Col>
         <Col xs={6} md={4} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={createNewUser}>New user</Button>
         </Col>
      </Row>
      
      <Table
         style={{ marginTop: '10px' }}
         rowKey={(user: User) => user.id}
         loading={isLoading}
         columns={columns}
         dataSource={filteredUsers}
      />

      <UserModalForm
         visible={isModalVisible}
         onCancel={closeUserModal}
         user={editingUser}
         savingData={isSavingData}
         onCreateEditSubmit={createEditUser}
         errorMessage={modalErrorMessage}
      ></UserModalForm>
      
   </div>)
}

export default UsersPage;
