import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Firebase module
vi.mock('./src/lib/firebase', () => {
  return {
    auth: {
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    },
    db: {},
    googleProvider: {},
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInWithPopup: vi.fn(),
    onAuthStateChanged: vi.fn((authInstance, callback) => {
      callback({
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      });
      return () => {};
    }),
  };
});

// Mock firebase/firestore functions
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    initializeFirestore: vi.fn(),
    persistentLocalCache: vi.fn(),
    persistentMultipleTabManager: vi.fn(),
    doc: vi.fn(() => ({})),
    getDoc: vi.fn(() => Promise.resolve({
      exists: () => true,
      data: () => ({
        totalKarmaPoints: 100,
        userProfile: { name: 'Test User', email: 'test@example.com', avatar: 'icon-leaf', archetype: 'Carbon Pioneer' },
        ledgerEntries: [],
        weeklyChallenges: [],
      }),
    })),
    setDoc: vi.fn(() => Promise.resolve()),
  };
});

// Mock motion/react to disable animations in tests
vi.mock('motion/react', async () => {
  const React = await import('react');
  
  const motionMock = new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') {
        const Component = React.forwardRef(({ children, ...props }, ref) => {
          const cleanProps = { ...props };
          delete cleanProps.animate;
          delete cleanProps.initial;
          delete cleanProps.exit;
          delete cleanProps.transition;
          delete cleanProps.whileHover;
          delete cleanProps.whileTap;
          delete cleanProps.layoutId;
          
          return React.createElement(prop, { ...cleanProps, ref }, children);
        });
        Component.displayName = `motion.${prop}`;
        return Component;
      }
      return undefined;
    }
  });

  return {
    motion: motionMock,
    AnimatePresence: ({ children }) => children,
  };
});

