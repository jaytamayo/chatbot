import { useCallback, useState } from 'react';

export const useSetModalState = () => {
  const [visible, setVisible] = useState(false);

  const showModal = useCallback(() => {
    setVisible(true);
  }, []);
  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  const switchVisible = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  return { visible, showModal, hideModal, switchVisible };
};
