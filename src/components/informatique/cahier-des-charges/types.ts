// Re-export types from centralized specifications types
export type {
  SpecificationMetadata,
  SpecificationSection,
  SpecificationType,
  SpecificationStatisticsType
} from '@/types/specifications';

export {
  documentToSpecification,
  specificationToCreateDocument,
  specificationToUpdateDocument
} from '@/types/specifications';
