import { Layout, Divider, Typography } from "antd";
import SelectCompany from "./company/SelectCompany";

const { Content } = Layout;
const { Title } = Typography;

function HomePage() {

   return (<Content style={{ padding: '20px 10px', textAlign: 'center' }}>
      
      <Title>Welcome!</Title>
      
      This is the home page of the application.

      <br /><br />

      This app shows all possible data and actions using the API created in the <a target="_blank" href="https://github.com/donelli/challenge-back-end-tractian">challenge-back-end-tractian</a>.

      <Divider />

      <SelectCompany />

   </Content>)

}

export default HomePage;
