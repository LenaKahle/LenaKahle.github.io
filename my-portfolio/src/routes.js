import Home from './pages/Home.svelte';
import About from './pages/About.svelte';
import CV from './pages/CV.svelte';
import Overview from './pages/Overview.svelte';
import Project from './pages/Project.svelte';

const routes = {
    '/': Home,
    '/about': About,
    '/cv': CV,
    '/sewing': Overview,
    '/photography': Overview,
    '/printmaking': Overview,
    '/programming': Overview,
    '/:category/:title': Project,
};
  
export default routes;
  