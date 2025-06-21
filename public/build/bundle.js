
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function subscribe(store, ...callbacks) {
		if (store == null) {
			for (const callback of callbacks) {
				callback(undefined);
			}
			return noop;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}
	/** */
	class HtmlTag {
		/**
		 * @private
		 * @default false
		 */
		is_svg = false;
		/** parent for creating node */
		e = undefined;
		/** html tag nodes */
		n = undefined;
		/** target */
		t = undefined;
		/** anchor */
		a = undefined;
		constructor(is_svg = false) {
			this.is_svg = is_svg;
			this.e = this.n = null;
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		c(html) {
			this.h(html);
		}

		/**
		 * @param {string} html
		 * @param {HTMLElement | SVGElement} target
		 * @param {HTMLElement | SVGElement} anchor
		 * @returns {void}
		 */
		m(html, target, anchor = null) {
			if (!this.e) {
				if (this.is_svg)
					this.e = svg_element(/** @type {keyof SVGElementTagNameMap} */ (target.nodeName));
				/** #7364  target for <template> may be provided as #document-fragment(11) */ else
					this.e = element(
						/** @type {keyof HTMLElementTagNameMap} */ (
							target.nodeType === 11 ? 'TEMPLATE' : target.nodeName
						)
					);
				this.t =
					target.tagName !== 'TEMPLATE'
						? target
						: /** @type {HTMLTemplateElement} */ (target).content;
				this.c(html);
			}
			this.i(anchor);
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		h(html) {
			this.e.innerHTML = html;
			this.n = Array.from(
				this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes
			);
		}

		/**
		 * @returns {void} */
		i(anchor) {
			for (let i = 0; i < this.n.length; i += 1) {
				insert(this.t, this.n[i], anchor);
			}
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		p(html) {
			this.d();
			this.h(html);
			this.i(this.a);
		}

		/**
		 * @returns {void} */
		d() {
			this.n.forEach(detach);
		}
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately after the component has been updated.
	 *
	 * The first time the callback runs will be after the initial `onMount`
	 *
	 * https://svelte.dev/docs/svelte#afterupdate
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function afterUpdate(fn) {
		get_current_component().$$.after_update.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {Promise<void>} */
	function tick() {
		schedule_update();
		return resolved_promise;
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {{}} */
	function get_spread_update(levels, updates) {
		const update = {};
		const to_null_out = {};
		const accounted_for = { $$scope: 1 };
		let i = levels.length;
		while (i--) {
			const o = levels[i];
			const n = updates[i];
			if (n) {
				for (const key in o) {
					if (!(key in n)) to_null_out[key] = 1;
				}
				for (const key in n) {
					if (!accounted_for[key]) {
						update[key] = n[key];
						accounted_for[key] = 1;
					}
				}
				levels[i] = n;
			} else {
				for (const key in o) {
					accounted_for[key] = 1;
				}
			}
		}
		for (const key in to_null_out) {
			if (!(key in update)) update[key] = undefined;
		}
		return update;
	}

	function get_spread_object(spread_props) {
		return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.18';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	function construct_svelte_component_dev(component, props) {
		const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
		try {
			const instance = new component(props);
			if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
				throw new Error(error_message);
			}
			return instance;
		} catch (err) {
			const { message } = err;
			if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
				throw new Error(error_message);
			} else {
				throw err;
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	const subscriber_queue = [];

	/**
	 * Creates a `Readable` store that allows reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#readable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Readable<T>}
	 */
	function readable(value, start) {
		return {
			subscribe: writable(value, start).subscribe
		};
	}

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}

	/**
	 * Derived value store by synchronizing one or more readable stores and
	 * applying an aggregation function over its input values.
	 *
	 * https://svelte.dev/docs/svelte-store#derived
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @overload
	 * @param {S} stores - input stores
	 * @param {(values: import('./private.js').StoresValues<S>, set: (value: T) => void, update: (fn: import('./public.js').Updater<T>) => void) => import('./public.js').Unsubscriber | void} fn - function callback that aggregates the values
	 * @param {T} [initial_value] - initial value
	 * @returns {import('./public.js').Readable<T>}
	 */

	/**
	 * Derived value store by synchronizing one or more readable stores and
	 * applying an aggregation function over its input values.
	 *
	 * https://svelte.dev/docs/svelte-store#derived
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @overload
	 * @param {S} stores - input stores
	 * @param {(values: import('./private.js').StoresValues<S>) => T} fn - function callback that aggregates the values
	 * @param {T} [initial_value] - initial value
	 * @returns {import('./public.js').Readable<T>}
	 */

	/**
	 * @template {import('./private.js').Stores} S
	 * @template T
	 * @param {S} stores
	 * @param {Function} fn
	 * @param {T} [initial_value]
	 * @returns {import('./public.js').Readable<T>}
	 */
	function derived(stores, fn, initial_value) {
		const single = !Array.isArray(stores);
		/** @type {Array<import('./public.js').Readable<any>>} */
		const stores_array = single ? [stores] : stores;
		if (!stores_array.every(Boolean)) {
			throw new Error('derived() expects stores as input, got a falsy value');
		}
		const auto = fn.length < 2;
		return readable(initial_value, (set, update) => {
			let started = false;
			const values = [];
			let pending = 0;
			let cleanup = noop;
			const sync = () => {
				if (pending) {
					return;
				}
				cleanup();
				const result = fn(single ? values[0] : values, set, update);
				if (auto) {
					set(result);
				} else {
					cleanup = is_function(result) ? result : noop;
				}
			};
			const unsubscribers = stores_array.map((store, i) =>
				subscribe(
					store,
					(value) => {
						values[i] = value;
						pending &= ~(1 << i);
						if (started) {
							sync();
						}
					},
					() => {
						pending |= 1 << i;
					}
				)
			);
			started = true;
			sync();
			return function stop() {
				run_all(unsubscribers);
				cleanup();
				// We need to set this to false because callbacks can still happen despite having unsubscribed:
				// Callbacks might already be placed in the queue which doesn't know it should no longer
				// invoke this derived store.
				started = false;
			};
		});
	}

	function parse(str, loose) {
		if (str instanceof RegExp) return { keys:false, pattern:str };
		var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
		arr[0] || arr.shift();

		while (tmp = arr.shift()) {
			c = tmp[0];
			if (c === '*') {
				keys.push('wild');
				pattern += '/(.*)';
			} else if (c === ':') {
				o = tmp.indexOf('?', 1);
				ext = tmp.indexOf('.', 1);
				keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
				pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
				if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
			} else {
				pattern += '/' + tmp;
			}
		}

		return {
			keys: keys,
			pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
		};
	}

	/* node_modules\svelte-spa-router\Router.svelte generated by Svelte v4.2.18 */

	const { Error: Error_1, Object: Object_1$1, console: console_1$2 } = globals;

	// (246:0) {:else}
	function create_else_block(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;
		const switch_instance_spread_levels = [/*props*/ ctx[2]];
		var switch_value = /*component*/ ctx[0];

		function switch_props(ctx, dirty) {
			let switch_instance_props = {};

			for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
				switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
			}

			if (dirty !== undefined && dirty & /*props*/ 4) {
				switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])]));
			}

			return {
				props: switch_instance_props,
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
			switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) mount_component(switch_instance, target, anchor);
				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx, dirty));
						switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					const switch_instance_changes = (dirty & /*props*/ 4)
					? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
					: {};

					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(switch_instance_anchor);
				}

				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block.name,
			type: "else",
			source: "(246:0) {:else}",
			ctx
		});

		return block;
	}

	// (239:0) {#if componentParams}
	function create_if_block$5(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;
		const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
		var switch_value = /*component*/ ctx[0];

		function switch_props(ctx, dirty) {
			let switch_instance_props = {};

			for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
				switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
			}

			if (dirty !== undefined && dirty & /*componentParams, props*/ 6) {
				switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [
					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
				]));
			}

			return {
				props: switch_instance_props,
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
			switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) mount_component(switch_instance, target, anchor);
				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx, dirty));
						switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
					? get_spread_update(switch_instance_spread_levels, [
							dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
							dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
						])
					: {};

					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(switch_instance_anchor);
				}

				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$5.name,
			type: "if",
			source: "(239:0) {#if componentParams}",
			ctx
		});

		return block;
	}

	function create_fragment$a(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block$5, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*componentParams*/ ctx[1]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if_blocks[current_block_type_index].d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$a.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function getLocation() {
		const hashPosition = window.location.href.indexOf('#/');

		let location = hashPosition > -1
		? window.location.href.substr(hashPosition + 1)
		: '/';

		// Check if there's a querystring
		const qsPosition = location.indexOf('?');

		let querystring = '';

		if (qsPosition > -1) {
			querystring = location.substr(qsPosition + 1);
			location = location.substr(0, qsPosition);
		}

		return { location, querystring };
	}

	const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
	function start(set) {
		set(getLocation());

		const update = () => {
			set(getLocation());
		};

		window.addEventListener('hashchange', update, false);

		return function stop() {
			window.removeEventListener('hashchange', update, false);
		};
	});

	const location = derived(loc, _loc => _loc.location);
	const querystring = derived(loc, _loc => _loc.querystring);
	const params = writable(undefined);

	async function push(location) {
		if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
			throw Error('Invalid parameter location');
		}

		// Execute this code when the current call stack is complete
		await tick();

		// Note: this will include scroll state in history even when restoreScrollState is false
		history.replaceState(
			{
				...history.state,
				__svelte_spa_router_scrollX: window.scrollX,
				__svelte_spa_router_scrollY: window.scrollY
			},
			undefined
		);

		window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
	}

	async function pop() {
		// Execute this code when the current call stack is complete
		await tick();

		window.history.back();
	}

	async function replace(location) {
		if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
			throw Error('Invalid parameter location');
		}

		// Execute this code when the current call stack is complete
		await tick();

		const dest = (location.charAt(0) == '#' ? '' : '#') + location;

		try {
			const newState = { ...history.state };
			delete newState['__svelte_spa_router_scrollX'];
			delete newState['__svelte_spa_router_scrollY'];
			window.history.replaceState(newState, undefined, dest);
		} catch(e) {
			// eslint-disable-next-line no-console
			console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
		}

		// The method above doesn't trigger the hashchange event, so let's do that manually
		window.dispatchEvent(new Event('hashchange'));
	}

	function link(node, opts) {
		opts = linkOpts(opts);

		// Only apply to <a> tags
		if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
			throw Error('Action "link" can only be used with <a> tags');
		}

		updateLink(node, opts);

		return {
			update(updated) {
				updated = linkOpts(updated);
				updateLink(node, updated);
			}
		};
	}

	function restoreScroll(state) {
		// If this exists, then this is a back navigation: restore the scroll position
		if (state) {
			window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
		} else {
			// Otherwise this is a forward navigation: scroll to top
			window.scrollTo(0, 0);
		}
	}

	// Internal function used by the link function
	function updateLink(node, opts) {
		let href = opts.href || node.getAttribute('href');

		// Destination must start with '/' or '#/'
		if (href && href.charAt(0) == '/') {
			// Add # to the href attribute
			href = '#' + href;
		} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
			throw Error('Invalid value for "href" attribute: ' + href);
		}

		node.setAttribute('href', href);

		node.addEventListener('click', event => {
			// Prevent default anchor onclick behaviour
			event.preventDefault();

			if (!opts.disabled) {
				scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
			}
		});
	}

	// Internal function that ensures the argument of the link action is always an object
	function linkOpts(val) {
		if (val && typeof val == 'string') {
			return { href: val };
		} else {
			return val || {};
		}
	}

	/**
	 * The handler attached to an anchor tag responsible for updating the
	 * current history state with the current scroll state
	 *
	 * @param {string} href - Destination
	 */
	function scrollstateHistoryHandler(href) {
		// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
		history.replaceState(
			{
				...history.state,
				__svelte_spa_router_scrollX: window.scrollX,
				__svelte_spa_router_scrollY: window.scrollY
			},
			undefined
		);

		// This will force an update as desired, but this time our scroll state will be attached
		window.location.hash = href;
	}

	function instance$a($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Router', slots, []);
		let { routes = {} } = $$props;
		let { prefix = '' } = $$props;
		let { restoreScrollState = false } = $$props;

		/**
	 * Container for a route: path, component
	 */
		class RouteItem {
			/**
	 * Initializes the object and creates a regular expression from the path, using regexparam.
	 *
	 * @param {string} path - Path to the route (must start with '/' or '*')
	 * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
	 */
			constructor(path, component) {
				if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
					throw Error('Invalid component object');
				}

				// Path must be a regular or expression, or a string starting with '/' or '*'
				if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
					throw Error('Invalid value for "path" argument - strings must start with / or *');
				}

				const { pattern, keys } = parse(path);
				this.path = path;

				// Check if the component is wrapped and we have conditions
				if (typeof component == 'object' && component._sveltesparouter === true) {
					this.component = component.component;
					this.conditions = component.conditions || [];
					this.userData = component.userData;
					this.props = component.props || {};
				} else {
					// Convert the component to a function that returns a Promise, to normalize it
					this.component = () => Promise.resolve(component);

					this.conditions = [];
					this.props = {};
				}

				this._pattern = pattern;
				this._keys = keys;
			}

			/**
	 * Checks if `path` matches the current route.
	 * If there's a match, will return the list of parameters from the URL (if any).
	 * In case of no match, the method will return `null`.
	 *
	 * @param {string} path - Path to test
	 * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
	 */
			match(path) {
				// If there's a prefix, check if it matches the start of the path.
				// If not, bail early, else remove it before we run the matching.
				if (prefix) {
					if (typeof prefix == 'string') {
						if (path.startsWith(prefix)) {
							path = path.substr(prefix.length) || '/';
						} else {
							return null;
						}
					} else if (prefix instanceof RegExp) {
						const match = path.match(prefix);

						if (match && match[0]) {
							path = path.substr(match[0].length) || '/';
						} else {
							return null;
						}
					}
				}

				// Check if the pattern matches
				const matches = this._pattern.exec(path);

				if (matches === null) {
					return null;
				}

				// If the input was a regular expression, this._keys would be false, so return matches as is
				if (this._keys === false) {
					return matches;
				}

				const out = {};
				let i = 0;

				while (i < this._keys.length) {
					// In the match parameters, URL-decode all values
					try {
						out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
					} catch(e) {
						out[this._keys[i]] = null;
					}

					i++;
				}

				return out;
			}

			/**
	 * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
	 * @typedef {Object} RouteDetail
	 * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
	 * @property {string} location - Location path
	 * @property {string} querystring - Querystring from the hash
	 * @property {object} [userData] - Custom data passed by the user
	 * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
	 * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
	 */
			/**
	 * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
	 * 
	 * @param {RouteDetail} detail - Route detail
	 * @returns {boolean} Returns true if all the conditions succeeded
	 */
			async checkConditions(detail) {
				for (let i = 0; i < this.conditions.length; i++) {
					if (!await this.conditions[i](detail)) {
						return false;
					}
				}

				return true;
			}
		}

		// Set up all routes
		const routesList = [];

		if (routes instanceof Map) {
			// If it's a map, iterate on it right away
			routes.forEach((route, path) => {
				routesList.push(new RouteItem(path, route));
			});
		} else {
			// We have an object, so iterate on its own properties
			Object.keys(routes).forEach(path => {
				routesList.push(new RouteItem(path, routes[path]));
			});
		}

		// Props for the component to render
		let component = null;

		let componentParams = null;
		let props = {};

		// Event dispatcher from Svelte
		const dispatch = createEventDispatcher();

		// Just like dispatch, but executes on the next iteration of the event loop
		async function dispatchNextTick(name, detail) {
			// Execute this code when the current call stack is complete
			await tick();

			dispatch(name, detail);
		}

		// If this is set, then that means we have popped into this var the state of our last scroll position
		let previousScrollState = null;

		let popStateChanged = null;

		if (restoreScrollState) {
			popStateChanged = event => {
				// If this event was from our history.replaceState, event.state will contain
				// our scroll history. Otherwise, event.state will be null (like on forward
				// navigation)
				if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
					previousScrollState = event.state;
				} else {
					previousScrollState = null;
				}
			};

			// This is removed in the destroy() invocation below
			window.addEventListener('popstate', popStateChanged);

			afterUpdate(() => {
				restoreScroll(previousScrollState);
			});
		}

		// Always have the latest value of loc
		let lastLoc = null;

		// Current object of the component loaded
		let componentObj = null;

		// Handle hash change events
		// Listen to changes in the $loc store and update the page
		// Do not use the $: syntax because it gets triggered by too many things
		const unsubscribeLoc = loc.subscribe(async newLoc => {
			lastLoc = newLoc;

			// Find a route matching the location
			let i = 0;

			while (i < routesList.length) {
				const match = routesList[i].match(newLoc.location);

				if (!match) {
					i++;
					continue;
				}

				const detail = {
					route: routesList[i].path,
					location: newLoc.location,
					querystring: newLoc.querystring,
					userData: routesList[i].userData,
					params: match && typeof match == 'object' && Object.keys(match).length
					? match
					: null
				};

				// Check if the route can be loaded - if all conditions succeed
				if (!await routesList[i].checkConditions(detail)) {
					// Don't display anything
					$$invalidate(0, component = null);

					componentObj = null;

					// Trigger an event to notify the user, then exit
					dispatchNextTick('conditionsFailed', detail);

					return;
				}

				// Trigger an event to alert that we're loading the route
				// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
				dispatchNextTick('routeLoading', Object.assign({}, detail));

				// If there's a component to show while we're loading the route, display it
				const obj = routesList[i].component;

				// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
				if (componentObj != obj) {
					if (obj.loading) {
						$$invalidate(0, component = obj.loading);
						componentObj = obj;
						$$invalidate(1, componentParams = obj.loadingParams);
						$$invalidate(2, props = {});

						// Trigger the routeLoaded event for the loading component
						// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
						dispatchNextTick('routeLoaded', Object.assign({}, detail, {
							component,
							name: component.name,
							params: componentParams
						}));
					} else {
						$$invalidate(0, component = null);
						componentObj = null;
					}

					// Invoke the Promise
					const loaded = await obj();

					// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
					if (newLoc != lastLoc) {
						// Don't update the component, just exit
						return;
					}

					// If there is a "default" property, which is used by async routes, then pick that
					$$invalidate(0, component = loaded && loaded.default || loaded);

					componentObj = obj;
				}

				// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
				// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
				if (match && typeof match == 'object' && Object.keys(match).length) {
					$$invalidate(1, componentParams = match);
				} else {
					$$invalidate(1, componentParams = null);
				}

				// Set static props, if any
				$$invalidate(2, props = routesList[i].props);

				// Dispatch the routeLoaded event then exit
				// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
				dispatchNextTick('routeLoaded', Object.assign({}, detail, {
					component,
					name: component.name,
					params: componentParams
				})).then(() => {
					params.set(componentParams);
				});

				return;
			}

			// If we're still here, there was no match, so show the empty component
			$$invalidate(0, component = null);

			componentObj = null;
			params.set(undefined);
		});

		onDestroy(() => {
			unsubscribeLoc();
			popStateChanged && window.removeEventListener('popstate', popStateChanged);
		});

		const writable_props = ['routes', 'prefix', 'restoreScrollState'];

		Object_1$1.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
		});

		function routeEvent_handler(event) {
			bubble.call(this, $$self, event);
		}

		function routeEvent_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$props => {
			if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
			if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
			if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
		};

		$$self.$capture_state = () => ({
			readable,
			writable,
			derived,
			tick,
			getLocation,
			loc,
			location,
			querystring,
			params,
			push,
			pop,
			replace,
			link,
			restoreScroll,
			updateLink,
			linkOpts,
			scrollstateHistoryHandler,
			onDestroy,
			createEventDispatcher,
			afterUpdate,
			parse,
			routes,
			prefix,
			restoreScrollState,
			RouteItem,
			routesList,
			component,
			componentParams,
			props,
			dispatch,
			dispatchNextTick,
			previousScrollState,
			popStateChanged,
			lastLoc,
			componentObj,
			unsubscribeLoc
		});

		$$self.$inject_state = $$props => {
			if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
			if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
			if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
			if ('component' in $$props) $$invalidate(0, component = $$props.component);
			if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
			if ('props' in $$props) $$invalidate(2, props = $$props.props);
			if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
			if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
			if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
			if ('componentObj' in $$props) componentObj = $$props.componentObj;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
				// Update history.scrollRestoration depending on restoreScrollState
				history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
			}
		};

		return [
			component,
			componentParams,
			props,
			routes,
			prefix,
			restoreScrollState,
			routeEvent_handler,
			routeEvent_handler_1
		];
	}

	class Router extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$a, create_fragment$a, safe_not_equal, {
				routes: 3,
				prefix: 4,
				restoreScrollState: 5
			});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Router",
				options,
				id: create_fragment$a.name
			});
		}

		get routes() {
			throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set routes(value) {
			throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get prefix() {
			throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set prefix(value) {
			throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get restoreScrollState() {
			throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set restoreScrollState(value) {
			throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\Gallery.svelte generated by Svelte v4.2.18 */
	const file$8 = "src\\components\\Gallery.svelte";

	function get_each_context$4(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[7] = list[i];
		child_ctx[9] = i;
		return child_ctx;
	}

	// (67:8) {#each images as image, index}
	function create_each_block$4(ctx) {
		let img;
		let img_src_value;
		let mounted;
		let dispose;

		function click_handler() {
			return /*click_handler*/ ctx[5](/*index*/ ctx[9]);
		}

		const block = {
			c: function create() {
				img = element("img");
				if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[7])) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Thumbnail");
				attr_dev(img, "class", "w-24 h-24 object-cover cursor-pointer rounded-lg hover:opacity-100 transition-opacity duration-300");
				toggle_class(img, "opacity-50", /*index*/ ctx[9] !== /*currentIndex*/ ctx[1]);
				add_location(img, file$8, 67, 12, 2496);
			},
			m: function mount(target, anchor) {
				insert_dev(target, img, anchor);

				if (!mounted) {
					dispose = listen_dev(img, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*images*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[7])) {
					attr_dev(img, "src", img_src_value);
				}

				if (dirty & /*currentIndex*/ 2) {
					toggle_class(img, "opacity-50", /*index*/ ctx[9] !== /*currentIndex*/ ctx[1]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(img);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$4.name,
			type: "each",
			source: "(67:8) {#each images as image, index}",
			ctx
		});

		return block;
	}

	function create_fragment$9(ctx) {
		let div2;
		let div0;
		let button0;
		let svg0;
		let path0;
		let t0;
		let img;
		let img_src_value;
		let t1;
		let button1;
		let svg1;
		let path1;
		let t2;
		let div1;
		let mounted;
		let dispose;
		let each_value = ensure_array_like_dev(/*images*/ ctx[0]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				button0 = element("button");
				svg0 = svg_element("svg");
				path0 = svg_element("path");
				t0 = space();
				img = element("img");
				t1 = space();
				button1 = element("button");
				svg1 = svg_element("svg");
				path1 = svg_element("path");
				t2 = space();
				div1 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(path0, "d", "m15 18-6-6 6-6");
				add_location(path0, file$8, 47, 208, 1499);
				attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
				attr_dev(svg0, "width", "24");
				attr_dev(svg0, "height", "24");
				attr_dev(svg0, "fill", "none");
				attr_dev(svg0, "stroke", "currentColor");
				attr_dev(svg0, "stroke-width", "2");
				attr_dev(svg0, "stroke-linecap", "round");
				attr_dev(svg0, "stroke-linejoin", "round");
				attr_dev(svg0, "class", "lucide lucide-chevron-left");
				add_location(svg0, file$8, 47, 12, 1303);
				attr_dev(button0, "class", "absolute left-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10");
				add_location(button0, file$8, 46, 8, 1136);
				if (!src_url_equal(img.src, img_src_value = /*images*/ ctx[0][/*currentIndex*/ ctx[1]])) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "featured");
				attr_dev(img, "loading", "lazy");
				attr_dev(img, "class", "h-full object-contain");
				add_location(img, file$8, 51, 8, 1591);
				attr_dev(path1, "d", "m9 18 6-6-6-6");
				add_location(path1, file$8, 55, 209, 2093);
				attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
				attr_dev(svg1, "width", "24");
				attr_dev(svg1, "height", "24");
				attr_dev(svg1, "fill", "none");
				attr_dev(svg1, "stroke", "currentColor");
				attr_dev(svg1, "stroke-width", "2");
				attr_dev(svg1, "stroke-linecap", "round");
				attr_dev(svg1, "stroke-linejoin", "round");
				attr_dev(svg1, "class", "lucide lucide-chevron-right");
				add_location(svg1, file$8, 55, 12, 1896);
				attr_dev(button1, "class", "absolute right-2 top-1/2 transform -translate-y-1/2 text-bright z-10 rounded-full p-1 hover:bg-dark hover:bg-opacity-10");
				add_location(button1, file$8, 54, 8, 1728);
				attr_dev(div0, "class", "relative w-auto h-96 overflow-hidden rounded-lg");
				add_location(div0, file$8, 44, 4, 1034);
				attr_dev(div1, "class", "flex mt-4 space-x-4 overflow-x-auto");
				add_location(div1, file$8, 65, 4, 2393);
				attr_dev(div2, "class", "flex flex-col items-center");
				add_location(div2, file$8, 42, 0, 941);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				append_dev(div0, button0);
				append_dev(button0, svg0);
				append_dev(svg0, path0);
				append_dev(div0, t0);
				append_dev(div0, img);
				append_dev(div0, t1);
				append_dev(div0, button1);
				append_dev(button1, svg1);
				append_dev(svg1, path1);
				append_dev(div2, t2);
				append_dev(div2, div1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div1, null);
					}
				}

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*goPrev*/ ctx[3], false, false, false, false),
						listen_dev(button1, "click", /*goNext*/ ctx[2], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*images, currentIndex*/ 3 && !src_url_equal(img.src, img_src_value = /*images*/ ctx[0][/*currentIndex*/ ctx[1]])) {
					attr_dev(img, "src", img_src_value);
				}

				if (dirty & /*images, currentIndex, setCurrentImage*/ 19) {
					each_value = ensure_array_like_dev(/*images*/ ctx[0]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$4(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$4(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				destroy_each(each_blocks, detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$9.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$9($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Gallery', slots, []);
		let { images = [] } = $$props;
		let currentIndex = 0;

		function goNext() {
			$$invalidate(1, currentIndex = (currentIndex + 1) % images.length);
		}

		function goPrev() {
			$$invalidate(1, currentIndex = (currentIndex - 1 + images.length) % images.length);
		}

		function setCurrentImage(index) {
			$$invalidate(1, currentIndex = index);
		}

		const handleKeyDown = event => {
			if (event.key === 'ArrowLeft') {
				goPrev();
			}

			if (event.key === 'ArrowRight') {
				goNext();
			}
		};

		onMount(() => {
			window.addEventListener('keydown', handleKeyDown);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		});

		onDestroy(() => {
			window.removeEventListener('keydown', handleKeyDown);
		});

		const writable_props = ['images'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
		});

		const click_handler = index => setCurrentImage(index);

		$$self.$$set = $$props => {
			if ('images' in $$props) $$invalidate(0, images = $$props.images);
		};

		$$self.$capture_state = () => ({
			onMount,
			onDestroy,
			images,
			currentIndex,
			goNext,
			goPrev,
			setCurrentImage,
			handleKeyDown
		});

		$$self.$inject_state = $$props => {
			if ('images' in $$props) $$invalidate(0, images = $$props.images);
			if ('currentIndex' in $$props) $$invalidate(1, currentIndex = $$props.currentIndex);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [images, currentIndex, goNext, goPrev, setCurrentImage, click_handler];
	}

	class Gallery extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$9, create_fragment$9, safe_not_equal, { images: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Gallery",
				options,
				id: create_fragment$9.name
			});
		}

		get images() {
			throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set images(value) {
			throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\pages\ProjectDetails.svelte generated by Svelte v4.2.18 */
	const file$7 = "src\\pages\\ProjectDetails.svelte";

	function get_each_context$3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[3] = list[i];
		return child_ctx;
	}

	// (17:4) {#if project}
	function create_if_block$4(ctx) {
		let div1;
		let h1;
		let t0_value = /*project*/ ctx[0].title + "";
		let t0;
		let t1;
		let div0;
		let t2;
		let div2;
		let gallery;
		let current;
		let each_value = ensure_array_like_dev(/*project*/ ctx[0].description);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
		}

		gallery = new Gallery({
				props: { images: /*project*/ ctx[0].images },
				$$inline: true
			});

		const block = {
			c: function create() {
				div1 = element("div");
				h1 = element("h1");
				t0 = text(t0_value);
				t1 = space();
				div0 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t2 = space();
				div2 = element("div");
				create_component(gallery.$$.fragment);
				attr_dev(h1, "class", "text-[40px] md:text-[100px] font-new-amsterdam");
				add_location(h1, file$7, 18, 12, 544);
				attr_dev(div0, "class", "text-left");
				add_location(div0, file$7, 19, 12, 637);
				attr_dev(div1, "class", "w-full md:w-auto");
				add_location(div1, file$7, 17, 8, 500);
				attr_dev(div2, "class", "w-full");
				add_location(div2, file$7, 25, 8, 827);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, h1);
				append_dev(h1, t0);
				append_dev(div1, t1);
				append_dev(div1, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div0, null);
					}
				}

				insert_dev(target, t2, anchor);
				insert_dev(target, div2, anchor);
				mount_component(gallery, div2, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				if ((!current || dirty & /*project*/ 1) && t0_value !== (t0_value = /*project*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

				if (dirty & /*project*/ 1) {
					each_value = ensure_array_like_dev(/*project*/ ctx[0].description);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$3(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div0, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				const gallery_changes = {};
				if (dirty & /*project*/ 1) gallery_changes.images = /*project*/ ctx[0].images;
				gallery.$set(gallery_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(gallery.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(gallery.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
					detach_dev(t2);
					detach_dev(div2);
				}

				destroy_each(each_blocks, detaching);
				destroy_component(gallery);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$4.name,
			type: "if",
			source: "(17:4) {#if project}",
			ctx
		});

		return block;
	}

	// (21:16) {#each project.description as infotext}
	function create_each_block$3(ctx) {
		let p;
		let t_value = /*infotext*/ ctx[3] + "";
		let t;

		const block = {
			c: function create() {
				p = element("p");
				t = text(t_value);
				add_location(p, file$7, 21, 20, 739);
			},
			m: function mount(target, anchor) {
				insert_dev(target, p, anchor);
				append_dev(p, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*project*/ 1 && t_value !== (t_value = /*infotext*/ ctx[3] + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(p);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$3.name,
			type: "each",
			source: "(21:16) {#each project.description as infotext}",
			ctx
		});

		return block;
	}

	function create_fragment$8(ctx) {
		let div;
		let current;
		let if_block = /*project*/ ctx[0] && create_if_block$4(ctx);

		const block = {
			c: function create() {
				div = element("div");
				if (if_block) if_block.c();
				attr_dev(div, "class", "flex flex-col md:flex-row justify-between m-2");
				add_location(div, file$7, 15, 0, 412);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*project*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*project*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$4(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (if_block) if_block.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$8.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$8($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ProjectDetails', slots, []);
		let { title } = $$props;
		let { category } = $$props;
		let project;

		onMount(async () => {
			const response = await fetch('data/projects.json');
			const projects = await response.json();
			$$invalidate(0, project = projects[category].projects.find(p => p.title === title));
		});

		$$self.$$.on_mount.push(function () {
			if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
				console.warn("<ProjectDetails> was created without expected prop 'title'");
			}

			if (category === undefined && !('category' in $$props || $$self.$$.bound[$$self.$$.props['category']])) {
				console.warn("<ProjectDetails> was created without expected prop 'category'");
			}
		});

		const writable_props = ['title', 'category'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectDetails> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('title' in $$props) $$invalidate(1, title = $$props.title);
			if ('category' in $$props) $$invalidate(2, category = $$props.category);
		};

		$$self.$capture_state = () => ({
			onMount,
			Gallery,
			title,
			category,
			project
		});

		$$self.$inject_state = $$props => {
			if ('title' in $$props) $$invalidate(1, title = $$props.title);
			if ('category' in $$props) $$invalidate(2, category = $$props.category);
			if ('project' in $$props) $$invalidate(0, project = $$props.project);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [project, title, category];
	}

	class ProjectDetails extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$8, safe_not_equal, { title: 1, category: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ProjectDetails",
				options,
				id: create_fragment$8.name
			});
		}

		get title() {
			throw new Error("<ProjectDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set title(value) {
			throw new Error("<ProjectDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get category() {
			throw new Error("<ProjectDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set category(value) {
			throw new Error("<ProjectDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\Popup.svelte generated by Svelte v4.2.18 */
	const file$6 = "src\\components\\Popup.svelte";

	// (37:0) {#if isOpen}
	function create_if_block$3(ctx) {
		let div1;
		let div0;
		let button;
		let svg;
		let path0;
		let path1;
		let t;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				button = element("button");
				svg = svg_element("svg");
				path0 = svg_element("path");
				path1 = svg_element("path");
				t = space();
				if (default_slot) default_slot.c();
				attr_dev(path0, "d", "M18 6 6 18");
				add_location(path0, file$6, 40, 221, 1563);
				attr_dev(path1, "d", "m6 6 12 12");
				add_location(path1, file$6, 40, 243, 1585);
				attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
				attr_dev(svg, "width", "24");
				attr_dev(svg, "height", "24");
				attr_dev(svg, "viewBox", "0 0 24 24");
				attr_dev(svg, "fill", "none");
				attr_dev(svg, "stroke", "currentColor");
				attr_dev(svg, "stroke-width", "3");
				attr_dev(svg, "stroke-linecap", "round");
				attr_dev(svg, "stroke-linejoin", "round");
				attr_dev(svg, "class", "lucide lucide-x");
				add_location(svg, file$6, 40, 16, 1358);
				attr_dev(button, "class", "absolute top-2 right-2 rounded-full p-1 text-accent1 hover:bg-dark hover:bg-opacity-10 z-50");
				add_location(button, file$6, 39, 12, 1210);
				attr_dev(div0, "class", "bg-bright p-2 md:p-6 rounded-none md:rounded-lg shadow-lg relative w-full md:w-10/12 h-full max-h-none md:max-h-[calc(100vh-100px)] z-50");
				add_location(div0, file$6, 38, 8, 1046);
				attr_dev(div1, "id", "popup-overlay");
				attr_dev(div1, "class", "fixed inset-0 flex items-center justify-center bg-dark bg-opacity-75 z-40");
				attr_dev(div1, "aria-label", "Close Popup");
				attr_dev(div1, "role", "presentation");
				add_location(div1, file$6, 37, 4, 855);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, button);
				append_dev(button, svg);
				append_dev(svg, path0);
				append_dev(svg, path1);
				append_dev(div0, t);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button, "click", /*closePopup*/ ctx[2], false, false, false, false),
						listen_dev(div1, "click", /*handleClickOutside*/ ctx[1], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if (default_slot) default_slot.d(detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$3.name,
			type: "if",
			source: "(37:0) {#if isOpen}",
			ctx
		});

		return block;
	}

	function create_fragment$7(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*isOpen*/ ctx[0] && create_if_block$3(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*isOpen*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isOpen*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$7.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$7($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Popup', slots, ['default']);
		let { isOpen = false } = $$props;
		let dispatch = createEventDispatcher();

		const handleKeyDown = event => {
			if (event.key === 'Escape') {
				closePopup();
			}
		};

		const handleClickOutside = event => {
			if (event.target.id === 'popup-overlay') {
				closePopup();
			}
		};

		onMount(() => {
			window.addEventListener('keydown', handleKeyDown);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		});

		onDestroy(() => {
			window.removeEventListener('keydown', handleKeyDown);
		});

		function closePopup() {
			$$invalidate(0, isOpen = false);
			dispatch("closePopup");
		}

		const writable_props = ['isOpen'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popup> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
			if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({
			onMount,
			onDestroy,
			createEventDispatcher,
			isOpen,
			dispatch,
			handleKeyDown,
			handleClickOutside,
			closePopup
		});

		$$self.$inject_state = $$props => {
			if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
			if ('dispatch' in $$props) dispatch = $$props.dispatch;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [isOpen, handleClickOutside, closePopup, $$scope, slots];
	}

	class Popup extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$7, safe_not_equal, { isOpen: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Popup",
				options,
				id: create_fragment$7.name
			});
		}

		get isOpen() {
			throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isOpen(value) {
			throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\ProjectIcon.svelte generated by Svelte v4.2.18 */
	const file$5 = "src\\components\\ProjectIcon.svelte";

	// (30:0) <Popup isOpen={openProject} on:closePopup={closeProjectPopup}>
	function create_default_slot(ctx) {
		let projectdetails;
		let current;

		projectdetails = new ProjectDetails({
				props: {
					title: /*title*/ ctx[0],
					category: /*category*/ ctx[2]
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(projectdetails.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(projectdetails, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const projectdetails_changes = {};
				if (dirty & /*title*/ 1) projectdetails_changes.title = /*title*/ ctx[0];
				if (dirty & /*category*/ 4) projectdetails_changes.category = /*category*/ ctx[2];
				projectdetails.$set(projectdetails_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(projectdetails.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(projectdetails.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(projectdetails, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(30:0) <Popup isOpen={openProject} on:closePopup={closeProjectPopup}>",
			ctx
		});

		return block;
	}

	function create_fragment$6(ctx) {
		let div2;
		let button;
		let img;
		let img_src_value;
		let t0;
		let div1;
		let div0;
		let t1;
		let t2;
		let popup;
		let current;
		let mounted;
		let dispose;

		popup = new Popup({
				props: {
					isOpen: /*openProject*/ ctx[3],
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		popup.$on("closePopup", /*closeProjectPopup*/ ctx[5]);

		const block = {
			c: function create() {
				div2 = element("div");
				button = element("button");
				img = element("img");
				t0 = space();
				div1 = element("div");
				div0 = element("div");
				t1 = text(/*title*/ ctx[0]);
				t2 = space();
				create_component(popup.$$.fragment);
				if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[1])) attr_dev(img, "src", img_src_value);
				attr_dev(img, "loading", "lazy");
				attr_dev(img, "alt", /*title*/ ctx[0]);
				attr_dev(img, "class", "transition-transform duration-400 transform group-hover:scale-115");
				add_location(img, file$5, 22, 8, 558);
				attr_dev(div0, "class", "text-black text-[40px] font-new-amsterdam leading-tight");
				add_location(div0, file$5, 24, 12, 857);
				attr_dev(div1, "class", "absolute top-0 left-0 w-full h-full bg-bright opacity-0 transition-opacity duration-300 group-hover:opacity-80 flex items-center justify-center");
				add_location(div1, file$5, 23, 8, 686);
				add_location(button, file$5, 21, 4, 512);
				attr_dev(div2, "class", "relative inline-block overflow-hidden group mx-1 w-[120px] md:w-[250px] h-[120px] md:h-[250px]");
				add_location(div2, file$5, 20, 0, 398);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, button);
				append_dev(button, img);
				append_dev(button, t0);
				append_dev(button, div1);
				append_dev(div1, div0);
				append_dev(div0, t1);
				insert_dev(target, t2, anchor);
				mount_component(popup, target, anchor);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*openProjectPopup*/ ctx[4], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (!current || dirty & /*image*/ 2 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[1])) {
					attr_dev(img, "src", img_src_value);
				}

				if (!current || dirty & /*title*/ 1) {
					attr_dev(img, "alt", /*title*/ ctx[0]);
				}

				if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
				const popup_changes = {};
				if (dirty & /*openProject*/ 8) popup_changes.isOpen = /*openProject*/ ctx[3];

				if (dirty & /*$$scope, title, category*/ 69) {
					popup_changes.$$scope = { dirty, ctx };
				}

				popup.$set(popup_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(popup.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(popup.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
					detach_dev(t2);
				}

				destroy_component(popup, detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$6.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('ProjectIcon', slots, []);
		let { title } = $$props;
		let { image } = $$props;
		let { category } = $$props;
		let openProject = false;

		function openProjectPopup() {
			$$invalidate(3, openProject = true);
		}

		function closeProjectPopup() {
			$$invalidate(3, openProject = false);
		}

		$$self.$$.on_mount.push(function () {
			if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
				console.warn("<ProjectIcon> was created without expected prop 'title'");
			}

			if (image === undefined && !('image' in $$props || $$self.$$.bound[$$self.$$.props['image']])) {
				console.warn("<ProjectIcon> was created without expected prop 'image'");
			}

			if (category === undefined && !('category' in $$props || $$self.$$.bound[$$self.$$.props['category']])) {
				console.warn("<ProjectIcon> was created without expected prop 'category'");
			}
		});

		const writable_props = ['title', 'image', 'category'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectIcon> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('title' in $$props) $$invalidate(0, title = $$props.title);
			if ('image' in $$props) $$invalidate(1, image = $$props.image);
			if ('category' in $$props) $$invalidate(2, category = $$props.category);
		};

		$$self.$capture_state = () => ({
			ProjectDetails,
			Popup,
			title,
			image,
			category,
			openProject,
			openProjectPopup,
			closeProjectPopup
		});

		$$self.$inject_state = $$props => {
			if ('title' in $$props) $$invalidate(0, title = $$props.title);
			if ('image' in $$props) $$invalidate(1, image = $$props.image);
			if ('category' in $$props) $$invalidate(2, category = $$props.category);
			if ('openProject' in $$props) $$invalidate(3, openProject = $$props.openProject);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [title, image, category, openProject, openProjectPopup, closeProjectPopup];
	}

	class ProjectIcon extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0, image: 1, category: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "ProjectIcon",
				options,
				id: create_fragment$6.name
			});
		}

		get title() {
			throw new Error("<ProjectIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set title(value) {
			throw new Error("<ProjectIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get image() {
			throw new Error("<ProjectIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set image(value) {
			throw new Error("<ProjectIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get category() {
			throw new Error("<ProjectIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set category(value) {
			throw new Error("<ProjectIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\pages\Home.svelte generated by Svelte v4.2.18 */

	const { Object: Object_1, console: console_1$1 } = globals;
	const file$4 = "src\\pages\\Home.svelte";

	function get_each_context$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[2] = list[i][0];
		child_ctx[0] = list[i][1];
		return child_ctx;
	}

	function get_each_context_1$2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[5] = list[i];
		return child_ctx;
	}

	// (27:4) {#if projects}
	function create_if_block$2(ctx) {
		let div;
		let current;
		let each_value = ensure_array_like_dev(Object.entries(/*projects*/ ctx[0]));
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		const block = {
			c: function create() {
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(div, "class", "flex flex-col justify-center w-full md:w-2/3 mb-8 gap-4");
				add_location(div, file$4, 27, 8, 918);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div, null);
					}
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*Object, projects*/ 1) {
					each_value = ensure_array_like_dev(Object.entries(/*projects*/ ctx[0]));
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block$2(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(div, null);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$2.name,
			type: "if",
			source: "(27:4) {#if projects}",
			ctx
		});

		return block;
	}

	// (32:24) {#each projects.projects.slice(0, 3) as projectItem}
	function create_each_block_1$2(ctx) {
		let projecticon;
		let current;

		projecticon = new ProjectIcon({
				props: {
					title: /*projectItem*/ ctx[5].title,
					image: /*projectItem*/ ctx[5].images[0],
					category: /*title*/ ctx[2]
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(projecticon.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(projecticon, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const projecticon_changes = {};
				if (dirty & /*projects*/ 1) projecticon_changes.title = /*projectItem*/ ctx[5].title;
				if (dirty & /*projects*/ 1) projecticon_changes.image = /*projectItem*/ ctx[5].images[0];
				if (dirty & /*projects*/ 1) projecticon_changes.category = /*title*/ ctx[2];
				projecticon.$set(projecticon_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(projecticon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(projecticon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(projecticon, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1$2.name,
			type: "each",
			source: "(32:24) {#each projects.projects.slice(0, 3) as projectItem}",
			ctx
		});

		return block;
	}

	// (29:12) {#each Object.entries(projects) as [title, projects]}
	function create_each_block$2(ctx) {
		let div3;
		let div0;
		let t0;
		let div2;
		let button;
		let div1;
		let h2;
		let t1_value = /*title*/ ctx[2] + "";
		let t1;
		let t2;
		let p;
		let t4;
		let current;
		let mounted;
		let dispose;
		let each_value_1 = ensure_array_like_dev(/*projects*/ ctx[0].projects.slice(0, 3));
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		function click_handler() {
			return /*click_handler*/ ctx[1](/*title*/ ctx[2]);
		}

		const block = {
			c: function create() {
				div3 = element("div");
				div0 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t0 = space();
				div2 = element("div");
				button = element("button");
				div1 = element("div");
				h2 = element("h2");
				t1 = text(t1_value);
				t2 = space();
				p = element("p");
				p.textContent = "See More Projects →";
				t4 = space();
				attr_dev(div0, "class", "flex flex-row");
				add_location(div0, file$4, 30, 20, 1165);
				attr_dev(h2, "class", "heading");
				add_location(h2, file$4, 45, 32, 1914);
				attr_dev(p, "class", "font-new-amsterdam tracking-widest hover:underline");
				add_location(p, file$4, 48, 32, 2052);
				attr_dev(div1, "class", "flex flex-col items-end md:items-start");
				add_location(div1, file$4, 44, 28, 1828);
				add_location(button, file$4, 41, 24, 1700);
				attr_dev(div2, "class", "flex flex-col w-full md:w-auto px-4");
				add_location(div2, file$4, 40, 20, 1625);
				attr_dev(div3, "class", "flex flex-col md:flex-row items-center md:justify-between");
				add_location(div3, file$4, 29, 16, 1072);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div3, anchor);
				append_dev(div3, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div0, null);
					}
				}

				append_dev(div3, t0);
				append_dev(div3, div2);
				append_dev(div2, button);
				append_dev(button, div1);
				append_dev(div1, h2);
				append_dev(h2, t1);
				append_dev(div1, t2);
				append_dev(div1, p);
				append_dev(div3, t4);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty & /*Object, projects*/ 1) {
					each_value_1 = ensure_array_like_dev(/*projects*/ ctx[0].projects.slice(0, 3));
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1$2(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(div0, null);
						}
					}

					group_outros();

					for (i = each_value_1.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}

				if ((!current || dirty & /*projects*/ 1) && t1_value !== (t1_value = /*title*/ ctx[2] + "")) set_data_dev(t1, t1_value);
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value_1.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div3);
				}

				destroy_each(each_blocks, detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$2.name,
			type: "each",
			source: "(29:12) {#each Object.entries(projects) as [title, projects]}",
			ctx
		});

		return block;
	}

	function create_fragment$5(ctx) {
		let div1;
		let div0;
		let p0;
		let t1;
		let p1;
		let t3;
		let p2;
		let t4;
		let a;
		let t6;
		let t7;
		let current;
		let if_block = /*projects*/ ctx[0] && create_if_block$2(ctx);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				p0 = element("p");
				p0.textContent = "Welcome to my portfolio!";
				t1 = space();
				p1 = element("p");
				p1.textContent = "I'm Lena, a computer science and archaeology student. On this website, I feature some of my creative projects.";
				t3 = space();
				p2 = element("p");
				t4 = text("For more information about my background, check out \r\n            ");
				a = element("a");
				a.textContent = "my CV";
				t6 = text("!");
				t7 = space();
				if (if_block) if_block.c();
				attr_dev(p0, "class", "font-new-amsterdam text-[48px] md:text-[100px]");
				add_location(p0, file$4, 16, 8, 454);
				add_location(p1, file$4, 17, 8, 550);
				attr_dev(a, "href", "/#/cv");
				attr_dev(a, "class", "text-accent1 hover:text-accent1-hover");
				add_location(a, file$4, 22, 12, 784);
				add_location(p2, file$4, 20, 8, 701);
				attr_dev(div0, "class", "items-center justify-center m-8 gap-4");
				add_location(div0, file$4, 15, 4, 393);
				attr_dev(div1, "align", "center");
				add_location(div1, file$4, 14, 0, 367);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, p0);
				append_dev(div0, t1);
				append_dev(div0, p1);
				append_dev(div0, t3);
				append_dev(div0, p2);
				append_dev(p2, t4);
				append_dev(p2, a);
				append_dev(p2, t6);
				append_dev(div1, t7);
				if (if_block) if_block.m(div1, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*projects*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*projects*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$2(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div1, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if (if_block) if_block.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Home', slots, []);
		let projects;

		onMount(async () => {
			const response = await fetch('data/projects.json');
			$$invalidate(0, projects = await response.json());
			console.log(projects);
		});

		const writable_props = [];

		Object_1.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Home> was created with unknown prop '${key}'`);
		});

		const click_handler = title => push("/" + title);
		$$self.$capture_state = () => ({ onMount, ProjectIcon, push, projects });

		$$self.$inject_state = $$props => {
			if ('projects' in $$props) $$invalidate(0, projects = $$props.projects);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [projects, click_handler];
	}

	class Home extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Home",
				options,
				id: create_fragment$5.name
			});
		}
	}

	/* src\pages\CV.svelte generated by Svelte v4.2.18 */
	const file$3 = "src\\pages\\CV.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[2] = list[i];
		child_ctx[4] = i;
		return child_ctx;
	}

	function get_each_context_1$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[5] = list[i];
		child_ctx[4] = i;
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[7] = list[i];
		child_ctx[4] = i;
		return child_ctx;
	}

	function get_each_context_3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[9] = list[i];
		return child_ctx;
	}

	function get_each_context_4(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[12] = list[i];
		return child_ctx;
	}

	function get_each_context_5(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[15] = list[i];
		return child_ctx;
	}

	// (21:4) {#if cv}
	function create_if_block$1(ctx) {
		let div4;
		let t0;
		let div3;
		let div0;
		let strong0;
		let t2;
		let span0;
		let t3;
		let div1;
		let strong1;
		let t5;
		let span1;
		let t6;
		let div2;
		let strong2;
		let t8;
		let span2;
		let each_value_3 = ensure_array_like_dev(/*keys*/ ctx[1]);
		let each_blocks_3 = [];

		for (let i = 0; i < each_value_3.length; i += 1) {
			each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
		}

		let each_value_2 = ensure_array_like_dev(/*cv*/ ctx[0]["languages"]);
		let each_blocks_2 = [];

		for (let i = 0; i < each_value_2.length; i += 1) {
			each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
		}

		let each_value_1 = ensure_array_like_dev(/*cv*/ ctx[0]["itSkills"]);
		let each_blocks_1 = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
		}

		let each_value = ensure_array_like_dev(/*cv*/ ctx[0]["personalInterests"]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				div4 = element("div");

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					each_blocks_3[i].c();
				}

				t0 = space();
				div3 = element("div");
				div0 = element("div");
				strong0 = element("strong");
				strong0.textContent = "Languages:";
				t2 = space();
				span0 = element("span");

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].c();
				}

				t3 = space();
				div1 = element("div");
				strong1 = element("strong");
				strong1.textContent = "IT Skills (Personal Projects / Working Experience):";
				t5 = space();
				span1 = element("span");

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t6 = space();
				div2 = element("div");
				strong2 = element("strong");
				strong2.textContent = "Personal Interests:";
				t8 = space();
				span2 = element("span");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				add_location(strong0, file$3, 49, 34, 2275);
				add_location(span0, file$3, 50, 20, 2323);
				attr_dev(div0, "class", "mb-2");
				add_location(div0, file$3, 49, 16, 2257);
				add_location(strong1, file$3, 56, 34, 2599);
				add_location(span1, file$3, 57, 20, 2688);
				attr_dev(div1, "class", "mb-2");
				add_location(div1, file$3, 56, 16, 2581);
				add_location(strong2, file$3, 63, 21, 2937);
				add_location(span2, file$3, 64, 20, 2994);
				add_location(div2, file$3, 63, 16, 2932);
				attr_dev(div3, "class", "bg-bright rounded-lg shadow p-4");
				add_location(div3, file$3, 48, 12, 2195);
				attr_dev(div4, "class", "w-full md:w-2/3 flex flex-col gap-8 mb-8");
				add_location(div4, file$3, 21, 8, 611);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div4, anchor);

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					if (each_blocks_3[i]) {
						each_blocks_3[i].m(div4, null);
					}
				}

				append_dev(div4, t0);
				append_dev(div4, div3);
				append_dev(div3, div0);
				append_dev(div0, strong0);
				append_dev(div0, t2);
				append_dev(div0, span0);

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					if (each_blocks_2[i]) {
						each_blocks_2[i].m(span0, null);
					}
				}

				append_dev(div3, t3);
				append_dev(div3, div1);
				append_dev(div1, strong1);
				append_dev(div1, t5);
				append_dev(div1, span1);

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					if (each_blocks_1[i]) {
						each_blocks_1[i].m(span1, null);
					}
				}

				append_dev(div3, t6);
				append_dev(div3, div2);
				append_dev(div2, strong2);
				append_dev(div2, t8);
				append_dev(div2, span2);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(span2, null);
					}
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv, keys*/ 3) {
					each_value_3 = ensure_array_like_dev(/*keys*/ ctx[1]);
					let i;

					for (i = 0; i < each_value_3.length; i += 1) {
						const child_ctx = get_each_context_3(ctx, each_value_3, i);

						if (each_blocks_3[i]) {
							each_blocks_3[i].p(child_ctx, dirty);
						} else {
							each_blocks_3[i] = create_each_block_3(child_ctx);
							each_blocks_3[i].c();
							each_blocks_3[i].m(div4, t0);
						}
					}

					for (; i < each_blocks_3.length; i += 1) {
						each_blocks_3[i].d(1);
					}

					each_blocks_3.length = each_value_3.length;
				}

				if (dirty & /*cv*/ 1) {
					each_value_2 = ensure_array_like_dev(/*cv*/ ctx[0]["languages"]);
					let i;

					for (i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_2, i);

						if (each_blocks_2[i]) {
							each_blocks_2[i].p(child_ctx, dirty);
						} else {
							each_blocks_2[i] = create_each_block_2(child_ctx);
							each_blocks_2[i].c();
							each_blocks_2[i].m(span0, null);
						}
					}

					for (; i < each_blocks_2.length; i += 1) {
						each_blocks_2[i].d(1);
					}

					each_blocks_2.length = each_value_2.length;
				}

				if (dirty & /*cv*/ 1) {
					each_value_1 = ensure_array_like_dev(/*cv*/ ctx[0]["itSkills"]);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(child_ctx, dirty);
						} else {
							each_blocks_1[i] = create_each_block_1$1(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(span1, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}

					each_blocks_1.length = each_value_1.length;
				}

				if (dirty & /*cv*/ 1) {
					each_value = ensure_array_like_dev(/*cv*/ ctx[0]["personalInterests"]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(span2, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div4);
				}

				destroy_each(each_blocks_3, detaching);
				destroy_each(each_blocks_2, detaching);
				destroy_each(each_blocks_1, detaching);
				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(21:4) {#if cv}",
			ctx
		});

		return block;
	}

	// (32:36) {#if item.location}
	function create_if_block_2(ctx) {
		let span;
		let t_value = /*item*/ ctx[12].location + "";
		let t;

		const block = {
			c: function create() {
				span = element("span");
				t = text(t_value);
				attr_dev(span, "class", "text-right text-base md:text-lg text-gray-700 md:min-w-[120px]");
				add_location(span, file$3, 32, 40, 1461);
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && t_value !== (t_value = /*item*/ ctx[12].location + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_2.name,
			type: "if",
			source: "(32:36) {#if item.location}",
			ctx
		});

		return block;
	}

	// (36:32) {#if item.details}
	function create_if_block_1(ctx) {
		let ul;
		let each_value_5 = ensure_array_like_dev(/*item*/ ctx[12].details);
		let each_blocks = [];

		for (let i = 0; i < each_value_5.length; i += 1) {
			each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
		}

		const block = {
			c: function create() {
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(ul, "class", "list-disc list-inside mt-1 ml-4 text-left");
				add_location(ul, file$3, 36, 36, 1729);
			},
			m: function mount(target, anchor) {
				insert_dev(target, ul, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ul, null);
					}
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv, keys*/ 3) {
					each_value_5 = ensure_array_like_dev(/*item*/ ctx[12].details);
					let i;

					for (i = 0; i < each_value_5.length; i += 1) {
						const child_ctx = get_each_context_5(ctx, each_value_5, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_5(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_5.length;
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(ul);
				}

				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(36:32) {#if item.details}",
			ctx
		});

		return block;
	}

	// (38:40) {#each item.details as detail}
	function create_each_block_5(ctx) {
		let li;
		let t_value = /*detail*/ ctx[15] + "";
		let t;

		const block = {
			c: function create() {
				li = element("li");
				t = text(t_value);
				add_location(li, file$3, 38, 44, 1899);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, t);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && t_value !== (t_value = /*detail*/ ctx[15] + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_5.name,
			type: "each",
			source: "(38:40) {#each item.details as detail}",
			ctx
		});

		return block;
	}

	// (27:24) {#each cv[key] as item}
	function create_each_block_4(ctx) {
		let div1;
		let div0;
		let span0;
		let t0_value = /*item*/ ctx[12].period + "";
		let t0;
		let t1;
		let span1;
		let t2_value = /*item*/ ctx[12].title + "";
		let t2;
		let t3;
		let t4;
		let if_block0 = /*item*/ ctx[12].location && create_if_block_2(ctx);
		let if_block1 = /*item*/ ctx[12].details && create_if_block_1(ctx);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				span0 = element("span");
				t0 = text(t0_value);
				t1 = space();
				span1 = element("span");
				t2 = text(t2_value);
				t3 = space();
				if (if_block0) if_block0.c();
				t4 = space();
				if (if_block1) if_block1.c();
				attr_dev(span0, "class", "text-accent1 font-semibold text-md md:text-xl min-w-[90px]");
				add_location(span0, file$3, 29, 36, 1160);
				attr_dev(span1, "class", "font-semibold text-lg md:text-2xl flex-1");
				add_location(span1, file$3, 30, 36, 1290);
				attr_dev(div0, "class", "flex flex-col md:flex-row md:items-center md:gap-4");
				add_location(div0, file$3, 28, 32, 1059);
				attr_dev(div1, "class", "bg-bright rounded-lg shadow p-4 flex flex-col gap-2");
				add_location(div1, file$3, 27, 28, 961);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, span0);
				append_dev(span0, t0);
				append_dev(div0, t1);
				append_dev(div0, span1);
				append_dev(span1, t2);
				append_dev(div0, t3);
				if (if_block0) if_block0.m(div0, null);
				append_dev(div1, t4);
				if (if_block1) if_block1.m(div1, null);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && t0_value !== (t0_value = /*item*/ ctx[12].period + "")) set_data_dev(t0, t0_value);
				if (dirty & /*cv*/ 1 && t2_value !== (t2_value = /*item*/ ctx[12].title + "")) set_data_dev(t2, t2_value);

				if (/*item*/ ctx[12].location) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_2(ctx);
						if_block0.c();
						if_block0.m(div0, null);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*item*/ ctx[12].details) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_1(ctx);
						if_block1.c();
						if_block1.m(div1, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_4.name,
			type: "each",
			source: "(27:24) {#each cv[key] as item}",
			ctx
		});

		return block;
	}

	// (23:12) {#each keys as key}
	function create_each_block_3(ctx) {
		let div2;
		let div0;
		let t1;
		let div1;
		let each_value_4 = ensure_array_like_dev(/*cv*/ ctx[0][/*key*/ ctx[9]]);
		let each_blocks = [];

		for (let i = 0; i < each_value_4.length; i += 1) {
			each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
		}

		const block = {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				div0.textContent = `${/*key*/ ctx[9]}`;
				t1 = space();
				div1 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(div0, "class", "font-new-amsterdam text-[40px] md:text-[60px] mb-2 text-left ml-2");
				add_location(div0, file$3, 24, 20, 740);
				attr_dev(div1, "class", "flex flex-col gap-6");
				add_location(div1, file$3, 25, 20, 851);
				add_location(div2, file$3, 23, 16, 714);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, div0);
				append_dev(div2, t1);
				append_dev(div2, div1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div1, null);
					}
				}
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv, keys*/ 3) {
					each_value_4 = ensure_array_like_dev(/*cv*/ ctx[0][/*key*/ ctx[9]]);
					let i;

					for (i = 0; i < each_value_4.length; i += 1) {
						const child_ctx = get_each_context_4(ctx, each_value_4, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_4(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_4.length;
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_3.name,
			type: "each",
			source: "(23:12) {#each keys as key}",
			ctx
		});

		return block;
	}

	// (52:24) {#each cv["languages"] as language, i}
	function create_each_block_2(ctx) {
		let html_tag;
		let raw_value = /*language*/ ctx[7] + "";

		let t_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["languages"].length - 1
		? ', '
		: '') + "";

		let t;

		const block = {
			c: function create() {
				html_tag = new HtmlTag(false);
				t = text(t_value);
				html_tag.a = t;
			},
			m: function mount(target, anchor) {
				html_tag.m(raw_value, target, anchor);
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && raw_value !== (raw_value = /*language*/ ctx[7] + "")) html_tag.p(raw_value);

				if (dirty & /*cv*/ 1 && t_value !== (t_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["languages"].length - 1
				? ', '
				: '') + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					html_tag.d();
					detach_dev(t);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_2.name,
			type: "each",
			source: "(52:24) {#each cv[\\\"languages\\\"] as language, i}",
			ctx
		});

		return block;
	}

	// (59:24) {#each cv["itSkills"] as skill, i}
	function create_each_block_1$1(ctx) {
		let t0_value = /*skill*/ ctx[5] + "";
		let t0;

		let t1_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["itSkills"].length - 1
		? ', '
		: '') + "";

		let t1;

		const block = {
			c: function create() {
				t0 = text(t0_value);
				t1 = text(t1_value);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t0, anchor);
				insert_dev(target, t1, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && t0_value !== (t0_value = /*skill*/ ctx[5] + "")) set_data_dev(t0, t0_value);

				if (dirty & /*cv*/ 1 && t1_value !== (t1_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["itSkills"].length - 1
				? ', '
				: '') + "")) set_data_dev(t1, t1_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(t1);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1$1.name,
			type: "each",
			source: "(59:24) {#each cv[\\\"itSkills\\\"] as skill, i}",
			ctx
		});

		return block;
	}

	// (66:24) {#each cv["personalInterests"] as interest, i}
	function create_each_block$1(ctx) {
		let html_tag;
		let raw_value = /*interest*/ ctx[2] + "";

		let t_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["personalInterests"].length - 1
		? ', '
		: '') + "";

		let t;

		const block = {
			c: function create() {
				html_tag = new HtmlTag(false);
				t = text(t_value);
				html_tag.a = t;
			},
			m: function mount(target, anchor) {
				html_tag.m(raw_value, target, anchor);
				insert_dev(target, t, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*cv*/ 1 && raw_value !== (raw_value = /*interest*/ ctx[2] + "")) html_tag.p(raw_value);

				if (dirty & /*cv*/ 1 && t_value !== (t_value = (/*i*/ ctx[4] < /*cv*/ ctx[0]["personalInterests"].length - 1
				? ', '
				: '') + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					html_tag.d();
					detach_dev(t);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$1.name,
			type: "each",
			source: "(66:24) {#each cv[\\\"personalInterests\\\"] as interest, i}",
			ctx
		});

		return block;
	}

	function create_fragment$4(ctx) {
		let div1;
		let div0;
		let h1;
		let t1;
		let a;
		let t2;
		let a_href_value;
		let t3;
		let if_block = /*cv*/ ctx[0] && create_if_block$1(ctx);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h1 = element("h1");
				h1.textContent = "Lena Kahle";
				t1 = space();
				a = element("a");
				t2 = text("LINKEDIN →");
				t3 = space();
				if (if_block) if_block.c();
				attr_dev(h1, "class", "heading");
				add_location(h1, file$3, 14, 8, 387);
				attr_dev(a, "class", "font-new-amsterdam tracking-widest hover:underline text-[40px]");
				attr_dev(a, "target", "_blank");
				attr_dev(a, "href", a_href_value = /*cv*/ ctx[0]?.linkedin);
				add_location(a, file$3, 17, 8, 453);
				add_location(div0, file$3, 13, 4, 373);
				attr_dev(div1, "align", "center");
				attr_dev(div1, "class", "flex flex-col items-center justify-center");
				add_location(div1, file$3, 12, 0, 298);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, h1);
				append_dev(div0, t1);
				append_dev(div0, a);
				append_dev(a, t2);
				append_dev(div1, t3);
				if (if_block) if_block.m(div1, null);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*cv*/ 1 && a_href_value !== (a_href_value = /*cv*/ ctx[0]?.linkedin)) {
					attr_dev(a, "href", a_href_value);
				}

				if (/*cv*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						if_block.m(div1, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				if (if_block) if_block.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('CV', slots, []);
		let cv;

		const keys = [
			'education',
			'experience',
			'awards and scholarships',
			'extracurricular activities'
		];

		onMount(async () => {
			const response = await fetch('data/cv.json');
			$$invalidate(0, cv = await response.json());
		});

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CV> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ onMount, cv, keys });

		$$self.$inject_state = $$props => {
			if ('cv' in $$props) $$invalidate(0, cv = $$props.cv);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [cv, keys];
	}

	class CV extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "CV",
				options,
				id: create_fragment$4.name
			});
		}
	}

	/* src\pages\Overview.svelte generated by Svelte v4.2.18 */

	const { console: console_1 } = globals;
	const file$2 = "src\\pages\\Overview.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[3] = list[i];
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[6] = list[i];
		return child_ctx;
	}

	// (21:4) {#if data}
	function create_if_block(ctx) {
		let div;
		let h1;
		let t1;
		let p;
		let t2;
		let each1_anchor;
		let current;
		let each_value_1 = ensure_array_like_dev(/*data*/ ctx[0].description);
		let each_blocks_1 = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		let each_value = ensure_array_like_dev(/*data*/ ctx[0].projects);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		const block = {
			c: function create() {
				div = element("div");
				h1 = element("h1");
				h1.textContent = `${/*category*/ ctx[1]}`;
				t1 = space();
				p = element("p");

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t2 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each1_anchor = empty();
				attr_dev(h1, "class", "heading");
				add_location(h1, file$2, 22, 12, 601);
				attr_dev(p, "class", "w-full md:w-1/3 text-center md:text-left");
				add_location(p, file$2, 25, 12, 682);
				attr_dev(div, "class", "flex flex-col md:flex-row items-center mx-1 mb-2 justify-center md:gap-4");
				add_location(div, file$2, 21, 8, 501);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h1);
				append_dev(div, t1);
				append_dev(div, p);

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					if (each_blocks_1[i]) {
						each_blocks_1[i].m(p, null);
					}
				}

				insert_dev(target, t2, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(target, anchor);
					}
				}

				insert_dev(target, each1_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (dirty & /*data*/ 1) {
					each_value_1 = ensure_array_like_dev(/*data*/ ctx[0].description);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(child_ctx, dirty);
						} else {
							each_blocks_1[i] = create_each_block_1(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(p, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}

					each_blocks_1.length = each_value_1.length;
				}

				if (dirty & /*data, category*/ 3) {
					each_value = ensure_array_like_dev(/*data*/ ctx[0].projects);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
					detach_dev(t2);
					detach_dev(each1_anchor);
				}

				destroy_each(each_blocks_1, detaching);
				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(21:4) {#if data}",
			ctx
		});

		return block;
	}

	// (27:16) {#each data.description as description}
	function create_each_block_1(ctx) {
		let t_value = /*description*/ ctx[6] + "";
		let t;
		let br;

		const block = {
			c: function create() {
				t = text(t_value);
				br = element("br");
				add_location(br, file$2, 27, 33, 826);
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
				insert_dev(target, br, anchor);
			},
			p: function update(ctx, dirty) {
				if (dirty & /*data*/ 1 && t_value !== (t_value = /*description*/ ctx[6] + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
					detach_dev(br);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1.name,
			type: "each",
			source: "(27:16) {#each data.description as description}",
			ctx
		});

		return block;
	}

	// (33:8) {#each data.projects as project}
	function create_each_block(ctx) {
		let projecticon;
		let current;

		projecticon = new ProjectIcon({
				props: {
					title: /*project*/ ctx[3].title,
					image: /*project*/ ctx[3].images[0],
					category: /*category*/ ctx[1]
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(projecticon.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(projecticon, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const projecticon_changes = {};
				if (dirty & /*data*/ 1) projecticon_changes.title = /*project*/ ctx[3].title;
				if (dirty & /*data*/ 1) projecticon_changes.image = /*project*/ ctx[3].images[0];
				projecticon.$set(projecticon_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(projecticon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(projecticon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(projecticon, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(33:8) {#each data.projects as project}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let div;
		let current;
		let if_block = /*data*/ ctx[0] && create_if_block(ctx);

		const block = {
			c: function create() {
				div = element("div");
				if (if_block) if_block.c();
				attr_dev(div, "align", "center");
				add_location(div, file$2, 19, 0, 455);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*data*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*data*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (if_block) if_block.d();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Overview', slots, []);
		let data;
		let location = window.location.hash.replace('#/', '');
		let category = location.split('/')[0];

		onMount(async () => {
			const response = await fetch('data/projects.json');
			$$invalidate(0, data = await response.json());
			$$invalidate(0, data = data[category]);
			console.log(data);
		});

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Overview> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			onMount,
			ProjectIcon,
			data,
			location,
			category
		});

		$$self.$inject_state = $$props => {
			if ('data' in $$props) $$invalidate(0, data = $$props.data);
			if ('location' in $$props) location = $$props.location;
			if ('category' in $$props) $$invalidate(1, category = $$props.category);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [data, category];
	}

	class Overview extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Overview",
				options,
				id: create_fragment$3.name
			});
		}
	}

	const routes = {
	    '/': Home,
	    '/cv': CV,
	    '/:category': Overview,
	};

	/* src\TailwindCss.svelte generated by Svelte v4.2.18 */

	function create_fragment$2(ctx) {
		const block = {
			c: noop,
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: noop,
			p: noop,
			i: noop,
			o: noop,
			d: noop
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('TailwindCss', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TailwindCss> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class TailwindCss extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "TailwindCss",
				options,
				id: create_fragment$2.name
			});
		}
	}

	/* src\components\Header.svelte generated by Svelte v4.2.18 */
	const file$1 = "src\\components\\Header.svelte";

	function create_fragment$1(ctx) {
		let div1;
		let a0;
		let img;
		let img_src_value;
		let t0;
		let h1;
		let t2;
		let div0;
		let a1;
		let t4;
		let a2;

		const block = {
			c: function create() {
				div1 = element("div");
				a0 = element("a");
				img = element("img");
				t0 = space();
				h1 = element("h1");
				h1.textContent = "Lena Kahle";
				t2 = space();
				div0 = element("div");
				a1 = element("a");
				a1.textContent = "Blog";
				t4 = space();
				a2 = element("a");
				a2.textContent = "CV";
				if (!src_url_equal(img.src, img_src_value = "logo/logo_dark.png")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Logo");
				attr_dev(img, "class", "h-11");
				add_location(img, file$1, 3, 8, 211);
				attr_dev(h1, "class", "hidden md:block");
				add_location(h1, file$1, 4, 8, 275);
				attr_dev(a0, "href", "/#");
				attr_dev(a0, "class", "flex justify-center items-center gap-2");
				add_location(a0, file$1, 2, 4, 141);
				attr_dev(a1, "href", "/#/blog");
				add_location(a1, file$1, 10, 8, 400);
				attr_dev(a2, "href", "/#/cv");
				add_location(a2, file$1, 11, 8, 436);
				attr_dev(div0, "class", "flex gap-4 pr-4 ");
				add_location(div0, file$1, 9, 4, 360);
				attr_dev(div1, "class", "flex gap-10 justify-between items-center pt-3 pb-2 px-8 z-20 text-dark text-[40px] leading-tight font-new-amsterdam");
				add_location(div1, file$1, 0, 0, 0);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, a0);
				append_dev(a0, img);
				append_dev(a0, t0);
				append_dev(a0, h1);
				append_dev(div1, t2);
				append_dev(div1, div0);
				append_dev(div0, a1);
				append_dev(div0, t4);
				append_dev(div0, a2);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$1($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Header', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class Header extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Header",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src\App.svelte generated by Svelte v4.2.18 */
	const file = "src\\App.svelte";

	function create_fragment(ctx) {
		let div1;
		let header;
		let t0;
		let div0;
		let router;
		let t1;
		let tailwindcss;
		let current;
		header = new Header({ $$inline: true });
		router = new Router({ props: { routes }, $$inline: true });
		tailwindcss = new TailwindCss({ $$inline: true });

		const block = {
			c: function create() {
				div1 = element("div");
				create_component(header.$$.fragment);
				t0 = space();
				div0 = element("div");
				create_component(router.$$.fragment);
				t1 = space();
				create_component(tailwindcss.$$.fragment);
				attr_dev(div0, "class", "h-screen overflow-auto mt-2 flex flex-col w-full bg-dark bg-opacity-5");
				add_location(div0, file, 11, 4, 375);
				attr_dev(div1, "class", "max-h-screen flex flex-col bg-bright text-dark");
				add_location(div1, file, 8, 0, 292);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				mount_component(header, div1, null);
				append_dev(div1, t0);
				append_dev(div1, div0);
				mount_component(router, div0, null);
				insert_dev(target, t1, anchor);
				mount_component(tailwindcss, target, anchor);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(header.$$.fragment, local);
				transition_in(router.$$.fragment, local);
				transition_in(tailwindcss.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(header.$$.fragment, local);
				transition_out(router.$$.fragment, local);
				transition_out(tailwindcss.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
					detach_dev(t1);
				}

				destroy_component(header);
				destroy_component(router);
				destroy_component(tailwindcss, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ Router, routes, TailwindCss, Header });
		return [];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "App",
				options,
				id: create_fragment.name
			});
		}
	}

	const app = new App({
		target: document.body,
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
