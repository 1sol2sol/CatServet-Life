import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <meta property="og:description" content="집사들의 정보공유 모임" />
          <meta property="author" content="Hansol" />
          <meta property="og:title" content="집사생활" />
          <link
            rel="shortcut icon"
            sizes="16x16 32x32 64x64"
            href="/cat.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}