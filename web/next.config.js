// const withPreact = require('next-plugin-preact');
// const nextPwa = require("next-pwa")
// const assetManifest = require("next-assets-manifest");
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })

// const withPreact = require('next-plugin-preact');
module.exports = ({
    // dest: "public",
    // sw: "./serviceWorker.js",

    // swcMinify: true,
    reactStrictMode: false,
    poweredByHeader: false,
    // webpack: (conf) => ({...conf, topLevelAwait: true}),
    // Customize the client side manifest.
    // assetsManifestClient: {
    //     output: './public/client-manifest.json'
    // },
    typescript: {
        ignoreBuildErrors: true
    },
    env: {
        CHATS_NODE_ENV: "production",
        BUILD_TYPE: "web",

        "NODE_ENV": "production",
        // CHATS_NODE_ENV: "development",
        SELF_HOST_ADDRESS: ''//[...(require('os').networkInterfaces()['en0'])].find(({family}) => family.toLowerCase() === 'ipv4')['address']
    }
    // Customize the server side manifest.
    // assetsManifestServer: {
    //     output: './public/server-manifest.json'
    // }
    // webpack: (config, { dev, isServer }) => {
    //     if (!dev && !isServer) {
    //         Object.assign(config.resolve.alias, {
    //             react: 'preact/compat',
    //             'react-dom/test-utils': 'preact/test-utils',
    //             'react-dom': 'preact/compat',
    //         })
    //     }
    //     return config
    // },
});
