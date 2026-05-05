import { useQuery, useQueryClient } from '@tanstack/react-query';
import { message, Modal } from 'antd';
import { fetchState, resetState, saveState } from '../api/state';
import { EMPTY_STATE } from '../data/seed';

export function useAppState() {
  const queryClient = useQueryClient();

  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ['state'],
    queryFn: fetchState,
    placeholderData: EMPTY_STATE,
  });

  const data = { ...EMPTY_STATE, ...(rawData || {}) };

  const persist = (newData) => {
    queryClient.setQueryData(['state'], newData);
    saveState(newData);
  };

  const resetData = () => {
    Modal.confirm({
      title: 'Reset dữ liệu',
      content: 'Khôi phục toàn bộ dữ liệu về trạng thái mẫu? Các thay đổi sẽ mất.',
      okText: 'Khôi phục',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await resetState();
          queryClient.invalidateQueries({ queryKey: ['state'] });
          message.success('Đã xoá toàn bộ dữ liệu');
        } catch (e) {
          console.warn('Reset lỗi:', e);
          message.error('Reset thất bại');
        }
      },
    });
  };

  return { data, persist, resetData, isLoading, isError };
}
