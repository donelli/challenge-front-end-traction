import React, { useEffect, useState } from "react";
import { Alert } from 'antd';

interface ErrorAlertProps {
   message: string
}

function ErrorAlert(props: ErrorAlertProps) {

   return (
      <Alert
         message="Error"
         description={props.message}
         type="error"
         showIcon
      />
   );
   
}

export default ErrorAlert
