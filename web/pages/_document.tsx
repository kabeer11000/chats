import Document, {Head, Html, Main, NextScript} from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="manifest" href="/manifest.json"/>
                    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png"/>
                    <meta name="theme-color" content="#5549EA"/>
                    <meta name="application-name" content="Chats"/>
                    <meta name="apple-mobile-web-app-capable" content="yes"/>
                    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                    <meta name="apple-mobile-web-app-title" content="Chats"/>
                    <meta name="description" content="Free email chats app"/>
                    <meta name="format-detection" content="telephone=no"/>
                    <meta name="mobile-web-app-capable" content="yes"/>
                    <link rel="apple-touch-icon" href="/images/icon-512-maskable.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/images/icon-192-maskable.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/images/icon-192-maskable.png"/>
                    <link rel="mask-icon" href="/images/icon-192-maskable.png" color="#5bbad5"/>
                    <link rel="shortcut icon" href="/favicon.ico"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>

                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:url" content="https://chats.kabeersnetwork.tk"/>
                    <meta name="twitter:title" content="Chats"/>
                    <meta name="twitter:description" content="Free and opensource email chat app"/>
                    <meta name="twitter:image"
                          content="https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/vms-emulated/752036691c73fe3d2094ece33731358d.jpg"/>
                    <meta name="twitter:creator" content="@ChesticleHunter"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:title" content="Kabeer Chats"/>
                    <meta property="og:description" content="Free and opensource email chat app"/>
                    <meta property="og:site_name" content="Kabeer Chats"/>
                    <meta property="og:url" content="https://chats.kabeersnetwork.tk"/>
                    <meta property="og:image"
                          content="https://kabeers-papers-pdf2image.000webhostapp.com/kabeer-chats-storage/vms-emulated/752036691c73fe3d2094ece33731358d.jpg"/>
                </Head>
                <body>
                {/* @ts-ignore */}
                <kn-utils-canvas>
                    <canvas id={"compression-canvas"} style={{display: "none"}}/>
                    {/* @ts-ignore */}
                </kn-utils-canvas>
                <Main/>
                {/* @ts-ignore */}
                <NextScript/>
                </body>
            </Html>
        );
    }
}
export default MyDocument;