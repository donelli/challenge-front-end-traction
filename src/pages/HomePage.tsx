import { Layout, Divider, Typography } from "antd";
import SelectCompany from "./company/SelectCompany";

const { Content } = Layout;
const { Title } = Typography;

function HomePage() {

   return (<Content style={{ padding: '20px 10px', textAlign: 'center' }}>
      
      <Title>Welcome!</Title>
      
      This is the home page of the application.

      <br /><br />

      Here i'm probably going to put a description of the application.

      <Divider />

      <SelectCompany />

   </Content>)

}

export default HomePage;
