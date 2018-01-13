/* eslint-disable no-console */

import fse from 'fs-extra';
import rimrafPromise from 'rimraf-promise';

import { clearCache, install } from './npmCommandManager';

const cleaner = () => (
  fse.stat('package.json')
    .then(stats => stats.isFile())
    .then((canClean) => {
      if (canClean) {
        console.log('🗑️  Removing node_modules 🗑 ');

        return rimrafPromise('./node_modules')
          .then(() => console.log('✅  Removed node_modules'))
          .then(() => console.log('🗑️  Clearing npm cache 🗑️'))
          .then(() => clearCache())
          .then(() => console.log('✅  Cleared npm cache'))
          .then(() => console.log('💥  Installing npm packages 💥'))
          .then(() => install())
          .then(() => console.log('✅  Installed npm packages'));
      }

      console.log('💣  No package.json file found, so no cleaning will occur 💣');
      return null;
    }).catch((e) => {
      if (e.code === 'ENOENT') {
        console.log('💣  No package.json file found, so no cleaning will occur 💣');
      } else {
        throw e;
      }
    })
);

export default cleaner;
