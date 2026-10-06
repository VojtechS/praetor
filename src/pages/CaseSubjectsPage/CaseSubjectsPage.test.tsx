import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { caseSubjectApi } from '../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.ts';
import { CaseSubjectsPage } from './index.tsx';
import { CASE_ID, setupApiMocks } from './CaseSubjectsPage.test-data.ts';

vi.mock('../../features/caseSubjects/api/caseApi/caseApi.ts', () => ({
  caseApi: { getById: vi.fn() },
}));

vi.mock('../../features/caseSubjects/api/caseSubjectApi/caseSubjectApi.ts', () => ({
  caseSubjectApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));

vi.mock('../../features/codelists/api/codelistApi/codelistApi.ts', () => ({
  codelistApi: { getByName: vi.fn() },
}));

vi.mock('../../features/subjects/api/subjectApi/subjectApi.ts', () => ({
  subjectApi: { getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn() },
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/spisy/${CASE_ID}/subjekty`]}>
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

  it('shows the case title and subjects grouped by role', async () => {
    renderPage();

    expect(await screen.findByRole('button', { name: 'Adam Masaryk' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jakub Radil' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Klient/ })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Protistrana/ })).toBeInTheDocument();
    expect(await screen.findByText('2026/001 — Testovací spis')).toBeInTheDocument();
  });

  it('shows an empty state when the case has no subjects', async () => {
    setupApiMocks([]);
    renderPage();

    expect(await screen.findByText('Žádné subjekty na spisu')).toBeInTheDocument();
  });

  it('opens and closes the subject detail', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Jakub Radil' }));

    const detail = await screen.findByRole('complementary', { name: 'Detail subjektu' });
    expect(await within(detail).findByRole('heading', { name: 'Jakub Radil' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zavřít detail subjektu' }));

    expect(
      screen.queryByRole('complementary', { name: 'Detail subjektu' }),
    ).not.toBeInTheDocument();
  });

  it('removes a subject from the case after confirmation', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('button', { name: 'Adam Masaryk' });
    await user.click(
      screen.getAllByRole('menuitem', { name: 'Odstranit subjekt ze spisu', hidden: true })[0],
    );

    const dialog = await screen.findByRole('dialog', { name: 'Odebrat subjekt ze spisu' });
    await user.click(within(dialog).getByRole('button', { name: 'Odebrat' }));

    expect(caseSubjectApi.remove).toHaveBeenCalledWith(CASE_ID, 1);
  });

  it('sets the main payer from the row menu', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByRole('button', { name: 'Jakub Radil' });
    await user.click(
      screen.getAllByRole('menuitem', { name: 'Nastavit jako hlavního plátce', hidden: true })[1],
    );

    expect(caseSubjectApi.update).toHaveBeenCalledWith(CASE_ID, 2, { isMainPayer: true });
  });
});
