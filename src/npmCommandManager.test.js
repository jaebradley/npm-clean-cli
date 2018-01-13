import childProcessPromise from 'child-process-promise';
import { clearCache, install } from './npmCommandManager';


describe('npmCommandManager', () => {
  let spawnSpy;

  const spawnResponse = 'spawned a command';
  const options = { stdio: 'inherit', shell: true };

  beforeEach(() => {
    spawnSpy = jest.spyOn(childProcessPromise, 'spawn').mockReturnValue(Promise.resolve(spawnResponse));
  });

  afterEach(() => {
    spawnSpy.mockRestore();
  });

  describe('clearCache', () => {
    it('should spawn npm cache clean command', async () => {
      const response = await clearCache();

      expect(response).toEqual(spawnResponse);
      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenCalledWith('npm cache clean --force', options);
    });
  });

  describe('install', () => {
    it('should spawn npm install', async () => {
      const response = await install();

      expect(response).toEqual(spawnResponse);
      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenCalledWith('npm install', options);
    });
  });
});
