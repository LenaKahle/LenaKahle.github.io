var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function l(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let i,c;function a(t,e){return t===e||(i||(i=document.createElement("a")),i.href=e,t===i.href)}function u(t,n,o,r){return t[1]&&r?e(o.ctx.slice(),t[1](r(n))):o.ctx}function f(t,e){t.appendChild(e)}function d(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode&&t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function $(){return m(" ")}function w(){return m("")}function v(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}function b(t,e,n,o){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function k(t,e,n){t.classList.toggle(e,!!n)}function _(t,e){return new t(e)}function j(t){c=t}function E(){if(!c)throw new Error("Function called outside component initialization");return c}function L(t){E().$$.on_mount.push(t)}function S(t){E().$$.on_destroy.push(t)}function C(){const t=E();return(e,n,{cancelable:o=!1}={})=>{const r=t.$$.callbacks[e];if(r){const l=function(t,e,{bubbles:n=!1,cancelable:o=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:o})}(e,n,{cancelable:o});return r.slice().forEach((e=>{e.call(t,l)})),!l.defaultPrevented}return!0}}function O(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const z=[],A=[];let P=[];const M=[],T=Promise.resolve();let I=!1;function N(){I||(I=!0,T.then(q))}function H(){return N(),T}function B(t){P.push(t)}const D=new Set;let R=0;function q(){if(0!==R)return;const t=c;do{try{for(;R<z.length;){const t=z[R];R++,j(t),K(t.$$)}}catch(t){throw z.length=0,R=0,t}for(j(null),z.length=0,R=0;A.length;)A.pop()();for(let t=0;t<P.length;t+=1){const e=P[t];D.has(e)||(D.add(e),e())}P.length=0}while(z.length);for(;M.length;)M.pop()();I=!1,D.clear(),j(t)}function K(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(B)}}const F=new Set;let X;function Y(){X={r:0,c:[],p:X}}function V(){X.r||r(X.c),X=X.p}function W(t,e){t&&t.i&&(F.delete(t),t.i(e))}function G(t,e,n,o){if(t&&t.o){if(F.has(t))return;F.add(t),X.c.push((()=>{F.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function J(t){return void 0!==t?.length?t:Array.from(t)}function U(t,e){const n={},o={},r={$$scope:1};let l=t.length;for(;l--;){const s=t[l],i=e[l];if(i){for(const t in s)t in i||(o[t]=1);for(const t in i)r[t]||(n[t]=i[t],r[t]=1);t[l]=i}else for(const t in s)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}function Q(t){return"object"==typeof t&&null!==t?t:{}}function Z(t){t&&t.c()}function tt(t,e,o){const{fragment:s,after_update:i}=t.$$;s&&s.m(e,o),B((()=>{const e=t.$$.on_mount.map(n).filter(l);t.$$.on_destroy?t.$$.on_destroy.push(...e):r(e),t.$$.on_mount=[]})),i.forEach(B)}function et(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];P.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),P=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function nt(e,n,l,s,i,a,u=null,f=[-1]){const d=c;j(e);const g=e.$$={fragment:null,ctx:[],props:a,update:t,not_equal:i,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:o(),dirty:f,skip_bound:!1,root:n.target||d.$$.root};u&&u(g.root);let h=!1;if(g.ctx=l?l(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return g.ctx&&i(g.ctx[t],g.ctx[t]=r)&&(!g.skip_bound&&g.bound[t]&&g.bound[t](r),h&&function(t,e){-1===t.$$.dirty[0]&&(z.push(t),N(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(e,t)),n})):[],g.update(),h=!0,r(g.before_update),g.fragment=!!s&&s(g.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);g.fragment&&g.fragment.l(t),t.forEach(p)}else g.fragment&&g.fragment.c();n.intro&&W(e.$$.fragment),tt(e,n.target,n.anchor),q()}j(d)}class ot{$$=void 0;$$set=void 0;$destroy(){et(this,1),this.$destroy=t}$on(e,n){if(!l(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");const rt=[];function lt(t,e){return{subscribe:st(t,e).subscribe}}function st(e,n=t){let o;const r=new Set;function l(t){if(s(e,t)&&(e=t,o)){const t=!rt.length;for(const t of r)t[1](),rt.push(t,e);if(t){for(let t=0;t<rt.length;t+=2)rt[t][0](rt[t+1]);rt.length=0}}}function i(t){l(t(e))}return{set:l,update:i,subscribe:function(s,c=t){const a=[s,c];return r.add(a),1===r.size&&(o=n(l,i)||t),s(e),()=>{r.delete(a),0===r.size&&o&&(o(),o=null)}}}}function it(e,n,o){const s=!Array.isArray(e),i=s?[e]:e;if(!i.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const c=n.length<2;return lt(o,((e,o)=>{let a=!1;const u=[];let f=0,d=t;const p=()=>{if(f)return;d();const r=n(s?u[0]:u,e,o);c?e(r):d=l(r)?r:t},g=i.map(((e,n)=>function(e,...n){if(null==e){for(const t of n)t(void 0);return t}const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(e,(t=>{u[n]=t,f&=~(1<<n),a&&p()}),(()=>{f|=1<<n}))));return a=!0,p(),function(){r(g),d(),a=!1}}))}function ct(t){let n,o,r;const l=[t[2]];var s=t[0];function i(t,n){let o={};for(let t=0;t<l.length;t+=1)o=e(o,l[t]);return void 0!==n&&4&n&&(o=e(o,U(l,[Q(t[2])]))),{props:o}}return s&&(n=_(s,i(t)),n.$on("routeEvent",t[7])),{c(){n&&Z(n.$$.fragment),o=w()},m(t,e){n&&tt(n,t,e),d(t,o,e),r=!0},p(t,e){if(1&e&&s!==(s=t[0])){if(n){Y();const t=n;G(t.$$.fragment,1,0,(()=>{et(t,1)})),V()}s?(n=_(s,i(t,e)),n.$on("routeEvent",t[7]),Z(n.$$.fragment),W(n.$$.fragment,1),tt(n,o.parentNode,o)):n=null}else if(s){const o=4&e?U(l,[Q(t[2])]):{};n.$set(o)}},i(t){r||(n&&W(n.$$.fragment,t),r=!0)},o(t){n&&G(n.$$.fragment,t),r=!1},d(t){t&&p(o),n&&et(n,t)}}}function at(t){let n,o,r;const l=[{params:t[1]},t[2]];var s=t[0];function i(t,n){let o={};for(let t=0;t<l.length;t+=1)o=e(o,l[t]);return void 0!==n&&6&n&&(o=e(o,U(l,[2&n&&{params:t[1]},4&n&&Q(t[2])]))),{props:o}}return s&&(n=_(s,i(t)),n.$on("routeEvent",t[6])),{c(){n&&Z(n.$$.fragment),o=w()},m(t,e){n&&tt(n,t,e),d(t,o,e),r=!0},p(t,e){if(1&e&&s!==(s=t[0])){if(n){Y();const t=n;G(t.$$.fragment,1,0,(()=>{et(t,1)})),V()}s?(n=_(s,i(t,e)),n.$on("routeEvent",t[6]),Z(n.$$.fragment),W(n.$$.fragment,1),tt(n,o.parentNode,o)):n=null}else if(s){const o=6&e?U(l,[2&e&&{params:t[1]},4&e&&Q(t[2])]):{};n.$set(o)}},i(t){r||(n&&W(n.$$.fragment,t),r=!0)},o(t){n&&G(n.$$.fragment,t),r=!1},d(t){t&&p(o),n&&et(n,t)}}}function ut(t){let e,n,o,r;const l=[at,ct],s=[];function i(t,e){return t[1]?0:1}return e=i(t),n=s[e]=l[e](t),{c(){n.c(),o=w()},m(t,n){s[e].m(t,n),d(t,o,n),r=!0},p(t,[r]){let c=e;e=i(t),e===c?s[e].p(t,r):(Y(),G(s[c],1,1,(()=>{s[c]=null})),V(),n=s[e],n?n.p(t,r):(n=s[e]=l[e](t),n.c()),W(n,1),n.m(o.parentNode,o))},i(t){r||(W(n),r=!0)},o(t){G(n),r=!1},d(t){t&&p(o),s[e].d(t)}}}function ft(){const t=window.location.href.indexOf("#/");let e=t>-1?window.location.href.substr(t+1):"/";const n=e.indexOf("?");let o="";return n>-1&&(o=e.substr(n+1),e=e.substr(0,n)),{location:e,querystring:o}}const dt=lt(null,(function(t){t(ft());const e=()=>{t(ft())};return window.addEventListener("hashchange",e,!1),function(){window.removeEventListener("hashchange",e,!1)}}));it(dt,(t=>t.location)),it(dt,(t=>t.querystring));const pt=st(void 0);function gt(t,e,n){let{routes:o={}}=e,{prefix:r=""}=e,{restoreScrollState:l=!1}=e;class s{constructor(t,e){if(!e||"function"!=typeof e&&("object"!=typeof e||!0!==e._sveltesparouter))throw Error("Invalid component object");if(!t||"string"==typeof t&&(t.length<1||"/"!=t.charAt(0)&&"*"!=t.charAt(0))||"object"==typeof t&&!(t instanceof RegExp))throw Error('Invalid value for "path" argument - strings must start with / or *');const{pattern:n,keys:o}=function(t,e){if(t instanceof RegExp)return{keys:!1,pattern:t};var n,o,r,l,s=[],i="",c=t.split("/");for(c[0]||c.shift();r=c.shift();)"*"===(n=r[0])?(s.push("wild"),i+="/(.*)"):":"===n?(o=r.indexOf("?",1),l=r.indexOf(".",1),s.push(r.substring(1,~o?o:~l?l:r.length)),i+=~o&&!~l?"(?:/([^/]+?))?":"/([^/]+?)",~l&&(i+=(~o?"?":"")+"\\"+r.substring(l))):i+="/"+r;return{keys:s,pattern:new RegExp("^"+i+(e?"(?=$|/)":"/?$"),"i")}}(t);this.path=t,"object"==typeof e&&!0===e._sveltesparouter?(this.component=e.component,this.conditions=e.conditions||[],this.userData=e.userData,this.props=e.props||{}):(this.component=()=>Promise.resolve(e),this.conditions=[],this.props={}),this._pattern=n,this._keys=o}match(t){if(r)if("string"==typeof r){if(!t.startsWith(r))return null;t=t.substr(r.length)||"/"}else if(r instanceof RegExp){const e=t.match(r);if(!e||!e[0])return null;t=t.substr(e[0].length)||"/"}const e=this._pattern.exec(t);if(null===e)return null;if(!1===this._keys)return e;const n={};let o=0;for(;o<this._keys.length;){try{n[this._keys[o]]=decodeURIComponent(e[o+1]||"")||null}catch(t){n[this._keys[o]]=null}o++}return n}async checkConditions(t){for(let e=0;e<this.conditions.length;e++)if(!await this.conditions[e](t))return!1;return!0}}const i=[];o instanceof Map?o.forEach(((t,e)=>{i.push(new s(e,t))})):Object.keys(o).forEach((t=>{i.push(new s(t,o[t]))}));let c=null,a=null,u={};const f=C();async function d(t,e){await H(),f(t,e)}let p=null,g=null;var h;l&&(g=t=>{p=t.state&&(t.state.__svelte_spa_router_scrollY||t.state.__svelte_spa_router_scrollX)?t.state:null},window.addEventListener("popstate",g),h=()=>{var t;(t=p)?window.scrollTo(t.__svelte_spa_router_scrollX,t.__svelte_spa_router_scrollY):window.scrollTo(0,0)},E().$$.after_update.push(h));let m=null,$=null;const w=dt.subscribe((async t=>{m=t;let e=0;for(;e<i.length;){const o=i[e].match(t.location);if(!o){e++;continue}const r={route:i[e].path,location:t.location,querystring:t.querystring,userData:i[e].userData,params:o&&"object"==typeof o&&Object.keys(o).length?o:null};if(!await i[e].checkConditions(r))return n(0,c=null),$=null,void d("conditionsFailed",r);d("routeLoading",Object.assign({},r));const l=i[e].component;if($!=l){l.loading?(n(0,c=l.loading),$=l,n(1,a=l.loadingParams),n(2,u={}),d("routeLoaded",Object.assign({},r,{component:c,name:c.name,params:a}))):(n(0,c=null),$=null);const e=await l();if(t!=m)return;n(0,c=e&&e.default||e),$=l}return o&&"object"==typeof o&&Object.keys(o).length?n(1,a=o):n(1,a=null),n(2,u=i[e].props),void d("routeLoaded",Object.assign({},r,{component:c,name:c.name,params:a})).then((()=>{pt.set(a)}))}n(0,c=null),$=null,pt.set(void 0)}));return S((()=>{w(),g&&window.removeEventListener("popstate",g)})),t.$$set=t=>{"routes"in t&&n(3,o=t.routes),"prefix"in t&&n(4,r=t.prefix),"restoreScrollState"in t&&n(5,l=t.restoreScrollState)},t.$$.update=()=>{32&t.$$.dirty&&(history.scrollRestoration=l?"manual":"auto")},[c,a,u,o,r,l,function(e){O.call(this,t,e)},function(e){O.call(this,t,e)}]}class ht extends ot{constructor(t){super(),nt(this,t,gt,ut,s,{routes:3,prefix:4,restoreScrollState:5})}}function mt(t,e,n){const o=t.slice();return o[7]=e[n],o[9]=n,o}function $t(t){let e,n,o,r;function l(){return t[5](t[9])}return{c(){e=h("img"),a(e.src,n=t[7])||y(e,"src",n),y(e,"alt","Thumbnail"),y(e,"class","w-24 h-24 object-cover cursor-pointer rounded-lg hover:opacity-100 transition-opacity duration-300"),k(e,"opacity-50",t[9]!==t[1])},m(t,n){d(t,e,n),o||(r=v(e,"click",l),o=!0)},p(o,r){t=o,1&r&&!a(e.src,n=t[7])&&y(e,"src",n),2&r&&k(e,"opacity-50",t[9]!==t[1])},d(t){t&&p(e),o=!1,r()}}}function wt(e){let n,o,l,s,i,c,u,m,w,x,b,k,_=J(e[0]),j=[];for(let t=0;t<_.length;t+=1)j[t]=$t(mt(e,_,t));return{c(){n=h("div"),o=h("div"),l=h("button"),l.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>',s=$(),i=h("img"),u=$(),m=h("button"),m.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>',w=$(),x=h("div");for(let t=0;t<j.length;t+=1)j[t].c();y(l,"class","absolute left-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10"),a(i.src,c=e[0][e[1]])||y(i,"src",c),y(i,"alt","featured"),y(i,"loading","lazy"),y(i,"class","h-full object-contain"),y(m,"class","absolute right-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10"),y(o,"class","relative w-auto h-96 overflow-hidden rounded-lg"),y(x,"class","flex mt-4 space-x-4 overflow-x-auto"),y(n,"class","flex flex-col items-center")},m(t,r){d(t,n,r),f(n,o),f(o,l),f(o,s),f(o,i),f(o,u),f(o,m),f(n,w),f(n,x);for(let t=0;t<j.length;t+=1)j[t]&&j[t].m(x,null);b||(k=[v(l,"click",e[3]),v(m,"click",e[2])],b=!0)},p(t,[e]){if(3&e&&!a(i.src,c=t[0][t[1]])&&y(i,"src",c),19&e){let n;for(_=J(t[0]),n=0;n<_.length;n+=1){const o=mt(t,_,n);j[n]?j[n].p(o,e):(j[n]=$t(o),j[n].c(),j[n].m(x,null))}for(;n<j.length;n+=1)j[n].d(1);j.length=_.length}},i:t,o:t,d(t){t&&p(n),g(j,t),b=!1,r(k)}}}function vt(t,e,n){let{images:o=[]}=e,r=0;function l(){n(1,r=(r+1)%o.length)}function s(){n(1,r=(r-1+o.length)%o.length)}function i(t){n(1,r=t)}const c=t=>{"ArrowLeft"===t.key&&s(),"ArrowRight"===t.key&&l()};L((()=>(window.addEventListener("keydown",c),()=>{window.removeEventListener("keydown",c)}))),S((()=>{window.removeEventListener("keydown",c)}));return t.$$set=t=>{"images"in t&&n(0,o=t.images)},[o,r,l,s,i,t=>i(t)]}class yt extends ot{constructor(t){super(),nt(this,t,vt,wt,s,{images:0})}}function xt(t,e,n){const o=t.slice();return o[3]=e[n],o}function bt(t){let e,n,o,r,l,s,i,c,a,u=t[0].title+"",w=J(t[0].description),v=[];for(let e=0;e<w.length;e+=1)v[e]=kt(xt(t,w,e));return c=new yt({props:{images:t[0].images}}),{c(){e=h("div"),n=h("h1"),o=m(u),r=$(),l=h("p");for(let t=0;t<v.length;t+=1)v[t].c();s=$(),i=h("div"),Z(c.$$.fragment),y(n,"class","text-[100px] leading-none font-new-amsterdam"),y(l,"class","text-left"),y(e,"class","w-auto"),y(i,"class","w-full")},m(t,u){d(t,e,u),f(e,n),f(n,o),f(e,r),f(e,l);for(let t=0;t<v.length;t+=1)v[t]&&v[t].m(l,null);d(t,s,u),d(t,i,u),tt(c,i,null),a=!0},p(t,e){if((!a||1&e)&&u!==(u=t[0].title+"")&&x(o,u),1&e){let n;for(w=J(t[0].description),n=0;n<w.length;n+=1){const o=xt(t,w,n);v[n]?v[n].p(o,e):(v[n]=kt(o),v[n].c(),v[n].m(l,null))}for(;n<v.length;n+=1)v[n].d(1);v.length=w.length}const n={};1&e&&(n.images=t[0].images),c.$set(n)},i(t){a||(W(c.$$.fragment,t),a=!0)},o(t){G(c.$$.fragment,t),a=!1},d(t){t&&(p(e),p(s),p(i)),g(v,t),et(c)}}}function kt(t){let e,n,o,r=t[3]+"";return{c(){e=h("p"),n=m(r),o=h("br")},m(t,r){d(t,e,r),f(e,n),d(t,o,r)},p(t,e){1&e&&r!==(r=t[3]+"")&&x(n,r)},d(t){t&&(p(e),p(o))}}}function _t(t){let e,n,o=t[0]&&bt(t);return{c(){e=h("div"),o&&o.c(),y(e,"class","flex flex-row justify-between m-2")},m(t,r){d(t,e,r),o&&o.m(e,null),n=!0},p(t,[n]){t[0]?o?(o.p(t,n),1&n&&W(o,1)):(o=bt(t),o.c(),W(o,1),o.m(e,null)):o&&(Y(),G(o,1,1,(()=>{o=null})),V())},i(t){n||(W(o),n=!0)},o(t){G(o),n=!1},d(t){t&&p(e),o&&o.d()}}}function jt(t,e,n){let o,{title:r}=e,{category:l}=e;return L((async()=>{const t=await fetch("data/projects.json"),e=await t.json();n(0,o=e[l].projects.find((t=>t.title===r)))})),t.$$set=t=>{"title"in t&&n(1,r=t.title),"category"in t&&n(2,l=t.category)},[o,r,l]}class Et extends ot{constructor(t){super(),nt(this,t,jt,_t,s,{title:1,category:2})}}function Lt(t){let e,n,o,l,s,i,c,a;const g=t[5].default,m=function(t,e,n,o){if(t){const r=u(t,e,n,o);return t[0](r)}}(g,t,t[4],null);return{c(){e=h("div"),n=h("div"),o=h("button"),o.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',l=$(),m&&m.c(),y(o,"class","absolute top-2 right-2 rounded-full p-1 text-accent1 hover:bg-dark hover:bg-opacity-10"),y(n,"class",s="bg-bright p-6 rounded-lg shadow-lg relative "+t[1]+" max-h-[calc(100vh-100px)] z-50"),y(e,"id","popup-overlay"),y(e,"class","fixed inset-0 flex items-center justify-center bg-dark bg-opacity-75 z-40"),y(e,"aria-label","Close Popup"),y(e,"role","presentation")},m(r,s){d(r,e,s),f(e,n),f(n,o),f(n,l),m&&m.m(n,null),i=!0,c||(a=[v(o,"click",t[3]),v(e,"click",t[2])],c=!0)},p(t,e){m&&m.p&&(!i||16&e)&&function(t,e,n,o,r,l){if(r){const s=u(e,n,o,l);t.p(s,r)}}(m,g,t,t[4],i?function(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}(g,t[4],e,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[4]),null),(!i||2&e&&s!==(s="bg-bright p-6 rounded-lg shadow-lg relative "+t[1]+" max-h-[calc(100vh-100px)] z-50"))&&y(n,"class",s)},i(t){i||(W(m,t),i=!0)},o(t){G(m,t),i=!1},d(t){t&&p(e),m&&m.d(t),c=!1,r(a)}}}function St(t){let e,n,o=t[0]&&Lt(t);return{c(){o&&o.c(),e=w()},m(t,r){o&&o.m(t,r),d(t,e,r),n=!0},p(t,[n]){t[0]?o?(o.p(t,n),1&n&&W(o,1)):(o=Lt(t),o.c(),W(o,1),o.m(e.parentNode,e)):o&&(Y(),G(o,1,1,(()=>{o=null})),V())},i(t){n||(W(o),n=!0)},o(t){G(o),n=!1},d(t){t&&p(e),o&&o.d(t)}}}function Ct(t,e,n){let{$$slots:o={},$$scope:r}=e,{isOpen:l=!1}=e,{width:s="w-1/2"}=e,i=C();const c=t=>{"Escape"===t.key&&a()};function a(){n(0,l=!1),i("closePopup")}return L((()=>(window.addEventListener("keydown",c),()=>{window.removeEventListener("keydown",c)}))),S((()=>{window.removeEventListener("keydown",c)})),t.$$set=t=>{"isOpen"in t&&n(0,l=t.isOpen),"width"in t&&n(1,s=t.width),"$$scope"in t&&n(4,r=t.$$scope)},[l,s,t=>{"popup-overlay"===t.target.id&&a()},a,r,o]}class Ot extends ot{constructor(t){super(),nt(this,t,Ct,St,s,{isOpen:0,width:1})}}function zt(t){let e,n;return e=new Et({props:{title:t[0],category:t[2]}}),{c(){Z(e.$$.fragment)},m(t,o){tt(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.title=t[0]),4&n&&(o.category=t[2]),e.$set(o)},i(t){n||(W(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){et(e,t)}}}function At(t){let e,n,o,r,l,s,i,c,u,g,w,k,_;return g=new Ot({props:{isOpen:t[4],width:"w-10/12",$$slots:{default:[zt]},$$scope:{ctx:t}}}),g.$on("closePopup",t[6]),{c(){e=h("div"),n=h("button"),o=h("img"),l=$(),s=h("div"),i=h("div"),c=m(t[0]),u=$(),Z(g.$$.fragment),a(o.src,r=t[1])||y(o,"src",r),y(o,"loading","lazy"),y(o,"alt",t[0]),y(o,"class","transition-transform duration-400 transform group-hover:scale-115"),y(i,"class","text-black text-[40px] font-new-amsterdam leading-tight"),y(s,"class","absolute top-0 left-0 w-full h-full bg-bright opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center"),y(e,"class","relative inline-block overflow-hidden group mx-1"),b(e,"width",t[3]),b(e,"height",t[3])},m(r,a){d(r,e,a),f(e,n),f(n,o),f(n,l),f(n,s),f(s,i),f(i,c),d(r,u,a),tt(g,r,a),w=!0,k||(_=v(n,"click",t[5]),k=!0)},p(t,[n]){(!w||2&n&&!a(o.src,r=t[1]))&&y(o,"src",r),(!w||1&n)&&y(o,"alt",t[0]),(!w||1&n)&&x(c,t[0]),(!w||8&n)&&b(e,"width",t[3]),(!w||8&n)&&b(e,"height",t[3]);const l={};16&n&&(l.isOpen=t[4]),133&n&&(l.$$scope={dirty:n,ctx:t}),g.$set(l)},i(t){w||(W(g.$$.fragment,t),w=!0)},o(t){G(g.$$.fragment,t),w=!1},d(t){t&&(p(e),p(u)),et(g,t),k=!1,_()}}}function Pt(t,e,n){let{title:o}=e,{image:r}=e,{category:l}=e,{size:s="350px"}=e,i=!1;return t.$$set=t=>{"title"in t&&n(0,o=t.title),"image"in t&&n(1,r=t.image),"category"in t&&n(2,l=t.category),"size"in t&&n(3,s=t.size)},[o,r,l,s,i,function(){n(4,i=!0)},function(){n(4,i=!1)}]}class Mt extends ot{constructor(t){super(),nt(this,t,Pt,At,s,{title:0,image:1,category:2,size:3})}}function Tt(e){let n,o,r,l,s,i,c;return{c(){n=h("span"),o=m(e[0]),r=$(),l=h("span"),s=m(e[0]),y(l,"class",i=`absolute ${e[1]}`),b(l,"font-size",e[3]+"px"),b(l,"top","-"+e[4]+"px"),b(l,"left","-"+e[4]+"px"),y(n,"class",c=`relative ${e[2]} font-new-amsterdam flex`),b(n,"font-size",e[3]+"px")},m(t,e){d(t,n,e),f(n,o),f(n,r),f(n,l),f(l,s)},p(t,[e]){1&e&&x(o,t[0]),1&e&&x(s,t[0]),2&e&&i!==(i=`absolute ${t[1]}`)&&y(l,"class",i),8&e&&b(l,"font-size",t[3]+"px"),4&e&&c!==(c=`relative ${t[2]} font-new-amsterdam flex`)&&y(n,"class",c),8&e&&b(n,"font-size",t[3]+"px")},i:t,o:t,d(t){t&&p(n)}}}function It(t,e,n){let{text:o}=e,{mainColor:r="text-accent1"}=e,{shadowColor:l="text-accent2"}=e,{fontSize:s=200}=e,i=s/40;return t.$$set=t=>{"text"in t&&n(0,o=t.text),"mainColor"in t&&n(1,r=t.mainColor),"shadowColor"in t&&n(2,l=t.shadowColor),"fontSize"in t&&n(3,s=t.fontSize)},[o,r,l,s,i]}class Nt extends ot{constructor(t){super(),nt(this,t,It,Tt,s,{text:0,mainColor:1,shadowColor:2,fontSize:3})}}function Ht(t,e,n){const o=t.slice();return o[2]=e[n][0],o[0]=e[n][1],o}function Bt(t,e,n){const o=t.slice();return o[5]=e[n],o}function Dt(t){let e,n,o=J(Object.entries(t[0])),r=[];for(let e=0;e<o.length;e+=1)r[e]=qt(Ht(t,o,e));const l=t=>G(r[t],1,1,(()=>{r[t]=null}));return{c(){e=h("div");for(let t=0;t<r.length;t+=1)r[t].c();y(e,"class","flex flex-col mx-4 justify-center")},m(t,o){d(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,n){if(1&n){let s;for(o=J(Object.entries(t[0])),s=0;s<o.length;s+=1){const l=Ht(t,o,s);r[s]?(r[s].p(l,n),W(r[s],1)):(r[s]=qt(l),r[s].c(),W(r[s],1),r[s].m(e,null))}for(Y(),s=o.length;s<r.length;s+=1)l(s);V()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)W(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)G(r[t]);n=!1},d(t){t&&p(e),g(r,t)}}}function Rt(t){let e,n;return e=new Mt({props:{title:t[5].title,image:t[5].images[0],size:"250px",category:t[2]}}),{c(){Z(e.$$.fragment)},m(t,o){tt(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.title=t[5].title),1&n&&(o.image=t[5].images[0]),1&n&&(o.category=t[2]),e.$set(o)},i(t){n||(W(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){et(e,t)}}}function qt(t){let e,n,o,r,l,s,i,c,a,u,m,w,x=J(t[0].projects.slice(0,3)),b=[];for(let e=0;e<x.length;e+=1)b[e]=Rt(Bt(t,x,e));const k=t=>G(b[t],1,1,(()=>{b[t]=null}));function _(){return t[1](t[2])}return s=new Nt({props:{text:t[2],fontSize:"100"}}),{c(){e=h("div"),n=h("div");for(let t=0;t<b.length;t+=1)b[t].c();o=$(),r=h("div"),l=h("button"),Z(s.$$.fragment),i=$(),c=h("p"),c.textContent="See All Projects →",a=$(),y(n,"class","flex"),y(c,"class","font-new-amsterdam tracking-widest hover:underline"),y(l,"class",""),y(r,"class","flex flex-col"),y(e,"class","flex flex-row items-center justify-between")},m(t,p){d(t,e,p),f(e,n);for(let t=0;t<b.length;t+=1)b[t]&&b[t].m(n,null);f(e,o),f(e,r),f(r,l),tt(s,l,null),f(l,i),f(l,c),f(e,a),u=!0,m||(w=v(l,"click",_),m=!0)},p(e,o){if(t=e,1&o){let e;for(x=J(t[0].projects.slice(0,3)),e=0;e<x.length;e+=1){const r=Bt(t,x,e);b[e]?(b[e].p(r,o),W(b[e],1)):(b[e]=Rt(r),b[e].c(),W(b[e],1),b[e].m(n,null))}for(Y(),e=x.length;e<b.length;e+=1)k(e);V()}const r={};1&o&&(r.text=t[2]),s.$set(r)},i(t){if(!u){for(let t=0;t<x.length;t+=1)W(b[t]);W(s.$$.fragment,t),u=!0}},o(t){b=b.filter(Boolean);for(let t=0;t<b.length;t+=1)G(b[t]);G(s.$$.fragment,t),u=!1},d(t){t&&p(e),g(b,t),et(s),m=!1,w()}}}function Kt(t){let e,n,o,r,l=t[0]&&Dt(t);return{c(){e=h("div"),n=h("div"),n.innerHTML='<p class="font-new-amsterdam text-[100px]">Welcome to my portfolio!</p> <p>I&#39;m Lena, a computer science and archaeology student. On this website, I feature some of my creative projects.</p> <p>For more information about my background, check out <a href="/#/cv" class="text-accent1 hover:text-accent1-hover">my CV</a>!</p>',o=$(),l&&l.c(),y(n,"class","items-center justify-center m-8 gap-4"),y(e,"align","center")},m(t,s){d(t,e,s),f(e,n),f(e,o),l&&l.m(e,null),r=!0},p(t,[n]){t[0]?l?(l.p(t,n),1&n&&W(l,1)):(l=Dt(t),l.c(),W(l,1),l.m(e,null)):l&&(Y(),G(l,1,1,(()=>{l=null})),V())},i(t){r||(W(l),r=!0)},o(t){G(l),r=!1},d(t){t&&p(e),l&&l.d()}}}function Ft(t,e,n){let o;L((async()=>{const t=await fetch("data/projects.json");n(0,o=await t.json()),console.log(o)}));return[o,t=>async function(t){if(!t||t.length<1||"/"!=t.charAt(0)&&0!==t.indexOf("#/"))throw Error("Invalid parameter location");await H(),history.replaceState({...history.state,__svelte_spa_router_scrollX:window.scrollX,__svelte_spa_router_scrollY:window.scrollY},void 0),window.location.hash=("#"==t.charAt(0)?"":"#")+t}("/"+t)]}function Xt(t,e,n){const o=t.slice();return o[2]=e[n],o}function Yt(t,e,n){const o=t.slice();return o[5]=e[n],o}function Vt(t,e,n){const o=t.slice();return o[8]=e[n],o}function Wt(t){let e,n,o,r,l,s,i,c,a,u=J(t[1]),m=[];for(let e=0;e<u.length;e+=1)m[e]=Zt(Xt(t,u,e));return{c(){e=h("table");for(let t=0;t<m.length;t+=1)m[t].c();n=$(),o=h("tr"),o.innerHTML='<td><strong>Languages</strong></td> <td colspan="2"><strong>German</strong> native speaker, <strong>English</strong> fluent,<strong>French</strong> good working knowledge, <strong>Latin</strong> proficiency certificate (Latinum), <strong>Italian</strong> basic knowledge</td>',r=$(),l=h("tr"),l.innerHTML='<td><strong>IT Skills (Personal Projects / Working Experience)</strong></td> <td colspan="2">MS Office, Java, Python (incl. django), Svelte (JavaScript framework), PHP, SQL, GIMP, Scribus, Inkscape, Krita</td>',s=$(),i=h("tr"),i.innerHTML='<td><strong>IT Skills (University Courses)</strong></td> <td colspan="2">OCaml, x86 Assembly, C, MATLAB</td>',c=$(),a=h("tr"),a.innerHTML='<td><strong>Personal Interests</strong></td> <td colspan="2"><a style="color:SteelBlue" href="/#/sewing" target="_blank">sewing</a>, <a style="color:SteelBlue" href="/#/printmaking" target="_blank">printmaking</a>, <a style="color:SteelBlue" href="/#/photography" target="_blank">photography</a>, Dungeons and Dragons</td>'},m(t,u){d(t,e,u);for(let t=0;t<m.length;t+=1)m[t]&&m[t].m(e,null);f(e,n),f(e,o),f(e,r),f(e,l),f(e,s),f(e,i),f(e,c),f(e,a)},p(t,o){if(3&o){let r;for(u=J(t[1]),r=0;r<u.length;r+=1){const l=Xt(t,u,r);m[r]?m[r].p(l,o):(m[r]=Zt(l),m[r].c(),m[r].m(e,n))}for(;r<m.length;r+=1)m[r].d(1);m.length=u.length}},d(t){t&&p(e),g(m,t)}}}function Gt(t){let e,n=J(t[5].details),o=[];for(let e=0;e<n.length;e+=1)o[e]=Jt(Vt(t,n,e));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=w()},m(t,n){for(let e=0;e<o.length;e+=1)o[e]&&o[e].m(t,n);d(t,e,n)},p(t,r){if(3&r){let l;for(n=J(t[5].details),l=0;l<n.length;l+=1){const s=Vt(t,n,l);o[l]?o[l].p(s,r):(o[l]=Jt(s),o[l].c(),o[l].m(e.parentNode,e))}for(;l<o.length;l+=1)o[l].d(1);o.length=n.length}},d(t){t&&p(e),g(o,t)}}}function Jt(t){let e,n,o=t[8]+"";return{c(){e=h("li"),n=m(o)},m(t,o){d(t,e,o),f(e,n)},p(t,e){1&e&&o!==(o=t[8]+"")&&x(n,o)},d(t){t&&p(e)}}}function Ut(t){let e,n,o=t[5].location+"";return{c(){e=h("td"),n=m(o)},m(t,o){d(t,e,o),f(e,n)},p(t,e){1&e&&o!==(o=t[5].location+"")&&x(n,o)},d(t){t&&p(e)}}}function Qt(t){let e,n,o,r,l,s,i,c,a,u,g,w=t[5].period+"",v=t[5].title+"",b=t[5].details&&Gt(t),k=t[5].location&&Ut(t);return{c(){e=h("tr"),n=h("td"),o=m(w),r=$(),l=h("td"),s=h("div"),i=m(v),c=$(),a=h("ul"),b&&b.c(),u=$(),k&&k.c(),g=$(),y(s,"class","font-semibold"),y(a,"class","list-disc list-inside")},m(t,p){d(t,e,p),f(e,n),f(n,o),f(e,r),f(e,l),f(l,s),f(s,i),f(l,c),f(l,a),b&&b.m(a,null),f(e,u),k&&k.m(e,null),f(e,g)},p(t,n){1&n&&w!==(w=t[5].period+"")&&x(o,w),1&n&&v!==(v=t[5].title+"")&&x(i,v),t[5].details?b?b.p(t,n):(b=Gt(t),b.c(),b.m(a,null)):b&&(b.d(1),b=null),t[5].location?k?k.p(t,n):(k=Ut(t),k.c(),k.m(e,g)):k&&(k.d(1),k=null)},d(t){t&&p(e),b&&b.d(),k&&k.d()}}}function Zt(t){let e,n,o,r,l=J(t[0][t[2]]),s=[];for(let e=0;e<l.length;e+=1)s[e]=Qt(Yt(t,l,e));return{c(){e=h("tr"),n=h("td"),n.textContent=`${t[2]}`,o=$();for(let t=0;t<s.length;t+=1)s[t].c();r=w(),y(n,"colspan","3"),y(n,"class","font-semibold font-new-amsterdam text-[60px]")},m(t,l){d(t,e,l),f(e,n),d(t,o,l);for(let e=0;e<s.length;e+=1)s[e]&&s[e].m(t,l);d(t,r,l)},p(t,e){if(3&e){let n;for(l=J(t[0][t[2]]),n=0;n<l.length;n+=1){const o=Yt(t,l,n);s[n]?s[n].p(o,e):(s[n]=Qt(o),s[n].c(),s[n].m(r.parentNode,r))}for(;n<s.length;n+=1)s[n].d(1);s.length=l.length}},d(t){t&&(p(e),p(o),p(r)),g(s,t)}}}function te(t){let e,n,o,r,l,s,i,c,a;o=new Nt({props:{text:"Lena Kahle CV"}});let u=t[0]&&Wt(t);return{c(){e=h("div"),n=h("div"),Z(o.$$.fragment),r=$(),l=h("a"),s=m("LINKEDIN: LENA KAHLE"),c=$(),u&&u.c(),y(l,"class","font-new-amsterdam tracking-widest hover:underline text-[40px]"),y(l,"target","_blank"),y(l,"href",i=t[0]?.linkedin),y(n,"class",""),y(e,"align","center"),y(e,"class","flex flex-col items-center justify-center")},m(t,i){d(t,e,i),f(e,n),tt(o,n,null),f(n,r),f(n,l),f(l,s),f(e,c),u&&u.m(e,null),a=!0},p(t,[n]){(!a||1&n&&i!==(i=t[0]?.linkedin))&&y(l,"href",i),t[0]?u?u.p(t,n):(u=Wt(t),u.c(),u.m(e,null)):u&&(u.d(1),u=null)},i(t){a||(W(o.$$.fragment,t),a=!0)},o(t){G(o.$$.fragment,t),a=!1},d(t){t&&p(e),et(o),u&&u.d()}}}function ee(t,e,n){let o;return L((async()=>{const t=await fetch("data/cv.json");n(0,o=await t.json()),console.log(o)})),[o,["education","experience","awards and scholarships","extracurricular activities"]]}function ne(t,e,n){const o=t.slice();return o[3]=e[n],o}function oe(t,e,n){const o=t.slice();return o[6]=e[n],o}function re(t){let e,n,o,r,l,s,i;n=new Nt({props:{text:t[1]}});let c=J(t[0].description),a=[];for(let e=0;e<c.length;e+=1)a[e]=le(oe(t,c,e));let u=J(t[0].projects),m=[];for(let e=0;e<u.length;e+=1)m[e]=se(ne(t,u,e));const v=t=>G(m[t],1,1,(()=>{m[t]=null}));return{c(){e=h("div"),Z(n.$$.fragment),o=$(),r=h("p");for(let t=0;t<a.length;t+=1)a[t].c();l=$();for(let t=0;t<m.length;t+=1)m[t].c();s=w(),y(r,"class","w-1/3 text-left"),y(e,"class","flex flex-row items-center justify-center mx-8 gap-4")},m(t,c){d(t,e,c),tt(n,e,null),f(e,o),f(e,r);for(let t=0;t<a.length;t+=1)a[t]&&a[t].m(r,null);d(t,l,c);for(let e=0;e<m.length;e+=1)m[e]&&m[e].m(t,c);d(t,s,c),i=!0},p(t,e){if(1&e){let n;for(c=J(t[0].description),n=0;n<c.length;n+=1){const o=oe(t,c,n);a[n]?a[n].p(o,e):(a[n]=le(o),a[n].c(),a[n].m(r,null))}for(;n<a.length;n+=1)a[n].d(1);a.length=c.length}if(3&e){let n;for(u=J(t[0].projects),n=0;n<u.length;n+=1){const o=ne(t,u,n);m[n]?(m[n].p(o,e),W(m[n],1)):(m[n]=se(o),m[n].c(),W(m[n],1),m[n].m(s.parentNode,s))}for(Y(),n=u.length;n<m.length;n+=1)v(n);V()}},i(t){if(!i){W(n.$$.fragment,t);for(let t=0;t<u.length;t+=1)W(m[t]);i=!0}},o(t){G(n.$$.fragment,t),m=m.filter(Boolean);for(let t=0;t<m.length;t+=1)G(m[t]);i=!1},d(t){t&&(p(e),p(l),p(s)),et(n),g(a,t),g(m,t)}}}function le(t){let e,n,o=t[6]+"";return{c(){e=m(o),n=h("br")},m(t,o){d(t,e,o),d(t,n,o)},p(t,n){1&n&&o!==(o=t[6]+"")&&x(e,o)},d(t){t&&(p(e),p(n))}}}function se(t){let e,n;return e=new Mt({props:{title:t[3].title,image:t[3].images[0],category:t[1]}}),{c(){Z(e.$$.fragment)},m(t,o){tt(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.title=t[3].title),1&n&&(o.image=t[3].images[0]),e.$set(o)},i(t){n||(W(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){et(e,t)}}}function ie(t){let e,n,o=t[0]&&re(t);return{c(){e=h("div"),o&&o.c(),y(e,"align","center")},m(t,r){d(t,e,r),o&&o.m(e,null),n=!0},p(t,[n]){t[0]?o?(o.p(t,n),1&n&&W(o,1)):(o=re(t),o.c(),W(o,1),o.m(e,null)):o&&(Y(),G(o,1,1,(()=>{o=null})),V())},i(t){n||(W(o),n=!0)},o(t){G(o),n=!1},d(t){t&&p(e),o&&o.d()}}}function ce(t,e,n){let o,r=window.location.hash.replace("#/","").split("/")[0];return L((async()=>{const t=await fetch("data/projects.json");n(0,o=await t.json()),n(0,o=o[r]),console.log(o)})),[o,r]}const ae={"/":class extends ot{constructor(t){super(),nt(this,t,Ft,Kt,s,{})}},"/cv":class extends ot{constructor(t){super(),nt(this,t,ee,te,s,{})}},"/:category":class extends ot{constructor(t){super(),nt(this,t,ce,ie,s,{})}}};class ue extends ot{constructor(t){super(),nt(this,t,null,null,s,{})}}function fe(e){let n;return{c(){n=h("div"),n.innerHTML='<a href="/#" class="flex justify-center items-center gap-2"><img src="logo/logo_dark.png" alt="Logo" class="h-11"/> <h1>Lena Kahle</h1></a> <div class="flex gap-4 pr-4 "><a href="/#">Home</a> <a href="/#/cv">CV</a></div>',y(n,"class","flex gap-10 justify-between items-center pt-3 pb-2 px-8 z-20 text-dark text-[40px] leading-tight font-new-amsterdam")},m(t,e){d(t,n,e)},p:t,i:t,o:t,d(t){t&&p(n)}}}class de extends ot{constructor(t){super(),nt(this,t,null,fe,s,{})}}function pe(e){let n,o,r,l,s,i,c,a;return o=new de({}),s=new ht({props:{routes:ae}}),c=new ue({}),{c(){n=h("div"),Z(o.$$.fragment),r=$(),l=h("div"),Z(s.$$.fragment),i=$(),Z(c.$$.fragment),y(l,"class","h-screen overflow-auto mt-2 flex flex-col w-full bg-dark bg-opacity-5"),y(n,"class","max-h-screen flex flex-col bg-bright text-dark")},m(t,e){d(t,n,e),tt(o,n,null),f(n,r),f(n,l),tt(s,l,null),d(t,i,e),tt(c,t,e),a=!0},p:t,i(t){a||(W(o.$$.fragment,t),W(s.$$.fragment,t),W(c.$$.fragment,t),a=!0)},o(t){G(o.$$.fragment,t),G(s.$$.fragment,t),G(c.$$.fragment,t),a=!1},d(t){t&&(p(n),p(i)),et(o),et(s),et(c,t)}}}return new class extends ot{constructor(t){super(),nt(this,t,null,pe,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
