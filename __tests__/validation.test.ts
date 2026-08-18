import { describe, it, expect } from 'vitest';

// Test validation logic that mirrors the server-side validation
function validateCreateTask(input: unknown): boolean {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (!obj.title || typeof obj.title !== 'string') return false;
  if (obj.title.trim().length === 0) return false;
  if (obj.title.length > 100) return false;
  if (obj.description !== undefined && typeof obj.description !== 'string') return false;
  return true;
}

function validateUpdateTask(input: unknown): boolean {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (obj.title !== undefined) {
    if (typeof obj.title !== 'string' || obj.title.trim().length === 0 || obj.title.length > 100) {
      return false;
    }
  }
  if (obj.description !== undefined && typeof obj.description !== 'string') {
    return false;
  }
  if (obj.completed !== undefined && typeof obj.completed !== 'boolean') {
    return false;
  }
  return true;
}

describe('Validation', () => {
  describe('validateCreateTask', () => {
    it('should accept valid task with title only', () => {
      expect(validateCreateTask({ title: 'Test Task' })).toBe(true);
    });

    it('should accept valid task with title and description', () => {
      expect(validateCreateTask({ title: 'Test Task', description: 'A description' })).toBe(true);
    });

    it('should reject empty object', () => {
      expect(validateCreateTask({})).toBe(false);
    });

    it('should reject missing title', () => {
      expect(validateCreateTask({ description: 'test' })).toBe(false);
    });

    it('should reject empty title', () => {
      expect(validateCreateTask({ title: '' })).toBe(false);
    });

    it('should reject whitespace-only title', () => {
      expect(validateCreateTask({ title: '   ' })).toBe(false);
    });

    it('should reject title over 100 characters', () => {
      expect(validateCreateTask({ title: 'a'.repeat(101) })).toBe(false);
    });

    it('should accept title exactly 100 characters', () => {
      expect(validateCreateTask({ title: 'a'.repeat(100) })).toBe(true);
    });

    it('should reject non-string description', () => {
      expect(validateCreateTask({ title: 'Test', description: 123 })).toBe(false);
    });

    it('should reject null input', () => {
      expect(validateCreateTask(null)).toBe(false);
    });

    it('should reject array input', () => {
      expect(validateCreateTask(['test'])).toBe(false);
    });
  });

  describe('validateUpdateTask', () => {
    it('should accept valid update with title', () => {
      expect(validateUpdateTask({ title: 'Updated Title' })).toBe(true);
    });

    it('should accept valid update with completed', () => {
      expect(validateUpdateTask({ completed: true })).toBe(true);
    });

    it('should accept valid update with description', () => {
      expect(validateUpdateTask({ description: 'New description' })).toBe(true);
    });

    it('should accept multiple fields', () => {
      expect(validateUpdateTask({ title: 'Title', completed: false, description: 'Desc' })).toBe(true);
    });

    it('should reject empty title', () => {
      expect(validateUpdateTask({ title: '' })).toBe(false);
    });

    it('should reject non-boolean completed', () => {
      expect(validateUpdateTask({ completed: 'true' as unknown as boolean })).toBe(false);
    });

    it('should reject non-string description', () => {
      expect(validateUpdateTask({ description: 123 as unknown as string })).toBe(false);
    });

    it('should reject null input', () => {
      expect(validateUpdateTask(null)).toBe(false);
    });

    it('should accept empty object (no updates)', () => {
      expect(validateUpdateTask({})).toBe(true);
    });
  });
});
