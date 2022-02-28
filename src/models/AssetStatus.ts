
export enum AssetStatus {
   RUNNING = 'RUNNING',
   ALERTING = 'ALERTING',
   STOPPED = 'STOPPED'
}

export const getAssetStatusColor = (status: string) => {
   switch (status) {
      case 'RUNNING':
         return '#52c41a';
      case 'STOPPED':
         return '#f5222d';
      case 'ALERT':
         return '#faad14';
      default:
         return '#1890ff';
   }
};

export const getPossibleStatus = () => {
   return [
      { name: 'Running', value: AssetStatus.RUNNING },
      { name: 'Stopped', value: AssetStatus.STOPPED },
      { name: 'Alerting', value: AssetStatus.ALERTING }
   ];
};
