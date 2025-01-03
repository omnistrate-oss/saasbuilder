import styles from "./styles.module.css";

function CookiePolicyTable({ orgName }) {
  return (
    <table className={styles.table} border={1} cellSpacing={0} cellPadding={5}>
      <colgroup>
        <col span={1} style={{ width: "25%" }} />
        <col span={1} style={{ width: "45%" }} />
        <col span={1} style={{ width: "30%" }} />
      </colgroup>
      <thead className={styles.headerRow}>
        <tr>
          <th className={styles.headerCell}>Cookie Category</th>
          <th className={styles.headerCell}>Description</th>
          <th className={styles.headerCell}>Provider</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.cell}>Strictly Necessary Cookies</td>
          <td className={styles.cell}>
            These cookies are essential for the functionality of our website and
            cannot be switched off in our systems. They are typically set in
            response to actions you take, such as logging in or setting privacy
            preferences. While you can configure your browser to block these
            cookies, some parts of the website may not function properly.
            Example: token
          </td>
          <td className={styles.cell}>{orgName}</td>
        </tr>
        <tr>
          <td className={styles.cell}>Analytics Cookies</td>
          <td className={styles.cell}>
            These cookies help us understand how visitors interact with our
            websites by collecting and reporting information. They allow us to
            measure and improve the performance of our services. Examples:
            Google Analytics (_ga, _ga_*, _gid) and Koala Analytics (ko_id,
            ko_sid).
          </td>
          <td className={styles.cell}>{orgName}, Google Analytics</td>
        </tr>
      </tbody>
    </table>
  );
}

export default CookiePolicyTable;
