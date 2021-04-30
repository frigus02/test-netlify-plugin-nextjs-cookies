import Head from "next/head";
import styles from "../styles/Home.module.css";

const setCookies = () => {
  document.cookie = "first=1; path=/; secure; samesite=lax";
  document.cookie = "second=2; path=/; secure; samesite=lax";
  window.location.reload();
};

export default function Home({ cookies }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>netlify-plugin-nextjs cookie test</title>
      </Head>
      <main className={styles.main}>
        <h1>Cookies from server</h1>
        {cookies}
        <h1>Set some</h1>
        <button onClick={setCookies}>Set cookies and reload</button>
      </main>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  return {
    props: {
      cookies: JSON.stringify(context.req.headers.cookie, null, 2) ?? null,
    },
  };
};
