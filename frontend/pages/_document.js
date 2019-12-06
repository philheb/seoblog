import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='UTF-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <link
            rel='stylesheet'
            href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css'
          />
          {/* <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css'
          /> */}
          <link
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
            rel='stylesheet'
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

export default MyDocument;
