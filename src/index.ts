import {smarthomeStub} from './platform/stub-setup';
export * from './platform/mock-local-home-platform';
export * from './platform/stub-setup';
export * from './platform/smart-home-app';
export * from './platform/device-manager';
export * from './platform/execute';
(global as any).smarthome = smarthomeStub;
