import { spawn } from 'child-process-promise';

const options = {
  stdio: 'inherit',
  shell: true,
};

const clearCache = () => (
  spawn('npm cache clean --force', options)
);

const install = () => (
  spawn('npm install', options)
);

export { clearCache, install };
