import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = [];
  }

  connect(onConnected, onError) {
    const socket = new SockJS('http://localhost:8080/ws');
    
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('WebSocket Connected');
        this.connected = true;
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        console.log('WebSocket connection closed');
        this.connected = false;
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket Disconnected');
    }
  }

  subscribeToEvents(callback) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected. Attempting to connect...');
      return null;
    }

    const subscription = this.client.subscribe('/topic/events', (message) => {
      const event = JSON.parse(message.body);
      callback(event);
    });

    this.subscriptions.push(subscription);
    return subscription;
  }

  subscribeToEmergencies(callback) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe('/topic/emergency', (message) => {
      const event = JSON.parse(message.body);
      callback(event);
    });

    this.subscriptions.push(subscription);
    return subscription;
  }

  subscribeToUserNotifications(username, callback) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(`/user/${username}/queue/notifications`, (message) => {
      const event = JSON.parse(message.body);
      callback(event);
    });

    this.subscriptions.push(subscription);
    return subscription;
  }

  sendMessage(destination, message) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
