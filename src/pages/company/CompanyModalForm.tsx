import { Alert, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import Company from "../../models/Company";

interface CompanyModalFormProps {
   company?: Company;
   visible: boolean;
   savingData: boolean;
   onCancel: () => void;
   onCreateEditSubmit: (oldCompany: Company | undefined, companyName: string) => void;
   errorMessage: string;
}

interface CompanyFormData {
   name: string;
}

const CompanyModalForm: React.FC<CompanyModalFormProps> = ({ visible, onCancel, company, savingData, errorMessage, onCreateEditSubmit }) => {
   
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

   const onFinish = () => {
      onCreateEditSubmit(company, form.getFieldValue('name') as string);
   }
   
   return (
     <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ company ? 'Edit company' : 'New company' }
         visible={visible}
         onOk={savingData ? undefined : onOk}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
         style={{ top: 20 }}
      >
         <Form form={form} layout="vertical" name="companyForm" initialValues={{ name: company ? company.name : '' }} onFinish={onFinish}>
            
            <Form.Item name="name" label="Company Name" rules={[{ required: true, message: 'Please input the company name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   );
};

export default CompanyModalForm;
