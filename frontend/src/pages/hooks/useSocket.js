import { useEffect } from 'react';
import { useSocketStore } from '../store/useSocketStore';

export const useSocket = (boardId = null) => {
  const { socket, isConnected, initSocket, disconnectSocket, joinBoard, leaveBoard } = useSocketStore();

  useEffect(() => {
    // Initialize socket on mount
    initSocket();

    // Join board room if boardId is provided
    if (boardId && isConnected) {
      joinBoard(boardId);
    }

    // Cleanup on unmount or boardId change
    return () => {
      if (boardId) {
        leaveBoard(boardId);
      }
    };
  }, [boardId, isConnected]);

  return { socket, isConnected };
};

export default useSocket;