import fse from 'fs-extra';
import rimrafPromise from 'rimraf-promise';

import * as npmCommandManager from './npmCommandManager';

import cleaner from './cleaner';

jest.mock('rimraf-promise');

describe('cleaner', () => {
  let statSpy;
  let consoleLogSpy;
  let clearCacheSpy;
  let installSpy;

  const removingNodeModulesMessage = '🗑️  Removing node_modules 🗑 ';
  const removedNodeModulesMessage = '✅  Removed node_modules';
  const clearingNpmCacheMessage = '🗑️  Clearing npm cache 🗑️';
  const clearedNpmCacheMessage = '✅  Cleared npm cache';
  const installingNpmPackagesMessage = '💥  Installing npm packages 💥';
  const installedNpmPackagesMessage = '✅  Installed npm packages';
  const noPackageJsonFoundMessage = '💣  No package.json found, so no cleaning will occur 💣';

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(global.console, 'log');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('cleaner', () => {
    describe('skip cleaning', () => {
      it('should not clean', async () => {
        const isFileMock = jest.fn();
        isFileMock.mockReturnValue(false);
        const stats = { isFile: isFileMock };
        statSpy = jest.spyOn(fse, 'stat').mockReturnValue(Promise.resolve(stats));
        const response = await cleaner();
        expect(response).toEqual(null);
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(noPackageJsonFoundMessage);
        statSpy.mockRestore();
        isFileMock.mockRestore();
      });

      it('should not clean if stat throws', async () => {
        const error = new Error('stat error');
        statSpy = jest.spyOn(fse, 'stat').mockReturnValue(Promise.reject(error));

        try {
          await cleaner();
        } catch (e) {
          expect(e).toEqual(error);
          expect(consoleLogSpy).not.toHaveBeenCalled();
        }

        statSpy.mockRestore();
      });

      it('should not clean if isFile throws', async () => {
        const error = new Error('isFile error');
        const isFileMock = jest.fn(() => Promise.reject(error));
        const stats = { isFile: isFileMock };
        statSpy = jest.spyOn(fse, 'stat').mockReturnValue(Promise.resolve(stats));

        try {
          await cleaner();
        } catch (e) {
          expect(e).toEqual(error);
          expect(consoleLogSpy).not.toHaveBeenCalled();
        }
      });
    });

    describe('clean', () => {
      const isFileMock = jest.fn(() => true);
      const stats = { isFile: isFileMock };

      beforeEach(() => {
        statSpy = jest.spyOn(fse, 'stat').mockReturnValue(Promise.resolve(stats));
      });

      afterEach(() => {
        isFileMock.mockRestore();
        statSpy.mockRestore();
        rimrafPromise.mockReset();
        clearCacheSpy.mockReset();
        installSpy.mockReset();
      });

      it('should clean', async () => {
        clearCacheSpy = jest.spyOn(npmCommandManager, 'clearCache').mockReturnValue(Promise.resolve());
        installSpy = jest.spyOn(npmCommandManager, 'install').mockReturnValue(Promise.resolve());
        rimrafPromise.mockImplementationOnce(() => Promise.resolve());

        const response = await cleaner();
        expect(response).toEqual(undefined);
        expect(consoleLogSpy).toHaveBeenCalledTimes(6);
        expect(consoleLogSpy).toHaveBeenCalledWith(removingNodeModulesMessage);
        expect(consoleLogSpy).toHaveBeenCalledWith(removedNodeModulesMessage);
        expect(consoleLogSpy).toHaveBeenCalledWith(clearedNpmCacheMessage);
        expect(consoleLogSpy).toHaveBeenCalledWith(clearedNpmCacheMessage);
        expect(consoleLogSpy).toHaveBeenCalledWith(installingNpmPackagesMessage);
        expect(consoleLogSpy).toHaveBeenCalledWith(installedNpmPackagesMessage);
        expect(rimrafPromise).toHaveBeenCalledTimes(1);
        expect(rimrafPromise).toHaveBeenCalledWith('./node_modules');
        expect(clearCacheSpy).toHaveBeenCalledTimes(1);
        expect(installSpy).toHaveBeenCalledTimes(1);
      });

      it('should only remove node modules if clearing caches throws', async () => {
        const error = new Error('rimraf error');
        rimrafPromise.mockImplementationOnce(() => Promise.reject(error));

        try {
          await cleaner();
        } catch (e) {
          expect(e).toEqual(error);
          expect(consoleLogSpy).toHaveBeenCalledTimes(1);
          expect(consoleLogSpy).toHaveBeenCalledWith(removingNodeModulesMessage);
          expect(rimrafPromise).toHaveBeenCalledTimes(1);
          expect(clearCacheSpy).not.toHaveBeenCalled();
          expect(installSpy).not.toHaveBeenCalled();
        }
      });

      it('should only remove node modules and clearing cache when install throws', async () => {
        const error = new Error('install error');
        rimrafPromise.mockImplementationOnce(() => Promise.resolve());
        clearCacheSpy = jest.spyOn(npmCommandManager, 'clearCache').mockReturnValue(Promise.resolve());
        installSpy = jest.spyOn(npmCommandManager, 'install').mockReturnValue(Promise.reject(error));

        try {
          await cleaner();
        } catch (e) {
          expect(e).toEqual(error);
          expect(consoleLogSpy).toHaveBeenCalledTimes(5);
          expect(consoleLogSpy).toHaveBeenCalledWith(removingNodeModulesMessage);
          expect(consoleLogSpy).toHaveBeenCalledWith(removedNodeModulesMessage);
          expect(consoleLogSpy).toHaveBeenCalledWith(clearingNpmCacheMessage);
          expect(consoleLogSpy).toHaveBeenCalledWith(clearedNpmCacheMessage);
          expect(consoleLogSpy).toHaveBeenCalledWith(installingNpmPackagesMessage);
          expect(rimrafPromise).toHaveBeenCalledTimes(1);
          expect(clearCacheSpy).toHaveBeenCalledTimes(1);
          expect(installSpy).toHaveBeenCalledTimes(1);
        }
      });
    });
  });
});
