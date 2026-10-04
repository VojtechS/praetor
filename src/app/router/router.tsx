import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { CaseSubjectsPage } from '../../pages/CaseSubjectsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/spisy/2026-001/subjekty" replace /> },
      { path: 'spisy/:caseId/subjekty', element: <CaseSubjectsPage /> },
    ],
  },
]);
