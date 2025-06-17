import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.container}>
      <div className="Header_eventFlow">이벤트 창</div>
      <h1>헤더입니다</h1>
    </header>
  );
}
