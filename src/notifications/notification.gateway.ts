// src/notification/notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust to your frontend domain
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private userSockets = new Map<string, string>(); // userId -> socketId map

  // Public method used by NotificationService to send targeted push
  sendNotificationToUser(userId: string, notification: Notification) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      // 'newNotification' is the event the React frontend listens for
      this.server.to(socketId).emit('newNotification', notification);
    }
  }

  handleConnection(client: Socket) {
    // Handled by client sending 'registerUser' event
  }

  handleDisconnect(client: Socket) {
    // Remove disconnected socket from map
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  // Client must send this event after connection to identify themselves
  @SubscribeMessage('registerUser')
  handleRegister(@MessageBody() data: { userId: string }, client: Socket) {
    if (data.userId) {
      this.userSockets.set(data.userId, client.id);
    }
  }
}
