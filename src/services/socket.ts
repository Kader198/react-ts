import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private queryClient: any = null;

  initialize(queryClient: any) {
    this.queryClient = queryClient;
    this.socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('CREATED', () => {
        console.log('CREATED task ');
        
      this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    this.socket.on('userUpdated', () => {
      this.queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    // Add more listeners as needed
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService(); 