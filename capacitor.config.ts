import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mobiles.app',
  appName: 'clips',
  webDir: 'dist/clips',
  server: {
    androidScheme: 'https'
  }
};

export default config;
