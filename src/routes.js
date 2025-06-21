import Home from './pages/Home.svelte';
import CV from './pages/CV.svelte';
import Overview from './pages/Overview.svelte';
import Blog from './pages/Blog.svelte';
import BlogPost from './pages/BlogPost.svelte';

const routes = {
    '/': Home,
    '/cv': CV,
    '/blog': Blog,
    '/blog/:blog-post': BlogPost,
    '/:category': Overview,
};
  
export default routes;
  