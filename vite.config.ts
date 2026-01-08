import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
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
		open: true,
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
});
