import styles from './styles.module.scss'

export const Header:React.FC = () => {
  return (
    <header className={styles.headerContainer} >
      <div className={styles.headerContent} >
        <img src="/images/logo.svg" alt="My Blog Logo"/>
        <nav>
          <a className={styles.active} href="">Home</a>
          {/* <a href="">About</a> */}
          <a href="">Posts</a>
        </nav>
      </div>
    </header>
  );
};

