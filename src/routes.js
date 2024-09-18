import Home from './pages/Home.svelte';
import CV from './pages/CV.svelte';
import Overview from './pages/Overview.svelte';

const routes = {
    '/': Home,
    '/cv': CV,
    '/:category': Overview,
};
  
export default routes;
  