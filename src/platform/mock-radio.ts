/*
 * Mock radio for interfacing with mock devices
 */

export interface MockUDPListener {
  onUDPMessage(msg: Buffer, rinfo: RemoteAddressInfo): void;
}

export class RemoteAddressInfo {
  address: string;
  family: string;
  port: number;
  size: number;
  constructor(address: string, family: string, port: number, size: number) {
    this.address = address;
    this.family = family;
    this.port = port;
    this.size = size;
  }
}

// Simulates a network with simple UDP messaging functionality
export class MockNetwork {
  udpListeners: Map<string, MockUDPListener[]>;

  constructor() {
    this.udpListeners = new Map<string, MockUDPListener[]>();
  }

  registerUDPListener(
    listener: MockUDPListener,
    port: number,
    address: string
  ) {
    const key = address + ':' + port.toString();
    if (this.udpListeners.has(key)) {
      this.udpListeners.get(key)!.push(listener);
      return;
    }
    this.udpListeners.set(key, [listener]);
  }

  public sendUDPMessage(
    msg: Buffer,
    port: number,
    address: string,
    fromPort: number,
    fromAddress: string
  ) {
    const key = address + ':' + port.toString();
    const listeners = this.udpListeners.get(key);
    if (listeners === undefined) {
      return;
    }
    for (const listener of listeners) {
      const rinfo: RemoteAddressInfo = new RemoteAddressInfo(
        fromAddress,
        '',
        fromPort,
        0
      );
      listener.onUDPMessage(msg, rinfo);
    }
  }
}

export class UDPDevice implements MockUDPListener {
  private udpMessageAction: (
    msg: Buffer,
    rinfo: RemoteAddressInfo
  ) => void = () => {};

  onUDPMessage(msg: Buffer, rinfo: RemoteAddressInfo): void {
    this.udpMessageAction(msg, rinfo);
  }

  setUDPMessageAction(
    messageAction: (msg: Buffer, rinfo: RemoteAddressInfo) => void
  ) {
    this.udpMessageAction = messageAction;
  }
}