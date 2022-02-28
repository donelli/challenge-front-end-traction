import { Alert, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import User from "../../models/User";

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
         style={{ top: 20 }}
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

export default UserModalForm;
