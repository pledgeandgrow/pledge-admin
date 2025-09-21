/**
 * @deprecated This service is deprecated. Use dataService from @/services/dataService instead.
 * This file exists only to fix lint errors from previous references.
 */

import { Test } from '@/components/informatique/test-et-validation/types';

// Mock implementation to satisfy TypeScript
export const createTest = async () => {};
export const updateTest = async () => {};
export const deleteTest = async () => {};
export const getTests = async (): Promise<Test[]> => {
  return [];
};

export default {
  createTest,
  updateTest,
  deleteTest,
  getTests
};
