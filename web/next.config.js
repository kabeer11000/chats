module.exports = ({
    swcMinify: true,
    reactStrictMode: false,
    poweredByHeader: false,
    typescript: {
        ignoreBuildErrors: true
    },
    env: {
        // TODO SELF_HOST_ADDRESS: [...(require('os').networkInterfaces()['en0'])].find(({family}) => family.toLowerCase() === 'ipv4')['address']
    }
});
