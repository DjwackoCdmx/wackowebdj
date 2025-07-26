import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.djwacko.propinas',
  appName: 'DJ Wacko Propinas',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
