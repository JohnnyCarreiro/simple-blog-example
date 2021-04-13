
import Document, { Head, Html, Main, NextScript } from 'next/document'
export default class Mydocument extends Document{
  render():JSX.Element{
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
          <meta name="theme-color" content="#673AB6" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
      )
    }
  }
