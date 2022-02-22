import { Button, Col, Input, Row, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import User from "../../models/User";
import apiService from "../../services/apiService";

const { Search } = Input;

interface UsersPageProps {
   companyId: string;
}

const UsersPage: React.FC<UsersPageProps> = ({ companyId }) => {
   
   const [isLoading, setIsLoading] = useState(true);
   const [users, setUsers] = useState<User[]>([]);
   
   const [filterValue, setFilterValue] = useState('');
   
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

   const columns: TableColumnsType<User> = [
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
         title: "Actions"
      }
   ];

   const onSearch = (value: string) => {
      setFilterValue(value);
   }

   const filteredUsers = users.filter(user => {
      
      if (!filterValue || user.name.toLowerCase().includes(filterValue.toLowerCase())) {
         return true;
      }
      
      return false;
   });
   
   const createNewUser = () => {};
   
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

   </div>)
}

export default UsersPage;
