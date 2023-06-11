import million from 'million/compiler'
export default million.next({
    swcMinify: true,
    reactStrictMode: false,
    poweredByHeader: false,

    optimize: true,
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: {
        // TODO SELF_HOST_ADDRESS: [...(require('os').networkInterfaces()['en0'])].find(({family}) => family.toLowerCase() === 'ipv4')['address']
    }
});
