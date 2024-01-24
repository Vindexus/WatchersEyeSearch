import {ToastContainer} from 'react-toastify';
import React from 'react'
import {PageContextProvider} from './usePageContext'
import type {PageContext} from 'vike/types'
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles.css';

export { PageShell }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
	return (
		<React.StrictMode>
			<PageContextProvider pageContext={pageContext}>
				<div>
					<div className="App w-full flex flex-col items-center justify-start min-h-screen bg-gray-900 text-gray-400">
						{children}
						<div style={{display: "none"}} className={'bg-gray-500 bg-gray-800'}></div>
					</div>
					<ToastContainer />
				</div>
			</PageContextProvider>
		</React.StrictMode>
	)
}
