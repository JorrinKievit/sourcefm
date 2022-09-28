import { useToast } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';

const Toast: FC = () => {
  const toast = useToast();

  useEffect(() => {
    window.electron.ipcRenderer.on('toast', (status, message) => {
      console.log(status, message);
      toast({
        title: status as string,
        description: message as string,
        status: status as 'success' | 'error' | 'warning' | 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    });
  });
  return <></>;
};

export default Toast;
