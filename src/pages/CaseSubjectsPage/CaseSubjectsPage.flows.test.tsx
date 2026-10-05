import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
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

describe('CaseSubjectsPage flows', () => {
  beforeEach(() => {
    setupApiMocks();
  });

  it('adds an existing subject to the case', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Přidat subjekt' }));
    const roleDialog = screen.getByRole('dialog', { name: 'Přidání/editace subjektu' });
    await user.click(within(roleDialog).getByRole('button', { name: /Subjekt \/ osoba/ }));

    await user.click(await within(roleDialog).findByRole('row', { name: /Mgr\. Filip Petr/ }));

    expect(await within(roleDialog).findByText('Mgr. Filip Petr')).toBeInTheDocument();
    await user.click(within(roleDialog).getByRole('button', { name: 'Uložit' }));

    expect(await screen.findByRole('link', { name: 'Mgr. Filip Petr' })).toBeInTheDocument();
  });

  it('opens the subject card from the row actions without selecting the row', async () => {
    const user = userEvent.setup();
    renderPage();

    const row = (await screen.findByRole('link', { name: 'Marek Horáček' })).closest<HTMLElement>(
      '[role="row"]',
    )!;
    await user.click(within(row).getByRole('button', { name: 'Otevřít' }));

    expect(await screen.findByRole('dialog', { name: 'Marek Horáček' })).toBeInTheDocument();
    expect(
      within(row).getByRole('link', { name: 'Marek Horáček', hidden: true }),
    ).not.toHaveAttribute('aria-current');
  });

  it('removes a subject from the case after a confirmation', async () => {
    const user = userEvent.setup();
    renderPage();

    const row = (await screen.findByRole('link', { name: 'Marek Horáček' })).closest<HTMLElement>(
      '[role="row"]',
    )!;
    await user.click(within(row).getByRole('button', { name: 'Další akce' }));
    await user.click(
      within(row).getByRole('menuitem', { name: 'Odstranit subjekt ze spisu', hidden: true }),
    );
    const confirm = screen.getByRole('dialog', { name: 'Odebrat subjekt ze spisu' });
    await user.click(within(confirm).getByRole('button', { name: 'Odebrat' }));

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Marek Horáček' })).not.toBeInTheDocument();
    });
  });
});
