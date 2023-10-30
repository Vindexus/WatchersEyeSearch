import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
	const myEnv = loadEnv(mode, process.cwd())

	const htmlPlugin = () => {
		return {
			name: "html-transform",
			transformIndexHtml(html: string) {
				return html.replace(/%(.*?)%/g, function (match, p1) {
					return myEnv[p1];
				});
			},
		};
	};

	return defineConfig({
		base: myEnv.VITE_BASENAME || '/',
		plugins: [htmlPlugin(), react(), tsconfigPaths()],
	})
}
