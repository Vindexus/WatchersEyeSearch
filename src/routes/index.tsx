import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';

const Router = () => {
	console.log('router')
	return <BrowserRouter basename={'/WatchersEyeSearch'}>
		<Routes>
			<Route
				path="/"
				element={<Home/>}
			/>
		</Routes>
	</BrowserRouter>
};


export default Router;
