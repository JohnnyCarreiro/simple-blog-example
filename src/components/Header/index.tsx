import { ChangeEvent } from 'react'
import { useRouter } from 'next/router'

import { SignInButton } from './SignInButton'
import { ActiveLink } from './ActiveLink'

import styles from './styles.module.scss'

export const Header:React.FC = () => {
  const router = useRouter()
  const { locale } = router
  const changeLanguage = (e:ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    router.push(router.pathname, router.asPath, { locale });
  }

  return (
    <header className={styles.headerContainer} >
      <div className={styles.headerContent} >
        <img src="/images/logo.svg" alt="My Blog Logo"/>
        <nav>
          <ActiveLink activeClassName={styles.active} href="/" >
            <a>Home</a>
          </ActiveLink>

            {/*
          <ActiveLink activeClassName={styles.active} href=""  >
            <a>About</a>
          </ActiveLink>
          */}
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton/>
        <div className={styles.lang_switch} >
          <select
            onChange={changeLanguage}
            defaultValue={locale}
            className={styles.select}
          >
            <option className="text-black" value="en-us">EN - 🇺🇸</option>
            <option className="text-black" value="pt-br">PT - 🇧🇷</option>
          </select>
        </div>
      </div>
    </header>
  );
};

