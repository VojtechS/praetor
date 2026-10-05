import columnStyles from '../../../../styles/caseSubjectListColumns.module.scss';
import styles from './CaseSubjectListHeader.module.scss';

export function CaseSubjectListHeader() {
  return (
    <div role="rowgroup">
      <div
        role="row"
        className={`${styles.caseSubjectListHeader} ${columnStyles.caseSubjectListGrid}`}
      >
        <div role="columnheader">Označení</div>
        <div role="columnheader">Identifikace</div>
        <div role="columnheader">Hmotně právní role</div>
        <div role="columnheader">Procesní role</div>
        <div role="columnheader">Spisová značka</div>
        <div role="columnheader">
          <span className="visuallyHidden">Akce</span>
        </div>
      </div>
    </div>
  );
}
