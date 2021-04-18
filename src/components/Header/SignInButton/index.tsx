import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'

export const SignInButton:React.FC = () => {
  const isUserLogedIn = true
  return isUserLogedIn ? (
    <button
        type="button"
        className={styles.signInButton}
      >
        <FaGithub color="#04D361" />
        JohnnyCarreiro
        <FiX color="#737380" className={styles.closeIcon} />
      </button>
  ):(
    <button
        type="button"
        className={styles.signInButton}
      >
        <FaGithub color="#EBA417" />
        Sign In with github
      </button>
  )
}
