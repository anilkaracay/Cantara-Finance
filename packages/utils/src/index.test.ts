import { describe, it, expect } from 'vitest';
import { logger } from './index';

describe('Logger', () => {
    it('should be defined', () => {
        expect(logger).toBeDefined();
    });
});
