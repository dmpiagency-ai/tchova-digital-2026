// 🔌 PLUG-IN SYSTEM: Deploy Configuration
// Easy deployment management for different environments

const config = {
  // 🔌 PLUG-IN: Environment Configurations
  environments: {
    development: {
      project: 'tchova-digital-dev',
      channel: 'dev-tchova-digital',
      description: 'Development environment with Firebase emulators'
    },
    staging: {
      project: 'tchova-digital-staging',
      channel: 'staging-tchova-digital',
      description: 'Staging environment for testing'
    },
    production: {
      project: 'tchova-digital-prod',
      channel: 'live-tchova-digital',
      description: 'Production environment'
    }
  },

  // 🔌 PLUG-IN: Build Configurations
  builds: {
    development: {
      command: 'npm run build',
      env: {
        VITE_USE_FIREBASE_EMULATOR: 'true',
        VITE_ENABLE_ANALYTICS: 'false',
        VITE_ENABLE_PAYMENTS: 'false'
      }
    },
    staging: {
      command: 'npm run build',
      env: {
        VITE_USE_FIREBASE_EMULATOR: 'false',
        VITE_ENABLE_ANALYTICS: 'true',
        VITE_ENABLE_PAYMENTS: 'true'
      }
    },
    production: {
      command: 'npm run build',
      env: {
        VITE_USE_FIREBASE_EMULATOR: 'false',
        VITE_ENABLE_ANALYTICS: 'true',
        VITE_ENABLE_PAYMENTS: 'true'
      }
    }
  },

  // 🔌 PLUG-IN: Pre-deployment Checks
  checks: {
    firebase: {
      config: 'src/config/firebase.ts',
      required: ['VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_API_KEY']
    },
    environment: {
      files: ['.env.local', '.env.production'],
      required: ['VITE_WHATSAPP_NUMBER']
    },
    build: {
      command: 'npm run build',
      checkDist: true
    }
  },

  // 🔌 PLUG-IN: Deployment Scripts
  scripts: {
    'deploy:dev': 'npm run build && firebase use development && firebase deploy --only hosting',
    'deploy:staging': 'npm run build && firebase use staging && firebase deploy --only hosting',
    'deploy:prod': 'npm run build && firebase use production && firebase deploy --only hosting',
    'preview:dev': 'npm run build && firebase serve --only hosting',
    'emulators': 'firebase emulators:start'
  }
};

// 🔌 PLUG-IN: Environment Detection
const getCurrentEnvironment = () => {
  const branch = process.env.CI_COMMIT_REF_NAME || 'development';
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') return 'production';
  if (branch === 'staging' || branch === 'main') return 'staging';
  return 'development';
};

// 🔌 PLUG-IN: Configuration Getter
const getConfig = (environment = getCurrentEnvironment()) => {
  return {
    ...config.environments[environment],
    build: config.builds[environment],
    checks: config.checks
  };
};

// 🔌 PLUG-IN: Validation Function
const validateDeployment = (environment) => {
  const issues = [];
  const envConfig = config.environments[environment];

  if (!envConfig) {
    issues.push(`Environment "${environment}" not configured`);
  }

  // Check required environment variables
  const requiredVars = config.checks.firebase.required;
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      issues.push(`Missing required environment variable: ${varName}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    config: getConfig(environment)
  };
};

export {
  config,
  getCurrentEnvironment,
  getConfig,
  validateDeployment
};