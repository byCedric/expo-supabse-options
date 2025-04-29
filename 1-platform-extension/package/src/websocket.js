import { WebSocket as NodeWebSocket } from 'ws';

export class WebSocket {
  // WebSocket constants
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  
  constructor(url, protocols) {
    this.ws = new NodeWebSocket(url, protocols);
    
    // Properties
    this.url = url;
    this.bufferedAmount = 0;
    this.extensions = '';
    this.binaryType = 'blob';
    
    // Event handlers (will be set by user)
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    
    // Event listeners collections
    this._listeners = {
      open: [],
      message: [],
      error: [],
      close: []
    };
    
    // Set up event listeners
    this.ws.on('open', () => {
      this.protocol = this.ws.protocol;
      const event = new WebSocket.Event('open');
      
      // Call onopen handler if set
      if (this.onopen) this.onopen(event);
      
      // Call all registered open event listeners
      this._listeners.open.forEach(listener => listener(event));
    });
    
    this.ws.on('message', (data) => {
      const event = new WebSocket.MessageEvent('message', { data });
      
      // Call onmessage handler if set
      if (this.onmessage) this.onmessage(event);
      
      // Call all registered message event listeners
      this._listeners.message.forEach(listener => listener(event));
    });
    
    this.ws.on('error', (error) => {
      const event = new WebSocket.ErrorEvent('error', { error });
      
      // Call onerror handler if set
      if (this.onerror) this.onerror(event);
      
      // Call all registered error event listeners
      this._listeners.error.forEach(listener => listener(event));
    });
    
    this.ws.on('close', (code, reason) => {
      const event = new WebSocket.CloseEvent('close', { 
        code, 
        reason: reason.toString(), 
        wasClean: code === 1000 
      });
      
      // Call onclose handler if set
      if (this.onclose) this.onclose(event);
      
      // Call all registered close event listeners
      this._listeners.close.forEach(listener => listener(event));
    });
  }
  
  // Methods
  send(data) {
    this.ws.send(data);
  }
  
  close(code, reason) {
    this.ws.close(code, reason);
  }
  
  // Event listener methods
  addEventListener(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type].push(listener);
    }
  }
  
  removeEventListener(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type] = this._listeners[type].filter(l => l !== listener);
    }
  }
  
  // Getter for readyState
  get readyState() {
    return this.ws.readyState;
  }
  
  // Helper class methods to mimic browser's Event classes
  static Event = class Event {
    constructor(type) {
      this.type = type;
    }
  }
  
  static MessageEvent = class MessageEvent {
    constructor(type, init) {
      this.type = type;
      this.data = init.data;
    }
  }
  
  static CloseEvent = class CloseEvent {
    constructor(type, init) {
      this.type = type;
      this.code = init.code;
      this.reason = init.reason;
      this.wasClean = init.wasClean;
    }
  }
  
  static ErrorEvent = class ErrorEvent {
    constructor(type, init) {
      this.type = type;
      this.error = init.error;
      this.message = init.error.message;
    }
  }
}
