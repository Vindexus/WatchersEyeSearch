import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';

const Router = () => {
	return <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
		<Routes>
			<Route
				path="/"
				element={<Home/>}
			/>
		</Routes>
	</BrowserRouter>
};


export default Router;
