import { Alert, Col, Form, Input, Modal, Row, Select, Slider } from "antd";
import { useEffect, useState } from "react";
import { Asset } from "../../models/Asset";
import { AssetStatus, getPossibleStatus } from "../../models/AssetStatus";
import User from "../../models/User";
import apiService from "../../services/apiService";

const { TextArea } = Input;

interface AssetModalFormProps {
   asset?: Asset;
   visible: boolean;
   savingData: boolean;
   onCancel: () => void;
   onCreateEditSubmit: (oldAsset: Asset | undefined, newAsset: Asset) => void;
   errorMessage: string;
   companyId: string;
}

interface AssetFormData {
   name: string;
   model: string;
   description: string;
   status: AssetStatus;
   owner: string;
   healthLevel: number;
}

const AssetModalForm: React.FC<AssetModalFormProps> = ({ visible, onCancel, asset, savingData, errorMessage, onCreateEditSubmit, companyId }) => {

   const [form] = Form.useForm<AssetFormData>();
   const [users, setUsers] = useState<User[]>([]);
   const [isLoadingUsers, setLoadingUsers] = useState<boolean>(false);
   
   useEffect(() => {

      if (asset) {
         form.setFieldsValue({
            name: asset.name,
            model: asset.model,
            description: asset.description,
            status: asset.status,
            owner: asset.ownerId,
            healthLevel: asset.healthLevel
         });
      } else {
         form.resetFields();
      }
      
   }, [ asset, form, visible ])
   
   useEffect(() => {
      
      if (!visible) {
         return;
      }
      
      setLoadingUsers(true);

      apiService.getUsers(companyId)
      .then(users => {
         
         setUsers(users);
         setLoadingUsers(false);
         
      })
      .catch(err => {
         console.error(err);
         // TODO handle error
      });
      
   }, [ visible, companyId ]);
   
   const onOk = () => {}
   const onFinish = () => {};

   const possibleStatus = getPossibleStatus();

   // TODO:
   // - image
   
   return (
      <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ asset ? 'Edit asset' : 'New asset' }
         visible={visible}
         onOk={savingData ? undefined : onOk}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
      >
         <Form form={form} layout="vertical" name="assetForm" onFinish={onFinish}>
            
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the asset name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please input the asset model!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the asset description!' }]}>
               <TextArea disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the asset status!' }]}>
               <Select disabled={savingData}>
                  {possibleStatus.map(status => (
                     <Select.Option key={status.value} value={status.value}>{status.name}</Select.Option>
                  ))}
               </Select>
            </Form.Item>
            
            <Form.Item name="owner" label="Owner" rules={[{ required: true, message: 'Please select the owner' }]}>
               <Select
                  showSearch
                  loading={isLoadingUsers}
                  disabled={savingData}
                  filterOption={(input, option) => {
                     return option!.children!.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
               >
                  {users.map(user => (
                     <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>
                  ))}
               </Select>
            </Form.Item>

            <Form.Item name="healthLevel" label="Health Level" rules={[{ required: true, message: 'Please select the asset health level!' }]}>
               <Slider defaultValue={100} disabled={savingData} />
            </Form.Item>
            
            {/* <Form.Item label="Image" rules={[{ required: true, message: 'Please select a image!' }]}>
               <Row>
                  <Col span={24}>
                     
                     
                     
                     
                  </Col>
               </Row>
            </Form.Item> */}
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   )
};

export default AssetModalForm;
