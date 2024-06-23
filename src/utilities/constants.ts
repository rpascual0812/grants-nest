export type AvailableApplicationStatus =
    | 'Received Proposals'
    | 'Grants Team Review'
    | 'Advisers Review'
    | 'Budget Review and Finalization'
    | 'Financial Management Capacity'
    | 'Due Diligence';

export const AVAILABLE_APPLICATION_STATUS: AvailableApplicationStatus[] = [
    'Received Proposals',
    'Grants Team Review',
    'Advisers Review',
    'Budget Review and Finalization',
    'Financial Management Capacity',
    'Due Diligence',
];

export type AvailableProjectStatus =
    | 'Contract Preparation'
    | 'Final Approval'
    | 'Partner Signing'
    | 'Fund Release'
    | 'Completed';
export const AVAILABLE_PROJECT_STATUS: AvailableProjectStatus[] = [
    'Contract Preparation',
    'Final Approval',
    'Partner Signing',
    'Fund Release',
    'Completed',
];
