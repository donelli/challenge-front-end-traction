import { Alert, Button, Col, Form, Image, Input, message, Modal, Row, Select, Slider, Space, Upload } from "antd";
import { useEffect, useState } from "react";
import { Asset } from "../../models/Asset";
import { AssetStatus, getPossibleStatus } from "../../models/AssetStatus";
import User from "../../models/User";
import apiService from "../../services/apiService";
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";

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
   imageId: string;
}

const AssetModalForm: React.FC<AssetModalFormProps> = ({ visible, onCancel, asset, savingData, errorMessage, onCreateEditSubmit, companyId }) => {

   const [form] = Form.useForm<AssetFormData>();
   const [users, setUsers] = useState<User[]>([]);
   const [isLoadingUsers, setLoadingUsers] = useState<boolean>(false);

   const [currentImageUrl, setCurrentImageUrl] = useState("");
   const [fileList, setFileList] = useState<UploadFile[]>([])
   
   const [usersError, setUsersError] = useState("awasdasd");
   
   useEffect(() => {

      setFileList([]);

      if (asset) {
         form.setFieldsValue({
            name: asset.name,
            model: asset.model,
            description: asset.description,
            status: asset.status,
            owner: asset.ownerId,
            healthLevel: asset.healthLevel,
            imageId: asset.imageId
         });
         setCurrentImageUrl(asset.imageUrl);
      } else {
         form.resetFields();
         setCurrentImageUrl("");
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
         setUsersError(err.message);
      });
      
   }, [ visible, companyId ]);
   
   const onFinish = async () => {
      
      const values = await form.validateFields();
      
      const newAsset = new Asset('', values.name, values.description, values.model, values.owner, currentImageUrl, values.healthLevel, undefined, values.status, values.imageId);
      
      if (asset) {
         newAsset.id = asset.id;
      }
      
      onCreateEditSubmit(asset, newAsset);
      
   };

   const possibleStatus = getPossibleStatus();

   const uploadProps = {
      name: 'file',
      action: apiService.getAssetUploadUrl(),
      beforeUpload: (file: UploadFile) => {
         console.warn(file.type);
         
         const isPNG = file.type === 'image/png';
         const isJPG = file.type === 'image/jpeg';
         
         console.log(isPNG, isJPG);
         
         if (isPNG || isJPG) {
            // ok
         } else {
           message.error(`${file.name} is not a png/jpg file`);
         }
         return isPNG || isJPG || Upload.LIST_IGNORE;
      },
      onChange(info: UploadChangeParam) {
         
         if (info.file.status === 'done') {
            
            form.setFieldsValue({
               imageId: info.file.response.fileName
            })

            setCurrentImageUrl(info.file.response.fileUrl);
            setFileList([]);
            
            message.success("Successfully updated asset image!")
            
         } else if (info.file.status === 'error') {
            
            console.log('failed: ', info.file);
            message.error(info.file.response.message);
            setFileList([]);
            
         } else {
            setFileList([
               {
                  uid: info.file.uid,
                  name: info.file.name,
                  status: 'uploading'
               }
            ])
         }
         
      },
   };
   
   return (
      <Modal
         cancelButtonProps={{ disabled: savingData }}
         okButtonProps={{ loading: savingData, }}
         title={ asset ? 'Edit asset' : 'New asset' }
         visible={visible}
         onOk={savingData ? undefined : onFinish}
         okText={savingData ? 'Saving...' : 'Ok'}
         onCancel={onCancel}
         closable={!savingData}
         maskClosable={!savingData}
         style={{ top: 20 }}
         width={650}
      >
         <Form form={form} layout="vertical" name="assetForm" onFinish={onFinish}>
            
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the asset name!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please input the asset model!' }]}>
               <Input disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the asset description!' }]}>
               <TextArea rows={5} disabled={savingData} />
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
                  disabled={savingData || !!usersError}
                  filterOption={(input, option) => {
                     return option!.children!.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }}
               >
                  {users.map(user => (
                     <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>
                  ))}
               </Select>
               
               {usersError && <Alert style={{ marginTop: '5px' }} type="error" message={usersError} />}
               
            </Form.Item>

            <Form.Item name="healthLevel" label="Health Level" rules={[{ required: true, message: 'Please select the asset health level!' }]}>
               <Slider disabled={savingData} />
            </Form.Item>
            
            <Form.Item name="imageId" label="Image" rules={[{ required: true, message: 'Please select a image!' }]}>
                     
               <Space direction="vertical">
                  
                  {currentImageUrl && <Image src={currentImageUrl} />}
                  {!currentImageUrl && <Alert type="warning" message="No image selected" />}
                  
                  <Upload
                     disabled={savingData}
                     fileList={fileList}
                     {...uploadProps}
                  >
                     <Button icon={<UploadOutlined />}>Upload asset image</Button>
                  </Upload>
                  
               </Space>
                     
            </Form.Item>
            
         </Form>
         
         {errorMessage && <Alert type="error" message={errorMessage} closable={true} />}
         
     </Modal>
   )
};

export default AssetModalForm;
