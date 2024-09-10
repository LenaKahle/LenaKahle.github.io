import Home from './pages/Home.svelte';
import CV from './pages/CV.svelte';
import Overview from './pages/Overview.svelte';
import Project from './pages/Project.svelte';

const routes = {
    '/': Home,
    '/cv': CV,
    // '/sewing': Overview,
    // '/photography': Overview,
    // '/printmaking': Overview,
    // '/programming': Overview,
    '/:category/:project?': Overview,
};
  
export default routes;
  