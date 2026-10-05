import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CaseSubjectsPage } from './index.tsx';
import { setupApiMocks } from './CaseSubjectsPage.test-data.ts';

vi.mock('../../features/caseSubjects/api/caseApi/caseApi.ts', () => ({
  caseApi: { getById: vi.fn() },
}));

vi.mock('../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.ts', () => ({
  caseSubjectApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

vi.mock('../../features/subjects/api/subjectApi/subjectApi.ts', () => ({
  subjectApi: { getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn() },
}));

vi.mock('../../features/codelists/api/codelistApi/codelistApi.ts', () => ({
  codelistApi: { getByName: vi.fn() },
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/spisy/2026-001/subjekty']}>
        <Routes>
          <Route path="/spisy/:caseId/subjekty" element={<CaseSubjectsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CaseSubjectsPage', () => {
  beforeEach(() => {
    setupApiMocks();
  });

  it('renders the groups and rows', async () => {
    renderPage();

    expect(await screen.findByRole('button', { name: 'INVESTIT Group' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adam Masaryk' })).toBeInTheDocument();
    expect(screen.getByText('Klient')).toBeInTheDocument();
    expect(screen.getByText('Protistrana')).toBeInTheDocument();
    expect(screen.getByText('Zúčastněné subjekty')).toBeInTheDocument();
    expect(screen.getByText('Rozhodující orgány')).toBeInTheDocument();
    expect(
      screen.getByText('Právní zástupce: JUDr. Pavel Tomášek, IČO 155322365'),
    ).toBeInTheDocument();
  });

  it('opens the detail of the selected subject', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Adam Masaryk' }));

    expect(await screen.findByRole('heading', { name: 'Adam Masaryk' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Detail subjektu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adam Masaryk' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });
});
