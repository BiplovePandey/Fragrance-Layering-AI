export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
}

const config: CapacitorConfig = {
  appId: 'com.olfactory.atelier',
  appName: 'Olfactory Atelier',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
