/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app', 'components', 'constants', 'hooks', 'lib', 'types'],
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
