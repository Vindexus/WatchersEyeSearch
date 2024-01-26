import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Page from '@/pages/Home';

const Router = () => {
	return <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
		<Routes>
			<Route
				path="/"
				element={<Page/>}
			/>
		</Routes>
	</BrowserRouter>
};


export default Router;
