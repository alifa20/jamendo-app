export const useAudioPlayer = jest.fn((source: string | object) => {
  const sourceUrl = typeof source === 'string' ? source : '';
  const isInvalidUrl = sourceUrl.includes('invalid');

  // Each instance gets its own state
  let playing = false;

  const mockPlayer = {
    get playing() {
      return playing;
    },
    play: jest.fn(() => {
      if (isInvalidUrl) {
        throw new Error('Failed to load audio');
      }
      playing = true;
    }),
    pause: jest.fn(() => {
      playing = false;
    }),
    addListener: jest.fn((event: string, callback: () => void) => {
      if (isInvalidUrl && event === 'error') {
        setTimeout(callback, 0);
      }
      return {
        remove: jest.fn(),
      };
    }),
  };

  return mockPlayer;
});

export const AudioSource = {};
