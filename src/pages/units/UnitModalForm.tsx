import { Alert, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { Unit } from "../../models/Unit";

interface UnitModalFormProps {
   unit?: Unit;
   visible: boolean;
   savingData: boolean;
   onCancel: () => void;
   onCreateEditSubmit: (oldUnit: Unit | undefined, unitName: string) => void;
   errorMessage: string;
}

interface UnitFormData {
   name: string;
}

const UnitModalForm: React.FC<UnitModalFormProps> = ({ visible, onCancel, unit, savingData, errorMessage, onCreateEditSubmit }) => {
   
   const [form] = Form.useForm<UnitFormData>();
   
   useEffect(() => {

      if (!visible) {
         return;
      }
      
      if (unit) {
         form.setFieldsValue({ name: unit.name });
      } else {
         form.setFieldsValue({ name: '' });
      }
      
   }, [ unit, form, visible ])
 
   const onOk = () => {
     form.submit();
   };

   const onFinish = () => {
      onCreateEditSubmit(unit, form.getFieldValue('name') as string);
   }
   
   return (
     <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ unit ? 'Edit unit' : 'New unit' }
         visible={visible}
         onOk={savingData ? undefined : onOk}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
         style={{ top: 20 }}
      >
         <Form form={form} layout="vertical" name="unitForm" initialValues={{ name: unit ? unit.name : '' }} onFinish={onFinish}>
            
            <Form.Item name="name" label="Unit Name" rules={[{ required: true, message: 'Please input the unit name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   );
};

export default UnitModalForm;
