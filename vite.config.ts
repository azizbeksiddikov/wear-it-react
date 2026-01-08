import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd(), '');
	const apiUrl = env.VITE_API_URL?.replace(/\/$/, '') || 'https://wearit.admin.azbek.me';

	return {
		plugins: [
			react(),
			tsconfigPaths(),
			// Pre-compress assets to Gzip (improves load time without server-side overhead)
			compression({
				algorithm: 'gzip',
				ext: '.gz',
				threshold: 10240, // 10KB
			}),
			// Optimize images during build
			ViteImageOptimizer({
				test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
				png: { quality: 80 },
				jpeg: { quality: 80 },
				jpg: { quality: 80 },
				webp: { quality: 80 },
			}),
		],
		server: {
			port: 3000,
			open: false,
			host: true,
			proxy: {
				'/api': {
					target: apiUrl,
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/api/, ''),
					configure: (proxy, _options) => {
						proxy.on('error', (err, _req, _res) => {
							console.log('proxy error', err);
						});
						proxy.on('proxyReq', (proxyReq, req, _res) => {
							console.log('Sending Request to the Target:', req.method, req.url);
						});
						proxy.on('proxyRes', (proxyRes, req, _res) => {
							console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
						});
					},
				},
			},
		},
		build: {
			outDir: 'build',
			// Optimize chunk size warning and report compressed size
			chunkSizeWarningLimit: 600,
			reportCompressedSize: true,
			minify: 'esbuild',
			rollupOptions: {
				output: {
					manualChunks: {
						'vendor-react': ['react', 'react-dom', 'react-router-dom'],
						'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
						'vendor-utils': ['axios', 'moment', 'sweetalert2', 'swiper'],
					},
				},
			},
		},
	};
});
