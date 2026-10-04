import columnStyles from '../../../../styles/caseSubjectListColumns.module.scss';
import styles from './CaseSubjectListHeader.module.scss';

export function CaseSubjectListHeader() {
  return (
    <thead className={styles.caseSubjectListHeader}>
      <tr>
        <th scope="col">Označení</th>
        <th className={columnStyles.caseSubjectList__identification} scope="col">
          Identifikace
        </th>
        <th className={columnStyles.caseSubjectList__materialLegalRole} scope="col">
          Hmotně právní role
        </th>
        <th className={columnStyles.caseSubjectList__proceduralRole} scope="col">
          Procesní role
        </th>
        <th className={columnStyles.caseSubjectList__caseFileNumber} scope="col">
          Spisová značka
        </th>
        <th className={columnStyles.caseSubjectList__actions} scope="col">
          <span className="visuallyHidden">Akce</span>
        </th>
      </tr>
    </thead>
  );
}
