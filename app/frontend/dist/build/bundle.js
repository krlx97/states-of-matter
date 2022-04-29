
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self$1(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
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
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
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
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const authStore = writable({
        signinForm: {
            username: "",
            password: ""
        },
        signupForm: {
            username: "",
            password: ""
        }
    });

    const decksStore = writable({
        deckSlots: [],
        deckCards: [],
        cardsInDeck: 0
    });

    const lobbyStore = writable({
        lobbyId: 0,
        host: {
            username: "",
            socketId: "",
            avatarId: 0
        },
        challengee: {
            username: "",
            socketId: "",
            avatarId: 0
        }
    });

    const gameStore = writable({
        gameId: 0,
        currentPlayer: "",
        player: {
            username: "",
            hero: {
                id: 0,
                health: 0,
                maxHealth: 0,
                mana: 0,
                maxMana: 0,
                effects: []
            },
            minion: { a: undefined, b: undefined, c: undefined, d: undefined },
            trap: undefined,
            deck: [],
            hand: [],
            graveyard: []
        },
        opponent: {
            username: "",
            hero: {
                id: 0,
                health: 0,
                maxHealth: 0,
                mana: 0,
                maxMana: 0,
                effects: []
            },
            minion: { a: undefined, b: undefined, c: undefined, d: undefined },
            trap: undefined,
            deck: 0,
            hand: 0,
            graveyard: []
        }
    });

    const hoveredCardStore = writable({
        field: ""
    });

    var CardType;
    (function (CardType) {
        CardType[CardType["HERO"] = 0] = "HERO";
        CardType[CardType["MINION"] = 1] = "MINION";
        CardType[CardType["MAGIC"] = 2] = "MAGIC";
        CardType[CardType["TRAP"] = 3] = "TRAP";
    })(CardType || (CardType = {}));
    var CardKlass;
    (function (CardKlass) {
        CardKlass[CardKlass["NEUTRAL"] = 0] = "NEUTRAL";
        CardKlass[CardKlass["SOLID"] = 1] = "SOLID";
        CardKlass[CardKlass["LIQUID"] = 2] = "LIQUID";
        CardKlass[CardKlass["GAS"] = 3] = "GAS";
        CardKlass[CardKlass["PLASMA"] = 4] = "PLASMA";
    })(CardKlass || (CardKlass = {}));
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus[PlayerStatus["OFFLINE"] = 0] = "OFFLINE";
        PlayerStatus[PlayerStatus["ONLINE"] = 1] = "ONLINE";
        PlayerStatus[PlayerStatus["INQUEUE"] = 2] = "INQUEUE";
        PlayerStatus[PlayerStatus["INLOBBY"] = 3] = "INLOBBY";
        PlayerStatus[PlayerStatus["INGAME"] = 4] = "INGAME";
    })(PlayerStatus || (PlayerStatus = {}));
    var Effect;
    (function (Effect) {
        Effect[Effect["GREED"] = 0] = "GREED";
        Effect[Effect["BLIND"] = 1] = "BLIND";
        Effect[Effect["CHARGE"] = 2] = "CHARGE";
    })(Effect || (Effect = {}));

    const selectedCardStore = writable({
        field: "",
        hand: {
            gid: 0,
            type: CardType.MINION
        }
    });

    const modalStore = writable({
        data: {},
        current: "",
        list: {
            addFriend: false,
            block: false,
            changeDeckName: false,
            gift: false,
            joinLobby: false,
            setDeckKlass: false,
            tip: false,
            unfriend: false,
            graveyard: false,
            sendToken: false
        }
    });

    const notificationsStore = writable([]);

    const playerStore = writable({
        socketId: "",
        username: "",
        publicKey: "",
        privateKey: "",
        privateKeyHash: "",
        status: PlayerStatus.OFFLINE,
        xp: 0,
        lv: 1,
        deckId: 0,
        avatarId: 0,
        lobbyId: 0,
        gameId: 0,
        decks: [],
        social: {
            friends: [],
            requests: [],
            blocked: []
        },
        wallet: [],
        last_nonce: 0
    });

    const chatStore = writable([]);

    const socialStore = writable({
        friends: [],
        chat: {
            username: "",
            avatarId: 0,
            status: PlayerStatus.OFFLINE,
            isOpen: false,
            messages: []
        }
    });

    class CryptoService {
        constructor() {
            this._crypto = CryptoJS;
        }
        decrypt(private_key_hash, password) {
            const { _crypto } = this;
            const decrypted = _crypto.AES.decrypt(private_key_hash, password);
            return decrypted.toString(_crypto.enc.Utf8);
        }
        encrypt(privateKey, password) {
            return this._crypto.AES.encrypt(privateKey, password).toString();
        }
    }

    class EccService {
        constructor() {
            this._ecc = eosjs_ecc;
        }
        async randomKey() {
            return await this._ecc.randomKey();
        }
        sign(data, private_key) {
            return this._ecc.sign(data, private_key);
        }
        toPublic(private_key) {
            return this._ecc.privateToPublic(private_key);
        }
    }

    class MiscService {
        showNotification(msg) {
            notificationsStore.update((store) => {
                const id = store.length;
                store.push({ id, msg });
                return store;
            });
            setTimeout(() => {
                notificationsStore.update((store) => {
                    const id = store.length;
                    const notification = store.find((notification) => notification.id === id);
                    const i = store.indexOf(notification);
                    store.splice(i, 1);
                    return store;
                });
            }, 10000);
        }
        openModal(name, data = {}) {
            modalStore.update((store) => {
                store.current = name;
                store.data = data;
                store.list[name] = true;
                return store;
            });
        }
        closeModal() {
            modalStore.update((store) => {
                store.list[store.current] = false;
                store.current = "";
                store.data = {};
                return store;
            });
        }
    }

    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];

    var parseuri = function parseuri(str) {
        var src = str,
            b = str.indexOf('['),
            e = str.indexOf(']');

        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }

        var m = re.exec(str || ''),
            uri = {},
            i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }

        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);

        return uri;
    };

    function pathNames(obj, path) {
        var regx = /\/{2,9}/g,
            names = path.replace(regx, "/").split("/");

        if (path.substr(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.substr(path.length - 1, 1) == '/') {
            names.splice(names.length - 1, 1);
        }

        return names;
    }

    function queryKey(uri, query) {
        var data = {};

        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });

        return data;
    }

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parseuri(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    var hasCors = {exports: {}};

    /**
     * Module exports.
     *
     * Logic borrowed from Modernizr:
     *
     *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
     */

    try {
      hasCors.exports = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
    } catch (err) {
      // if XMLHttp support is disabled in IE then it will throw
      // when trying to create
      hasCors.exports = false;
    }

    var hasCORS = hasCors.exports;

    var globalThis$1 = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    // browser shim for xmlhttprequest module
    function XMLHttpRequest$1 (opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThis$1[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = setTimeout;
    const NATIVE_CLEAR_TIMEOUT = clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis$1);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis$1);
        }
        else {
            obj.setTimeoutFn = setTimeout.bind(globalThis$1);
            obj.clearTimeoutFn = clearTimeout.bind(globalThis$1);
        }
    }

    /**
     * Expose `Emitter`.
     */

    var Emitter_1 = Emitter;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + content);
        };
        return fileReader.readAsDataURL(data);
    };

    /*
     * base64-arraybuffer 1.0.1 <https://github.com/niklasvh/base64-arraybuffer>
     * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
     * Released under MIT License
     */
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    var lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (var i$1 = 0; i$1 < chars.length; i$1++) {
        lookup$1[chars.charCodeAt(i$1)] = i$1;
    }
    var decode$1 = function (base64) {
        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    class Transport extends Emitter_1 {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} options.
         * @api private
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.readyState = "";
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} str
         * @return {Transport} for chaining
         * @api protected
         */
        onError(msg, desc) {
            const err = new Error(msg);
            // @ts-ignore
            err.type = "TransportError";
            // @ts-ignore
            err.description = desc;
            super.emit("error", err);
            return this;
        }
        /**
         * Opens the transport.
         *
         * @api public
         */
        open() {
            if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
            }
            return this;
        }
        /**
         * Closes the transport.
         *
         * @api public
         */
        close() {
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         * @api public
         */
        send(packets) {
            if ("open" === this.readyState) {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @api protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emit("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @api protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @api protected
         */
        onPacket(packet) {
            super.emit("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @api protected
         */
        onClose() {
            this.readyState = "closed";
            super.emit("close");
        }
    }

    var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
      , length = 64
      , map = {}
      , seed = 0
      , i = 0
      , prev;

    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode(num) {
      var encoded = '';

      do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
      } while (num > 0);

      return encoded;
    }

    /**
     * Return the integer value specified by the given string.
     *
     * @param {String} str The string to convert.
     * @returns {Number} The integer value represented by the string.
     * @api public
     */
    function decode(str) {
      var decoded = 0;

      for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
      }

      return decoded;
    }

    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
      var now = encode(+new Date());

      if (now !== prev) return seed = 0, prev = now;
      return now +'.'+ encode(seed++);
    }

    //
    // Map each character to its index.
    //
    for (; i < length; i++) map[alphabet[i]] = i;

    //
    // Expose the `yeast`, `encode` and `decode` functions.
    //
    yeast.encode = encode;
    yeast.decode = decode;
    var yeast_1 = yeast;

    var parseqs = {};

    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */

    parseqs.encode = function (obj) {
      var str = '';

      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (str.length) str += '&';
          str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
        }
      }

      return str;
    };

    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */

    parseqs.decode = function(qs){
      var qry = {};
      var pairs = qs.split('&');
      for (var i = 0, l = pairs.length; i < l; i++) {
        var pair = pairs[i].split('=');
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return qry;
    };

    class Polling extends Transport {
        constructor() {
            super(...arguments);
            this.polling = false;
        }
        /**
         * Transport name.
         */
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @api private
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} callback upon buffers are flushed and transport is paused
         * @api private
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @api public
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emit("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @api private
         */
        onData(data) {
            const callback = packet => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose();
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emit("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @api private
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} data packets
         * @param {Function} drain callback
         * @api private
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, data => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emit("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast_1();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = parseqs.encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
    }

    /* global attachEvent */
    /**
     * Empty function
     */
    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XMLHttpRequest$1({
            xdomain: false
        });
        return null != xhr.responseType;
    })();
    class XHR extends Polling {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */
        constructor(opts) {
            super(opts);
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request$1(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data
            });
            req.on("success", fn);
            req.on("error", err => {
                this.onError("xhr post error", err);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @api private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", err => {
                this.onError("xhr poll error", err);
            });
            this.pollXhr = req;
        }
    }
    class Request$1 extends Emitter_1 {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XMLHttpRequest$1(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request$1.requestsCount++;
                Request$1.requests[this.index] = this;
            }
        }
        /**
         * Called upon successful response.
         *
         * @api private
         */
        onSuccess() {
            this.emit("success");
            this.cleanup();
        }
        /**
         * Called if we have data.
         *
         * @api private
         */
        onData(data) {
            this.emit("data", data);
            this.onSuccess();
        }
        /**
         * Called upon error.
         *
         * @api private
         */
        onError(err) {
            this.emit("error", err);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @api private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request$1.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @api private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.onData(data);
            }
        }
        /**
         * Aborts the request.
         *
         * @api public
         */
        abort() {
            this.cleanup();
        }
    }
    Request$1.requestsCount = 0;
    Request$1.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThis$1 ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request$1.requests) {
            if (Request$1.requests.hasOwnProperty(i)) {
                Request$1.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return cb => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThis$1.WebSocket || globalThis$1.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @api {Object} connection options
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Transport name.
         *
         * @api public
         */
        get name() {
            return "websocket";
        }
        /**
         * Opens socket.
         *
         * @api private
         */
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emit("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @api private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onmessage = ev => this.onData(ev.data);
            this.ws.onerror = e => this.onError("websocket error", e);
        }
        /**
         * Writes data to socket.
         *
         * @param {Array} array of packets.
         * @api private
         */
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, data => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emit("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        /**
         * Closes socket.
         *
         * @api private
         */
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast_1();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = parseqs.encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @api public
         */
        check() {
            return (!!WebSocket &&
                !("__initialize" in WebSocket && this.name === WS.prototype.name));
        }
    }

    const transports = {
        websocket: WS,
        polling: XHR
    };

    class Socket$1 extends Emitter_1 {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} opts - options
         * @api public
         */
        constructor(uri, opts = {}) {
            super();
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parseuri(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parseuri(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024
                },
                transportOptions: {},
                closeOnBeforeunload: true
            }, opts);
            this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
            if (typeof this.opts.query === "string") {
                this.opts.query = parseqs.decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    addEventListener("beforeunload", () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    }, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close");
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */
        createTransport(name) {
            const query = clone(this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", () => {
                this.onClose("transport close");
            });
        }
        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", msg => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = err => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @api private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState &&
                this.opts.upgrade &&
                this.transport.pause) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @api private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @api private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @api private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @api private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @api private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                this.transport.send(this.writeBuffer);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = this.writeBuffer.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @param {Object} options.
         * @return {Socket} for chaining.
         * @api public
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} callback function.
         * @api private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         *
         * @api public
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @api private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @api private
         */
        onClose(reason, desc) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, desc);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;
    function clone(obj) {
        const o = {};
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = obj[i];
            }
        }
        return o;
    }

    Socket$1.protocol;

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        packet.attachments = undefined; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder) {
            return buffers[data.num]; // appropriate buffer (should be natural order anyway)
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    obj.type =
                        obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK;
                    return this.encodeAsBinary(obj);
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter_1 {
        constructor() {
            super();
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                packet = this.decodeString(obj);
                if (packet.type === PacketType.BINARY_EVENT ||
                    packet.type === PacketType.BINARY_ACK) {
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
            }
        }
    }
    function tryParse(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return false;
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    class Socket extends Emitter_1 {
        /**
         * `Socket` constructor.
         *
         * @public
         */
        constructor(io, nsp, opts) {
            super();
            this.connected = false;
            this.disconnected = true;
            this.receiveBuffer = [];
            this.sendBuffer = [];
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @public
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for connect()
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * @return self
         * @public
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @return self
         * @public
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev + '" is a reserved event name');
            }
            args.unshift(ev);
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            const timeout = this.flags.timeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this.packet({ type: PacketType.CONNECT, data });
                });
            }
            else {
                this.packet({ type: PacketType.CONNECT, data: this.auth });
            }
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @private
         */
        onclose(reason) {
            this.connected = false;
            this.disconnected = true;
            delete this.id;
            this.emitReserved("disconnect", reason);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                    this.onack(packet);
                    break;
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id) {
            this.id = id;
            this.connected = true;
            this.disconnected = false;
            this.emitBuffered();
            this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => this.packet(packet));
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually.
         *
         * @return self
         * @public
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for disconnect()
         *
         * @return self
         * @public
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         * @public
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @returns self
         * @public
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * ```
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         * ```
         *
         * @returns self
         * @public
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @param listener
         * @public
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @param listener
         * @public
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @param listener
         * @public
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         *
         * @public
         */
        listenersAny() {
            return this._anyListeners || [];
        }
    }

    /**
     * Expose `Backoff`.
     */

    var backo2 = Backoff;

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */

    function Backoff(opts) {
      opts = opts || {};
      this.ms = opts.min || 100;
      this.max = opts.max || 10000;
      this.factor = opts.factor || 2;
      this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
      this.attempts = 0;
    }

    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */

    Backoff.prototype.duration = function(){
      var ms = this.ms * Math.pow(this.factor, this.attempts++);
      if (this.jitter) {
        var rand =  Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
      }
      return Math.min(ms, this.max) | 0;
    };

    /**
     * Reset the number of attempts.
     *
     * @api public
     */

    Backoff.prototype.reset = function(){
      this.attempts = 0;
    };

    /**
     * Set the minimum duration
     *
     * @api public
     */

    Backoff.prototype.setMin = function(min){
      this.ms = min;
    };

    /**
     * Set the maximum duration
     *
     * @api public
     */

    Backoff.prototype.setMax = function(max){
      this.max = max;
    };

    /**
     * Set the jitter
     *
     * @api public
     */

    Backoff.prototype.setJitter = function(jitter){
      this.jitter = jitter;
    };

    class Manager extends Emitter_1 {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new backo2({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            this.decoder.add(data);
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            this.emitReserved("packet", packet);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    class SocketService {
        constructor() {
            this.socket = lookup("ws://localhost:4200");
        }
    }

    const cryptoService = new CryptoService();
    const eccService = new EccService();
    const miscService = new MiscService();
    const socketService = new SocketService();

    const getPrivateKeyHash = () => {
        const { socket } = socketService;
        socket.on("getPrivateKeyHash", (params) => {
            const { privateKeyHash } = params;
            const { username, password } = get_store_value(authStore).signinForm;
            const privateKey = cryptoService.decrypt(privateKeyHash, password);
            if (privateKey) {
                const publicKey = eccService.toPublic(privateKey);
                const signature = eccService.sign(`signin:${username}`, privateKey);
                playerStore.update((player) => {
                    player.privateKey = privateKey;
                    return player;
                });
                socket.emit("signin", { username, publicKey, signature });
            }
            else {
                miscService.showNotification("Wrong password.");
            }
        });
    };

    const signin = () => {
        const { socket } = socketService;
        socket.on("signin", (params) => {
            const { player, friends, lobby, game } = params;
            const { privateKey } = get_store_value(playerStore);
            playerStore.set(player);
            playerStore.update((store) => {
                store.privateKey = privateKey;
                return store;
            });
            socialStore.update((store) => {
                store.friends = friends;
                return store;
            });
            if (lobby) {
                lobbyStore.set(lobby);
            }
            if (game) {
                gameStore.set(game);
            }
            socket.emit("updateStatus");
        });
    };

    const destroyLobby = () => {
        const { socket } = socketService;
        socket.on("destroyLobby", () => {
            lobbyStore.set({
                lobbyId: 0,
                host: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                },
                challengee: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                }
            });
            playerStore.update((player) => {
                player.status = PlayerStatus.ONLINE;
                return player;
            });
            socket.emit("updateStatus");
        });
    };

    const joinLobbyReceiver = () => {
        const { socket } = socketService;
        socket.on("joinLobbyReceiver", (params) => {
            lobbyStore.update((lobby) => {
                lobby.challengee = params.challengee;
                return lobby;
            });
        });
    };

    const joinLobbySender = () => {
        const { socket } = socketService;
        socket.on("joinLobbySender", (params) => {
            lobbyStore.set(params.lobby);
            playerStore.update((player) => {
                player.status = PlayerStatus.INLOBBY;
                return player;
            });
            socket.emit("updateStatus");
        });
    };

    const leaveLobbyReceiver = () => {
        const { socket } = socketService;
        socket.on("leaveLobbyReceiver", () => {
            lobbyStore.update((lobby) => {
                lobby.challengee = {
                    username: "",
                    socketId: "",
                    avatarId: 0
                };
                return lobby;
            });
        });
    };

    const leaveLobbySender = () => {
        const { socket } = socketService;
        socket.on("leaveLobbySender", () => {
            lobbyStore.set({
                lobbyId: 0,
                host: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                },
                challengee: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                }
            });
            playerStore.update((player) => {
                player.status = PlayerStatus.ONLINE;
                return player;
            });
            socket.emit("updateStatus");
        });
    };

    const makeLobby = () => {
        const { socket } = socketService;
        socket.on("makeLobby", (params) => {
            lobbyStore.set(params.lobby);
            playerStore.update((player) => {
                player.status = PlayerStatus.INLOBBY;
                return player;
            });
            socket.emit("updateStatus");
        });
    };

    const saveDeck = () => {
        const { socket } = socketService;
        socket.on("saveDeck", (params) => {
            playerStore.update((player) => {
                const { deckId } = player;
                const deck = player.decks.find((deck) => deck.id === deckId);
                deck.cards = params.cards;
                return player;
            });
            miscService.showNotification("Deck saved successfully.");
        });
    };

    const cards = [{
            id: 0,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 1",
            damage: 10,
            health: 70,
            manaCost: 30,
            effect: "Neutral card 1 can attack twice.",
            effects: [Effect.GREED]
        }, {
            id: 1,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 2",
            damage: 11,
            health: 80,
            manaCost: 35,
            effect: "Neutral card 2 effect",
            effects: [Effect.BLIND]
        }, {
            id: 2,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 3",
            damage: 12,
            health: 90,
            manaCost: 40,
            effect: "Neutral card 3 effect",
            effects: [Effect.CHARGE]
        }, {
            id: 3,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 4",
            damage: 13,
            health: 100,
            manaCost: 45,
            effect: "Neutral card 4 effect",
            effects: []
        }, {
            id: 4,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 5",
            damage: 14,
            health: 110,
            manaCost: 50,
            effect: "Neutral card 5 effect",
            effects: []
        }, {
            id: 5,
            klass: CardKlass.NEUTRAL,
            type: CardType.MINION,
            name: "Neutral card 6",
            damage: 15,
            health: 120,
            manaCost: 55,
            effect: "Neutral card 6 effect",
            effects: []
        }, {
            id: 6,
            klass: CardKlass.NEUTRAL,
            type: CardType.MAGIC,
            name: "Neutral card 7",
            manaCost: 60,
            effect: "Neutral card 7 effect",
            effects: []
        }, {
            id: 7,
            klass: CardKlass.NEUTRAL,
            type: CardType.MAGIC,
            name: "Neutral card 8",
            manaCost: 60,
            effect: "Neutral card 8 effect",
            effects: []
        }, {
            id: 8,
            klass: CardKlass.NEUTRAL,
            type: CardType.MAGIC,
            name: "Neutral card 9",
            manaCost: 60,
            effect: "Neutral card 9 effect",
            effects: []
        }, {
            id: 9,
            klass: CardKlass.NEUTRAL,
            type: CardType.TRAP,
            name: "Neutral card 10",
            manaCost: 60,
            effect: "Neutral card 10 effect",
            effects: []
        }, {
            id: 10,
            klass: CardKlass.NEUTRAL,
            type: CardType.TRAP,
            name: "Neutral card 11",
            manaCost: 60,
            effect: "Neutral card 11 effect",
            effects: []
        }, {
            id: 11,
            klass: CardKlass.NEUTRAL,
            type: CardType.TRAP,
            name: "Neutral card 12",
            manaCost: 60,
            effect: "Neutral card 12 effect",
            effects: []
        }, {
            id: 50,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 1",
            damage: 1,
            health: 1,
            manaCost: 1,
            effect: "Solid card 1 effect",
            effects: []
        }, {
            id: 51,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 2",
            damage: 2,
            health: 2,
            manaCost: 2,
            effect: "Solid card 2 effect",
            effects: []
        }, {
            id: 52,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 3",
            damage: 3,
            health: 3,
            manaCost: 3,
            effect: "Solid card 3 effect",
            effects: []
        }, {
            id: 53,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 4",
            damage: 4,
            health: 4,
            manaCost: 4,
            effect: "Solid card 4 effect",
            effects: []
        }, {
            id: 54,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 5",
            damage: 5,
            health: 5,
            manaCost: 5,
            effect: "Solid card 5 effect",
            effects: []
        }, {
            id: 55,
            klass: CardKlass.SOLID,
            type: CardType.MINION,
            name: "Solid card 6",
            damage: 6,
            health: 6,
            manaCost: 6,
            effect: "Solid card 6 effect",
            effects: []
        }, {
            id: 56,
            klass: CardKlass.SOLID,
            type: CardType.MAGIC,
            name: "Solid card 7",
            manaCost: 7,
            effect: "Solid card 7 effect",
            effects: []
        }, {
            id: 57,
            klass: CardKlass.SOLID,
            type: CardType.MAGIC,
            name: "Solid card 8",
            manaCost: 8,
            effect: "Solid card 8 effect",
            effects: []
        }, {
            id: 58,
            klass: CardKlass.SOLID,
            type: CardType.MAGIC,
            name: "Solid card 9",
            manaCost: 9,
            effect: "Solid card 9 effect",
            effects: []
        }, {
            id: 59,
            klass: CardKlass.SOLID,
            type: CardType.TRAP,
            name: "Solid card 10",
            manaCost: 10,
            effect: "Solid card 10 effect",
            effects: []
        }, {
            id: 60,
            klass: CardKlass.SOLID,
            type: CardType.TRAP,
            name: "Solid card 11",
            manaCost: 11,
            effect: "Solid card 11 effect",
            effects: []
        }, {
            id: 61,
            klass: CardKlass.SOLID,
            type: CardType.TRAP,
            name: "Solid card 12",
            manaCost: 12,
            effect: "Solid card 12 effect",
            effects: []
        }, {
            id: 100,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 1",
            damage: 1,
            health: 1,
            manaCost: 1,
            effect: "Liquid card 1 effect",
            effects: []
        }, {
            id: 101,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 2",
            damage: 2,
            health: 2,
            manaCost: 2,
            effect: "Liquid card 2 effect",
            effects: []
        }, {
            id: 102,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 3",
            damage: 3,
            health: 3,
            manaCost: 3,
            effect: "Liquid card 3 effect",
            effects: []
        }, {
            id: 103,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 4",
            damage: 4,
            health: 4,
            manaCost: 4,
            effect: "Liquid card 4 effect",
            effects: []
        }, {
            id: 104,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 5",
            damage: 5,
            health: 5,
            manaCost: 5,
            effect: "Liquid card 5 effect",
            effects: []
        }, {
            id: 105,
            klass: CardKlass.LIQUID,
            type: CardType.MINION,
            name: "Liquid card 6",
            damage: 6,
            health: 6,
            manaCost: 6,
            effect: "Liquid card 6 effect",
            effects: []
        }, {
            id: 106,
            klass: CardKlass.LIQUID,
            type: CardType.MAGIC,
            name: "Liquid card 7",
            manaCost: 7,
            effect: "Liquid card 7 effect",
            effects: []
        }, {
            id: 107,
            klass: CardKlass.LIQUID,
            type: CardType.MAGIC,
            name: "Liquid card 8",
            manaCost: 8,
            effect: "Liquid card 8 effect",
            effects: []
        }, {
            id: 108,
            klass: CardKlass.LIQUID,
            type: CardType.MAGIC,
            name: "Liquid card 9",
            manaCost: 9,
            effect: "Liquid card 9 effect",
            effects: []
        }, {
            id: 109,
            klass: CardKlass.LIQUID,
            type: CardType.TRAP,
            name: "Liquid card 10",
            manaCost: 10,
            effect: "Liquid card 10 effect",
            effects: []
        }, {
            id: 110,
            klass: CardKlass.LIQUID,
            type: CardType.TRAP,
            name: "Liquid card 11",
            manaCost: 11,
            effect: "Liquid card 11 effect",
            effects: []
        }, {
            id: 111,
            klass: CardKlass.LIQUID,
            type: CardType.TRAP,
            name: "Liquid card 12",
            manaCost: 12,
            effect: "Liquid card 12 effect",
            effects: []
        }, {
            id: 150,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 1",
            damage: 1,
            health: 1,
            manaCost: 1,
            effect: "Gas card 1 effect",
            effects: []
        }, {
            id: 151,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 2",
            damage: 2,
            health: 2,
            manaCost: 2,
            effect: "Gas card 2 effect",
            effects: []
        }, {
            id: 152,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 3",
            damage: 3,
            health: 3,
            manaCost: 3,
            effect: "Gas card 3 effect",
            effects: []
        }, {
            id: 153,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 4",
            damage: 4,
            health: 4,
            manaCost: 4,
            effect: "Gas card 4 effect",
            effects: []
        }, {
            id: 154,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 5",
            damage: 5,
            health: 5,
            manaCost: 5,
            effect: "Gas card 5 effect",
            effects: []
        }, {
            id: 155,
            klass: CardKlass.GAS,
            type: CardType.MINION,
            name: "Gas card 6",
            damage: 6,
            health: 6,
            manaCost: 6,
            effect: "Gas card 6 effect",
            effects: []
        }, {
            id: 156,
            klass: CardKlass.GAS,
            type: CardType.MAGIC,
            name: "Gas card 7",
            manaCost: 7,
            effect: "Gas card 7 effect",
            effects: []
        }, {
            id: 157,
            klass: CardKlass.GAS,
            type: CardType.MAGIC,
            name: "Gas card 8",
            manaCost: 8,
            effect: "Gas card 8 effect",
            effects: []
        }, {
            id: 158,
            klass: CardKlass.GAS,
            type: CardType.MAGIC,
            name: "Gas card 9",
            manaCost: 9,
            effect: "Gas card 9 effect",
            effects: []
        }, {
            id: 159,
            klass: CardKlass.GAS,
            type: CardType.TRAP,
            name: "Gas card 10",
            manaCost: 10,
            effect: "Gas card 10 effect",
            effects: []
        }, {
            id: 160,
            klass: CardKlass.GAS,
            type: CardType.TRAP,
            name: "Gas card 11",
            manaCost: 11,
            effect: "Gas card 11 effect",
            effects: []
        }, {
            id: 161,
            klass: CardKlass.GAS,
            type: CardType.TRAP,
            name: "Gas card 12",
            manaCost: 12,
            effect: "Gas card 12 effect",
            effects: []
        }, {
            id: 200,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 1",
            damage: 1,
            health: 1,
            manaCost: 1,
            effect: `
    If Plasma card 1 procs
    <span class="f--red"><i class="fas fa-khanda"></i></span>,
    it can attack again.
  `,
            effects: []
        }, {
            id: 201,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 2",
            damage: 2,
            health: 2,
            manaCost: 2,
            effect: `
    When summoned, 10% of your Life Points are transfered into *cardname*
    damage
  `,
            effects: []
        }, {
            id: 202,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 3",
            damage: 3,
            health: 3,
            manaCost: 3,
            effect: `
    Gains
    <span class="f--red">+1% <i class="fas fa-khanda"></i></span>
    for each
    <span class="f--green">1% missing <i class="fas fa-heart"></i></span>,
    and converts excess
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    to
    <span class="f--orange"><i class="fas fa-fire"></i></span>.
  `,
            effects: []
        }, {
            id: 203,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 4",
            damage: 4,
            health: 4,
            manaCost: 4,
            effect: `
    Gains <span class="f--red">+20% <i class="fas fa-khanda"></i></span> for
    each Minion on your field, self included.
  `,
            effects: []
        }, {
            id: 204,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 5",
            damage: 5,
            health: 5,
            manaCost: 5,
            effect: `
    Executes Minions below
    <span class="f--green">5% <i class="fas fa-heart"></i></span>
    after combat.
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    procs execute Minions below
    <span class="f--green">10% <i class="fas fa-heart"></i></span>
    instead. Works only on minions.
  `,
            effects: []
        }, {
            id: 205,
            klass: CardKlass.PLASMA,
            type: CardType.MINION,
            name: "Plasma card 6",
            damage: 6,
            health: 6,
            manaCost: 6,
            effect: `
    If Plasma card 6 procs
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    , the opposing card is stunned.
    <br>
    <i><b>* Stunned</b>: Not able to attack for 1 turn.</i>
  `,
            effects: []
        }, {
            id: 206,
            klass: CardKlass.PLASMA,
            type: CardType.MAGIC,
            name: "Plasma card 7",
            manaCost: 7,
            effect: `
    Give one minion
    <span class="f--red">+6/6 <i class="fas fa-khanda"></i></span>.
  `,
            effects: []
        }, {
            id: 207,
            klass: CardKlass.PLASMA,
            type: CardType.MAGIC,
            name: "Plasma card 8",
            manaCost: 8,
            effect: "Plasma card 8 effect",
            effects: []
        }, {
            id: 208,
            klass: CardKlass.PLASMA,
            type: CardType.MAGIC,
            name: "Plasma card 9",
            manaCost: 9,
            effect: "Plasma card 9 effect",
            effects: []
        }, {
            id: 209,
            klass: CardKlass.PLASMA,
            type: CardType.TRAP,
            name: "Plasma card 10",
            manaCost: 10,
            effect: `
    The next Minion your opponent attacks will gain
    <span class="f--red">+6/6 <i class="fas fa-khanda"></i></span>
    until the end of their turn.
  `,
            effects: []
        }, {
            id: 210,
            klass: CardKlass.PLASMA,
            type: CardType.TRAP,
            name: "Plasma card 11",
            manaCost: 11,
            effect: "Plasma card 11 effect",
            effects: []
        }, {
            id: 211,
            klass: CardKlass.PLASMA,
            type: CardType.TRAP,
            name: "Plasma card 12",
            manaCost: 12,
            effect: "Plasma card 12 effect",
            effects: []
        }];
    const solidHero = {
        name: "Solid Hero",
        klass: CardKlass.SOLID,
        damage: 55,
        health: 1500,
        mana: 100,
        passive: {
            name: "Thick Armor",
            amount: 10,
            info: `
      Solid Hero and Minions take
      <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
      when defending.
    `
        },
        active: {
            name: "Taunt",
            manaCost: 10,
            info: `
      Solid Hero can apply a Taunt buff on Solid Minions or himself, giving it
      additional
      <span class="f--yellow"><i class="fas fa-shield-alt fa-fw"></i></span>,
      and forcing the enemy Hero and Minions to attack that minion for their
      next turn.
    `
        },
        special: {
            amount: 0,
            effect: ""
        },
    };
    const liquidHero = {
        name: "Liquid Hero",
        klass: CardKlass.LIQUID,
        damage: 30,
        health: 600,
        mana: 100,
        passive: {
            name: "Passive",
            amount: 25,
            info: `
      Liquid Hero and Minions heal
      <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
      whenever a Liquid Minion dies.
    `
        },
        active: {
            name: "Active",
            manaCost: 30,
            info: `
      Liquid hero and minions heal
      <span class="f--green">10% missing <i class="fas fa-heart"></i></span>.
    `
        },
        special: {
            amount: 0,
            effect: ""
        },
    };
    const gasHero = {
        name: "Gas Hero",
        klass: CardKlass.GAS,
        damage: 10,
        health: 1000,
        mana: 100,
        passive: {
            name: `
      <span class="f--gas">Neurotoxin <i class="fas fa-radiation fa-fw"></i></span>
    `,
            amount: 1,
            info: `
      When attacking, Gas Hero and Minions apply
      <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
      debuff to the entire enemy field, dealing
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      each turn to the affected targets. This effect can stack.
    `
        },
        active: {
            name: "Active",
            manaCost: 25,
            info: `
      ...
    `
        },
        special: {
            amount: 0,
            effect: ""
        },
    };
    const plasmaHero = {
        name: "Plasma Hero",
        klass: CardKlass.PLASMA,
        damage: 30,
        health: 800,
        mana: 100,
        passive: {
            name: `
      <span class="f--red">Radiation <i class="fas fa-burn fa-fw"></i></span>
    `,
            amount: 10,
            info: `
      <br>
      When attacking, Plasma Hero and Minions apply
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
      debuff, which deals
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      to the affected Minions or Hero each turn. This effect can stack.
    `
        },
        active: {
            name: "Unstable Core",
            manaCost: 50,
            info: `
      Plasma Hero applies Unstable Core debuff on one enemy Minion or Hero.
      Plasma Hero and Minions attacking the affected target will deal additional
      <span class="f--orange">10% <i class="fas fa-fire fa-fw"></i></span>,
      and apply
      <span class="f--red">3 <i class="fas fa-burn fa-fw"></i></span>
      additional stacks until the end of your turn.
    `
        },
        special: {
            amount: 0,
            effect: ""
        },
    };
    const heroes = [
        solidHero, liquidHero, gasHero, plasmaHero
    ];
    const passives = [{
            klass: CardKlass.SOLID,
            text: `
    Solid Hero and Minions take
    <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
    when defending.
  `
        }, {
            klass: CardKlass.LIQUID,
            text: `
    Liquid Hero and Minions heal
    <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
    whenever a Liquid Minion dies.
  `
        }, {
            klass: CardKlass.GAS,
            text: `
    When attacking, Gas Hero and Minions apply
    <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
    debuff to the entire enemy field, dealing
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    each turn to the affected targets. This effect can stack.
  `
        }, {
            klass: CardKlass.PLASMA,
            text: `
    When attacking, Plasma Hero and Minions apply
    <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
    debuff, which deals
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    to the affected Minions or Hero each turn. This effect can stack.
  `
        }];

    const selectDeck = () => {
        const { socket } = socketService;
        socket.on("selectDeck", (params) => {
            const { deckId } = params;
            const player = get_store_value(playerStore);
            playerStore.update((player) => {
                player.deckId = deckId;
                return player;
            });
            decksStore.update((decks) => {
                const { deckId } = player;
                const deck = player.decks.find((deck) => deck.id === deckId);
                decks.deckCards = deck.cards.map((deckCard) => {
                    const card = cards.find((card) => card.id === deckCard.id);
                    const { id, klass, name } = card;
                    const { amount } = deckCard;
                    return { klass, id, name, amount };
                });
                return decks;
            });
        });
    };

    const setDeckKlass = () => {
        const { socket } = socketService;
        socket.on("setDeckKlass", (params) => {
            const { deckId, klass } = params;
            playerStore.update((store) => {
                const deck = store.decks.find((deck) => deck.id === deckId);
                deck.klass = klass;
                return store;
            });
            decksStore.update((store) => {
                const deck = store.deckSlots.find((deck) => deck.id === deckId);
                deck.klass = klass;
                return store;
            });
        });
    };

    const setDeckName = () => {
        const { socket } = socketService;
        socket.on("setDeckName", (params) => {
            const { id, name } = params;
            playerStore.update((store) => {
                const deck = store.decks.find((deck) => deck.id === id);
                deck.name = name;
                return store;
            });
            decksStore.update((store) => {
                const deck = store.deckSlots.find((deck) => deck.id === id);
                deck.name = name;
                return store;
            });
            miscService.closeModal();
            miscService.showNotification("Deck name changed successfully.");
        });
    };

    const startGame = () => {
        const { socket } = socketService;
        socket.on("startGame", (params) => {
            playerStore.update((player) => {
                player.status = PlayerStatus.INGAME;
                return player;
            });
            gameStore.set(params.game);
            socket.emit("updateStatus");
        });
    };

    const attackMinionOpponent = () => {
        const { socket } = socketService;
        socket.on("attackMinionOpponent", (params) => {
            const { attacker, attacked } = params;
            gameStore.update((game) => {
                const { player, opponent } = game;
                const playerMinion = player.minion[attacked];
                const opponentMinion = opponent.minion[attacker];
                playerMinion.health -= opponentMinion.damage;
                opponentMinion.health -= playerMinion.damage;
                playerMinion.hasAttacked = true;
                if (!playerMinion.hasTriggeredEffect) {
                    if (playerMinion.effects.includes(Effect.CHARGE)) {
                        playerMinion.hasAttacked = false;
                        playerMinion.hasTriggeredEffect = true;
                    }
                }
                if (playerMinion.health <= 0) {
                    playerMinion.health = playerMinion.maxHealth;
                    player.graveyard.push(playerMinion);
                    player.minion[attacker] = undefined;
                }
                if (opponentMinion.health <= 0) {
                    opponentMinion.health = opponentMinion.maxHealth;
                    opponent.graveyard.push(opponentMinion);
                    opponent.minion[attacked] = undefined;
                }
                return game;
            });
        });
    };

    const attackMinionPlayer = () => {
        const { socket } = socketService;
        socket.on("attackMinionPlayer", (params) => {
            const { attacked, attacker } = params;
            gameStore.update((game) => {
                const { player, opponent } = game;
                const playerMinion = player.minion[attacker];
                const opponentMinion = opponent.minion[attacked];
                playerMinion.health -= opponentMinion.damage;
                opponentMinion.health -= playerMinion.damage;
                playerMinion.hasAttacked = true;
                if (!playerMinion.hasTriggeredEffect) {
                    if (playerMinion.effects.includes(Effect.CHARGE)) {
                        playerMinion.hasAttacked = false;
                        playerMinion.hasTriggeredEffect = true;
                    }
                }
                if (playerMinion.health <= 0) {
                    playerMinion.health = playerMinion.maxHealth;
                    player.graveyard.push(playerMinion);
                    player.minion[attacker] = undefined;
                }
                if (opponentMinion.health <= 0) {
                    opponentMinion.health = opponentMinion.maxHealth;
                    opponent.graveyard.push(opponentMinion);
                    opponent.minion[attacked] = undefined;
                }
                return game;
            });
        });
    };

    const endGame = () => {
        const { socket } = socketService;
        socket.on("endGame", () => {
            playerStore.update((player) => {
                player.gameId = 0;
                player.status = PlayerStatus.ONLINE;
                return player;
            });
            socket.emit("updateStatus");
        });
    };

    const endTurnOpponent = () => {
        socketService.socket.on("endTurnOpponent", () => {
            gameStore.update((store) => {
                const { deck, hand, hero, username } = store.player;
                store.currentPlayer = username;
                hand.push(deck.pop());
                hero.mana = 100;
                return store;
            });
        });
    };

    const endTurnPlayer = () => {
        const { socket } = socketService;
        socket.on("endTurnPlayer", () => {
            gameStore.update((store) => {
                const { opponent } = store;
                store.currentPlayer = store.opponent.username;
                opponent.hand += 1;
                opponent.deck -= 1;
                opponent.hero.mana = 100;
                return store;
            });
        });
    };

    const hoverCard = () => {
        const { socket } = socketService;
        socket.on("hoverCard", (params) => {
            hoveredCardStore.set(params);
        });
    };

    const levelUp = () => {
        const { socket } = socketService;
        socket.on("levelUp", (params) => {
            const { xp, lv } = params;
            playerStore.update((player) => {
                player.xp = xp;
                player.lv = lv;
                return player;
            });
        });
    };

    const playMinionOpponent = () => {
        const { socket } = socketService;
        socket.on("playMinionOpponent", (params) => {
            const { field, card } = params;
            gameStore.update((store) => {
                const { minion, hero } = store.opponent;
                hero.mana -= card.manaCost;
                minion[field] = card;
                store.opponent.hand -= 1;
                return store;
            });
        });
    };

    const playMinionPlayer = () => {
        const { socket } = socketService;
        socket.on("playMinionPlayer", (params) => {
            const { field, gid } = params;
            gameStore.update((store) => {
                const { hand, minion, hero } = store.player;
                const handCard = hand.find((card) => card.gid === gid);
                hero.mana -= handCard.manaCost;
                minion[field] = handCard;
                hand.splice(hand.indexOf(handCard), 1);
                return store;
            });
        });
    };

    // never forgetti code spaghetti ;w;
    const reloadGameState = () => {
        const { socket } = socketService;
        socket.on("reloadGameState", (params) => {
            gameStore.set(params.game);
        });
    };

    const unhoverCard = () => {
        const { socket } = socketService;
        socket.on("unhoverCard", () => {
            hoveredCardStore.set({
                field: ""
            });
        });
    };

    const notification = () => {
        socketService.socket.on("notification", (msg) => {
            miscService.showNotification(msg);
        });
    };

    const sendChatMsgReceiver = () => {
        socketService.socket.on("sendChatMsgReceiver", (params) => {
            const { sender, text, date } = params;
            socialStore.update((store) => {
                store
                    .friends
                    .find((friend) => friend.username === sender)
                    .messages
                    .push({ username: sender, text, date });
                return store;
            });
        });
    };

    const sendChatMsgSender = () => {
        socketService.socket.on("sendChatMsgSender", (params) => {
            const { sender, receiver, text, date } = params;
            socialStore.update((store) => {
                store
                    .friends
                    .find((friend) => friend.username === receiver)
                    .messages
                    .push({ username: sender, text, date });
                return store;
            });
        });
    };

    const acceptFriendReceiver = () => {
        const { socket } = socketService;
        socket.on("acceptFriendReceiver", (params) => {
            const { username, avatarId, status } = params;
            const messages = [];
            playerStore.update((store) => {
                store.social.friends.push(username);
                return store;
            });
            socialStore.update((store) => {
                store.friends.push({ username, status, avatarId, messages });
                return store;
            });
        });
    };

    const acceptFriendSender = () => {
        const { socket } = socketService;
        socket.on("acceptFriendSender", (params) => {
            const { username, avatarId, status } = params;
            const messages = [];
            playerStore.update((store) => {
                const { friends, requests } = store.social;
                const i = requests.indexOf(username);
                friends.push(username);
                requests.splice(i, 1);
                return store;
            });
            socialStore.update((store) => {
                store.friends.push({ username, status, avatarId, messages });
                return store;
            });
        });
    };

    const addFriend = () => {
        const { socket } = socketService;
        socket.on("addFriend", (params) => {
            playerStore.update((player) => {
                player.social.requests.push(params.username);
                return player;
            });
        });
    };

    const blockReceiver = () => {
        const { socket } = socketService;
        socket.on("blockReceiver", (params) => {
            const { username } = params;
            playerStore.update((store) => {
                const { friends } = store.social;
                const i = friends.indexOf(username);
                friends.splice(i, 1);
                return store;
            });
            socialStore.update((store) => {
                const { chat, friends } = store;
                const friend = friends.find((friend) => friend.username === username);
                const i = friends.indexOf(friend);
                friends.splice(i, 1);
                if (chat.username === username) {
                    chat.isOpen = false;
                }
                return store;
            });
        });
    };

    const blockSender = () => {
        const { socket } = socketService;
        socket.on("blockSender", (params) => {
            const { username } = params;
            playerStore.update((store) => {
                const { friends, blocked } = store.social;
                const i = friends.indexOf(username);
                friends.splice(i, 1);
                blocked.push(username);
                return store;
            });
            socialStore.update((store) => {
                const { chat, friends } = store;
                const friend = friends.find((friend) => friend.username === username);
                const i = friends.indexOf(friend);
                friends.splice(i, 1);
                if (chat.username === username) {
                    chat.isOpen = false;
                }
                return store;
            });
            miscService.closeModal();
        });
    };

    const setAvatarReceiver = () => {
        socketService.socket.on("setAvatarReceiver", (params) => {
            const { username, avatarId } = params;
            socialStore.update((store) => {
                const friend = store.friends.find((friend) => friend.username === username);
                friend.avatarId = avatarId;
                return store;
            });
        });
    };

    const setAvatarSender = () => {
        const { socket } = socketService;
        socket.on("setAvatarSender", (params) => {
            playerStore.update((player) => {
                player.avatarId = params.avatarId;
                return player;
            });
        });
    };

    const declineFriend = () => {
        const { socket } = socketService;
        socket.on("declineFriend", (params) => {
            playerStore.update((player) => {
                const { requests } = player.social;
                const i = requests.indexOf(params.username);
                requests.splice(i, 1);
                return player;
            });
        });
    };

    const unblock = () => {
        const { socket } = socketService;
        socket.on("unblock", (params) => {
            playerStore.update((player) => {
                const { blocked } = player.social;
                const i = blocked.indexOf(params.friendname);
                blocked.splice(i, 1);
                return player;
            });
        });
    };

    const unfriendReceiver = () => {
        const { socket } = socketService;
        socket.on("unfriendReceiver", (params) => {
            const { username } = params;
            playerStore.update((player) => {
                const { friends } = player.social;
                const i = friends.indexOf(username);
                friends.splice(i, 1);
                return player;
            });
            socialStore.update((store) => {
                const { chat, friends } = store;
                const friend = friends.find((friend) => friend.username === username);
                const i = friends.indexOf(friend);
                friends.splice(i, 1);
                if (chat.username === username) {
                    chat.isOpen = false;
                }
                return store;
            });
        });
    };

    const unfriendSender = () => {
        socketService.socket.on("unfriendSender", (params) => {
            const { username } = params;
            playerStore.update((store) => {
                const { friends } = store.social;
                const i = friends.indexOf(username);
                friends.splice(i, 1);
                return store;
            });
            socialStore.update((store) => {
                const { chat, friends } = store;
                const friend = friends.find((friend) => friend.username === username);
                const i = friends.indexOf(friend);
                friends.splice(i, 1);
                if (chat.username === username) {
                    chat.isOpen = false;
                }
                return store;
            });
            miscService.closeModal();
        });
    };

    const updateFriend = () => {
        socketService.socket.on("updateStatus", (params) => {
            const { username, status } = params;
            socialStore.update((store) => {
                const { friends } = store;
                const friend = friends.find((friend) => friend.username === username);
                friend.status = status;
                return store;
            });
        });
    };

    const responses = [
        // Auth
        getPrivateKeyHash,
        signin,
        // Client
        destroyLobby,
        joinLobbyReceiver,
        joinLobbySender,
        leaveLobbyReceiver,
        leaveLobbySender,
        makeLobby,
        saveDeck,
        selectDeck,
        setDeckKlass,
        setDeckName,
        startGame,
        // Game
        attackMinionOpponent,
        attackMinionPlayer,
        endGame,
        endTurnOpponent,
        endTurnPlayer,
        hoverCard,
        levelUp,
        playMinionOpponent,
        playMinionPlayer,
        reloadGameState,
        unhoverCard,
        // Global
        notification,
        sendChatMsgReceiver,
        sendChatMsgSender,
        // Sidenav
        acceptFriendReceiver,
        acceptFriendSender,
        addFriend,
        blockReceiver,
        blockSender,
        setAvatarReceiver,
        setAvatarSender,
        declineFriend,
        unblock,
        unfriendReceiver,
        unfriendSender,
        updateFriend
    ];

    /* src\ui\FontAwesome.svelte generated by Svelte v3.46.4 */

    const file$17 = "src\\ui\\FontAwesome.svelte";

    function create_fragment$19(ctx) {
    	let span;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", span_class_value = "" + (/*prefix*/ ctx[1] + " fa-" + /*icon*/ ctx[0] + " fa-fw"));
    			add_location(span, file$17, 5, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && span_class_value !== (span_class_value = "" + (/*prefix*/ ctx[1] + " fa-" + /*icon*/ ctx[0] + " fa-fw"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$19.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$19($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FontAwesome', slots, []);
    	let prefix = "fas";
    	let { icon } = $$props;
    	const writable_props = ['icon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FontAwesome> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({ prefix, icon });

    	$$self.$inject_state = $$props => {
    		if ('prefix' in $$props) $$invalidate(1, prefix = $$props.prefix);
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, prefix];
    }

    class FontAwesome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$19, create_fragment$19, safe_not_equal, { icon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FontAwesome",
    			options,
    			id: create_fragment$19.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<FontAwesome> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<FontAwesome>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<FontAwesome>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ChatWindow.svelte generated by Svelte v3.46.4 */
    const file$16 = "src\\ChatWindow.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (158:0) {#if $socialStore.chat.isOpen}
    function create_if_block$k(ctx) {
    	let div1;
    	let header;
    	let div0;
    	let button0;
    	let fontawesome0;
    	let t0;
    	let button1;
    	let fontawesome1;
    	let t1;
    	let button2;
    	let fontawesome2;
    	let t2;
    	let button3;
    	let fontawesome3;
    	let t3;
    	let button4;
    	let fontawesome4;
    	let t4;
    	let main;
    	let t5;
    	let form;
    	let input;
    	let current;
    	let mounted;
    	let dispose;

    	fontawesome0 = new FontAwesome({
    			props: { icon: "donate" },
    			$$inline: true
    		});

    	fontawesome1 = new FontAwesome({ props: { icon: "gift" }, $$inline: true });

    	fontawesome2 = new FontAwesome({
    			props: { icon: "user-times" },
    			$$inline: true
    		});

    	fontawesome3 = new FontAwesome({ props: { icon: "ban" }, $$inline: true });
    	fontawesome4 = new FontAwesome({ props: { icon: "times" }, $$inline: true });
    	let each_value = /*$chatStore*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			div0 = element("div");
    			button0 = element("button");
    			create_component(fontawesome0.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			create_component(fontawesome1.$$.fragment);
    			t1 = space();
    			button2 = element("button");
    			create_component(fontawesome2.$$.fragment);
    			t2 = space();
    			button3 = element("button");
    			create_component(fontawesome3.$$.fragment);
    			t3 = space();
    			button4 = element("button");
    			create_component(fontawesome4.$$.fragment);
    			t4 = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			form = element("form");
    			input = element("input");
    			attr_dev(button0, "class", "btn--icon");
    			add_location(button0, file$16, 161, 8, 3882);
    			attr_dev(button1, "class", "btn--icon");
    			add_location(button1, file$16, 164, 8, 3994);
    			attr_dev(button2, "class", "btn--icon");
    			add_location(button2, file$16, 167, 8, 4105);
    			attr_dev(button3, "class", "btn--icon");
    			add_location(button3, file$16, 170, 8, 4226);
    			add_location(div0, file$16, 160, 6, 3867);
    			attr_dev(button4, "class", "btn--icon-primary");
    			add_location(button4, file$16, 174, 6, 4349);
    			attr_dev(header, "class", "chat__header svelte-11ecmha");
    			add_location(header, file$16, 159, 4, 3830);
    			attr_dev(main, "class", "chat__msgs svelte-11ecmha");
    			add_location(main, file$16, 179, 4, 4483);
    			attr_dev(input, "placeholder", "Message");
    			attr_dev(input, "class", "svelte-11ecmha");
    			add_location(input, file$16, 217, 6, 5685);
    			attr_dev(form, "class", "chat__form svelte-11ecmha");
    			add_location(form, file$16, 216, 4, 5611);
    			attr_dev(div1, "class", "chat svelte-11ecmha");
    			add_location(div1, file$16, 158, 2, 3806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			append_dev(header, div0);
    			append_dev(div0, button0);
    			mount_component(fontawesome0, button0, null);
    			append_dev(div0, t0);
    			append_dev(div0, button1);
    			mount_component(fontawesome1, button1, null);
    			append_dev(div0, t1);
    			append_dev(div0, button2);
    			mount_component(fontawesome2, button2, null);
    			append_dev(div0, t2);
    			append_dev(div0, button3);
    			mount_component(fontawesome3, button3, null);
    			append_dev(header, t3);
    			append_dev(header, button4);
    			mount_component(fontawesome4, button4, null);
    			append_dev(div1, t4);
    			append_dev(div1, main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			/*main_binding*/ ctx[11](main);
    			append_dev(div1, t5);
    			append_dev(div1, form);
    			append_dev(form, input);
    			set_input_value(input, /*text*/ ctx[0]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*onTip*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*onGift*/ ctx[6], false, false, false),
    					listen_dev(button2, "click", /*onUnfriend*/ ctx[7], false, false, false),
    					listen_dev(button3, "click", /*onBlock*/ ctx[8], false, false, false),
    					listen_dev(button4, "click", /*onChatClose*/ ctx[9], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[12]),
    					listen_dev(form, "submit", prevent_default(/*onSendMessage*/ ctx[10]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$chatStore, $playerStore, $socialStore*/ 28) {
    				each_value = /*$chatStore*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome0.$$.fragment, local);
    			transition_in(fontawesome1.$$.fragment, local);
    			transition_in(fontawesome2.$$.fragment, local);
    			transition_in(fontawesome3.$$.fragment, local);
    			transition_in(fontawesome4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome0.$$.fragment, local);
    			transition_out(fontawesome1.$$.fragment, local);
    			transition_out(fontawesome2.$$.fragment, local);
    			transition_out(fontawesome3.$$.fragment, local);
    			transition_out(fontawesome4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(fontawesome0);
    			destroy_component(fontawesome1);
    			destroy_component(fontawesome2);
    			destroy_component(fontawesome3);
    			destroy_component(fontawesome4);
    			destroy_each(each_blocks, detaching);
    			/*main_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(158:0) {#if $socialStore.chat.isOpen}",
    		ctx
    	});

    	return block;
    }

    // (201:12) {#each message.messages as msg}
    function create_each_block_1$1(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*msg*/ ctx[16].date + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*msg*/ ctx[16].text + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(p0, "class", "chat__sender__msg__date svelte-11ecmha");
    			add_location(p0, file$16, 202, 16, 5304);
    			attr_dev(p1, "class", "chat__sender__msg__text svelte-11ecmha");
    			add_location(p1, file$16, 205, 16, 5409);
    			attr_dev(div, "class", "chat__sender__msg svelte-11ecmha");
    			add_location(div, file$16, 201, 14, 5255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$chatStore*/ 16 && t0_value !== (t0_value = /*msg*/ ctx[16].date + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$chatStore*/ 16 && t2_value !== (t2_value = /*msg*/ ctx[16].text + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(201:12) {#each message.messages as msg}",
    		ctx
    	});

    	return block;
    }

    // (181:6) {#each $chatStore as message}
    function create_each_block$e(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h4;

    	let t1_value = (/*message*/ ctx[13].username === /*$playerStore*/ ctx[3].username
    	? /*$playerStore*/ ctx[3].username
    	: /*$socialStore*/ ctx[2].chat.username) + "";

    	let t1;
    	let t2;
    	let t3;
    	let each_value_1 = /*message*/ ctx[13].messages;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			attr_dev(img, "class", "chat__sender__avatar svelte-11ecmha");

    			if (!src_url_equal(img.src, img_src_value = "assets/avatars/" + (/*message*/ ctx[13].username === /*$playerStore*/ ctx[3].username
    			? /*$playerStore*/ ctx[3].avatarId
    			: /*$socialStore*/ ctx[2].chat.avatarId) + ".jpg")) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", "Player avatar");
    			add_location(img, file$16, 183, 10, 4623);
    			attr_dev(h4, "class", "chat__sender__username svelte-11ecmha");
    			add_location(h4, file$16, 193, 12, 4959);
    			attr_dev(div0, "class", "chat__sender__msgs svelte-11ecmha");
    			add_location(div0, file$16, 192, 10, 4913);
    			attr_dev(div1, "class", "chat__sender svelte-11ecmha");
    			add_location(div1, file$16, 181, 8, 4583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(h4, t1);
    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$chatStore, $playerStore, $socialStore*/ 28 && !src_url_equal(img.src, img_src_value = "assets/avatars/" + (/*message*/ ctx[13].username === /*$playerStore*/ ctx[3].username
    			? /*$playerStore*/ ctx[3].avatarId
    			: /*$socialStore*/ ctx[2].chat.avatarId) + ".jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$chatStore, $playerStore, $socialStore*/ 28 && t1_value !== (t1_value = (/*message*/ ctx[13].username === /*$playerStore*/ ctx[3].username
    			? /*$playerStore*/ ctx[3].username
    			: /*$socialStore*/ ctx[2].chat.username) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$chatStore*/ 16) {
    				each_value_1 = /*message*/ ctx[13].messages;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(181:6) {#each $chatStore as message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$18(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$socialStore*/ ctx[2].chat.isOpen && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
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
    			if (/*$socialStore*/ ctx[2].chat.isOpen) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$socialStore*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$18.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$18($$self, $$props, $$invalidate) {
    	let $socialStore;
    	let $playerStore;
    	let $chatStore;
    	validate_store(socialStore, 'socialStore');
    	component_subscribe($$self, socialStore, $$value => $$invalidate(2, $socialStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(3, $playerStore = $$value));
    	validate_store(chatStore, 'chatStore');
    	component_subscribe($$self, chatStore, $$value => $$invalidate(4, $chatStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChatWindow', slots, []);
    	let text = "";
    	let chatMessagesRef;

    	const onTip = () => {
    		const { username } = $socialStore.chat;
    		miscService.openModal("tip", { username });
    	};

    	const onGift = () => {
    		const { username } = $socialStore.chat;
    		miscService.openModal("gift", { username });
    	};

    	const onUnfriend = () => {
    		const { username } = $socialStore.chat;
    		miscService.openModal("unfriend", { username });
    	};

    	const onBlock = () => {
    		const { username } = $socialStore.chat;
    		miscService.openModal("block", { username });
    	};

    	const onChatClose = () => {
    		set_store_value(socialStore, $socialStore.chat.isOpen = false, $socialStore);
    	};

    	const onSendMessage = () => {
    		if (text) {
    			const sender = $playerStore.username;
    			const receiver = $socialStore.chat.username;
    			const date = new Date();
    			socketService.socket.emit("sendChatMsg", { sender, receiver, text, date });
    			$$invalidate(0, text = "");
    		}
    	};

    	onMount(() => {
    		if ($socialStore.chat.isOpen) {
    			chatMessagesRef.scrollTo(0, chatMessagesRef.scrollHeight);
    		}
    	});

    	beforeUpdate(() => {
    		const newChat = [];

    		$socialStore.chat.messages.forEach(message => {
    			const date = new Date(message.date);
    			const timeString = date.toLocaleTimeString(["en-US"], { hour: "2-digit", minute: "2-digit" });
    			const newChatLast = newChat[newChat.length - 1];

    			if (newChat.length && newChatLast.username === message.username) {
    				newChatLast.messages.push({ text: message.text, date: timeString });
    			} else {
    				newChat.push({
    					username: message.username,
    					messages: [{ text: message.text, date: timeString }]
    				});
    			}
    		});

    		chatStore.set(newChat);
    	});

    	afterUpdate(() => {
    		if ($socialStore.chat.isOpen) {
    			chatMessagesRef.scrollTo(0, chatMessagesRef.scrollHeight);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChatWindow> was created with unknown prop '${key}'`);
    	});

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chatMessagesRef = $$value;
    			$$invalidate(1, chatMessagesRef);
    		});
    	}

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		onMount,
    		miscService,
    		socketService,
    		playerStore,
    		socialStore,
    		chatStore,
    		FontAwesome,
    		text,
    		chatMessagesRef,
    		onTip,
    		onGift,
    		onUnfriend,
    		onBlock,
    		onChatClose,
    		onSendMessage,
    		$socialStore,
    		$playerStore,
    		$chatStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('chatMessagesRef' in $$props) $$invalidate(1, chatMessagesRef = $$props.chatMessagesRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		text,
    		chatMessagesRef,
    		$socialStore,
    		$playerStore,
    		$chatStore,
    		onTip,
    		onGift,
    		onUnfriend,
    		onBlock,
    		onChatClose,
    		onSendMessage,
    		main_binding,
    		input_input_handler
    	];
    }

    class ChatWindow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$18, create_fragment$18, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChatWindow",
    			options,
    			id: create_fragment$18.name
    		});
    	}
    }

    /* src\ui\Button.svelte generated by Svelte v3.46.4 */

    const file$15 = "src\\ui\\Button.svelte";

    function create_fragment$17(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(`btn--${/*style*/ ctx[0]}-${/*color*/ ctx[1]}`) + " svelte-1fxzvnx"));
    			attr_dev(button, "type", /*type*/ ctx[2]);
    			button.disabled = /*disabled*/ ctx[3];
    			add_location(button, file$15, 81, 0, 1338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*style, color*/ 3 && button_class_value !== (button_class_value = "" + (null_to_empty(`btn--${/*style*/ ctx[0]}-${/*color*/ ctx[1]}`) + " svelte-1fxzvnx"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*type*/ 4) {
    				attr_dev(button, "type", /*type*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 8) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[3]);
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
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$17.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$17($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { style = "raised" } = $$props;
    	let { color = "purple" } = $$props;
    	let { type = "button" } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['style', 'color', 'type', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ style, color, type, disabled });

    	$$self.$inject_state = $$props => {
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [style, color, type, disabled, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$17, create_fragment$17, safe_not_equal, { style: 0, color: 1, type: 2, disabled: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$17.name
    		});
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\Form.svelte generated by Svelte v3.46.4 */

    const file$14 = "src\\ui\\Form.svelte";

    function create_fragment$16(ctx) {
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			attr_dev(form, "class", "svelte-1ihuixd");
    			add_location(form, file$14, 9, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
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
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$16.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$16($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, submit_handler];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$16, create_fragment$16, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$16.name
    		});
    	}
    }

    /* src\ui\Img.svelte generated by Svelte v3.46.4 */

    const file$13 = "src\\ui\\Img.svelte";

    function create_fragment$15(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = `assets/${/*src*/ ctx[0]}`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "class", "svelte-1qo6czq");
    			add_location(img, file$13, 9, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = `assets/${/*src*/ ctx[0]}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$15.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$15($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Img', slots, []);
    	let { src } = $$props;
    	let { alt } = $$props;
    	const writable_props = ['src', 'alt'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Img> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	$$self.$capture_state = () => ({ src, alt });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, alt];
    }

    class Img extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$15, create_fragment$15, safe_not_equal, { src: 0, alt: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Img",
    			options,
    			id: create_fragment$15.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Img> was created without expected prop 'src'");
    		}

    		if (/*alt*/ ctx[1] === undefined && !('alt' in props)) {
    			console.warn("<Img> was created without expected prop 'alt'");
    		}
    	}

    	get src() {
    		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\Input.svelte generated by Svelte v3.46.4 */

    const file$12 = "src\\ui\\Input.svelte";

    // (105:30) 
    function create_if_block_3$4(ctx) {
    	let label;
    	let input;
    	let t0;
    	let div;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			div = element("div");
    			t1 = text(/*placeholder*/ ctx[2]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "class", "svelte-1vjiaz0");
    			add_location(input, file$12, 106, 4, 2285);
    			attr_dev(div, "class", "svelte-1vjiaz0");
    			add_location(div, file$12, 107, 4, 2342);
    			attr_dev(label, "class", "label--checkbox svelte-1vjiaz0");
    			add_location(label, file$12, 105, 2, 2248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*checked*/ ctx[1];
    			append_dev(label, t0);
    			append_dev(label, div);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*checked*/ 2) {
    				input.checked = /*checked*/ ctx[1];
    			}

    			if (dirty & /*placeholder*/ 4) set_data_dev(t1, /*placeholder*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(105:30) ",
    		ctx
    	});

    	return block;
    }

    // (100:30) 
    function create_if_block_2$5(ctx) {
    	let label;
    	let div;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			t0 = text(/*placeholder*/ ctx[2]);
    			t1 = space();
    			input = element("input");
    			attr_dev(div, "class", "svelte-1vjiaz0");
    			add_location(div, file$12, 101, 4, 2109);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "maxlength", /*maxlength*/ ctx[4]);
    			attr_dev(input, "class", "svelte-1vjiaz0");
    			add_location(input, file$12, 102, 4, 2139);
    			attr_dev(label, "class", "svelte-1vjiaz0");
    			add_location(label, file$12, 100, 2, 2096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, t0);
    			append_dev(label, t1);
    			append_dev(label, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) set_data_dev(t0, /*placeholder*/ ctx[2]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*maxlength*/ 16) {
    				attr_dev(input, "maxlength", /*maxlength*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(100:30) ",
    		ctx
    	});

    	return block;
    }

    // (98:28) 
    function create_if_block_1$9(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Coming soon";
    			add_location(p, file$12, 98, 2, 2042);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(98:28) ",
    		ctx
    	});

    	return block;
    }

    // (93:0) {#if type === "text"}
    function create_if_block$j(ctx) {
    	let label;
    	let div;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			t0 = text(/*placeholder*/ ctx[2]);
    			t1 = space();
    			input = element("input");
    			attr_dev(div, "class", "svelte-1vjiaz0");
    			add_location(div, file$12, 94, 4, 1909);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "maxlength", /*maxlength*/ ctx[4]);
    			attr_dev(input, "class", "svelte-1vjiaz0");
    			add_location(input, file$12, 95, 4, 1939);
    			attr_dev(label, "class", "svelte-1vjiaz0");
    			add_location(label, file$12, 93, 2, 1896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, t0);
    			append_dev(label, t1);
    			append_dev(label, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) set_data_dev(t0, /*placeholder*/ ctx[2]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*maxlength*/ 16) {
    				attr_dev(input, "maxlength", /*maxlength*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(93:0) {#if type === \\\"text\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$14(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[3] === "text") return create_if_block$j;
    		if (/*type*/ ctx[3] === "number") return create_if_block_1$9;
    		if (/*type*/ ctx[3] === "password") return create_if_block_2$5;
    		if (/*type*/ ctx[3] === "checkbox") return create_if_block_3$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$14.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$14($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { value = "" } = $$props;
    	let { placeholder } = $$props;
    	let { type = "text" } = $$props;
    	let { checked = false } = $$props;
    	let { maxlength = 32 } = $$props;
    	const writable_props = ['value', 'placeholder', 'type', 'checked', 'maxlength'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(1, checked);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('checked' in $$props) $$invalidate(1, checked = $$props.checked);
    		if ('maxlength' in $$props) $$invalidate(4, maxlength = $$props.maxlength);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		placeholder,
    		type,
    		checked,
    		maxlength
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('checked' in $$props) $$invalidate(1, checked = $$props.checked);
    		if ('maxlength' in $$props) $$invalidate(4, maxlength = $$props.maxlength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		checked,
    		placeholder,
    		type,
    		maxlength,
    		input_input_handler,
    		input_input_handler_1,
    		input_change_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$14, create_fragment$14, safe_not_equal, {
    			value: 0,
    			placeholder: 2,
    			type: 3,
    			checked: 1,
    			maxlength: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$14.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*placeholder*/ ctx[2] === undefined && !('placeholder' in props)) {
    			console.warn("<Input> was created without expected prop 'placeholder'");
    		}
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxlength() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxlength(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\Modal.svelte generated by Svelte v3.46.4 */
    const file$11 = "src\\ui\\Modal.svelte";

    function create_fragment$13(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "modal svelte-1pfck1v");
    			add_location(div0, file$11, 26, 2, 640);
    			attr_dev(div1, "class", "wrapper--modal svelte-1pfck1v");
    			add_location(div1, file$11, 25, 0, 585);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", self$1(/*onExit*/ ctx[0]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
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
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$13.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$13($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);

    	const onExit = () => {
    		miscService.closeModal();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ miscService, onExit });
    	return [onExit, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$13, create_fragment$13, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$13.name
    		});
    	}
    }

    /* src\ui\ProgressBar.svelte generated by Svelte v3.46.4 */

    const file$10 = "src\\ui\\ProgressBar.svelte";

    function create_fragment$12(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`progress-bar__progress progress-bar__progress--${/*size*/ ctx[1]}`) + " svelte-ipgubo"));
    			attr_dev(div0, "style", div0_style_value = `width: ${/*progress*/ ctx[2]}%`);
    			toggle_class(div0, "green", /*color*/ ctx[0] === "green");
    			toggle_class(div0, "blue", /*color*/ ctx[0] === "blue");
    			toggle_class(div0, "purple", /*color*/ ctx[0] === "purple");
    			add_location(div0, file$10, 47, 2, 774);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`progress-bar progress-bar--${/*size*/ ctx[1]}`) + " svelte-ipgubo"));
    			add_location(div1, file$10, 46, 0, 720);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`progress-bar__progress progress-bar__progress--${/*size*/ ctx[1]}`) + " svelte-ipgubo"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*progress*/ 4 && div0_style_value !== (div0_style_value = `width: ${/*progress*/ ctx[2]}%`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*size, color*/ 3) {
    				toggle_class(div0, "green", /*color*/ ctx[0] === "green");
    			}

    			if (dirty & /*size, color*/ 3) {
    				toggle_class(div0, "blue", /*color*/ ctx[0] === "blue");
    			}

    			if (dirty & /*size, color*/ 3) {
    				toggle_class(div0, "purple", /*color*/ ctx[0] === "purple");
    			}

    			if (dirty & /*size*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`progress-bar progress-bar--${/*size*/ ctx[1]}`) + " svelte-ipgubo"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$12.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$12($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressBar', slots, []);
    	let { color = "purple" } = $$props;
    	let { size = "md" } = $$props;
    	let { progress = 0 } = $$props;
    	const writable_props = ['color', 'size', 'progress'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('progress' in $$props) $$invalidate(2, progress = $$props.progress);
    	};

    	$$self.$capture_state = () => ({ color, size, progress });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('progress' in $$props) $$invalidate(2, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, progress];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$12, create_fragment$12, safe_not_equal, { color: 0, size: 1, progress: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$12.name
    		});
    	}

    	get color() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\Text.svelte generated by Svelte v3.46.4 */

    const file$$ = "src\\ui\\Text.svelte";

    function create_fragment$11(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(`${/*color*/ ctx[0]} ${/*size*/ ctx[1]}`) + " svelte-1kwbaec"));
    			toggle_class(span, "isMonospace", /*isMonospace*/ ctx[2]);
    			toggle_class(span, "isUnderline", /*isUnderline*/ ctx[3]);
    			add_location(span, file$$, 71, 0, 716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*color, size*/ 3 && span_class_value !== (span_class_value = "" + (null_to_empty(`${/*color*/ ctx[0]} ${/*size*/ ctx[1]}`) + " svelte-1kwbaec"))) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*color, size, isMonospace*/ 7) {
    				toggle_class(span, "isMonospace", /*isMonospace*/ ctx[2]);
    			}

    			if (dirty & /*color, size, isUnderline*/ 11) {
    				toggle_class(span, "isUnderline", /*isUnderline*/ ctx[3]);
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
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$11.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$11($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	let { color = "white" } = $$props;
    	let { size = "md" } = $$props;
    	let { isMonospace = false } = $$props;
    	let { isUnderline = false } = $$props;
    	const writable_props = ['color', 'size', 'isMonospace', 'isUnderline'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('isMonospace' in $$props) $$invalidate(2, isMonospace = $$props.isMonospace);
    		if ('isUnderline' in $$props) $$invalidate(3, isUnderline = $$props.isUnderline);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ color, size, isMonospace, isUnderline });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('isMonospace' in $$props) $$invalidate(2, isMonospace = $$props.isMonospace);
    		if ('isUnderline' in $$props) $$invalidate(3, isUnderline = $$props.isUnderline);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, size, isMonospace, isUnderline, $$scope, slots, click_handler];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$11, create_fragment$11, safe_not_equal, {
    			color: 0,
    			size: 1,
    			isMonospace: 2,
    			isUnderline: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$11.name
    		});
    	}

    	get color() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMonospace() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMonospace(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isUnderline() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isUnderline(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\AddFriend.svelte generated by Svelte v3.46.4 */

    // (12:4) <Button type="submit">
    function create_default_slot_2$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SEND");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$e.name,
    		type: "slot",
    		source: "(12:4) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:2) <Form on:submit={onAddFriend}>
    function create_default_slot_1$i(ctx) {
    	let input;
    	let updating_value;
    	let t;
    	let button;
    	let current;

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[2](value);
    	}

    	let input_props = { placeholder: "Username" };

    	if (/*username*/ ctx[0] !== void 0) {
    		input_props.value = /*username*/ ctx[0];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, 'value', input_value_binding));

    	button = new Button({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_2$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (!updating_value && dirty & /*username*/ 1) {
    				updating_value = true;
    				input_changes.value = /*username*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$i.name,
    		type: "slot",
    		source: "(10:2) <Form on:submit={onAddFriend}>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Modal>
    function create_default_slot$p(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_1$i] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*onAddFriend*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};

    			if (dirty & /*$$scope, username*/ 9) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$p.name,
    		type: "slot",
    		source: "(9:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$10(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$p] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, username*/ 9) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$10.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$10($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddFriend', slots, []);
    	let username = "";

    	const onAddFriend = () => {
    		socketService.socket.emit("addFriend", { username });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddFriend> was created with unknown prop '${key}'`);
    	});

    	function input_value_binding(value) {
    		username = value;
    		$$invalidate(0, username);
    	}

    	$$self.$capture_state = () => ({
    		socketService,
    		Button,
    		Form,
    		Input,
    		Modal,
    		username,
    		onAddFriend
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, onAddFriend, input_value_binding];
    }

    class AddFriend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$10, create_fragment$10, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddFriend",
    			options,
    			id: create_fragment$10.name
    		});
    	}
    }

    /* src\modals\Block.svelte generated by Svelte v3.46.4 */
    const file$_ = "src\\modals\\Block.svelte";

    // (10:0) <Modal>
    function create_default_slot$o(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*$modalStore*/ ctx[0].data.username + "";
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let button0;
    	let t6;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Are you sure you want to block ");
    			t1 = text(t1_value);
    			t2 = text("?\r\n    ");
    			br = element("br");
    			t3 = text("\r\n    Doing so will prevent them from sending you requests until you unblock them.");
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "YES";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "NO";
    			add_location(br, file$_, 12, 4, 366);
    			add_location(p, file$_, 10, 2, 292);
    			attr_dev(button0, "class", "btn--raised-accent");
    			add_location(button0, file$_, 15, 2, 465);
    			attr_dev(button1, "class", "btn--basic-accent");
    			add_location(button1, file$_, 18, 2, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, br);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button0, "click", /*onBlock*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$modalStore*/ 1 && t1_value !== (t1_value = /*$modalStore*/ ctx[0].data.username + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$o.name,
    		type: "slot",
    		source: "(10:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$$(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$o] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, $modalStore*/ 5) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$$.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$$($$self, $$props, $$invalidate) {
    	let $modalStore;
    	validate_store(modalStore, 'modalStore');
    	component_subscribe($$self, modalStore, $$value => $$invalidate(0, $modalStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Block', slots, []);

    	const onBlock = () => {
    		const { username } = $modalStore.data;
    		socketService.socket.emit("block", { username });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Block> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		socketService,
    		modalStore,
    		Modal,
    		onBlock,
    		$modalStore
    	});

    	return [$modalStore, onBlock];
    }

    class Block$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$$, create_fragment$$, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Block",
    			options,
    			id: create_fragment$$.name
    		});
    	}
    }

    /* src\modals\ChangeDeckName.svelte generated by Svelte v3.46.4 */
    const file$Z = "src\\modals\\ChangeDeckName.svelte";

    // (11:0) <Modal>
    function create_default_slot$n(ctx) {
    	let form;
    	let div0;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Deck name";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "SET";
    			attr_dev(label, "for", "deckName");
    			add_location(label, file$Z, 13, 6, 359);
    			attr_dev(input, "id", "deckName");
    			attr_dev(input, "placeholder", "Deck name");
    			attr_dev(input, "name", "deckName");
    			attr_dev(input, "type", "text");
    			add_location(input, file$Z, 14, 6, 406);
    			attr_dev(div0, "class", "form__field");
    			add_location(div0, file$Z, 12, 4, 326);
    			attr_dev(button, "class", "form__field__submit");
    			add_location(button, file$Z, 23, 6, 596);
    			attr_dev(div1, "class", "form__field");
    			add_location(div1, file$Z, 22, 4, 563);
    			add_location(form, file$Z, 11, 2, 314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, label);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(button, "click", /*onSetDeckName*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$n.name,
    		type: "slot",
    		source: "(11:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$_(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$n] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, name*/ 17) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$_.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$_($$self, $$props, $$invalidate) {
    	let $modalStore;
    	validate_store(modalStore, 'modalStore');
    	component_subscribe($$self, modalStore, $$value => $$invalidate(3, $modalStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChangeDeckName', slots, []);
    	let name = "";

    	const onSetDeckName = () => {
    		const { id } = $modalStore.data;
    		socketService.socket.emit("setDeckName", { id, name });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChangeDeckName> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$capture_state = () => ({
    		socketService,
    		modalStore,
    		Modal,
    		name,
    		onSetDeckName,
    		$modalStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, onSetDeckName, input_input_handler];
    }

    class ChangeDeckName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$_, create_fragment$_, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChangeDeckName",
    			options,
    			id: create_fragment$_.name
    		});
    	}
    }

    /* src\modals\Gift.svelte generated by Svelte v3.46.4 */
    const file$Y = "src\\modals\\Gift.svelte";

    // (4:0) <Modal>
    function create_default_slot$m(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Gifting coming soon... 😉";
    			add_location(p, file$Y, 4, 2, 83);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$m.name,
    		type: "slot",
    		source: "(4:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Z(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$m] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gift', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gift> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Modal });
    	return [];
    }

    class Gift extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Z, create_fragment$Z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gift",
    			options,
    			id: create_fragment$Z.name
    		});
    	}
    }

    /* src\modals\JoinLobby.svelte generated by Svelte v3.46.4 */
    const file$X = "src\\modals\\JoinLobby.svelte";

    // (13:4) <Text>
    function create_default_slot_2$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lobby ID");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$d.name,
    		type: "slot",
    		source: "(13:4) <Text>",
    		ctx
    	});

    	return block;
    }

    // (17:4) <Button type="submit">
    function create_default_slot_1$h(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("JOIN");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$h.name,
    		type: "slot",
    		source: "(17:4) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Modal>
    function create_default_slot$l(ctx) {
    	let form;
    	let text_1;
    	let t0;
    	let input;
    	let t1;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_2$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_1$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(text_1.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			create_component(button.$$.fragment);
    			attr_dev(input, "placeholder", "Lobby ID");
    			attr_dev(input, "type", "number");
    			add_location(input, file$X, 15, 4, 405);
    			add_location(form, file$X, 11, 2, 313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(text_1, form, null);
    			append_dev(form, t0);
    			append_dev(form, input);
    			set_input_value(input, /*lobbyId*/ ctx[0]);
    			append_dev(form, t1);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(form, "submit", prevent_default(/*onJoinLobby*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);

    			if (dirty & /*lobbyId*/ 1 && to_number(input.value) !== /*lobbyId*/ ctx[0]) {
    				set_input_value(input, /*lobbyId*/ ctx[0]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(text_1);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$l.name,
    		type: "slot",
    		source: "(11:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Y(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$l] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, lobbyId*/ 9) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('JoinLobby', slots, []);
    	let lobbyId;

    	const onJoinLobby = () => {
    		socketService.socket.emit("joinLobby", { lobbyId });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<JoinLobby> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		lobbyId = to_number(this.value);
    		$$invalidate(0, lobbyId);
    	}

    	$$self.$capture_state = () => ({
    		socketService,
    		Modal,
    		Button,
    		Text,
    		lobbyId,
    		onJoinLobby
    	});

    	$$self.$inject_state = $$props => {
    		if ('lobbyId' in $$props) $$invalidate(0, lobbyId = $$props.lobbyId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lobbyId, onJoinLobby, input_input_handler];
    }

    class JoinLobby extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Y, create_fragment$Y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JoinLobby",
    			options,
    			id: create_fragment$Y.name
    		});
    	}
    }

    /* src\modals\SendToken.svelte generated by Svelte v3.46.4 */
    const file$W = "src\\modals\\SendToken.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (71:8) {#each chains as chain}
    function create_each_block$d(ctx) {
    	let option;
    	let t0_value = /*chain*/ ctx[9].text + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*chain*/ ctx[9];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-g6kqm2");
    			add_location(option, file$W, 71, 10, 1778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(71:8) {#each chains as chain}",
    		ctx
    	});

    	return block;
    }

    // (99:6) <Text>
    function create_default_slot_2$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SEND");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$c.name,
    		type: "slot",
    		source: "(99:6) <Text>",
    		ctx
    	});

    	return block;
    }

    // (98:4) <Button color="green" on:click={onSendToken}>
    function create_default_slot_1$g(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_2$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$g.name,
    		type: "slot",
    		source: "(98:4) <Button color=\\\"green\\\" on:click={onSendToken}>",
    		ctx
    	});

    	return block;
    }

    // (63:0) <Modal>
    function create_default_slot$k(ctx) {
    	let div0;
    	let t1;
    	let form_1;
    	let div1;
    	let label0;
    	let t3;
    	let select;
    	let t4;
    	let div2;
    	let label1;
    	let t6;
    	let input0;
    	let t7;
    	let div3;
    	let label2;
    	let t9;
    	let input1;
    	let t10;
    	let div4;
    	let input2;
    	let t11;
    	let label3;
    	let t13;
    	let div5;
    	let t14;
    	let t15_value = /*form*/ ctx[0].chain.fee + "";
    	let t15;
    	let t16;
    	let div6;
    	let t17;
    	let t18_value = (parseFloat(/*form*/ ctx[0].amount) + parseFloat(/*form*/ ctx[0].chain.fee)).toFixed(4) + "";
    	let t18;
    	let t19;
    	let t20_value = /*form*/ ctx[0].chain.text + "";
    	let t20;
    	let t21;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*chains*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	button = new Button({
    			props: {
    				color: "green",
    				$$slots: { default: [create_default_slot_1$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onSendToken*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "SEND TOKENS";
    			t1 = space();
    			form_1 = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Token";
    			t3 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "To";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Amount";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			div4 = element("div");
    			input2 = element("input");
    			t11 = space();
    			label3 = element("label");
    			label3.textContent = "Withdraw?";
    			t13 = space();
    			div5 = element("div");
    			t14 = text("Fee: ");
    			t15 = text(t15_value);
    			t16 = space();
    			div6 = element("div");
    			t17 = text("Total: ");
    			t18 = text(t18_value);
    			t19 = space();
    			t20 = text(t20_value);
    			t21 = space();
    			create_component(button.$$.fragment);
    			add_location(div0, file$W, 63, 2, 1575);
    			attr_dev(label0, "for", "chain");
    			add_location(label0, file$W, 68, 6, 1650);
    			attr_dev(select, "id", "chain");
    			attr_dev(select, "class", "svelte-g6kqm2");
    			if (/*form*/ ctx[0].chain === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$W, 69, 6, 1690);
    			attr_dev(div1, "class", "form__field svelte-g6kqm2");
    			add_location(div1, file$W, 67, 4, 1617);
    			attr_dev(label1, "for", "to");
    			add_location(label1, file$W, 80, 6, 1936);
    			attr_dev(input0, "id", "to");
    			attr_dev(input0, "class", "input--green");
    			attr_dev(input0, "placeholder", "To");
    			add_location(input0, file$W, 81, 6, 1970);
    			attr_dev(div2, "class", "form__field svelte-g6kqm2");
    			add_location(div2, file$W, 79, 4, 1903);
    			attr_dev(label2, "for", "amount");
    			add_location(label2, file$W, 85, 6, 2098);
    			attr_dev(input1, "id", "amount");
    			attr_dev(input1, "class", "input--green");
    			attr_dev(input1, "placeholder", "Amount");
    			add_location(input1, file$W, 86, 6, 2140);
    			attr_dev(div3, "class", "form__field svelte-g6kqm2");
    			add_location(div3, file$W, 84, 4, 2065);
    			attr_dev(input2, "class", "checkbox svelte-g6kqm2");
    			attr_dev(input2, "id", "withdraw");
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$W, 90, 6, 2302);
    			attr_dev(label3, "for", "withdraw");
    			set_style(label3, "flex-grow", "1");
    			add_location(label3, file$W, 91, 6, 2396);
    			attr_dev(div4, "class", "form__field svelte-g6kqm2");
    			set_style(div4, "display", "flex");
    			add_location(div4, file$W, 89, 4, 2247);
    			add_location(div5, file$W, 94, 4, 2476);
    			add_location(div6, file$W, 95, 4, 2514);
    			add_location(form_1, file$W, 65, 2, 1603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*form*/ ctx[0].chain);
    			append_dev(form_1, t4);
    			append_dev(form_1, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t6);
    			append_dev(div2, input0);
    			set_input_value(input0, /*form*/ ctx[0].to);
    			append_dev(form_1, t7);
    			append_dev(form_1, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t9);
    			append_dev(div3, input1);
    			set_input_value(input1, /*form*/ ctx[0].amount);
    			append_dev(form_1, t10);
    			append_dev(form_1, div4);
    			append_dev(div4, input2);
    			input2.checked = /*form*/ ctx[0].isWithdraw;
    			append_dev(div4, t11);
    			append_dev(div4, label3);
    			append_dev(form_1, t13);
    			append_dev(form_1, div5);
    			append_dev(div5, t14);
    			append_dev(div5, t15);
    			append_dev(form_1, t16);
    			append_dev(form_1, div6);
    			append_dev(div6, t17);
    			append_dev(div6, t18);
    			append_dev(div6, t19);
    			append_dev(div6, t20);
    			append_dev(form_1, t21);
    			mount_component(button, form_1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*chains*/ 2) {
    				each_value = /*chains*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*form, chains*/ 3) {
    				select_option(select, /*form*/ ctx[0].chain);
    			}

    			if (dirty & /*form, chains*/ 3 && input0.value !== /*form*/ ctx[0].to) {
    				set_input_value(input0, /*form*/ ctx[0].to);
    			}

    			if (dirty & /*form, chains*/ 3 && input1.value !== /*form*/ ctx[0].amount) {
    				set_input_value(input1, /*form*/ ctx[0].amount);
    			}

    			if (dirty & /*form, chains*/ 3) {
    				input2.checked = /*form*/ ctx[0].isWithdraw;
    			}

    			if ((!current || dirty & /*form*/ 1) && t15_value !== (t15_value = /*form*/ ctx[0].chain.fee + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty & /*form*/ 1) && t18_value !== (t18_value = (parseFloat(/*form*/ ctx[0].amount) + parseFloat(/*form*/ ctx[0].chain.fee)).toFixed(4) + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*form*/ 1) && t20_value !== (t20_value = /*form*/ ctx[0].chain.text + "")) set_data_dev(t20, t20_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form_1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(63:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$X(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$k] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, form*/ 4097) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$X.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$X($$self, $$props, $$invalidate) {
    	let disabled;
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(3, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SendToken', slots, []);

    	const chains = [
    		{ id: 0, text: "TLOS", fee: "0.0010 TLOS" },
    		{ id: 1, text: "SOM", fee: "0.001 SOM" },
    		{
    			id: 2,
    			text: "ATMOS",
    			fee: "0.0010 ATMOS"
    		}
    	];

    	const form = {
    		chain: { id: 0, text: "TLOS", fee: "0.0010 TLOS" },
    		to: "",
    		amount: "0.0000",
    		isWithdraw: false
    	};

    	const onSendToken = () => {
    		const { username, publicKey, privateKey } = $playerStore;
    		const signature = eccService.sign(`sendToken`, privateKey);

    		socketService.socket.emit("sendToken", {
    			chain_id: form.chain.id,
    			relayer: "admin",
    			from: username,
    			to: form.to,
    			quantity: `${form.amount} ${form.chain.text}`,
    			fee: `${form.chain.text === "TLOS" ? "0.0010" : "0.001"} ${form.chain.text}`,
    			nonce: 1,
    			memo: "test",
    			sig: signature,
    			isWithdraw: form.isWithdraw
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SendToken> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		form.chain = select_value(this);
    		$$invalidate(0, form);
    		$$invalidate(1, chains);
    	}

    	function input0_input_handler() {
    		form.to = this.value;
    		$$invalidate(0, form);
    		$$invalidate(1, chains);
    	}

    	function input1_input_handler() {
    		form.amount = this.value;
    		$$invalidate(0, form);
    		$$invalidate(1, chains);
    	}

    	function input2_change_handler() {
    		form.isWithdraw = this.checked;
    		$$invalidate(0, form);
    		$$invalidate(1, chains);
    	}

    	$$self.$capture_state = () => ({
    		eccService,
    		socketService,
    		playerStore,
    		Button,
    		Modal,
    		Text,
    		chains,
    		form,
    		onSendToken,
    		disabled,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('disabled' in $$props) disabled = $$props.disabled;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore*/ 8) {
    			disabled = $playerStore.wallet;
    		}
    	};

    	return [
    		form,
    		chains,
    		onSendToken,
    		$playerStore,
    		select_change_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler
    	];
    }

    class SendToken extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$X, create_fragment$X, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SendToken",
    			options,
    			id: create_fragment$X.name
    		});
    	}
    }

    /* src\modals\Tip.svelte generated by Svelte v3.46.4 */
    const file$V = "src\\modals\\Tip.svelte";

    // (4:0) <Modal>
    function create_default_slot$j(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Tipping coming soon... 😉";
    			add_location(p, file$V, 4, 2, 83);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(4:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tip', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tip> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Modal });
    	return [];
    }

    class Tip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$W, create_fragment$W, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tip",
    			options,
    			id: create_fragment$W.name
    		});
    	}
    }

    /* src\modals\Unfriend.svelte generated by Svelte v3.46.4 */
    const file$U = "src\\modals\\Unfriend.svelte";

    // (10:0) <Modal>
    function create_default_slot$i(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*$modalStore*/ ctx[0].data.username + "";
    	let t1;
    	let t2;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Are you sure you want to remove ");
    			t1 = text(t1_value);
    			t2 = text(" from your\r\n    friends list?");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "YES";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "NO";
    			add_location(p, file$U, 10, 2, 298);
    			attr_dev(button0, "class", "btn--raised-accent");
    			add_location(button0, file$U, 14, 2, 407);
    			attr_dev(button1, "class", "btn--basic-accent");
    			add_location(button1, file$U, 15, 2, 480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button0, "click", /*onUnfriend*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$modalStore*/ 1 && t1_value !== (t1_value = /*$modalStore*/ ctx[0].data.username + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(10:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$V(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$i] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, $modalStore*/ 5) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let $modalStore;
    	validate_store(modalStore, 'modalStore');
    	component_subscribe($$self, modalStore, $$value => $$invalidate(0, $modalStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Unfriend', slots, []);

    	const onUnfriend = () => {
    		const { username } = $modalStore.data;
    		socketService.socket.emit("unfriend", { username });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Unfriend> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		socketService,
    		modalStore,
    		Modal,
    		onUnfriend,
    		$modalStore
    	});

    	return [$modalStore, onUnfriend];
    }

    class Unfriend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$V, create_fragment$V, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Unfriend",
    			options,
    			id: create_fragment$V.name
    		});
    	}
    }

    /* src\ui\Card.svelte generated by Svelte v3.46.4 */
    const file$T = "src\\ui\\Card.svelte";

    function create_fragment$U(ctx) {
    	let div;
    	let img0;
    	let img0_src_value;
    	let t;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img0 = element("img");
    			t = space();
    			img1 = element("img");
    			attr_dev(img0, "class", "cardfront svelte-1f3rkrs");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/cards/cardfront.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$T, 183, 2, 4180);
    			attr_dev(img1, "class", "cardavatar svelte-1f3rkrs");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$T, 184, 2, 4241);
    			attr_dev(div, "class", "card svelte-1f3rkrs");
    			add_location(div, file$T, 147, 0, 3041);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img0);
    			append_dev(div, t);
    			append_dev(div, img1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card*/ 1 && !src_url_equal(img1.src, img1_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let isFlipped = false, passiveTooltip;
    	let { card, health, damage, isHealthBarVisible = false } = $$props;
    	let isNeutral = card.klass === CardKlass.NEUTRAL;
    	let isSolid = card.klass === CardKlass.SOLID;
    	let isLiquid = card.klass === CardKlass.LIQUID;
    	let isGas = card.klass === CardKlass.GAS;
    	let isPlasma = card.klass === CardKlass.PLASMA;

    	const flip = () => {
    		isFlipped = !isFlipped;
    	};

    	const passiveMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		passiveTooltip.style.top = `calc(24px + ${offsetY}px)`;
    		passiveTooltip.style.left = `calc(-12px + ${offsetX}px)`;
    	};

    	const writable_props = ['card', 'health', 'damage', 'isHealthBarVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('damage' in $$props) $$invalidate(2, damage = $$props.damage);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    	};

    	$$self.$capture_state = () => ({
    		CardType,
    		CardKlass,
    		passives,
    		ProgressBar,
    		Text,
    		Img,
    		card,
    		health,
    		damage,
    		isFlipped,
    		isHealthBarVisible,
    		passiveTooltip,
    		isNeutral,
    		isSolid,
    		isLiquid,
    		isGas,
    		isPlasma,
    		flip,
    		passiveMouseMove
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('damage' in $$props) $$invalidate(2, damage = $$props.damage);
    		if ('isFlipped' in $$props) isFlipped = $$props.isFlipped;
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('passiveTooltip' in $$props) passiveTooltip = $$props.passiveTooltip;
    		if ('isNeutral' in $$props) isNeutral = $$props.isNeutral;
    		if ('isSolid' in $$props) isSolid = $$props.isSolid;
    		if ('isLiquid' in $$props) isLiquid = $$props.isLiquid;
    		if ('isGas' in $$props) isGas = $$props.isGas;
    		if ('isPlasma' in $$props) isPlasma = $$props.isPlasma;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [card, health, damage, isHealthBarVisible];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$U, create_fragment$U, safe_not_equal, {
    			card: 0,
    			health: 1,
    			damage: 2,
    			isHealthBarVisible: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$U.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Card> was created without expected prop 'card'");
    		}

    		if (/*health*/ ctx[1] === undefined && !('health' in props)) {
    			console.warn("<Card> was created without expected prop 'health'");
    		}

    		if (/*damage*/ ctx[2] === undefined && !('damage' in props)) {
    			console.warn("<Card> was created without expected prop 'damage'");
    		}
    	}

    	get card() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damage() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damage(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHealthBarVisible() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHealthBarVisible(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modals\Graveyard.svelte generated by Svelte v3.46.4 */
    const file$S = "src\\modals\\Graveyard.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (37:4) {#each $modalStore.data as card}
    function create_each_block$c(ctx) {
    	let div;
    	let card;
    	let t;
    	let current;

    	card = new Card({
    			props: {
    				card: /*card*/ ctx[1],
    				health: 1,
    				damage: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "card svelte-comwb5");
    			add_location(div, file$S, 37, 6, 699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*$modalStore*/ 1) card_changes.card = /*card*/ ctx[1];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(37:4) {#each $modalStore.data as card}",
    		ctx
    	});

    	return block;
    }

    // (35:0) <Modal>
    function create_default_slot$h(ctx) {
    	let div;
    	let current;
    	let each_value = /*$modalStore*/ ctx[0].data;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
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

    			attr_dev(div, "class", "cards svelte-comwb5");
    			add_location(div, file$S, 35, 2, 634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$modalStore*/ 1) {
    				each_value = /*$modalStore*/ ctx[0].data;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(35:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$T(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, $modalStore*/ 17) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
    	let $modalStore;
    	validate_store(modalStore, 'modalStore');
    	component_subscribe($$self, modalStore, $$value => $$invalidate(0, $modalStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Graveyard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graveyard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ modalStore, Modal, Card, $modalStore });
    	return [$modalStore];
    }

    class Graveyard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graveyard",
    			options,
    			id: create_fragment$T.name
    		});
    	}
    }

    /* src\modals\Modals.svelte generated by Svelte v3.46.4 */

    // (13:0) {#if $modalStore.list.addFriend}
    function create_if_block_8(ctx) {
    	let addfriend;
    	let current;
    	addfriend = new AddFriend({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(addfriend.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addfriend, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addfriend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addfriend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addfriend, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(13:0) {#if $modalStore.list.addFriend}",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if $modalStore.list.block}
    function create_if_block_7(ctx) {
    	let block;
    	let current;
    	block = new Block$1({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(block.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(block, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(block.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(block.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(block, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(17:0) {#if $modalStore.list.block}",
    		ctx
    	});

    	return block_1;
    }

    // (21:0) {#if $modalStore.list.changeDeckName}
    function create_if_block_6(ctx) {
    	let changedeckname;
    	let current;
    	changedeckname = new ChangeDeckName({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(changedeckname.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(changedeckname, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(changedeckname.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(changedeckname.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(changedeckname, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(21:0) {#if $modalStore.list.changeDeckName}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if $modalStore.list.gift}
    function create_if_block_5$1(ctx) {
    	let gift;
    	let current;
    	gift = new Gift({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gift.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gift, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gift.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gift.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gift, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(25:0) {#if $modalStore.list.gift}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if $modalStore.list.joinLobby}
    function create_if_block_4$2(ctx) {
    	let joinlobby;
    	let current;
    	joinlobby = new JoinLobby({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(joinlobby.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(joinlobby, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(joinlobby.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(joinlobby.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(joinlobby, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(29:0) {#if $modalStore.list.joinLobby}",
    		ctx
    	});

    	return block;
    }

    // (33:0) {#if $modalStore.list.sendToken}
    function create_if_block_3$3(ctx) {
    	let sendtoken;
    	let current;
    	sendtoken = new SendToken({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sendtoken.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sendtoken, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sendtoken.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sendtoken.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sendtoken, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(33:0) {#if $modalStore.list.sendToken}",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if $modalStore.list.tip}
    function create_if_block_2$4(ctx) {
    	let tip;
    	let current;
    	tip = new Tip({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tip, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(37:0) {#if $modalStore.list.tip}",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if $modalStore.list.unfriend}
    function create_if_block_1$8(ctx) {
    	let unfriend;
    	let current;
    	unfriend = new Unfriend({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(unfriend.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(unfriend, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(unfriend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(unfriend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(unfriend, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(41:0) {#if $modalStore.list.unfriend}",
    		ctx
    	});

    	return block;
    }

    // (45:0) {#if $modalStore.list.graveyard}
    function create_if_block$i(ctx) {
    	let graveyard;
    	let current;
    	graveyard = new Graveyard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(graveyard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(graveyard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graveyard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graveyard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(graveyard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(45:0) {#if $modalStore.list.graveyard}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let if_block8_anchor;
    	let current;
    	let if_block0 = /*$modalStore*/ ctx[0].list.addFriend && create_if_block_8(ctx);
    	let if_block1 = /*$modalStore*/ ctx[0].list.block && create_if_block_7(ctx);
    	let if_block2 = /*$modalStore*/ ctx[0].list.changeDeckName && create_if_block_6(ctx);
    	let if_block3 = /*$modalStore*/ ctx[0].list.gift && create_if_block_5$1(ctx);
    	let if_block4 = /*$modalStore*/ ctx[0].list.joinLobby && create_if_block_4$2(ctx);
    	let if_block5 = /*$modalStore*/ ctx[0].list.sendToken && create_if_block_3$3(ctx);
    	let if_block6 = /*$modalStore*/ ctx[0].list.tip && create_if_block_2$4(ctx);
    	let if_block7 = /*$modalStore*/ ctx[0].list.unfriend && create_if_block_1$8(ctx);
    	let if_block8 = /*$modalStore*/ ctx[0].list.graveyard && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			if_block8_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			if (if_block8) if_block8.m(target, anchor);
    			insert_dev(target, if_block8_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$modalStore*/ ctx[0].list.addFriend) {
    				if (if_block0) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.block) {
    				if (if_block1) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.changeDeckName) {
    				if (if_block2) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.gift) {
    				if (if_block3) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_5$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.joinLobby) {
    				if (if_block4) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4$2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.sendToken) {
    				if (if_block5) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_3$3(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(t5.parentNode, t5);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.tip) {
    				if (if_block6) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_2$4(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(t6.parentNode, t6);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.unfriend) {
    				if (if_block7) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_1$8(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(t7.parentNode, t7);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (/*$modalStore*/ ctx[0].list.graveyard) {
    				if (if_block8) {
    					if (dirty & /*$modalStore*/ 1) {
    						transition_in(if_block8, 1);
    					}
    				} else {
    					if_block8 = create_if_block$i(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(if_block8_anchor.parentNode, if_block8_anchor);
    				}
    			} else if (if_block8) {
    				group_outros();

    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (if_block8) if_block8.d(detaching);
    			if (detaching) detach_dev(if_block8_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
    	let $modalStore;
    	validate_store(modalStore, 'modalStore');
    	component_subscribe($$self, modalStore, $$value => $$invalidate(0, $modalStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modals', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modals> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		modalStore,
    		AddFriend,
    		Block: Block$1,
    		ChangeDeckName,
    		Gift,
    		JoinLobby,
    		SendToken,
    		Tip,
    		Unfriend,
    		Graveyard,
    		$modalStore
    	});

    	return [$modalStore];
    }

    class Modals extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modals",
    			options,
    			id: create_fragment$S.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quadInOut(t) {
        t /= 0.5;
        if (t < 1)
            return 0.5 * t * t;
        t--;
        return -0.5 * (t * (t - 2) - 1);
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\Notifications.svelte generated by Svelte v3.46.4 */
    const file$R = "src\\Notifications.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].msg;
    	return child_ctx;
    }

    // (25:2) {#each $notificationsStore as {msg}}
    function create_each_block$b(ctx) {
    	let div;
    	let t0_value = /*msg*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "notification svelte-11eisc0");
    			add_location(div, file$R, 25, 4, 557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$notificationsStore*/ 1) && t0_value !== (t0_value = /*msg*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, /*inFly*/ ctx[1]);
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(25:2) {#each $notificationsStore as {msg}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let div;
    	let current;
    	let each_value = /*$notificationsStore*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
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

    			attr_dev(div, "class", "notifications svelte-11eisc0");
    			add_location(div, file$R, 23, 0, 484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$notificationsStore*/ 1) {
    				each_value = /*$notificationsStore*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let $notificationsStore;
    	validate_store(notificationsStore, 'notificationsStore');
    	component_subscribe($$self, notificationsStore, $$value => $$invalidate(0, $notificationsStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notifications', slots, []);
    	const inFly = { x: 100, duration: 225 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		notificationsStore,
    		inFly,
    		$notificationsStore
    	});

    	return [$notificationsStore, inFly];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$R, create_fragment$R, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$R.name
    		});
    	}
    }

    /* src\auth\Signin.svelte generated by Svelte v3.46.4 */
    const file$Q = "src\\auth\\Signin.svelte";

    // (16:2) <Text size="xlg">
    function create_default_slot_4$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$6.name,
    		type: "slot",
    		source: "(16:2) <Text size=\\\"xlg\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:4) <Button type="submit">
    function create_default_slot_3$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SIGN IN");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$7.name,
    		type: "slot",
    		source: "(21:4) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:2) <Form on:submit={onSignin}>
    function create_default_slot_2$b(ctx) {
    	let input0;
    	let updating_value;
    	let t0;
    	let input1;
    	let updating_value_1;
    	let t1;
    	let button;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[3](value);
    	}

    	let input0_props = { placeholder: "Username", maxlength: 12 };

    	if (/*$authStore*/ ctx[0].signinForm.username !== void 0) {
    		input0_props.value = /*$authStore*/ ctx[0].signinForm.username;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[4](value);
    	}

    	let input1_props = {
    		placeholder: "Password",
    		type: "password",
    		maxlength: 32
    	};

    	if (/*$authStore*/ ctx[0].signinForm.password !== void 0) {
    		input1_props.value = /*$authStore*/ ctx[0].signinForm.password;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	button = new Button({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(input1.$$.fragment);
    			t1 = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(input1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*$authStore*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*$authStore*/ ctx[0].signinForm.username;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*$authStore*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*$authStore*/ ctx[0].signinForm.password;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(input1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$b.name,
    		type: "slot",
    		source: "(18:2) <Form on:submit={onSignin}>",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Text color="purple" isUnderline={true} on:click={onGotoSignup}>
    function create_default_slot_1$f(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign up");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$f.name,
    		type: "slot",
    		source: "(26:4) <Text color=\\\"purple\\\" isUnderline={true} on:click={onGotoSignup}>",
    		ctx
    	});

    	return block;
    }

    // (24:2) <Text>
    function create_default_slot$g(ctx) {
    	let t;
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "purple",
    				isUnderline: true,
    				$$slots: { default: [create_default_slot_1$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text_1.$on("click", /*onGotoSignup*/ ctx[2]);

    	const block = {
    		c: function create() {
    			t = text("Dont have an account?\r\n    ");
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(24:2) <Text>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let div;
    	let text0;
    	let t0;
    	let br0;
    	let t1;
    	let form;
    	let t2;
    	let br1;
    	let t3;
    	let text1;
    	let current;

    	text0 = new Text({
    			props: {
    				size: "xlg",
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_2$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*onSignin*/ ctx[1]);

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(text0.$$.fragment);
    			t0 = space();
    			br0 = element("br");
    			t1 = space();
    			create_component(form.$$.fragment);
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			create_component(text1.$$.fragment);
    			add_location(br0, file$Q, 16, 2, 530);
    			add_location(br1, file$Q, 22, 2, 833);
    			add_location(div, file$Q, 14, 0, 486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(text0, div, null);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			mount_component(form, div, null);
    			append_dev(div, t2);
    			append_dev(div, br1);
    			append_dev(div, t3);
    			mount_component(text1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, $authStore*/ 65) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(text0);
    			destroy_component(form);
    			destroy_component(text1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let $authStore;
    	validate_store(authStore, 'authStore');
    	component_subscribe($$self, authStore, $$value => $$invalidate(0, $authStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signin', slots, []);
    	const dispatch = createEventDispatcher();

    	const onSignin = () => {
    		const { username } = $authStore.signinForm;
    		socketService.socket.emit("getPrivateKeyHash", { username });
    	};

    	const onGotoSignup = () => {
    		dispatch("gotoSignup");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signin> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal($authStore.signinForm.username, value)) {
    			$authStore.signinForm.username = value;
    			authStore.set($authStore);
    		}
    	}

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal($authStore.signinForm.password, value)) {
    			$authStore.signinForm.password = value;
    			authStore.set($authStore);
    		}
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		socketService,
    		authStore,
    		Button,
    		Form,
    		Input,
    		Text,
    		dispatch,
    		onSignin,
    		onGotoSignup,
    		$authStore
    	});

    	return [$authStore, onSignin, onGotoSignup, input0_value_binding, input1_value_binding];
    }

    class Signin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signin",
    			options,
    			id: create_fragment$Q.name
    		});
    	}
    }

    /* src\auth\Signup.svelte generated by Svelte v3.46.4 */
    const file$P = "src\\auth\\Signup.svelte";

    // (19:2) <Text size="lg">
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign up");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(19:2) <Text size=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Text>
    function create_default_slot_4$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("a-z 1-5 . (12 chars)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(25:4) <Text>",
    		ctx
    	});

    	return block;
    }

    // (31:4) <Button on:click={onSignup}>
    function create_default_slot_3$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SIGN UP");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(31:4) <Button on:click={onSignup}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <Form>
    function create_default_slot_2$a(ctx) {
    	let input0;
    	let updating_value;
    	let t0;
    	let text_1;
    	let t1;
    	let input1;
    	let updating_value_1;
    	let t2;
    	let button;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[3](value);
    	}

    	let input0_props = { placeholder: "Username", maxlength: 12 };

    	if (/*$authStore*/ ctx[0].signupForm.username !== void 0) {
    		input0_props.value = /*$authStore*/ ctx[0].signupForm.username;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[4](value);
    	}

    	let input1_props = {
    		placeholder: "Password",
    		type: "password",
    		maxlength: 32
    	};

    	if (/*$authStore*/ ctx[0].signupForm.password !== void 0) {
    		input1_props.value = /*$authStore*/ ctx[0].signupForm.password;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onSignup*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(text_1.$$.fragment);
    			t1 = space();
    			create_component(input1.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(text_1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(input1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*$authStore*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*$authStore*/ ctx[0].signupForm.username;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*$authStore*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*$authStore*/ ctx[0].signupForm.password;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(text_1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(input1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$a.name,
    		type: "slot",
    		source: "(20:2) <Form>",
    		ctx
    	});

    	return block;
    }

    // (35:4) <Text color="purple" isUnderline={true} on:click={onGotoSignin}>
    function create_default_slot_1$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$e.name,
    		type: "slot",
    		source: "(35:4) <Text color=\\\"purple\\\" isUnderline={true} on:click={onGotoSignin}>",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Text>
    function create_default_slot$f(ctx) {
    	let t;
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "purple",
    				isUnderline: true,
    				$$slots: { default: [create_default_slot_1$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text_1.$on("click", /*onGotoSignin*/ ctx[2]);

    	const block = {
    		c: function create() {
    			t = text("Already have an account?\r\n    ");
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(33:2) <Text>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$P(ctx) {
    	let div;
    	let text0;
    	let t0;
    	let form;
    	let t1;
    	let text1;
    	let current;

    	text0 = new Text({
    			props: {
    				size: "lg",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(text0.$$.fragment);
    			t0 = space();
    			create_component(form.$$.fragment);
    			t1 = space();
    			create_component(text1.$$.fragment);
    			add_location(div, file$P, 17, 0, 728);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(text0, div, null);
    			append_dev(div, t0);
    			mount_component(form, div, null);
    			append_dev(div, t1);
    			mount_component(text1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, $authStore*/ 65) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(text0);
    			destroy_component(form);
    			destroy_component(text1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let $authStore;
    	validate_store(authStore, 'authStore');
    	component_subscribe($$self, authStore, $$value => $$invalidate(0, $authStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	const dispatch = createEventDispatcher();

    	const onSignup = async () => {
    		const { username, password } = $authStore.signupForm;
    		const privateKey = await eccService.randomKey();
    		const publicKey = eccService.toPublic(privateKey);
    		const privateKeyHash = cryptoService.encrypt(privateKey, password);
    		socketService.socket.emit("signup", { username, publicKey, privateKeyHash });
    	};

    	const onGotoSignin = () => {
    		dispatch("gotoSignin");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal($authStore.signupForm.username, value)) {
    			$authStore.signupForm.username = value;
    			authStore.set($authStore);
    		}
    	}

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal($authStore.signupForm.password, value)) {
    			$authStore.signupForm.password = value;
    			authStore.set($authStore);
    		}
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		cryptoService,
    		eccService,
    		socketService,
    		authStore,
    		Button,
    		Form,
    		Input,
    		Text,
    		dispatch,
    		onSignup,
    		onGotoSignin,
    		$authStore
    	});

    	return [$authStore, onSignup, onGotoSignin, input0_value_binding, input1_value_binding];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$P.name
    		});
    	}
    }

    /* src\auth\Auth.svelte generated by Svelte v3.46.4 */
    const file$O = "src\\auth\\Auth.svelte";

    // (18:30) 
    function create_if_block_1$7(ctx) {
    	let signup;
    	let current;
    	signup = new Signup({ $$inline: true });
    	signup.$on("gotoSignin", /*gotoSignin_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(signup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(18:30) ",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if view === "Signin"}
    function create_if_block$h(ctx) {
    	let signin;
    	let current;
    	signin = new Signin({ $$inline: true });
    	signin.$on("gotoSignup", /*gotoSignup_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(signin.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signin, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signin, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(16:2) {#if view === \\\"Signin\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$h, create_if_block_1$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*view*/ ctx[0] === "Signin") return 0;
    		if (/*view*/ ctx[0] === "Signup") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "auth svelte-38v6nm");
    			add_location(div, file$O, 14, 0, 295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Auth', slots, []);
    	let view = "Signin";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth> was created with unknown prop '${key}'`);
    	});

    	const gotoSignup_handler = () => $$invalidate(0, view = "Signup");
    	const gotoSignin_handler = () => $$invalidate(0, view = "Signin");
    	$$self.$capture_state = () => ({ Signin, Signup, view });

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate(0, view = $$props.view);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [view, gotoSignup_handler, gotoSignin_handler];
    }

    class Auth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth",
    			options,
    			id: create_fragment$O.name
    		});
    	}
    }

    /* src\client\Governance.svelte generated by Svelte v3.46.4 */

    const file$N = "src\\client\\Governance.svelte";

    function create_fragment$N(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Governance coming soon... 😉";
    			attr_dev(div, "class", "coming-soon svelte-1u2nseh");
    			add_location(div, file$N, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Governance', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Governance> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Governance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Governance",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    /* src\client\Leaderboards.svelte generated by Svelte v3.46.4 */

    const file$M = "src\\client\\Leaderboards.svelte";

    function create_fragment$M(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Leaderboards coming soon... 😉";
    			attr_dev(div, "class", "coming-soon svelte-1u2nseh");
    			add_location(div, file$M, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leaderboards', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Leaderboards> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Leaderboards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboards",
    			options,
    			id: create_fragment$M.name
    		});
    	}
    }

    /* src\client\Market.svelte generated by Svelte v3.46.4 */

    const file$L = "src\\client\\Market.svelte";

    function create_fragment$L(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Market coming soon... 😉";
    			attr_dev(div, "class", "coming-soon svelte-1u2nseh");
    			add_location(div, file$L, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Market', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Market> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Market extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Market",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* src\client\collection\Tokens\Token.svelte generated by Svelte v3.46.4 */
    const file$K = "src\\client\\collection\\Tokens\\Token.svelte";

    // (80:6) <Text>
    function create_default_slot_5$3(ctx) {
    	let t_value = /*token*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*token*/ 1 && t_value !== (t_value = /*token*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(80:6) <Text>",
    		ctx
    	});

    	return block;
    }

    // (81:6) <Text>
    function create_default_slot_4$4(ctx) {
    	let t_value = /*token*/ ctx[0].amount + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*token*/ 1 && t_value !== (t_value = /*token*/ ctx[0].amount + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(81:6) <Text>",
    		ctx
    	});

    	return block;
    }

    // (84:2) {#if isRequestsToggled}
    function create_if_block$g(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_transition;
    	let current;
    	const if_block_creators = [create_if_block_1$6, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*token*/ ctx[0].token === "DMT") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$K, 84, 4, 2330);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(84:2) {#if isRequestsToggled}",
    		ctx
    	});

    	return block;
    }

    // (88:6) {:else}
    function create_else_block$9(ctx) {
    	let form_1;
    	let current;

    	form_1 = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_1$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form_1.$on("submit", /*onSendToken*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(form_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_1_changes = {};

    			if (dirty & /*$$scope, form, token*/ 2051) {
    				form_1_changes.$$scope = { dirty, ctx };
    			}

    			form_1.$set(form_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(88:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:6) {#if token.token === "DMT"}
    function create_if_block_1$6(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				size: "lg",
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(86:6) {#if token.token === \\\"DMT\\\"}",
    		ctx
    	});

    	return block;
    }

    // (101:12) <Text>
    function create_default_slot_3$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SEND");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(101:12) <Text>",
    		ctx
    	});

    	return block;
    }

    // (100:10) <Button type="submit">
    function create_default_slot_2$9(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(100:10) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (89:8) <Form on:submit={onSendToken}>
    function create_default_slot_1$d(ctx) {
    	let input0;
    	let updating_value;
    	let t0;
    	let input1;
    	let updating_value_1;
    	let t1;
    	let input2;
    	let updating_checked;
    	let t2;
    	let div0;
    	let t3;
    	let t4_value = /*form*/ ctx[1].chain.fee + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7_value = (parseFloat(/*form*/ ctx[1].amount) + parseFloat(/*form*/ ctx[1].chain.fee)).toFixed(4) + "";
    	let t7;
    	let t8;
    	let t9_value = /*form*/ ctx[1].chain.text + "";
    	let t9;
    	let t10;
    	let div2;
    	let t11;
    	let t12_value = (parseFloat(/*token*/ ctx[0].amount) - (parseFloat(/*form*/ ctx[1].amount) + parseFloat(/*form*/ ctx[1].chain.fee))).toFixed(4) + "";
    	let t12;
    	let t13;
    	let t14_value = /*form*/ ctx[1].chain.text + "";
    	let t14;
    	let t15;
    	let button;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[6](value);
    	}

    	let input0_props = { placeholder: "To", maxlength: 12 };

    	if (/*form*/ ctx[1].to !== void 0) {
    		input0_props.value = /*form*/ ctx[1].to;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[7](value);
    	}

    	let input1_props = { placeholder: "Amount", maxlength: 32 };

    	if (/*form*/ ctx[1].amount !== void 0) {
    		input1_props.value = /*form*/ ctx[1].amount;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	function input2_checked_binding(value) {
    		/*input2_checked_binding*/ ctx[8](value);
    	}

    	let input2_props = {
    		placeholder: "Withdraw",
    		type: "checkbox",
    		maxlength: 32
    	};

    	if (/*form*/ ctx[1].isWithdraw !== void 0) {
    		input2_props.checked = /*form*/ ctx[1].isWithdraw;
    	}

    	input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, 'checked', input2_checked_binding));

    	button = new Button({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(input1.$$.fragment);
    			t1 = space();
    			create_component(input2.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			t3 = text("Fee: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Total: ");
    			t7 = text(t7_value);
    			t8 = space();
    			t9 = text(t9_value);
    			t10 = space();
    			div2 = element("div");
    			t11 = text("Remaining: ");
    			t12 = text(t12_value);
    			t13 = space();
    			t14 = text(t14_value);
    			t15 = space();
    			create_component(button.$$.fragment);
    			set_style(div0, "text-align", "right");
    			add_location(div0, file$K, 95, 10, 2999);
    			set_style(div1, "text-align", "right");
    			add_location(div1, file$K, 96, 10, 3070);
    			set_style(div2, "text-align", "right");
    			set_style(div2, "margin-bottom", "1em");
    			add_location(div2, file$K, 97, 10, 3212);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(input1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(input2, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			append_dev(div2, t13);
    			append_dev(div2, t14);
    			insert_dev(target, t15, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*form*/ 2) {
    				updating_value = true;
    				input0_changes.value = /*form*/ ctx[1].to;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*form*/ 2) {
    				updating_value_1 = true;
    				input1_changes.value = /*form*/ ctx[1].amount;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_checked && dirty & /*form*/ 2) {
    				updating_checked = true;
    				input2_changes.checked = /*form*/ ctx[1].isWithdraw;
    				add_flush_callback(() => updating_checked = false);
    			}

    			input2.$set(input2_changes);
    			if ((!current || dirty & /*form*/ 2) && t4_value !== (t4_value = /*form*/ ctx[1].chain.fee + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*form*/ 2) && t7_value !== (t7_value = (parseFloat(/*form*/ ctx[1].amount) + parseFloat(/*form*/ ctx[1].chain.fee)).toFixed(4) + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*form*/ 2) && t9_value !== (t9_value = /*form*/ ctx[1].chain.text + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*token, form*/ 3) && t12_value !== (t12_value = (parseFloat(/*token*/ ctx[0].amount) - (parseFloat(/*form*/ ctx[1].amount) + parseFloat(/*form*/ ctx[1].chain.fee))).toFixed(4) + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*form*/ 2) && t14_value !== (t14_value = /*form*/ ctx[1].chain.text + "")) set_data_dev(t14, t14_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(input1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(input2, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t15);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$d.name,
    		type: "slot",
    		source: "(89:8) <Form on:submit={onSendToken}>",
    		ctx
    	});

    	return block;
    }

    // (87:8) <Text size="lg">
    function create_default_slot$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Token not tradeable.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(87:8) <Text size=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let t0;
    	let div1;
    	let text0;
    	let t1;
    	let text1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	img = new Img({
    			props: {
    				src: "currencies/" + /*token*/ ctx[0].token + ".png",
    				alt: /*token*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	text0 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*isRequestsToggled*/ ctx[2] && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(img.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(text0.$$.fragment);
    			t1 = space();
    			create_component(text1.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "token__img svelte-ka6fdy");
    			add_location(div0, file$K, 75, 4, 2045);
    			attr_dev(div1, "class", "token__content svelte-ka6fdy");
    			add_location(div1, file$K, 78, 4, 2179);
    			attr_dev(div2, "class", "token svelte-ka6fdy");
    			add_location(div2, file$K, 74, 2, 2020);
    			attr_dev(div3, "class", "token-wrapper svelte-ka6fdy");
    			toggle_class(div3, "isRequestsToggled", /*isRequestsToggled*/ ctx[2]);
    			add_location(div3, file$K, 73, 0, 1965);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(img, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(text0, div1, null);
    			append_dev(div1, t1);
    			mount_component(text1, div1, null);
    			append_dev(div3, t2);
    			if (if_block) if_block.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*toggleRequests*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const img_changes = {};
    			if (dirty & /*token*/ 1) img_changes.src = "currencies/" + /*token*/ ctx[0].token + ".png";
    			if (dirty & /*token*/ 1) img_changes.alt = /*token*/ ctx[0].name;
    			img.$set(img_changes);
    			const text0_changes = {};

    			if (dirty & /*$$scope, token*/ 2049) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, token*/ 2049) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);

    			if (/*isRequestsToggled*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isRequestsToggled*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*isRequestsToggled*/ 4) {
    				toggle_class(div3, "isRequestsToggled", /*isRequestsToggled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img.$$.fragment, local);
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img.$$.fragment, local);
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(img);
    			destroy_component(text0);
    			destroy_component(text1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(9, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Token', slots, []);
    	let { token } = $$props;
    	let scoops = false;

    	const form = {
    		chain: { id: 0, text: "TLOS", fee: "0.0010 TLOS" },
    		to: "",
    		amount: "0.0000",
    		isWithdraw: false
    	};

    	const onSendToken = () => {
    		const { username, publicKey, privateKey, last_nonce } = $playerStore;
    		const signature = eccService.sign(`transfer:${last_nonce + 1}`, privateKey);

    		socketService.socket.emit("sendToken", {
    			chain_id: form.chain.id,
    			relayer: "admin",
    			from: username,
    			to: form.to,
    			quantity: `${form.amount} ${form.chain.text}`,
    			fee: `${form.chain.text === "TLOS" ? "0.0010" : "0.001"} ${form.chain.text}`,
    			nonce: 1,
    			memo: "test",
    			sig: signature,
    			isWithdraw: scoops
    		});
    	};

    	const transitionSlide = { duration: 333, easing: quadInOut };
    	let isRequestsToggled = false;

    	const toggleRequests = () => {
    		$$invalidate(2, isRequestsToggled = !isRequestsToggled);
    	};

    	const writable_props = ['token'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Token> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal(form.to, value)) {
    			form.to = value;
    			$$invalidate(1, form);
    		}
    	}

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal(form.amount, value)) {
    			form.amount = value;
    			$$invalidate(1, form);
    		}
    	}

    	function input2_checked_binding(value) {
    		if ($$self.$$.not_equal(form.isWithdraw, value)) {
    			form.isWithdraw = value;
    			$$invalidate(1, form);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('token' in $$props) $$invalidate(0, token = $$props.token);
    	};

    	$$self.$capture_state = () => ({
    		eccService,
    		socketService,
    		playerStore,
    		Button,
    		Img,
    		Input,
    		Text,
    		Form,
    		token,
    		scoops,
    		form,
    		onSendToken,
    		quadInOut,
    		slide,
    		transitionSlide,
    		isRequestsToggled,
    		toggleRequests,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('token' in $$props) $$invalidate(0, token = $$props.token);
    		if ('scoops' in $$props) scoops = $$props.scoops;
    		if ('isRequestsToggled' in $$props) $$invalidate(2, isRequestsToggled = $$props.isRequestsToggled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		token,
    		form,
    		isRequestsToggled,
    		onSendToken,
    		transitionSlide,
    		toggleRequests,
    		input0_value_binding,
    		input1_value_binding,
    		input2_checked_binding
    	];
    }

    class Token extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, { token: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Token",
    			options,
    			id: create_fragment$K.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*token*/ ctx[0] === undefined && !('token' in props)) {
    			console.warn("<Token> was created without expected prop 'token'");
    		}
    	}

    	get token() {
    		throw new Error("<Token>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set token(value) {
    		throw new Error("<Token>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\client\collection\Tokens\Tokens.svelte generated by Svelte v3.46.4 */
    const file$J = "src\\client\\collection\\Tokens\\Tokens.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (21:2) {#each tokens as token}
    function create_each_block$a(ctx) {
    	let token;
    	let current;

    	token = new Token({
    			props: { token: /*token*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(token.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(token, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(token.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(token.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(token, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(21:2) {#each tokens as token}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let div;
    	let current;
    	let each_value = /*tokens*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
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

    			attr_dev(div, "class", "tokens svelte-14b0r2v");
    			add_location(div, file$J, 19, 0, 574);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tokens*/ 1) {
    				each_value = /*tokens*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tokens', slots, []);

    	const tokens = [
    		{
    			name: "Telos",
    			token: "TLOS",
    			amount: $playerStore.wallet[0]
    		},
    		{
    			name: "Light Matter",
    			token: "LMT",
    			amount: $playerStore.wallet[1]
    		},
    		{
    			name: "Dark Matter",
    			token: "DMT",
    			amount: "0 DMT"
    		},
    		{
    			name: "Atmos",
    			token: "ATMOS",
    			amount: "0.0000 ATMOS"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tokens> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ playerStore, Token, tokens, $playerStore });
    	return [tokens];
    }

    class Tokens extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tokens",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* src\client\collection\Avatars\Avatar.svelte generated by Svelte v3.46.4 */
    const file$I = "src\\client\\collection\\Avatars\\Avatar.svelte";

    function create_fragment$I(ctx) {
    	let div;
    	let img;
    	let current;
    	let mounted;
    	let dispose;

    	img = new Img({
    			props: {
    				src: "avatars/" + /*avatarId*/ ctx[0] + ".png",
    				alt: "Avatar " + /*avatarId*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(img.$$.fragment);
    			attr_dev(div, "class", "avatar svelte-1cadj5b");
    			toggle_class(div, "isSelected", /*isSelected*/ ctx[1]);
    			add_location(div, file$I, 23, 0, 522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(img, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onSetAvatar*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const img_changes = {};
    			if (dirty & /*avatarId*/ 1) img_changes.src = "avatars/" + /*avatarId*/ ctx[0] + ".png";
    			if (dirty & /*avatarId*/ 1) img_changes.alt = "Avatar " + /*avatarId*/ ctx[0];
    			img.$set(img_changes);

    			if (dirty & /*isSelected*/ 2) {
    				toggle_class(div, "isSelected", /*isSelected*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let isSelected;
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(3, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avatar', slots, []);
    	let { avatarId } = $$props;

    	const onSetAvatar = () => {
    		socketService.socket.emit("setAvatar", { avatarId });
    	};

    	const writable_props = ['avatarId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avatar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('avatarId' in $$props) $$invalidate(0, avatarId = $$props.avatarId);
    	};

    	$$self.$capture_state = () => ({
    		socketService,
    		playerStore,
    		Img,
    		avatarId,
    		onSetAvatar,
    		isSelected,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('avatarId' in $$props) $$invalidate(0, avatarId = $$props.avatarId);
    		if ('isSelected' in $$props) $$invalidate(1, isSelected = $$props.isSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore, avatarId*/ 9) {
    			$$invalidate(1, isSelected = $playerStore.avatarId === avatarId);
    		}
    	};

    	return [avatarId, isSelected, onSetAvatar, $playerStore];
    }

    class Avatar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, { avatarId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatar",
    			options,
    			id: create_fragment$I.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*avatarId*/ ctx[0] === undefined && !('avatarId' in props)) {
    			console.warn("<Avatar> was created without expected prop 'avatarId'");
    		}
    	}

    	get avatarId() {
    		throw new Error("<Avatar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatarId(value) {
    		throw new Error("<Avatar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\client\collection\Avatars\Avatars.svelte generated by Svelte v3.46.4 */
    const file$H = "src\\client\\collection\\Avatars\\Avatars.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:2) {#each avatarsIds as avatarId}
    function create_each_block$9(ctx) {
    	let avatar;
    	let current;

    	avatar = new Avatar({
    			props: { avatarId: /*avatarId*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(avatar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(avatar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(avatar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(avatar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(avatar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(13:2) {#each avatarsIds as avatarId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let div;
    	let current;
    	let each_value = /*avatarsIds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
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

    			attr_dev(div, "class", "avatars svelte-7gj9r1");
    			add_location(div, file$H, 11, 0, 236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*avatarsIds*/ 1) {
    				each_value = /*avatarsIds*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Avatars', slots, []);
    	const avatarsIds = [0, 1, 2, 3, 4];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Avatars> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Avatar, avatarsIds });
    	return [avatarsIds];
    }

    class Avatars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Avatars",
    			options,
    			id: create_fragment$H.name
    		});
    	}
    }

    /* src\client\collection\CardbackSkins.svelte generated by Svelte v3.46.4 */

    const file$G = "src\\client\\collection\\CardbackSkins.svelte";

    function create_fragment$G(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cardback Skins coming soon... 😉";
    			attr_dev(div, "class", "coming-soon svelte-1u2nseh");
    			add_location(div, file$G, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardbackSkins', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardbackSkins> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CardbackSkins extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardbackSkins",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    /* src\client\collection\CardSkins.svelte generated by Svelte v3.46.4 */

    const file$F = "src\\client\\collection\\CardSkins.svelte";

    function create_fragment$F(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Cardback Skins coming soon... 😉";
    			attr_dev(div, "class", "coming-soon svelte-1u2nseh");
    			add_location(div, file$F, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardSkins', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardSkins> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CardSkins extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardSkins",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* src\client\collection\NonFungibleTokens.svelte generated by Svelte v3.46.4 */
    const file$E = "src\\client\\collection\\NonFungibleTokens.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (32:4) {#each navs as nav}
    function create_each_block$8(ctx) {
    	let div;
    	let t0_value = /*nav*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*nav*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-whtip6");
    			toggle_class(div, "selected", /*selekted*/ ctx[0].name === /*nav*/ ctx[3].name);
    			add_location(div, file$E, 32, 6, 679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selekted, navs*/ 3) {
    				toggle_class(div, "selected", /*selekted*/ ctx[0].name === /*nav*/ ctx[3].name);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(32:4) {#each navs as nav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let nav;
    	let t2;
    	let switch_instance;
    	let current;
    	let each_value = /*navs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	var switch_value = /*selekted*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Skins";
    			t1 = space();
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(div0, file$E, 28, 2, 619);
    			attr_dev(nav, "class", "svelte-whtip6");
    			add_location(nav, file$E, 30, 2, 641);
    			attr_dev(div1, "class", "non-fungible__tokens svelte-whtip6");
    			add_location(div1, file$E, 27, 0, 581);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, nav);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(div1, t2);

    			if (switch_instance) {
    				mount_component(switch_instance, div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selekted, navs*/ 3) {
    				each_value = /*navs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (switch_value !== (switch_value = /*selekted*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div1, null);
    				} else {
    					switch_instance = null;
    				}
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
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NonFungibleTokens', slots, []);

    	const navs = [
    		{ name: "Avatars", component: Avatars },
    		{ name: "Card Skins", component: CardSkins },
    		{
    			name: "Cardback Skins",
    			component: CardbackSkins
    		}
    	];

    	let selekted = navs[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NonFungibleTokens> was created with unknown prop '${key}'`);
    	});

    	const click_handler = nav => $$invalidate(0, selekted = nav);

    	$$self.$capture_state = () => ({
    		Avatars,
    		CardbackSkins,
    		CardSkins,
    		navs,
    		selekted
    	});

    	$$self.$inject_state = $$props => {
    		if ('selekted' in $$props) $$invalidate(0, selekted = $$props.selekted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selekted, navs, click_handler];
    }

    class NonFungibleTokens extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NonFungibleTokens",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src\client\collection\Collection.svelte generated by Svelte v3.46.4 */
    const file$D = "src\\client\\collection\\Collection.svelte";

    function create_fragment$D(ctx) {
    	let div;
    	let tokens;
    	let t;
    	let nonfungibletokens;
    	let current;
    	tokens = new Tokens({ $$inline: true });
    	nonfungibletokens = new NonFungibleTokens({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tokens.$$.fragment);
    			t = space();
    			create_component(nonfungibletokens.$$.fragment);
    			attr_dev(div, "class", "collection svelte-3yrwoa");
    			add_location(div, file$D, 10, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tokens, div, null);
    			append_dev(div, t);
    			mount_component(nonfungibletokens, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tokens.$$.fragment, local);
    			transition_in(nonfungibletokens.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tokens.$$.fragment, local);
    			transition_out(nonfungibletokens.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tokens);
    			destroy_component(nonfungibletokens);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Collection', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Collection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Tokens, NonFungibleTokens });
    	return [];
    }

    class Collection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collection",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src\client\decks\Cards.svelte generated by Svelte v3.46.4 */
    const file$C = "src\\client\\decks\\Cards.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (101:6) {#if card.klass === klass}
    function create_if_block$f(ctx) {
    	let div;
    	let card;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	card = new Card({
    			props: {
    				card: /*card*/ ctx[10],
    				health: 0,
    				damage: 0
    			},
    			$$inline: true
    		});

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[7](/*card*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			t = space();
    			add_location(div, file$C, 101, 8, 2926);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_5, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(101:6) {#if card.klass === klass}",
    		ctx
    	});

    	return block;
    }

    // (100:4) {#each cards as card}
    function create_each_block$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*card*/ ctx[10].klass === /*klass*/ ctx[0] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*card*/ ctx[10].klass === /*klass*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*klass*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$f(ctx);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(100:4) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div7;
    	let div5;
    	let div0;
    	let img0;
    	let t0;
    	let div1;
    	let img1;
    	let t1;
    	let div2;
    	let img2;
    	let t2;
    	let div3;
    	let img3;
    	let t3;
    	let div4;
    	let img4;
    	let t4;
    	let div6;
    	let current;
    	let mounted;
    	let dispose;

    	img0 = new Img({
    			props: {
    				src: "classes/48/" + 0 + ".png",
    				alt: "A"
    			},
    			$$inline: true
    		});

    	img1 = new Img({
    			props: {
    				src: "classes/48/" + 1 + ".png",
    				alt: "B"
    			},
    			$$inline: true
    		});

    	img2 = new Img({
    			props: {
    				src: "classes/48/" + 2 + ".png",
    				alt: "C"
    			},
    			$$inline: true
    		});

    	img3 = new Img({
    			props: {
    				src: "classes/48/" + 3 + ".png",
    				alt: "D"
    			},
    			$$inline: true
    		});

    	img4 = new Img({
    			props: {
    				src: "classes/48/" + 4 + ".png",
    				alt: "E"
    			},
    			$$inline: true
    		});

    	let each_value = cards;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			create_component(img0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(img1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(img2.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(img3.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			create_component(img4.$$.fragment);
    			t4 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "klasses__klass svelte-10xfe44");
    			toggle_class(div0, "klasses__klass-selected", /*klass*/ ctx[0] === 0);
    			add_location(div0, file$C, 82, 4, 2008);
    			attr_dev(div1, "class", "klasses__klass svelte-10xfe44");
    			toggle_class(div1, "klasses__klass-selected", /*klass*/ ctx[0] === 1);
    			add_location(div1, file$C, 85, 4, 2172);
    			attr_dev(div2, "class", "klasses__klass svelte-10xfe44");
    			toggle_class(div2, "klasses__klass-selected", /*klass*/ ctx[0] === 2);
    			add_location(div2, file$C, 88, 4, 2336);
    			attr_dev(div3, "class", "klasses__klass svelte-10xfe44");
    			toggle_class(div3, "klasses__klass-selected", /*klass*/ ctx[0] === 3);
    			add_location(div3, file$C, 91, 4, 2500);
    			attr_dev(div4, "class", "klasses__klass svelte-10xfe44");
    			toggle_class(div4, "klasses__klass-selected", /*klass*/ ctx[0] === 4);
    			add_location(div4, file$C, 94, 4, 2664);
    			attr_dev(div5, "class", "klasses svelte-10xfe44");
    			add_location(div5, file$C, 81, 2, 1981);
    			attr_dev(div6, "class", "cards svelte-10xfe44");
    			add_location(div6, file$C, 98, 2, 2836);
    			attr_dev(div7, "class", "cardss svelte-10xfe44");
    			add_location(div7, file$C, 80, 0, 1957);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div5);
    			append_dev(div5, div0);
    			mount_component(img0, div0, null);
    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			mount_component(img1, div1, null);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			mount_component(img2, div2, null);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			mount_component(img3, div3, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			mount_component(img4, div4, null);
    			append_dev(div7, t4);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					listen_dev(div2, "click", /*click_handler_2*/ ctx[4], false, false, false),
    					listen_dev(div3, "click", /*click_handler_3*/ ctx[5], false, false, false),
    					listen_dev(div4, "click", /*click_handler_4*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*klass*/ 1) {
    				toggle_class(div0, "klasses__klass-selected", /*klass*/ ctx[0] === 0);
    			}

    			if (dirty & /*klass*/ 1) {
    				toggle_class(div1, "klasses__klass-selected", /*klass*/ ctx[0] === 1);
    			}

    			if (dirty & /*klass*/ 1) {
    				toggle_class(div2, "klasses__klass-selected", /*klass*/ ctx[0] === 2);
    			}

    			if (dirty & /*klass*/ 1) {
    				toggle_class(div3, "klasses__klass-selected", /*klass*/ ctx[0] === 3);
    			}

    			if (dirty & /*klass*/ 1) {
    				toggle_class(div4, "klasses__klass-selected", /*klass*/ ctx[0] === 4);
    			}

    			if (dirty & /*onAddToDeck, cards, klass*/ 3) {
    				each_value = cards;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div6, null);
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
    			transition_in(img0.$$.fragment, local);
    			transition_in(img1.$$.fragment, local);
    			transition_in(img2.$$.fragment, local);
    			transition_in(img3.$$.fragment, local);
    			transition_in(img4.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img0.$$.fragment, local);
    			transition_out(img1.$$.fragment, local);
    			transition_out(img2.$$.fragment, local);
    			transition_out(img3.$$.fragment, local);
    			transition_out(img4.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(img0);
    			destroy_component(img1);
    			destroy_component(img2);
    			destroy_component(img3);
    			destroy_component(img4);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let $decksStore;
    	let $playerStore;
    	validate_store(decksStore, 'decksStore');
    	component_subscribe($$self, decksStore, $$value => $$invalidate(8, $decksStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(9, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cards', slots, []);
    	let klass = 0;

    	const onAddToDeck = card => {
    		const { id, klass, name } = card;
    		const { deckId } = $playerStore;
    		const deckSlot = $decksStore.deckSlots.find(deckSlot => deckSlot.id === deckId);

    		if (deckSlot.cardsInDeck >= 30) {
    			return;
    		}

    		decksStore.update(store => {
    			const deckCard = store.deckCards.find(deckCard => deckCard.id === id);
    			const deckSlot = store.deckSlots.find(deckSlot => deckSlot.id === deckId);

    			if (deckCard) {
    				if (deckCard.amount < 2) {
    					deckCard.amount += 1;
    				}
    			} else {
    				const amount = 1;
    				store.deckCards.push({ klass, id, name, amount });
    			}

    			deckSlot.cardsInDeck = store.deckCards.reduce((acc, { amount }) => acc += amount, 0);
    			return store;
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cards> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, klass = 0);
    	const click_handler_1 = () => $$invalidate(0, klass = 1);
    	const click_handler_2 = () => $$invalidate(0, klass = 2);
    	const click_handler_3 = () => $$invalidate(0, klass = 3);
    	const click_handler_4 = () => $$invalidate(0, klass = 4);
    	const click_handler_5 = card => onAddToDeck(card);

    	$$self.$capture_state = () => ({
    		cards,
    		decksStore,
    		playerStore,
    		Card,
    		Img,
    		klass,
    		onAddToDeck,
    		$decksStore,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		onAddToDeck,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Cards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src\client\decks\DeckCard.svelte generated by Svelte v3.46.4 */
    const file$B = "src\\client\\decks\\DeckCard.svelte";

    // (47:4) <Text>
    function create_default_slot_1$c(ctx) {
    	let t_value = /*card*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 1 && t_value !== (t_value = /*card*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(47:4) <Text>",
    		ctx
    	});

    	return block;
    }

    // (48:4) <Text>
    function create_default_slot$d(ctx) {
    	let t0_value = /*card*/ ctx[0].amount + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" / 2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 1 && t0_value !== (t0_value = /*card*/ ctx[0].amount + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(48:4) <Text>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let text0;
    	let t1;
    	let text1;
    	let current;
    	let mounted;
    	let dispose;

    	text0 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			create_component(text0.$$.fragment);
    			t1 = space();
    			create_component(text1.$$.fragment);
    			attr_dev(img, "class", "card__img svelte-8x8ux9");
    			if (!src_url_equal(img.src, img_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*card*/ ctx[0].name);
    			add_location(img, file$B, 41, 2, 1204);
    			attr_dev(div0, "class", "card__text svelte-8x8ux9");
    			add_location(div0, file$B, 45, 2, 1309);
    			attr_dev(div1, "class", "card svelte-8x8ux9");
    			add_location(div1, file$B, 40, 0, 1154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(text0, div0, null);
    			append_dev(div0, t1);
    			mount_component(text1, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*onRemoveFromDeck*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*card*/ 1 && !src_url_equal(img.src, img_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*card*/ 1 && img_alt_value !== (img_alt_value = /*card*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			const text0_changes = {};

    			if (dirty & /*$$scope, card*/ 9) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, card*/ 9) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(text0);
    			destroy_component(text1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(2, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeckCard', slots, []);
    	let { card } = $$props;

    	const onRemoveFromDeck = () => {
    		const { deckId } = $playerStore;

    		decksStore.update(store => {
    			const deckCard = store.deckCards.find(deckCard => deckCard.id === card.id);
    			const deckSlot = store.deckSlots.find(deckSlot => deckSlot.id === deckId);

    			if (deckCard.amount > 1) {
    				deckCard.amount -= 1;
    			} else {
    				const i = store.deckCards.indexOf(deckCard);
    				store.deckCards.splice(i, 1);
    			}

    			deckSlot.cardsInDeck = store.deckCards.reduce((acc, { amount }) => acc += amount, 0);
    			return store;
    		});
    	};

    	const writable_props = ['card'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeckCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	$$self.$capture_state = () => ({
    		decksStore,
    		playerStore,
    		Text,
    		card,
    		onRemoveFromDeck,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [card, onRemoveFromDeck];
    }

    class DeckCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { card: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeckCard",
    			options,
    			id: create_fragment$B.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<DeckCard> was created without expected prop 'card'");
    		}
    	}

    	get card() {
    		throw new Error("<DeckCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<DeckCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\client\decks\DeckCards.svelte generated by Svelte v3.46.4 */
    const file$A = "src\\client\\decks\\DeckCards.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (26:2) {#each $decksStore.deckCards as card}
    function create_each_block$6(ctx) {
    	let deckcard;
    	let current;

    	deckcard = new DeckCard({
    			props: { card: /*card*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(deckcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(deckcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const deckcard_changes = {};
    			if (dirty & /*$decksStore*/ 1) deckcard_changes.card = /*card*/ ctx[1];
    			deckcard.$set(deckcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deckcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deckcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(deckcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(26:2) {#each $decksStore.deckCards as card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let current;
    	let each_value = /*$decksStore*/ ctx[0].deckCards;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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

    			attr_dev(div, "class", "deck svelte-1v8foy4");
    			add_location(div, file$A, 24, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$decksStore*/ 1) {
    				each_value = /*$decksStore*/ ctx[0].deckCards;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let $decksStore;
    	validate_store(decksStore, 'decksStore');
    	component_subscribe($$self, decksStore, $$value => $$invalidate(0, $decksStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeckCards', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeckCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ decksStore, DeckCard, $decksStore });
    	return [$decksStore];
    }

    class DeckCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeckCards",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* src\client\decks\DeckSlot.svelte generated by Svelte v3.46.4 */
    const file$z = "src\\client\\decks\\DeckSlot.svelte";

    // (75:10) {:else}
    function create_else_block$8(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-check fa-fw");
    			add_location(i, file$z, 75, 12, 2093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(75:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (73:10) {#if deck.cardsInDeck < 30}
    function create_if_block$e(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-exclamation fa-fw");
    			add_location(i, file$z, 73, 12, 2020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(73:10) {#if deck.cardsInDeck < 30}",
    		ctx
    	});

    	return block;
    }

    // (84:8) <Button style="icon" color="grey" on:click={changeDeckName}>
    function create_default_slot_2$8(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-edit fa-fw");
    			add_location(i, file$z, 84, 10, 2362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(84:8) <Button style=\\\"icon\\\" color=\\\"grey\\\" on:click={changeDeckName}>",
    		ctx
    	});

    	return block;
    }

    // (87:8) <Button style="icon" color="grey" on:click={clearDeck}>
    function create_default_slot_1$b(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-trash fa-fw");
    			add_location(i, file$z, 87, 10, 2491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(87:8) <Button style=\\\"icon\\\" color=\\\"grey\\\" on:click={clearDeck}>",
    		ctx
    	});

    	return block;
    }

    // (90:8) <Button style="icon" color="grey" on:click={saveDeck}>
    function create_default_slot$c(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-save fa-fw");
    			add_location(i, file$z, 90, 10, 2620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(90:8) <Button style=\\\"icon\\\" color=\\\"grey\\\" on:click={saveDeck}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let div6;
    	let img;
    	let img_src_value;
    	let t0;
    	let div5;
    	let div4;
    	let div2;
    	let div0;
    	let t1_value = /*deck*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*deck*/ ctx[0].cardsInDeck + "";
    	let t3;
    	let t4;
    	let t5;
    	let progressbar;
    	let t6;
    	let div3;
    	let button0;
    	let t7;
    	let button1;
    	let t8;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*deck*/ ctx[0].cardsInDeck < 30) return create_if_block$e;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	progressbar = new ProgressBar({
    			props: {
    				color: "purple",
    				progress: /*progress*/ ctx[1]
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				style: "icon",
    				color: "grey",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*changeDeckName*/ ctx[4]);

    	button1 = new Button({
    			props: {
    				style: "icon",
    				color: "grey",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*clearDeck*/ ctx[6]);

    	button2 = new Button({
    			props: {
    				style: "icon",
    				color: "grey",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*saveDeck*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			img = element("img");
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = text(" / 30\r\n          ");
    			if_block.c();
    			t5 = space();
    			create_component(progressbar.$$.fragment);
    			t6 = space();
    			div3 = element("div");
    			create_component(button0.$$.fragment);
    			t7 = space();
    			create_component(button1.$$.fragment);
    			t8 = space();
    			create_component(button2.$$.fragment);
    			attr_dev(img, "class", "deck__img svelte-7k55lf");
    			if (!src_url_equal(img.src, img_src_value = "assets/classes/64/" + /*deck*/ ctx[0].klass + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Class");
    			add_location(img, file$z, 63, 2, 1683);
    			add_location(div0, file$z, 69, 8, 1895);
    			add_location(div1, file$z, 70, 8, 1927);
    			attr_dev(div2, "class", "decktitle svelte-7k55lf");
    			add_location(div2, file$z, 68, 6, 1862);
    			attr_dev(div3, "class", "deck__footer__actions svelte-7k55lf");
    			add_location(div3, file$z, 82, 6, 2245);
    			attr_dev(div4, "class", "deck__footer__info svelte-7k55lf");
    			add_location(div4, file$z, 66, 4, 1820);
    			attr_dev(div5, "class", "deck__footer svelte-7k55lf");
    			add_location(div5, file$z, 65, 2, 1788);
    			attr_dev(div6, "class", "deck svelte-7k55lf");
    			toggle_class(div6, "selected", /*deck*/ ctx[0].id === /*$playerStore*/ ctx[2].deckId);
    			add_location(div6, file$z, 62, 0, 1612);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, img);
    			append_dev(div6, t0);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			if_block.m(div1, null);
    			append_dev(div4, t5);
    			mount_component(progressbar, div4, null);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			mount_component(button0, div3, null);
    			append_dev(div3, t7);
    			mount_component(button1, div3, null);
    			append_dev(div3, t8);
    			mount_component(button2, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*selectDeck*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*deck*/ 1 && !src_url_equal(img.src, img_src_value = "assets/classes/64/" + /*deck*/ ctx[0].klass + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*deck*/ 1) && t1_value !== (t1_value = /*deck*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*deck*/ 1) && t3_value !== (t3_value = /*deck*/ ctx[0].cardsInDeck + "")) set_data_dev(t3, t3_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			const progressbar_changes = {};
    			if (dirty & /*progress*/ 2) progressbar_changes.progress = /*progress*/ ctx[1];
    			progressbar.$set(progressbar_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (dirty & /*deck, $playerStore*/ 5) {
    				toggle_class(div6, "selected", /*deck*/ ctx[0].id === /*$playerStore*/ ctx[2].deckId);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block.d();
    			destroy_component(progressbar);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let progress;
    	let $decksStore;
    	let $playerStore;
    	validate_store(decksStore, 'decksStore');
    	component_subscribe($$self, decksStore, $$value => $$invalidate(7, $decksStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(2, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeckSlot', slots, []);
    	let { deck } = $$props;

    	const selectDeck = () => {
    		socketService.socket.emit("selectDeck", { deckId: deck.id });
    	};

    	const changeDeckName = () => {
    		miscService.openModal("changeDeckName", { id: deck.id });
    	};

    	const saveDeck = () => {
    		const cards = $decksStore.deckCards.map(({ id, amount }) => ({ id, amount }));
    		socketService.socket.emit("saveDeck", { cards });
    	};

    	const clearDeck = () => {
    		set_store_value(decksStore, $decksStore.deckCards = [], $decksStore);
    		set_store_value(decksStore, $decksStore.cardsInDeck = 0, $decksStore);
    	};

    	const writable_props = ['deck'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeckSlot> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('deck' in $$props) $$invalidate(0, deck = $$props.deck);
    	};

    	$$self.$capture_state = () => ({
    		miscService,
    		socketService,
    		decksStore,
    		playerStore,
    		Button,
    		ProgressBar,
    		deck,
    		selectDeck,
    		changeDeckName,
    		saveDeck,
    		clearDeck,
    		progress,
    		$decksStore,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('deck' in $$props) $$invalidate(0, deck = $$props.deck);
    		if ('progress' in $$props) $$invalidate(1, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*deck*/ 1) {
    			$$invalidate(1, progress = deck.cardsInDeck / 30 * 100);
    		}
    	};

    	return [deck, progress, $playerStore, selectDeck, changeDeckName, saveDeck, clearDeck];
    }

    class DeckSlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { deck: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeckSlot",
    			options,
    			id: create_fragment$z.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*deck*/ ctx[0] === undefined && !('deck' in props)) {
    			console.warn("<DeckSlot> was created without expected prop 'deck'");
    		}
    	}

    	get deck() {
    		throw new Error("<DeckSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deck(value) {
    		throw new Error("<DeckSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\client\decks\DeckSlots.svelte generated by Svelte v3.46.4 */
    const file$y = "src\\client\\decks\\DeckSlots.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:2) {#each $decksStore.deckSlots as deck}
    function create_each_block$5(ctx) {
    	let deckslot;
    	let current;

    	deckslot = new DeckSlot({
    			props: { deck: /*deck*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(deckslot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(deckslot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const deckslot_changes = {};
    			if (dirty & /*$decksStore*/ 1) deckslot_changes.deck = /*deck*/ ctx[1];
    			deckslot.$set(deckslot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deckslot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deckslot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(deckslot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(13:2) {#each $decksStore.deckSlots as deck}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div;
    	let current;
    	let each_value = /*$decksStore*/ ctx[0].deckSlots;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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

    			attr_dev(div, "class", "decks svelte-r0ucv5");
    			add_location(div, file$y, 11, 0, 238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$decksStore*/ 1) {
    				each_value = /*$decksStore*/ ctx[0].deckSlots;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let $decksStore;
    	validate_store(decksStore, 'decksStore');
    	component_subscribe($$self, decksStore, $$value => $$invalidate(0, $decksStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeckSlots', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DeckSlots> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ decksStore, DeckSlot, $decksStore });
    	return [$decksStore];
    }

    class DeckSlots extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeckSlots",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* src\ui\Hero.svelte generated by Svelte v3.46.4 */
    const file$x = "src\\ui\\Hero.svelte";

    // (154:2) {#if isHealthBarVisible}
    function create_if_block_1$5(ctx) {
    	let div;
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				size: "sm",
    				progress: /*health*/ ctx[1] / /*hero*/ ctx[0].health * 100,
    				color: "green"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			attr_dev(div, "class", "card__bar svelte-111neuw");
    			add_location(div, file$x, 154, 4, 3943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*health, hero*/ 3) progressbar_changes.progress = /*health*/ ctx[1] / /*hero*/ ctx[0].health * 100;
    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(154:2) {#if isHealthBarVisible}",
    		ctx
    	});

    	return block;
    }

    // (159:2) {#if isManaBarVisible}
    function create_if_block$d(ctx) {
    	let div;
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				size: "sm",
    				progress: /*mana*/ ctx[2] / /*hero*/ ctx[0].mana * 100,
    				color: "blue"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			attr_dev(div, "class", "card__manabar svelte-111neuw");
    			add_location(div, file$x, 159, 4, 4103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*mana, hero*/ 5) progressbar_changes.progress = /*mana*/ ctx[2] / /*hero*/ ctx[0].mana * 100;
    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(159:2) {#if isManaBarVisible}",
    		ctx
    	});

    	return block;
    }

    // (171:6) <Text size="xsm">
    function create_default_slot_2$7(ctx) {
    	let t_value = (/*mana*/ ctx[2] || /*hero*/ ctx[0].mana) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mana, hero*/ 5 && t_value !== (t_value = (/*mana*/ ctx[2] || /*hero*/ ctx[0].mana) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(171:6) <Text size=\\\"xsm\\\">",
    		ctx
    	});

    	return block;
    }

    // (176:6) <Text size="xsm">
    function create_default_slot_1$a(ctx) {
    	let t_value = (/*health*/ ctx[1] || /*hero*/ ctx[0].health) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*health, hero*/ 3 && t_value !== (t_value = (/*health*/ ctx[1] || /*hero*/ ctx[0].health) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(176:6) <Text size=\\\"xsm\\\">",
    		ctx
    	});

    	return block;
    }

    // (181:6) <Text size="xsm">
    function create_default_slot$b(ctx) {
    	let t_value = /*hero*/ ctx[0].damage + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hero*/ 1 && t_value !== (t_value = /*hero*/ ctx[0].damage + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(181:6) <Text size=\\\"xsm\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let div8;
    	let div3;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let br;
    	let t1;
    	let p0;
    	let raw0_value = /*hero*/ ctx[0].passive.info + "";
    	let t2;
    	let hr;
    	let t3;
    	let p1;
    	let raw1_value = /*hero*/ ctx[0].active.info + "";
    	let t4;
    	let div2;
    	let t5_value = /*hero*/ ctx[0].name + "";
    	let t5;
    	let t6;
    	let img1;
    	let t7;
    	let t8;
    	let t9;
    	let div7;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let text0;
    	let t11;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let text1;
    	let t13;
    	let div6;
    	let img4;
    	let img4_src_value;
    	let t14;
    	let text2;
    	let current;
    	let mounted;
    	let dispose;

    	img1 = new Img({
    			props: {
    				src: "classes/" + /*hero*/ ctx[0].klass + "_hero.jpg",
    				alt: /*hero*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	let if_block0 = /*isHealthBarVisible*/ ctx[3] && create_if_block_1$5(ctx);
    	let if_block1 = /*isManaBarVisible*/ ctx[4] && create_if_block$d(ctx);

    	text0 = new Text({
    			props: {
    				size: "xsm",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				size: "xsm",
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text2 = new Text({
    			props: {
    				size: "xsm",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			br = element("br");
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			p1 = element("p");
    			t4 = space();
    			div2 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			create_component(img1.$$.fragment);
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			div7 = element("div");
    			div4 = element("div");
    			img2 = element("img");
    			t10 = space();
    			create_component(text0.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t12 = space();
    			create_component(text1.$$.fragment);
    			t13 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t14 = space();
    			create_component(text2.$$.fragment);
    			if (!src_url_equal(img0.src, img0_src_value = "assets/attrs/hero.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Hero");
    			add_location(img0, file$x, 131, 6, 3493);
    			add_location(br, file$x, 135, 8, 3616);
    			add_location(p0, file$x, 136, 8, 3631);
    			add_location(hr, file$x, 139, 8, 3695);
    			add_location(p1, file$x, 140, 8, 3710);
    			attr_dev(div0, "class", "tooltip svelte-111neuw");
    			add_location(div0, file$x, 133, 6, 3548);
    			attr_dev(div1, "class", "stat stat__type svelte-111neuw");
    			add_location(div1, file$x, 130, 4, 3424);
    			add_location(div2, file$x, 146, 4, 3797);
    			attr_dev(div3, "class", "card__header svelte-111neuw");
    			add_location(div3, file$x, 129, 2, 3392);
    			if (!src_url_equal(img2.src, img2_src_value = "assets/attrs/mana.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Mana Capacity");
    			add_location(img2, file$x, 169, 6, 4314);
    			attr_dev(div4, "class", "stat stat__mana svelte-111neuw");
    			add_location(div4, file$x, 168, 4, 4277);
    			if (!src_url_equal(img3.src, img3_src_value = "assets/attrs/health.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Health");
    			add_location(img3, file$x, 174, 6, 4478);
    			attr_dev(div5, "class", "stat stat__health svelte-111neuw");
    			add_location(div5, file$x, 173, 4, 4439);
    			if (!src_url_equal(img4.src, img4_src_value = "assets/attrs/damage.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Damage");
    			add_location(img4, file$x, 179, 6, 4641);
    			attr_dev(div6, "class", "stat stat__damage svelte-111neuw");
    			add_location(div6, file$x, 178, 4, 4602);
    			attr_dev(div7, "class", "card__attrs svelte-111neuw");
    			add_location(div7, file$x, 164, 2, 4236);
    			attr_dev(div8, "class", "card svelte-111neuw");
    			add_location(div8, file$x, 127, 0, 3368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div3);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, br);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			p0.innerHTML = raw0_value;
    			append_dev(div0, t2);
    			append_dev(div0, hr);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			p1.innerHTML = raw1_value;
    			/*div0_binding*/ ctx[7](div0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, t5);
    			append_dev(div8, t6);
    			mount_component(img1, div8, null);
    			append_dev(div8, t7);
    			if (if_block0) if_block0.m(div8, null);
    			append_dev(div8, t8);
    			if (if_block1) if_block1.m(div8, null);
    			append_dev(div8, t9);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t10);
    			mount_component(text0, div4, null);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t12);
    			mount_component(text1, div5, null);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, img4);
    			append_dev(div6, t14);
    			mount_component(text2, div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "mousemove", /*passiveMouseMove*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*hero*/ 1) && raw0_value !== (raw0_value = /*hero*/ ctx[0].passive.info + "")) p0.innerHTML = raw0_value;			if ((!current || dirty & /*hero*/ 1) && raw1_value !== (raw1_value = /*hero*/ ctx[0].active.info + "")) p1.innerHTML = raw1_value;			if ((!current || dirty & /*hero*/ 1) && t5_value !== (t5_value = /*hero*/ ctx[0].name + "")) set_data_dev(t5, t5_value);
    			const img1_changes = {};
    			if (dirty & /*hero*/ 1) img1_changes.src = "classes/" + /*hero*/ ctx[0].klass + "_hero.jpg";
    			if (dirty & /*hero*/ 1) img1_changes.alt = /*hero*/ ctx[0].name;
    			img1.$set(img1_changes);

    			if (/*isHealthBarVisible*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isHealthBarVisible*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div8, t8);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isManaBarVisible*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isManaBarVisible*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$d(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div8, t9);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const text0_changes = {};

    			if (dirty & /*$$scope, mana, hero*/ 32773) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, health, hero*/ 32771) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    			const text2_changes = {};

    			if (dirty & /*$$scope, hero*/ 32769) {
    				text2_changes.$$scope = { dirty, ctx };
    			}

    			text2.$set(text2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			transition_in(text2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			transition_out(text2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			/*div0_binding*/ ctx[7](null);
    			destroy_component(img1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(text0);
    			destroy_component(text1);
    			destroy_component(text2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	let { hero } = $$props;
    	let { health = hero.health } = $$props;
    	let { mana = hero.health } = $$props;
    	let { isHealthBarVisible = false } = $$props;
    	let { isManaBarVisible = false } = $$props;
    	let abilityTooltip;
    	let passiveTooltip;
    	let damageTooltip;
    	let manaTooltip;
    	var heroKlass;

    	(function (heroKlass) {
    		heroKlass[heroKlass["SOLID"] = 1] = "SOLID";
    		heroKlass[heroKlass["LIQUID"] = 2] = "LIQUID";
    		heroKlass[heroKlass["GAS"] = 3] = "GAS";
    		heroKlass[heroKlass["PLASMA"] = 4] = "PLASMA";
    	})(heroKlass || (heroKlass = {}));

    	const abilityMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		abilityTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		abilityTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const passiveMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		$$invalidate(5, passiveTooltip.style.bottom = `calc(48px + ${-offsetY}px)`, passiveTooltip);
    		$$invalidate(5, passiveTooltip.style.left = `calc(-80px + ${offsetX}px)`, passiveTooltip);
    	};

    	const damageMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		damageTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		damageTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const manaMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		manaTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		manaTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const writable_props = ['hero', 'health', 'mana', 'isHealthBarVisible', 'isManaBarVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			passiveTooltip = $$value;
    			$$invalidate(5, passiveTooltip);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('hero' in $$props) $$invalidate(0, hero = $$props.hero);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('mana' in $$props) $$invalidate(2, mana = $$props.mana);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('isManaBarVisible' in $$props) $$invalidate(4, isManaBarVisible = $$props.isManaBarVisible);
    	};

    	$$self.$capture_state = () => ({
    		ProgressBar,
    		Text,
    		Img,
    		hero,
    		health,
    		mana,
    		isHealthBarVisible,
    		isManaBarVisible,
    		abilityTooltip,
    		passiveTooltip,
    		damageTooltip,
    		manaTooltip,
    		heroKlass,
    		abilityMouseMove,
    		passiveMouseMove,
    		damageMouseMove,
    		manaMouseMove
    	});

    	$$self.$inject_state = $$props => {
    		if ('hero' in $$props) $$invalidate(0, hero = $$props.hero);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('mana' in $$props) $$invalidate(2, mana = $$props.mana);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('isManaBarVisible' in $$props) $$invalidate(4, isManaBarVisible = $$props.isManaBarVisible);
    		if ('abilityTooltip' in $$props) abilityTooltip = $$props.abilityTooltip;
    		if ('passiveTooltip' in $$props) $$invalidate(5, passiveTooltip = $$props.passiveTooltip);
    		if ('damageTooltip' in $$props) damageTooltip = $$props.damageTooltip;
    		if ('manaTooltip' in $$props) manaTooltip = $$props.manaTooltip;
    		if ('heroKlass' in $$props) heroKlass = $$props.heroKlass;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hero,
    		health,
    		mana,
    		isHealthBarVisible,
    		isManaBarVisible,
    		passiveTooltip,
    		passiveMouseMove,
    		div0_binding
    	];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			hero: 0,
    			health: 1,
    			mana: 2,
    			isHealthBarVisible: 3,
    			isManaBarVisible: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$x.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hero*/ ctx[0] === undefined && !('hero' in props)) {
    			console.warn("<Hero> was created without expected prop 'hero'");
    		}
    	}

    	get hero() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hero(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mana() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mana(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHealthBarVisible() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHealthBarVisible(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isManaBarVisible() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isManaBarVisible(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\client\decks\HeroCards.svelte generated by Svelte v3.46.4 */
    const file$w = "src\\client\\decks\\HeroCards.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (21:2) {#each heroes as hero}
    function create_each_block$4(ctx) {
    	let div;
    	let hero;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	hero = new Hero({
    			props: { hero: /*hero*/ ctx[3] },
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*hero*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(hero.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "decks__hero svelte-1ccu1e3");
    			add_location(div, file$w, 21, 4, 542);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(hero, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(hero);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(21:2) {#each heroes as hero}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let div;
    	let current;
    	let each_value = heroes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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

    			attr_dev(div, "class", "decks svelte-1ccu1e3");
    			add_location(div, file$w, 19, 0, 491);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*setDeckKlass, heroes*/ 1) {
    				each_value = heroes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(2, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeroCards', slots, []);

    	const setDeckKlass = klass => {
    		const { deckId } = $playerStore;
    		socketService.socket.emit("setDeckKlass", { deckId, klass });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HeroCards> was created with unknown prop '${key}'`);
    	});

    	const click_handler = hero => setDeckKlass(hero.klass);

    	$$self.$capture_state = () => ({
    		heroes,
    		socketService,
    		playerStore,
    		Hero,
    		setDeckKlass,
    		$playerStore
    	});

    	return [setDeckKlass, click_handler];
    }

    class HeroCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeroCards",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src\client\decks\Decks.svelte generated by Svelte v3.46.4 */
    const file$v = "src\\client\\decks\\Decks.svelte";

    function create_fragment$v(ctx) {
    	let div3;
    	let div0;
    	let deckslots;
    	let t0;
    	let div1;
    	let herocards;
    	let t1;
    	let cards_1;
    	let t2;
    	let div2;
    	let deckcards;
    	let current;
    	deckslots = new DeckSlots({ $$inline: true });
    	herocards = new HeroCards({ $$inline: true });
    	cards_1 = new Cards({ $$inline: true });
    	deckcards = new DeckCards({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(deckslots.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(herocards.$$.fragment);
    			t1 = space();
    			create_component(cards_1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(deckcards.$$.fragment);
    			attr_dev(div0, "class", "decks__list svelte-1gm9h82");
    			add_location(div0, file$v, 46, 2, 1389);
    			attr_dev(div1, "class", "decks__cards svelte-1gm9h82");
    			add_location(div1, file$v, 50, 2, 1448);
    			attr_dev(div2, "class", "decks__deck svelte-1gm9h82");
    			add_location(div2, file$v, 55, 2, 1522);
    			attr_dev(div3, "class", "decks svelte-1gm9h82");
    			add_location(div3, file$v, 45, 0, 1366);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(deckslots, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			mount_component(herocards, div1, null);
    			append_dev(div1, t1);
    			mount_component(cards_1, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(deckcards, div2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(deckslots.$$.fragment, local);
    			transition_in(herocards.$$.fragment, local);
    			transition_in(cards_1.$$.fragment, local);
    			transition_in(deckcards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(deckslots.$$.fragment, local);
    			transition_out(herocards.$$.fragment, local);
    			transition_out(cards_1.$$.fragment, local);
    			transition_out(deckcards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(deckslots);
    			destroy_component(herocards);
    			destroy_component(cards_1);
    			destroy_component(deckcards);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $playerStore;
    	let $decksStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(0, $playerStore = $$value));
    	validate_store(decksStore, 'decksStore');
    	component_subscribe($$self, decksStore, $$value => $$invalidate(1, $decksStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Decks', slots, []);

    	onMount(() => {
    		const { deckId } = $playerStore;
    		const deck = $playerStore.decks.find(deck => deck.id === deckId);

    		set_store_value(
    			decksStore,
    			$decksStore.deckCards = deck.cards.map(deckCard => {
    				const card = cards.find(card => card.id === deckCard.id);
    				const { id, klass, name } = card;
    				const { amount } = deckCard;
    				return { klass, id, name, amount };
    			}),
    			$decksStore
    		);

    		set_store_value(
    			decksStore,
    			$decksStore.deckSlots = $playerStore.decks.map(deck => {
    				const { id, name, klass, cards } = deck;
    				let cardsInDeck = 0;

    				if (cards.length) {
    					cardsInDeck = cards.reduce((acc, { amount }) => acc += amount, 0);
    				}

    				return { id, name, klass, cardsInDeck };
    			}),
    			$decksStore
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Decks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		cards,
    		decksStore,
    		playerStore,
    		Cards,
    		DeckCards,
    		DeckSlots,
    		HeroCards,
    		$playerStore,
    		$decksStore
    	});

    	return [];
    }

    class Decks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Decks",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\client\play\Lobby.svelte generated by Svelte v3.46.4 */
    const file$u = "src\\client\\play\\Lobby.svelte";

    // (64:4) <Text>
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lobby ID:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(64:4) <Text>",
    		ctx
    	});

    	return block;
    }

    // (65:4) <Text color="purple">
    function create_default_slot_6$2(ctx) {
    	let t_value = /*$lobbyStore*/ ctx[0].lobbyId + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lobbyStore*/ 1 && t_value !== (t_value = /*$lobbyStore*/ ctx[0].lobbyId + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(65:4) <Text color=\\\"purple\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:8) <Text>
    function create_default_slot_5$2(ctx) {
    	let t_value = /*$lobbyStore*/ ctx[0].host.username + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$lobbyStore*/ 1 && t_value !== (t_value = /*$lobbyStore*/ ctx[0].host.username + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(78:8) <Text>",
    		ctx
    	});

    	return block;
    }

    // (80:8) <Text color="purple">
    function create_default_slot_4$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Host");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(80:8) <Text color=\\\"purple\\\">",
    		ctx
    	});

    	return block;
    }

    // (92:8) <Text color="green">
    function create_default_slot_3$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Challengee");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(92:8) <Text color=\\\"green\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:4) {:else}
    function create_else_block$7(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				style: "outlined",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onLeaveLobby*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(111:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:4) {#if $lobbyStore.host.username === $playerStore.username}
    function create_if_block$c(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				disabled: !/*$lobbyStore*/ ctx[0].challengee.username,
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*onStartGame*/ ctx[2]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*onDestroyLobby*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*$lobbyStore*/ 1) button0_changes.disabled = !/*$lobbyStore*/ ctx[0].challengee.username;

    			if (dirty & /*$$scope*/ 32) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(104:4) {#if $lobbyStore.host.username === $playerStore.username}",
    		ctx
    	});

    	return block;
    }

    // (112:6) <Button style="outlined" on:click={onLeaveLobby}>
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("LEAVE LOBBY");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(112:6) <Button style=\\\"outlined\\\" on:click={onLeaveLobby}>",
    		ctx
    	});

    	return block;
    }

    // (105:6) <Button disabled={!$lobbyStore.challengee.username} on:click={onStartGame}>
    function create_default_slot_1$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("START GAME");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(105:6) <Button disabled={!$lobbyStore.challengee.username} on:click={onStartGame}>",
    		ctx
    	});

    	return block;
    }

    // (108:6) <Button on:click={onDestroyLobby}>
    function create_default_slot$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DESTROY LOBBY");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(108:6) <Button on:click={onDestroyLobby}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div6;
    	let h3;
    	let text0;
    	let t0;
    	let text1;
    	let t1;
    	let div4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div0;
    	let text2;
    	let t3;
    	let br0;
    	let t4;
    	let text3;
    	let t5;
    	let h1;
    	let t7;
    	let div3;
    	let div2;

    	let t8_value = (/*$lobbyStore*/ ctx[0].challengee.username
    	? /*$lobbyStore*/ ctx[0].challengee.username
    	: "Awaiting...") + "";

    	let t8;
    	let t9;
    	let br1;
    	let t10;
    	let text4;
    	let t11;
    	let img1;
    	let img1_src_value;
    	let t12;
    	let div5;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	text0 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				color: "purple",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text2 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text3 = new Text({
    			props: {
    				color: "purple",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text4 = new Text({
    			props: {
    				color: "green",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$c, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$lobbyStore*/ ctx[0].host.username === /*$playerStore*/ ctx[1].username) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			h3 = element("h3");
    			create_component(text0.$$.fragment);
    			t0 = space();
    			create_component(text1.$$.fragment);
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div0 = element("div");
    			create_component(text2.$$.fragment);
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			create_component(text3.$$.fragment);
    			t5 = space();
    			h1 = element("h1");
    			h1.textContent = "VS";
    			t7 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			br1 = element("br");
    			t10 = space();
    			create_component(text4.$$.fragment);
    			t11 = space();
    			img1 = element("img");
    			t12 = space();
    			div5 = element("div");
    			if_block.c();
    			add_location(h3, file$u, 62, 2, 1426);
    			attr_dev(img0, "class", "host__avatar svelte-1q1cqf3");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/avatars/" + /*$lobbyStore*/ ctx[0].host.avatarId + ".png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Host avatar");
    			add_location(img0, file$u, 70, 6, 1583);
    			add_location(br0, file$u, 78, 8, 1791);
    			add_location(div0, file$u, 76, 6, 1726);
    			attr_dev(div1, "class", "host svelte-1q1cqf3");
    			add_location(div1, file$u, 69, 4, 1557);
    			attr_dev(h1, "class", "vs svelte-1q1cqf3");
    			add_location(h1, file$u, 83, 4, 1872);
    			add_location(br1, file$u, 90, 8, 2056);
    			add_location(div2, file$u, 88, 6, 1948);
    			attr_dev(img1, "class", "challengee__avatar svelte-1q1cqf3");

    			if (!src_url_equal(img1.src, img1_src_value = "assets/avatars/" + (/*$lobbyStore*/ ctx[0].challengee.username
    			? /*$lobbyStore*/ ctx[0].challengee.avatarId
    			: "unknown") + ".png")) attr_dev(img1, "src", img1_src_value);

    			attr_dev(img1, "alt", "Challengee avatar");
    			add_location(img1, file$u, 94, 6, 2132);
    			attr_dev(div3, "class", "challengee svelte-1q1cqf3");
    			add_location(div3, file$u, 87, 4, 1916);
    			attr_dev(div4, "class", "players svelte-1q1cqf3");
    			add_location(div4, file$u, 67, 2, 1528);
    			add_location(div5, file$u, 102, 2, 2357);
    			attr_dev(div6, "class", "lobby svelte-1q1cqf3");
    			add_location(div6, file$u, 60, 0, 1401);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h3);
    			mount_component(text0, h3, null);
    			append_dev(h3, t0);
    			mount_component(text1, h3, null);
    			append_dev(div6, t1);
    			append_dev(div6, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(text2, div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, br0);
    			append_dev(div0, t4);
    			mount_component(text3, div0, null);
    			append_dev(div4, t5);
    			append_dev(div4, h1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			append_dev(div2, t9);
    			append_dev(div2, br1);
    			append_dev(div2, t10);
    			mount_component(text4, div2, null);
    			append_dev(div3, t11);
    			append_dev(div3, img1);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			if_blocks[current_block_type_index].m(div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, $lobbyStore*/ 33) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);

    			if (!current || dirty & /*$lobbyStore*/ 1 && !src_url_equal(img0.src, img0_src_value = "assets/avatars/" + /*$lobbyStore*/ ctx[0].host.avatarId + ".png")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			const text2_changes = {};

    			if (dirty & /*$$scope, $lobbyStore*/ 33) {
    				text2_changes.$$scope = { dirty, ctx };
    			}

    			text2.$set(text2_changes);
    			const text3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text3_changes.$$scope = { dirty, ctx };
    			}

    			text3.$set(text3_changes);

    			if ((!current || dirty & /*$lobbyStore*/ 1) && t8_value !== (t8_value = (/*$lobbyStore*/ ctx[0].challengee.username
    			? /*$lobbyStore*/ ctx[0].challengee.username
    			: "Awaiting...") + "")) set_data_dev(t8, t8_value);

    			const text4_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				text4_changes.$$scope = { dirty, ctx };
    			}

    			text4.$set(text4_changes);

    			if (!current || dirty & /*$lobbyStore*/ 1 && !src_url_equal(img1.src, img1_src_value = "assets/avatars/" + (/*$lobbyStore*/ ctx[0].challengee.username
    			? /*$lobbyStore*/ ctx[0].challengee.avatarId
    			: "unknown") + ".png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

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
    				if_block.m(div5, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			transition_in(text2.$$.fragment, local);
    			transition_in(text3.$$.fragment, local);
    			transition_in(text4.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			transition_out(text2.$$.fragment, local);
    			transition_out(text3.$$.fragment, local);
    			transition_out(text4.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(text0);
    			destroy_component(text1);
    			destroy_component(text2);
    			destroy_component(text3);
    			destroy_component(text4);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $lobbyStore;
    	let $playerStore;
    	validate_store(lobbyStore, 'lobbyStore');
    	component_subscribe($$self, lobbyStore, $$value => $$invalidate(0, $lobbyStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lobby', slots, []);

    	const onStartGame = () => {
    		const { publicKey, privateKey } = $playerStore;
    		const { lobbyId } = $lobbyStore;
    		eccService.sign(`startgame:${lobbyId}`, privateKey);
    		socketService.socket.emit("startGame", { lobbyId });
    	};

    	const onDestroyLobby = () => {
    		socketService.socket.emit("destroyLobby");
    	};

    	const onLeaveLobby = () => {
    		socketService.socket.emit("leaveLobby");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lobby> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		eccService,
    		socketService,
    		lobbyStore,
    		playerStore,
    		Button,
    		Text,
    		onStartGame,
    		onDestroyLobby,
    		onLeaveLobby,
    		$lobbyStore,
    		$playerStore
    	});

    	return [$lobbyStore, $playerStore, onStartGame, onDestroyLobby, onLeaveLobby];
    }

    class Lobby extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lobby",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\client\play\SelectMode.svelte generated by Svelte v3.46.4 */
    const file$t = "src\\client\\play\\SelectMode.svelte";

    // (47:4) <Button color="green" on:click={onJoinCasualQueue}>
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("QUEUE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(47:4) <Button color=\\\"green\\\" on:click={onJoinCasualQueue}>",
    		ctx
    	});

    	return block;
    }

    // (62:6) <Button color="green" on:click={onMakeLobby}>
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MAKE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(62:6) <Button color=\\\"green\\\" on:click={onMakeLobby}>",
    		ctx
    	});

    	return block;
    }

    // (65:6) <Button style="outlined" color="green" on:click={onJoinLobby}>
    function create_default_slot$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("JOIN");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(65:6) <Button style=\\\"outlined\\\" color=\\\"green\\\" on:click={onJoinLobby}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div4;
    	let div0;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let button0;
    	let t4;
    	let div1;
    	let h11;
    	let t6;
    	let p1;
    	let t8;
    	let p2;
    	let t10;
    	let div3;
    	let h12;
    	let t12;
    	let p3;
    	let t14;
    	let div2;
    	let button1;
    	let t15;
    	let button2;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "green",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*onJoinCasualQueue*/ ctx[2]);

    	button1 = new Button({
    			props: {
    				color: "green",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*onMakeLobby*/ ctx[0]);

    	button2 = new Button({
    			props: {
    				style: "outlined",
    				color: "green",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*onJoinLobby*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "CASUAL";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Play for fun";
    			t3 = space();
    			create_component(button0.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "RANKED";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Rank up and earn SOM rewards";
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Ranked coming soon... 😉";
    			t10 = space();
    			div3 = element("div");
    			h12 = element("h1");
    			h12.textContent = "CUSTOM";
    			t12 = space();
    			p3 = element("p");
    			p3.textContent = "Challenge your friends";
    			t14 = space();
    			div2 = element("div");
    			create_component(button1.$$.fragment);
    			t15 = space();
    			create_component(button2.$$.fragment);
    			add_location(h10, file$t, 44, 4, 1111);
    			add_location(p0, file$t, 45, 4, 1132);
    			attr_dev(div0, "class", "play-screen casual svelte-owg92x");
    			add_location(div0, file$t, 43, 2, 1073);
    			add_location(h11, file$t, 52, 4, 1290);
    			add_location(p1, file$t, 53, 4, 1311);
    			add_location(p2, file$t, 54, 4, 1352);
    			attr_dev(div1, "class", "play-screen ranked svelte-owg92x");
    			add_location(div1, file$t, 51, 2, 1252);
    			add_location(h12, file$t, 58, 4, 1437);
    			add_location(p3, file$t, 59, 4, 1458);
    			add_location(div2, file$t, 60, 4, 1493);
    			attr_dev(div3, "class", "play-screen custom svelte-owg92x");
    			add_location(div3, file$t, 57, 2, 1399);
    			attr_dev(div4, "class", "play-screens svelte-owg92x");
    			add_location(div4, file$t, 42, 0, 1043);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			mount_component(button0, div0, null);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(div1, t8);
    			append_dev(div1, p2);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, h12);
    			append_dev(div3, t12);
    			append_dev(div3, p3);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			mount_component(button1, div2, null);
    			append_dev(div2, t15);
    			mount_component(button2, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectMode', slots, []);

    	const onMakeLobby = () => {
    		socketService.socket.emit("makeLobby");
    	};

    	const onJoinLobby = () => {
    		miscService.openModal("joinLobby");
    	};

    	const onJoinCasualQueue = () => {
    		socketService.socket.emit("joinCasualQueue");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectMode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		miscService,
    		socketService,
    		Button,
    		onMakeLobby,
    		onJoinLobby,
    		onJoinCasualQueue
    	});

    	return [onMakeLobby, onJoinLobby, onJoinCasualQueue];
    }

    class SelectMode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectMode",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\client\play\Play.svelte generated by Svelte v3.46.4 */
    const file$s = "src\\client\\play\\Play.svelte";

    // (17:2) {:else}
    function create_else_block$6(ctx) {
    	let selectmode;
    	let current;
    	selectmode = new SelectMode({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(selectmode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectmode, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectmode, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(17:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if isInLobby}
    function create_if_block$b(ctx) {
    	let lobby;
    	let current;
    	lobby = new Lobby({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lobby.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lobby, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lobby.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lobby.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lobby, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(15:2) {#if isInLobby}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isInLobby*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "play svelte-14immyk");
    			add_location(div, file$s, 13, 0, 355);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
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
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let isInLobby;
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Play', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Play> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		PlayerStatus,
    		playerStore,
    		Lobby,
    		SelectMode,
    		isInLobby,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isInLobby' in $$props) $$invalidate(0, isInLobby = $$props.isInLobby);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore*/ 2) {
    			$$invalidate(0, isInLobby = $playerStore.status === PlayerStatus.INLOBBY);
    		}
    	};

    	return [isInLobby, $playerStore];
    }

    class Play extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Play",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\client\Client.svelte generated by Svelte v3.46.4 */
    const file$r = "src\\client\\Client.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (70:6) {#each views as view}
    function create_each_block$3(ctx) {
    	let div;
    	let t0_value = /*view*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*view*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "link svelte-i3cxt8");
    			toggle_class(div, "link--active", /*view*/ ctx[4].name === /*currentView*/ ctx[0].name);
    			add_location(div, file$r, 70, 8, 1602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*views, currentView*/ 5) {
    				toggle_class(div, "link--active", /*view*/ ctx[4].name === /*currentView*/ ctx[0].name);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(70:6) {#each views as view}",
    		ctx
    	});

    	return block;
    }

    // (82:8) <Text>
    function create_default_slot_1$7(ctx) {
    	let t_value = /*$playerStore*/ ctx[1].wallet[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 2 && t_value !== (t_value = /*$playerStore*/ ctx[1].wallet[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(82:8) <Text>",
    		ctx
    	});

    	return block;
    }

    // (86:8) <Text>
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("0");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(86:8) <Text>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let div6;
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let img0;
    	let t1;
    	let text0;
    	let t2;
    	let div2;
    	let img1;
    	let t3;
    	let text1;
    	let t4;
    	let div5;
    	let switch_instance;
    	let current;
    	let each_value = /*views*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	img0 = new Img({
    			props: { src: "currencies/LMT.png", alt: "LMT" },
    			$$inline: true
    		});

    	text0 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	img1 = new Img({
    			props: { src: "currencies/DMT.png", alt: "DMT" },
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	var switch_value = /*currentView*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			create_component(img0.$$.fragment);
    			t1 = space();
    			create_component(text0.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(img1.$$.fragment);
    			t3 = space();
    			create_component(text1.$$.fragment);
    			t4 = space();
    			div5 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "links svelte-i3cxt8");
    			add_location(div0, file$r, 68, 4, 1544);
    			attr_dev(div1, "class", "client__header__currency svelte-i3cxt8");
    			add_location(div1, file$r, 79, 6, 1861);
    			attr_dev(div2, "class", "client__header__currency svelte-i3cxt8");
    			add_location(div2, file$r, 83, 6, 2019);
    			attr_dev(div3, "class", "client__header__currencies svelte-i3cxt8");
    			add_location(div3, file$r, 78, 4, 1813);
    			attr_dev(div4, "class", "client__header svelte-i3cxt8");
    			add_location(div4, file$r, 67, 2, 1510);
    			attr_dev(div5, "class", "client__content svelte-i3cxt8");
    			add_location(div5, file$r, 89, 2, 2172);
    			attr_dev(div6, "class", "client svelte-i3cxt8");
    			add_location(div6, file$r, 66, 0, 1486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			mount_component(img0, div1, null);
    			append_dev(div1, t1);
    			mount_component(text0, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(img1, div2, null);
    			append_dev(div2, t3);
    			mount_component(text1, div2, null);
    			append_dev(div6, t4);
    			append_dev(div6, div5);

    			if (switch_instance) {
    				mount_component(switch_instance, div5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*views, currentView*/ 5) {
    				each_value = /*views*/ ctx[2];
    				validate_each_argument(each_value);
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

    			const text0_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 130) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);

    			if (switch_value !== (switch_value = /*currentView*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div5, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img0.$$.fragment, local);
    			transition_in(text0.$$.fragment, local);
    			transition_in(img1.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img0.$$.fragment, local);
    			transition_out(text0.$$.fragment, local);
    			transition_out(img1.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    			destroy_component(img0);
    			destroy_component(text0);
    			destroy_component(img1);
    			destroy_component(text1);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Client', slots, []);

    	const views = [
    		{ name: "Play", component: Play },
    		{ name: "Decks", component: Decks },
    		{
    			name: "Collection",
    			component: Collection
    		},
    		{ name: "Market", component: Market },
    		{
    			name: "Leaderboards",
    			component: Leaderboards
    		},
    		{
    			name: "Governance",
    			component: Governance
    		}
    	];

    	let currentView = views[0];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Client> was created with unknown prop '${key}'`);
    	});

    	const click_handler = view => $$invalidate(0, currentView = view);

    	$$self.$capture_state = () => ({
    		playerStore,
    		Governance,
    		Leaderboards,
    		Market,
    		Collection,
    		Decks,
    		Play,
    		Img,
    		Text,
    		views,
    		currentView,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentView' in $$props) $$invalidate(0, currentView = $$props.currentView);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentView, $playerStore, views, click_handler];
    }

    class Client extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Client",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\sidenav\Footer.svelte generated by Svelte v3.46.4 */
    const file$q = "src\\sidenav\\Footer.svelte";

    // (14:2) <Button style="outlined" color="purple">
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DISCUSSIONS");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(14:2) <Button style=\\\"outlined\\\" color=\\\"purple\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:2) <Button style="outlined" color="purple">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DISCORD");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(15:2) <Button style=\\\"outlined\\\" color=\\\"purple\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				style: "outlined",
    				color: "purple",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				style: "outlined",
    				color: "purple",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "class", "footer svelte-19cv9jq");
    			add_location(div, file$q, 12, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\sidenav\Player.svelte generated by Svelte v3.46.4 */
    const file$p = "src\\sidenav\\Player.svelte";

    // (109:4) <Text size="lg">
    function create_default_slot_3$3(ctx) {
    	let t_value = /*$playerStore*/ ctx[1].username + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 2 && t_value !== (t_value = /*$playerStore*/ ctx[1].username + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(109:4) <Text size=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:4) <Text>
    function create_default_slot_2$4(ctx) {
    	let t0;
    	let t1_value = /*$playerStore*/ ctx[1].lv + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Level ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 2 && t1_value !== (t1_value = /*$playerStore*/ ctx[1].lv + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(110:4) <Text>",
    		ctx
    	});

    	return block;
    }

    // (111:4) <Text color="purple">
    function create_default_slot_1$5(ctx) {
    	let t0_value = /*$playerStore*/ ctx[1].xp + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" / ");
    			t2 = text(/*xpRequired*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 2 && t0_value !== (t0_value = /*$playerStore*/ ctx[1].xp + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*xpRequired*/ 1) set_data_dev(t2, /*xpRequired*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(111:4) <Text color=\\\"purple\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:4) <Button style="icon" on:click={logout}>
    function create_default_slot$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-power-off");
    			add_location(i, file$p, 115, 6, 3627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(115:4) <Button style=\\\"icon\\\" on:click={logout}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div4;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let svg;
    	let path0;
    	let path1;
    	let t1;
    	let div2;
    	let text0;
    	let t2;
    	let text1;
    	let t3;
    	let text2;
    	let t4;
    	let div3;
    	let button;
    	let current;

    	text0 = new Text({
    			props: {
    				size: "lg",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text2 = new Text({
    			props: {
    				color: "purple",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*logout*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			create_component(text0.$$.fragment);
    			t2 = space();
    			create_component(text1.$$.fragment);
    			t3 = space();
    			create_component(text2.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(img, "class", "player__main__img svelte-1nk8us7");
    			if (!src_url_equal(img.src, img_src_value = "assets/avatars/" + /*$playerStore*/ ctx[1].avatarId + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Avatar");
    			add_location(img, file$p, 94, 4, 2134);
    			attr_dev(path0, "d", "M31.1619 88.6507C21.7572 84.7551 13.9941 77.7191 9.19545 68.7414C4.39681 59.7638 2.8595 49.4 4.84545 39.416C6.8314 29.432 12.2177 20.4454 20.0867 13.9875C27.9557 7.52964 37.8204 4 48 4C58.1796 4 68.0444 7.52966 75.9133 13.9875C83.7823 20.4454 89.1686 29.432 91.1546 39.416C93.1405 49.4001 91.6032 59.7638 86.8045 68.7415C82.0059 77.7191 74.2428 84.7551 64.8381 88.6507");
    			attr_dev(path0, "stroke", "#424242");
    			attr_dev(path0, "stroke-width", "8");
    			add_location(path0, file$p, 101, 8, 2400);
    			attr_dev(path1, "id", "xpProgress");
    			set_style(path1, "stroke-dashoffset", /*xpOffset*/ ctx[2]);
    			attr_dev(path1, "d", "M29.1269 87.7468C20.0919 83.4567 12.7882 76.2164 8.41946 67.2193C4.05068 58.2221 2.87756 48.0051 5.09343 38.2519C7.3093 28.4987 12.7819 19.7915 20.6094 13.5652C28.4368 7.33902 38.1519 3.96536 48.1536 4.00027C58.1553 4.03518 67.8466 7.47658 75.6304 13.7573C83.4142 20.038 88.8259 28.7832 90.9736 38.5516C93.1213 48.3201 91.8769 58.5287 87.4454 67.4951C83.0139 76.4616 75.6599 83.6506 66.5952 87.8775");
    			attr_dev(path1, "stroke", "#796CFF");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "class", "svelte-1nk8us7");
    			add_location(path1, file$p, 102, 8, 2824);
    			attr_dev(svg, "width", "96");
    			attr_dev(svg, "height", "96");
    			attr_dev(svg, "viewBox", "0 0 96 96");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$p, 100, 6, 2295);
    			attr_dev(div0, "class", "player__main__bar svelte-1nk8us7");
    			add_location(div0, file$p, 99, 4, 2256);
    			attr_dev(div1, "class", "player__main svelte-1nk8us7");
    			add_location(div1, file$p, 93, 2, 2102);
    			attr_dev(div2, "class", "player__account svelte-1nk8us7");
    			add_location(div2, file$p, 107, 2, 3364);
    			add_location(div3, file$p, 113, 2, 3569);
    			attr_dev(div4, "class", "player svelte-1nk8us7");
    			add_location(div4, file$p, 91, 0, 2076);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			mount_component(text0, div2, null);
    			append_dev(div2, t2);
    			mount_component(text1, div2, null);
    			append_dev(div2, t3);
    			mount_component(text2, div2, null);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			mount_component(button, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$playerStore*/ 2 && !src_url_equal(img.src, img_src_value = "assets/avatars/" + /*$playerStore*/ ctx[1].avatarId + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*xpOffset*/ 4) {
    				set_style(path1, "stroke-dashoffset", /*xpOffset*/ ctx[2]);
    			}

    			const text0_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 66) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 66) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    			const text2_changes = {};

    			if (dirty & /*$$scope, xpRequired, $playerStore*/ 67) {
    				text2_changes.$$scope = { dirty, ctx };
    			}

    			text2.$set(text2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			transition_in(text2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			transition_out(text2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(text0);
    			destroy_component(text1);
    			destroy_component(text2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let xpRequired;
    	let xpOffset;
    	let $playerStore;
    	let $socialStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	validate_store(socialStore, 'socialStore');
    	component_subscribe($$self, socialStore, $$value => $$invalidate(5, $socialStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);

    	const logout = () => {
    		// socketService.socket.emit("signout");
    		socketService.socket.emit("updateStatus");

    		set_store_value(
    			playerStore,
    			$playerStore = {
    				socketId: "",
    				username: "",
    				publicKey: "",
    				privateKey: "",
    				last_nonce: 0,
    				privateKeyHash: "",
    				status: PlayerStatus.OFFLINE,
    				xp: 0,
    				lv: 1,
    				deckId: 0,
    				avatarId: 0,
    				lobbyId: 0,
    				gameId: 0,
    				decks: [],
    				social: { friends: [], requests: [], blocked: [] },
    				wallet: []
    			},
    			$playerStore
    		);

    		set_store_value(
    			socialStore,
    			$socialStore = {
    				friends: [],
    				chat: {
    					username: "",
    					status: PlayerStatus.OFFLINE,
    					avatarId: 0,
    					isOpen: false,
    					messages: []
    				}
    			},
    			$socialStore
    		);
    	};

    	let xpProgressLen;

    	onMount(() => {
    		const xpProgress = document.getElementById("xpProgress");
    		$$invalidate(4, xpProgressLen = xpProgress.getTotalLength());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		PlayerStatus,
    		socketService,
    		playerStore,
    		socialStore,
    		Button,
    		Img,
    		Text,
    		logout,
    		xpProgressLen,
    		xpRequired,
    		xpOffset,
    		$playerStore,
    		$socialStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('xpProgressLen' in $$props) $$invalidate(4, xpProgressLen = $$props.xpProgressLen);
    		if ('xpRequired' in $$props) $$invalidate(0, xpRequired = $$props.xpRequired);
    		if ('xpOffset' in $$props) $$invalidate(2, xpOffset = $$props.xpOffset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore*/ 2) {
    			$$invalidate(0, xpRequired = Math.pow($playerStore.lv * 10, $playerStore.lv / 100 + 1));
    		}

    		if ($$self.$$.dirty & /*xpProgressLen, $playerStore, xpRequired*/ 19) {
    			$$invalidate(2, xpOffset = xpProgressLen - xpProgressLen * ($playerStore.xp / xpRequired));
    		}
    	};

    	return [xpRequired, $playerStore, xpOffset, logout, xpProgressLen];
    }

    class Player$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\sidenav\social\Block.svelte generated by Svelte v3.46.4 */
    const file$o = "src\\sidenav\\social\\Block.svelte";

    // (22:2) <Text>
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*username*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1) set_data_dev(t, /*username*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(22:2) <Text>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <Button style="icon" on:click={onUnblock}>
    function create_default_slot$5(ctx) {
    	let fontawesome;
    	let current;
    	fontawesome = new FontAwesome({ props: { icon: "trash" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(23:2) <Button style=\\\"icon\\\" on:click={onUnblock}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let text_1;
    	let t;
    	let button;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onUnblock*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(text_1.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "block svelte-1e4fsgm");
    			add_location(div, file$o, 20, 0, 647);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(text_1, div, null);
    			append_dev(div, t);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope, username*/ 5) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(text_1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Block', slots, []);
    	let { username } = $$props;

    	const onUnblock = () => {
    		socketService.unblockFriend({ username });
    	};

    	const writable_props = ['username'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Block> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	$$self.$capture_state = () => ({
    		socketService,
    		Button,
    		FontAwesome,
    		Text,
    		username,
    		onUnblock
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, onUnblock];
    }

    class Block extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { username: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Block",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[0] === undefined && !('username' in props)) {
    			console.warn("<Block> was created without expected prop 'username'");
    		}
    	}

    	get username() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\sidenav\social\Friend.svelte generated by Svelte v3.46.4 */
    const file$n = "src\\sidenav\\social\\Friend.svelte";

    // (66:6) <Text>
    function create_default_slot_6$1(ctx) {
    	let t_value = /*friend*/ ctx[0].username + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*friend*/ 1 && t_value !== (t_value = /*friend*/ ctx[0].username + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(66:6) <Text>",
    		ctx
    	});

    	return block;
    }

    // (76:56) 
    function create_if_block_3$2(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "orange",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(76:56) ",
    		ctx
    	});

    	return block;
    }

    // (74:57) 
    function create_if_block_2$3(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "blue",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(74:57) ",
    		ctx
    	});

    	return block;
    }

    // (72:56) 
    function create_if_block_1$4(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "green",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(72:56) ",
    		ctx
    	});

    	return block;
    }

    // (70:8) {#if friend.status === PlayerStatus.OFFLINE}
    function create_if_block$a(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				color: "grey",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(70:8) {#if friend.status === PlayerStatus.OFFLINE}",
    		ctx
    	});

    	return block;
    }

    // (77:10) <Text color="orange">
    function create_default_slot_5$1(ctx) {
    	let fontawesome;
    	let t;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "circle" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    			t = text(" In game");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(77:10) <Text color=\\\"orange\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:10) <Text color="blue">
    function create_default_slot_4$2(ctx) {
    	let fontawesome;
    	let t;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "circle" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    			t = text(" In lobby");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(75:10) <Text color=\\\"blue\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:10) <Text color="green">
    function create_default_slot_3$2(ctx) {
    	let fontawesome;
    	let t;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "circle" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    			t = text(" Online");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(73:10) <Text color=\\\"green\\\">",
    		ctx
    	});

    	return block;
    }

    // (71:10) <Text color="grey">
    function create_default_slot_2$3(ctx) {
    	let fontawesome;
    	let t;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "circle" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    			t = text(" Offline");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(71:10) <Text color=\\\"grey\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:6) <Text>
    function create_default_slot_1$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_if_block_1$4, create_if_block_2$3, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*friend*/ ctx[0].status === PlayerStatus.OFFLINE) return 0;
    		if (/*friend*/ ctx[0].status === PlayerStatus.ONLINE) return 1;
    		if (/*friend*/ ctx[0].status === PlayerStatus.INLOBBY) return 2;
    		if (/*friend*/ ctx[0].status === PlayerStatus.INGAME) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
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
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(69:6) <Text>",
    		ctx
    	});

    	return block;
    }

    // (82:4) <Button style="icon" on:click={onChat}>
    function create_default_slot$4(ctx) {
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "comment" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(82:4) <Button style=\\\"icon\\\" on:click={onChat}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let text0;
    	let t1;
    	let text1;
    	let t2;
    	let button;
    	let current;

    	text0 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onChat*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			create_component(text0.$$.fragment);
    			t1 = space();
    			create_component(text1.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(img, "class", "friend__main__avatar__img svelte-w3fxhj");
    			if (!src_url_equal(img.src, img_src_value = "assets/avatars/" + /*friend*/ ctx[0].avatarId + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "" + (/*friend*/ ctx[0].username + " avatar"));
    			add_location(img, file$n, 58, 6, 1253);
    			attr_dev(div0, "class", "friend__main__avatar svelte-w3fxhj");
    			add_location(div0, file$n, 57, 4, 1211);
    			attr_dev(div1, "class", "friend__main__info svelte-w3fxhj");
    			add_location(div1, file$n, 64, 4, 1413);
    			attr_dev(div2, "class", "friend__main svelte-w3fxhj");
    			add_location(div2, file$n, 55, 2, 1177);
    			attr_dev(div3, "class", "friend svelte-w3fxhj");
    			add_location(div3, file$n, 53, 0, 1151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(text0, div1, null);
    			append_dev(div1, t1);
    			mount_component(text1, div1, null);
    			append_dev(div2, t2);
    			mount_component(button, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*friend*/ 1 && !src_url_equal(img.src, img_src_value = "assets/avatars/" + /*friend*/ ctx[0].avatarId + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*friend*/ 1 && img_alt_value !== (img_alt_value = "" + (/*friend*/ ctx[0].username + " avatar"))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			const text0_changes = {};

    			if (dirty & /*$$scope, friend*/ 9) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const text1_changes = {};

    			if (dirty & /*$$scope, friend*/ 9) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(text1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(text1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(text0);
    			destroy_component(text1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $socialStore;
    	validate_store(socialStore, 'socialStore');
    	component_subscribe($$self, socialStore, $$value => $$invalidate(2, $socialStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Friend', slots, []);
    	let { friend } = $$props;

    	const onChat = () => {
    		const { username, status, avatarId, messages } = friend;

    		if ($socialStore.chat.username === username) {
    			set_store_value(socialStore, $socialStore.chat.isOpen = true, $socialStore);
    		} else {
    			const isOpen = true;

    			set_store_value(
    				socialStore,
    				$socialStore.chat = {
    					username,
    					status,
    					avatarId,
    					isOpen,
    					messages
    				},
    				$socialStore
    			);
    		}
    	};

    	const writable_props = ['friend'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Friend> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('friend' in $$props) $$invalidate(0, friend = $$props.friend);
    	};

    	$$self.$capture_state = () => ({
    		PlayerStatus,
    		socialStore,
    		Button,
    		FontAwesome,
    		Text,
    		friend,
    		onChat,
    		$socialStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('friend' in $$props) $$invalidate(0, friend = $$props.friend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [friend, onChat];
    }

    class Friend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { friend: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Friend",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*friend*/ ctx[0] === undefined && !('friend' in props)) {
    			console.warn("<Friend> was created without expected prop 'friend'");
    		}
    	}

    	get friend() {
    		throw new Error("<Friend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set friend(value) {
    		throw new Error("<Friend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\sidenav\social\Request.svelte generated by Svelte v3.46.4 */
    const file$m = "src\\sidenav\\social\\Request.svelte";

    // (23:2) <Text>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*username*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1) set_data_dev(t, /*username*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(23:2) <Text>",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Button style="icon" on:click={onAcceptFriend}>
    function create_default_slot_1$2(ctx) {
    	let fontawesome;
    	let current;
    	fontawesome = new FontAwesome({ props: { icon: "check" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(25:4) <Button style=\\\"icon\\\" on:click={onAcceptFriend}>",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Button style="icon" on:click={onDeclineFriend}>
    function create_default_slot$3(ctx) {
    	let fontawesome;
    	let current;
    	fontawesome = new FontAwesome({ props: { icon: "trash" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(28:4) <Button style=\\\"icon\\\" on:click={onDeclineFriend}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div1;
    	let text_1;
    	let t0;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*onAcceptFriend*/ ctx[1]);

    	button1 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*onDeclineFriend*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(text_1.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			create_component(button1.$$.fragment);
    			add_location(div0, file$m, 23, 2, 814);
    			attr_dev(div1, "class", "request svelte-80736m");
    			add_location(div1, file$m, 21, 0, 762);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(text_1, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t1);
    			mount_component(button1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope, username*/ 9) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(text_1);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Request', slots, []);
    	let { username } = $$props;

    	const onAcceptFriend = () => {
    		socketService.socket.emit("acceptFriend", { username });
    	};

    	const onDeclineFriend = () => {
    		socketService.socket.emit("declineFriend", { username });
    	};

    	const writable_props = ['username'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Request> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	$$self.$capture_state = () => ({
    		socketService,
    		Button,
    		FontAwesome,
    		Text,
    		username,
    		onAcceptFriend,
    		onDeclineFriend
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, onAcceptFriend, onDeclineFriend];
    }

    class Request extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { username: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Request",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[0] === undefined && !('username' in props)) {
    			console.warn("<Request> was created without expected prop 'username'");
    		}
    	}

    	get username() {
    		throw new Error("<Request>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Request>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\sidenav\social\Social.svelte generated by Svelte v3.46.4 */
    const file$l = "src\\sidenav\\social\\Social.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (44:6) <Text size="xlg">
    function create_default_slot_9(ctx) {
    	let t0;
    	let b;
    	let t1_value = /*$playerStore*/ ctx[6].social.friends.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Friends ");
    			b = element("b");
    			t1 = text(t1_value);
    			add_location(b, file$l, 43, 31, 1525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, b, anchor);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 64 && t1_value !== (t1_value = /*$playerStore*/ ctx[6].social.friends.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(44:6) <Text size=\\\"xlg\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:8) <Button style="icon" on:click={addFriendModal}>
    function create_default_slot_8(ctx) {
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "user-plus" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(46:8) <Button style=\\\"icon\\\" on:click={addFriendModal}>",
    		ctx
    	});

    	return block;
    }

    // (49:8) <Button style="icon" on:click={toggleFriends}>
    function create_default_slot_7(ctx) {
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: /*friendsToggleIcon*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fontawesome_changes = {};
    			if (dirty & /*friendsToggleIcon*/ 32) fontawesome_changes.icon = /*friendsToggleIcon*/ ctx[5];
    			fontawesome.$set(fontawesome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(49:8) <Button style=\\\"icon\\\" on:click={toggleFriends}>",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if isFriendsToggled}
    function create_if_block_4$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_transition;
    	let current;
    	const if_block_creators = [create_if_block_5, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$playerStore*/ ctx[6].social.friends.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$l, 54, 6, 1895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(54:4) {#if isFriendsToggled}",
    		ctx
    	});

    	return block;
    }

    // (60:8) {:else}
    function create_else_block_2(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(60:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#if $playerStore.social.friends.length}
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*$socialStore*/ ctx[7].friends;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$socialStore*/ 128) {
    				each_value_2 = /*$socialStore*/ ctx[7].friends;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(56:8) {#if $playerStore.social.friends.length}",
    		ctx
    	});

    	return block;
    }

    // (61:10) <Text>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("You have no friends 😭");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(61:10) <Text>",
    		ctx
    	});

    	return block;
    }

    // (57:10) {#each $socialStore.friends as friend}
    function create_each_block_2(ctx) {
    	let friend;
    	let current;

    	friend = new Friend({
    			props: { friend: /*friend*/ ctx[18] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(friend.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(friend, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const friend_changes = {};
    			if (dirty & /*$socialStore*/ 128) friend_changes.friend = /*friend*/ ctx[18];
    			friend.$set(friend_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(friend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(friend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(friend, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(57:10) {#each $socialStore.friends as friend}",
    		ctx
    	});

    	return block;
    }

    // (69:6) <Text size="xlg">
    function create_default_slot_5(ctx) {
    	let t0;
    	let b;
    	let t1_value = /*$playerStore*/ ctx[6].social.requests.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Requests ");
    			b = element("b");
    			t1 = text(t1_value);
    			add_location(b, file$l, 68, 32, 2313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, b, anchor);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 64 && t1_value !== (t1_value = /*$playerStore*/ ctx[6].social.requests.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(69:6) <Text size=\\\"xlg\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:6) <Button style="icon" on:click={toggleRequests}>
    function create_default_slot_4$1(ctx) {
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: /*requestsToggleIcon*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fontawesome_changes = {};
    			if (dirty & /*requestsToggleIcon*/ 16) fontawesome_changes.icon = /*requestsToggleIcon*/ ctx[4];
    			fontawesome.$set(fontawesome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(70:6) <Button style=\\\"icon\\\" on:click={toggleRequests}>",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#if isRequestsToggled}
    function create_if_block_2$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_transition;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$playerStore*/ ctx[6].social.requests.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$l, 74, 6, 2535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

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
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(74:4) {#if isRequestsToggled}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {:else}
    function create_else_block_1$1(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(80:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:8) {#if $playerStore.social.requests.length}
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*$playerStore*/ ctx[6].social.requests;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 64) {
    				each_value_1 = /*$playerStore*/ ctx[6].social.requests;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(76:8) {#if $playerStore.social.requests.length}",
    		ctx
    	});

    	return block;
    }

    // (81:10) <Text>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("You have no friend requests 😢");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(81:10) <Text>",
    		ctx
    	});

    	return block;
    }

    // (77:10) {#each $playerStore.social.requests as username}
    function create_each_block_1(ctx) {
    	let request;
    	let current;

    	request = new Request({
    			props: { username: /*username*/ ctx[13] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(request.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(request, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const request_changes = {};
    			if (dirty & /*$playerStore*/ 64) request_changes.username = /*username*/ ctx[13];
    			request.$set(request_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(request.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(request.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(request, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(77:10) {#each $playerStore.social.requests as username}",
    		ctx
    	});

    	return block;
    }

    // (89:6) <Text size="xlg">
    function create_default_slot_2$1(ctx) {
    	let t0;
    	let b;
    	let t1_value = /*$playerStore*/ ctx[6].social.blocked.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Blocked ");
    			b = element("b");
    			t1 = text(t1_value);
    			add_location(b, file$l, 88, 31, 2974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, b, anchor);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 64 && t1_value !== (t1_value = /*$playerStore*/ ctx[6].social.blocked.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(89:6) <Text size=\\\"xlg\\\">",
    		ctx
    	});

    	return block;
    }

    // (90:6) <Button style="icon" on:click={toggleBlocked}>
    function create_default_slot_1$1(ctx) {
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: /*blockedToggleIcon*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontawesome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontawesome, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fontawesome_changes = {};
    			if (dirty & /*blockedToggleIcon*/ 8) fontawesome_changes.icon = /*blockedToggleIcon*/ ctx[3];
    			fontawesome.$set(fontawesome_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontawesome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(90:6) <Button style=\\\"icon\\\" on:click={toggleBlocked}>",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if isBlockedToggled}
    function create_if_block$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_transition;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$playerStore*/ ctx[6].social.blocked.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$l, 94, 6, 3192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

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
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, /*transitionSlide*/ ctx[8], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(94:4) {#if isBlockedToggled}",
    		ctx
    	});

    	return block;
    }

    // (100:8) {:else}
    function create_else_block$5(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(100:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#if $playerStore.social.blocked.length}
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$playerStore*/ ctx[6].social.blocked;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$playerStore*/ 64) {
    				each_value = /*$playerStore*/ ctx[6].social.blocked;
    				validate_each_argument(each_value);
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(96:8) {#if $playerStore.social.blocked.length}",
    		ctx
    	});

    	return block;
    }

    // (101:10) <Text>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("You haven't blocked anyone yet 😊");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(101:10) <Text>",
    		ctx
    	});

    	return block;
    }

    // (97:10) {#each $playerStore.social.blocked as username}
    function create_each_block$2(ctx) {
    	let block;
    	let current;

    	block = new Block({
    			props: { username: /*username*/ ctx[13] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(block.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(block, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const block_changes = {};
    			if (dirty & /*$playerStore*/ 64) block_changes.username = /*username*/ ctx[13];
    			block.$set(block_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(block.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(block.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(block, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(97:10) {#each $playerStore.social.blocked as username}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$l(ctx) {
    	let div7;
    	let div2;
    	let div1;
    	let text0;
    	let t0;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t2;
    	let t3;
    	let div4;
    	let div3;
    	let text1;
    	let t4;
    	let button2;
    	let t5;
    	let t6;
    	let div6;
    	let div5;
    	let text2;
    	let t7;
    	let button3;
    	let t8;
    	let current;

    	text0 = new Text({
    			props: {
    				size: "xlg",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*addFriendModal*/ ctx[9]);

    	button1 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggleFriends*/ ctx[10]);
    	let if_block0 = /*isFriendsToggled*/ ctx[0] && create_if_block_4$1(ctx);

    	text1 = new Text({
    			props: {
    				size: "xlg",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*toggleRequests*/ ctx[11]);
    	let if_block1 = /*isRequestsToggled*/ ctx[1] && create_if_block_2$2(ctx);

    	text2 = new Text({
    			props: {
    				size: "xlg",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3 = new Button({
    			props: {
    				style: "icon",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*toggleBlocked*/ ctx[12]);
    	let if_block2 = /*isBlockedToggled*/ ctx[2] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(text0.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			create_component(button1.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div4 = element("div");
    			div3 = element("div");
    			create_component(text1.$$.fragment);
    			t4 = space();
    			create_component(button2.$$.fragment);
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			div6 = element("div");
    			div5 = element("div");
    			create_component(text2.$$.fragment);
    			t7 = space();
    			create_component(button3.$$.fragment);
    			t8 = space();
    			if (if_block2) if_block2.c();
    			add_location(div0, file$l, 44, 6, 1583);
    			attr_dev(div1, "class", "social__section__toolbar svelte-15vyksn");
    			add_location(div1, file$l, 42, 4, 1454);
    			attr_dev(div2, "class", "social__section svelte-15vyksn");
    			add_location(div2, file$l, 41, 2, 1419);
    			attr_dev(div3, "class", "social__section__toolbar svelte-15vyksn");
    			add_location(div3, file$l, 67, 4, 2241);
    			attr_dev(div4, "class", "social__section svelte-15vyksn");
    			add_location(div4, file$l, 66, 2, 2206);
    			attr_dev(div5, "class", "social__section__toolbar svelte-15vyksn");
    			add_location(div5, file$l, 87, 4, 2903);
    			attr_dev(div6, "class", "social__section svelte-15vyksn");
    			add_location(div6, file$l, 86, 2, 2868);
    			attr_dev(div7, "class", "social svelte-15vyksn");
    			add_location(div7, file$l, 39, 0, 1393);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div2);
    			append_dev(div2, div1);
    			mount_component(text0, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t1);
    			mount_component(button1, div0, null);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div7, t3);
    			append_dev(div7, div4);
    			append_dev(div4, div3);
    			mount_component(text1, div3, null);
    			append_dev(div3, t4);
    			mount_component(button2, div3, null);
    			append_dev(div4, t5);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			mount_component(text2, div5, null);
    			append_dev(div5, t7);
    			mount_component(button3, div5, null);
    			append_dev(div6, t8);
    			if (if_block2) if_block2.m(div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const text0_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 2097216) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope, friendsToggleIcon*/ 2097184) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*isFriendsToggled*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isFriendsToggled*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const text1_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 2097216) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope, requestsToggleIcon*/ 2097168) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (/*isRequestsToggled*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isRequestsToggled*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const text2_changes = {};

    			if (dirty & /*$$scope, $playerStore*/ 2097216) {
    				text2_changes.$$scope = { dirty, ctx };
    			}

    			text2.$set(text2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope, blockedToggleIcon*/ 2097160) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);

    			if (/*isBlockedToggled*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*isBlockedToggled*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div6, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(text1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(text2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(text1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(text2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(text0);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (if_block0) if_block0.d();
    			destroy_component(text1);
    			destroy_component(button2);
    			if (if_block1) if_block1.d();
    			destroy_component(text2);
    			destroy_component(button3);
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let friendsToggleIcon;
    	let requestsToggleIcon;
    	let blockedToggleIcon;
    	let $playerStore;
    	let $socialStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(6, $playerStore = $$value));
    	validate_store(socialStore, 'socialStore');
    	component_subscribe($$self, socialStore, $$value => $$invalidate(7, $socialStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Social', slots, []);
    	let isFriendsToggled = true;
    	let isRequestsToggled = false;
    	let isBlockedToggled = false;
    	const transitionSlide = { duration: 333, easing: quadInOut };

    	const addFriendModal = () => {
    		miscService.openModal("addFriend");
    	};

    	const toggleFriends = () => {
    		$$invalidate(0, isFriendsToggled = !isFriendsToggled);
    	};

    	const toggleRequests = () => {
    		$$invalidate(1, isRequestsToggled = !isRequestsToggled);
    	};

    	const toggleBlocked = () => {
    		$$invalidate(2, isBlockedToggled = !isBlockedToggled);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		quadInOut,
    		slide,
    		miscService,
    		playerStore,
    		socialStore,
    		Button,
    		FontAwesome,
    		Text,
    		Block,
    		Friend,
    		Request,
    		isFriendsToggled,
    		isRequestsToggled,
    		isBlockedToggled,
    		transitionSlide,
    		addFriendModal,
    		toggleFriends,
    		toggleRequests,
    		toggleBlocked,
    		blockedToggleIcon,
    		requestsToggleIcon,
    		friendsToggleIcon,
    		$playerStore,
    		$socialStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFriendsToggled' in $$props) $$invalidate(0, isFriendsToggled = $$props.isFriendsToggled);
    		if ('isRequestsToggled' in $$props) $$invalidate(1, isRequestsToggled = $$props.isRequestsToggled);
    		if ('isBlockedToggled' in $$props) $$invalidate(2, isBlockedToggled = $$props.isBlockedToggled);
    		if ('blockedToggleIcon' in $$props) $$invalidate(3, blockedToggleIcon = $$props.blockedToggleIcon);
    		if ('requestsToggleIcon' in $$props) $$invalidate(4, requestsToggleIcon = $$props.requestsToggleIcon);
    		if ('friendsToggleIcon' in $$props) $$invalidate(5, friendsToggleIcon = $$props.friendsToggleIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isFriendsToggled*/ 1) {
    			$$invalidate(5, friendsToggleIcon = isFriendsToggled ? "chevron-up" : "chevron-down");
    		}

    		if ($$self.$$.dirty & /*isRequestsToggled*/ 2) {
    			$$invalidate(4, requestsToggleIcon = isRequestsToggled ? "chevron-up" : "chevron-down");
    		}

    		if ($$self.$$.dirty & /*isBlockedToggled*/ 4) {
    			$$invalidate(3, blockedToggleIcon = isBlockedToggled ? "chevron-up" : "chevron-down");
    		}
    	};

    	return [
    		isFriendsToggled,
    		isRequestsToggled,
    		isBlockedToggled,
    		blockedToggleIcon,
    		requestsToggleIcon,
    		friendsToggleIcon,
    		$playerStore,
    		$socialStore,
    		transitionSlide,
    		addFriendModal,
    		toggleFriends,
    		toggleRequests,
    		toggleBlocked
    	];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\sidenav\Sidenav.svelte generated by Svelte v3.46.4 */
    const file$k = "src\\sidenav\\Sidenav.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let player;
    	let t0;
    	let social;
    	let t1;
    	let footer;
    	let current;
    	player = new Player$1({ $$inline: true });
    	social = new Social({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(player.$$.fragment);
    			t0 = space();
    			create_component(social.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "sidenav svelte-1fojnyc");
    			add_location(div, file$k, 14, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(player, div, null);
    			append_dev(div, t0);
    			mount_component(social, div, null);
    			append_dev(div, t1);
    			mount_component(footer, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			transition_in(social.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(player);
    			destroy_component(social);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidenav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidenav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Footer, Player: Player$1, Social });
    	return [];
    }

    class Sidenav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidenav",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\game\opponent\OpponentDeck.svelte generated by Svelte v3.46.4 */
    const file$j = "src\\game\\opponent\\OpponentDeck.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let span;
    	let t0_value = /*$gameStore*/ ctx[0].opponent.deck + "";
    	let t0;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" / 30");
    			t2 = space();
    			img = element("img");
    			attr_dev(span, "class", "deck__cards svelte-td7s2i");
    			add_location(span, file$j, 19, 2, 334);
    			attr_dev(img, "class", "deck__img svelte-td7s2i");
    			if (!src_url_equal(img.src, img_src_value = "assets/card-backs/default.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Deck");
    			add_location(img, file$j, 20, 2, 402);
    			attr_dev(div, "class", "deck svelte-td7s2i");
    			add_location(div, file$j, 18, 0, 312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*$gameStore*/ ctx[0].opponent.deck + "")) set_data_dev(t0, t0_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentDeck', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentDeck> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ gameStore, $gameStore });
    	return [$gameStore];
    }

    class OpponentDeck extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentDeck",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\ui\CardSm.svelte generated by Svelte v3.46.4 */
    const file$i = "src\\ui\\CardSm.svelte";

    // (154:6) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "att svelte-16vspcj");
    			if (!src_url_equal(img.src, img_src_value = "assets/attrs/trap.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Trap");
    			add_location(img, file$i, 154, 8, 3267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(154:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (152:45) 
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "att svelte-16vspcj");
    			if (!src_url_equal(img.src, img_src_value = "assets/attrs/magic.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Magic");
    			add_location(img, file$i, 152, 8, 3183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(152:45) ",
    		ctx
    	});

    	return block;
    }

    // (150:6) {#if card.type === CardType.MINION}
    function create_if_block_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "att svelte-16vspcj");
    			if (!src_url_equal(img.src, img_src_value = "assets/attrs/minion.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Minion");
    			add_location(img, file$i, 150, 8, 3065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(150:6) {#if card.type === CardType.MINION}",
    		ctx
    	});

    	return block;
    }

    // (159:8) <Text color="purple" size="xsm">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Passive:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(159:8) <Text color=\\\"purple\\\" size=\\\"xsm\\\">",
    		ctx
    	});

    	return block;
    }

    // (165:8) {:else}
    function create_else_block$4(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				size: "sm",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(165:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (161:8) {#if card.klass !== CardKlass.NEUTRAL}
    function create_if_block_2$1(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				size: "sm",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope, card*/ 32769) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(161:8) {#if card.klass !== CardKlass.NEUTRAL}",
    		ctx
    	});

    	return block;
    }

    // (166:10) <Text size="sm">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No passive.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(166:10) <Text size=\\\"sm\\\">",
    		ctx
    	});

    	return block;
    }

    // (162:10) <Text size="sm">
    function create_default_slot_2(ctx) {
    	let html_tag;
    	let raw_value = passives.find(/*func*/ ctx[12]).text + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 1 && raw_value !== (raw_value = passives.find(/*func*/ ctx[12]).text + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(162:10) <Text size=\\\"sm\\\">",
    		ctx
    	});

    	return block;
    }

    // (169:8) <Text color="green" size="xsm">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Effect:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(169:8) <Text color=\\\"green\\\" size=\\\"xsm\\\">",
    		ctx
    	});

    	return block;
    }

    // (171:8) <Text size="sm">
    function create_default_slot$1(ctx) {
    	let html_tag;
    	let raw_value = /*card*/ ctx[0].effect + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 1 && raw_value !== (raw_value = /*card*/ ctx[0].effect + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(171:8) <Text size=\\\"sm\\\">",
    		ctx
    	});

    	return block;
    }

    // (182:2) {#if isHealthBarVisible}
    function create_if_block_1$2(ctx) {
    	let div;
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				progress: /*health*/ ctx[1] / /*card*/ ctx[0].health * 100,
    				color: "green"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			attr_dev(div, "class", "card__bar svelte-16vspcj");
    			add_location(div, file$i, 182, 4, 4133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*health, card*/ 3) progressbar_changes.progress = /*health*/ ctx[1] / /*card*/ ctx[0].health * 100;
    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(182:2) {#if isHealthBarVisible}",
    		ctx
    	});

    	return block;
    }

    // (193:4) {#if card.type === CardType.MINION}
    function create_if_block$8(ctx) {
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let span0;
    	let t1_value = (/*health*/ ctx[1] || /*card*/ ctx[0].health) + "";
    	let t1;
    	let t2;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let span1;
    	let t4_value = (/*damage*/ ctx[2] || /*card*/ ctx[0].damage) + "";
    	let t4;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t3 = space();
    			span1 = element("span");
    			t4 = text(t4_value);
    			attr_dev(img0, "class", "stat__img svelte-16vspcj");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/attrs/health.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Health");
    			add_location(img0, file$i, 194, 8, 4554);
    			attr_dev(span0, "class", "stat__text svelte-16vspcj");
    			add_location(span0, file$i, 195, 8, 4631);
    			attr_dev(div0, "class", "stat stat__health svelte-16vspcj");
    			add_location(div0, file$i, 193, 6, 4513);
    			attr_dev(img1, "class", "stat__img svelte-16vspcj");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/attrs/damage.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Damage");
    			add_location(img1, file$i, 198, 8, 4749);
    			attr_dev(span1, "class", "stat__text svelte-16vspcj");
    			add_location(span1, file$i, 199, 8, 4826);
    			attr_dev(div1, "class", "stat stat__damage svelte-16vspcj");
    			add_location(div1, file$i, 197, 6, 4708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img1);
    			append_dev(div1, t3);
    			append_dev(div1, span1);
    			append_dev(span1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*health, card*/ 3 && t1_value !== (t1_value = (/*health*/ ctx[1] || /*card*/ ctx[0].health) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*damage, card*/ 5 && t4_value !== (t4_value = (/*damage*/ ctx[2] || /*card*/ ctx[0].damage) + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(193:4) {#if card.type === CardType.MINION}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div5;
    	let div2;
    	let div1;
    	let t0;
    	let div0;
    	let text0;
    	let t1;
    	let br0;
    	let t2;
    	let current_block_type_index;
    	let if_block1;
    	let t3;
    	let hr;
    	let t4;
    	let text1;
    	let t5;
    	let br1;
    	let t6;
    	let text2;
    	let t7;
    	let span0;
    	let t8_value = /*card*/ ctx[0].name + "";
    	let t8;
    	let t9;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t10;
    	let t11;
    	let div4;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t12;
    	let span1;
    	let t13_value = /*card*/ ctx[0].manaCost + "";
    	let t13;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*card*/ ctx[0].type === CardType.MINION) return create_if_block_3;
    		if (/*card*/ ctx[0].type === CardType.MAGIC) return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	text0 = new Text({
    			props: {
    				color: "purple",
    				size: "xsm",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_2$1, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*card*/ ctx[0].klass !== CardKlass.NEUTRAL) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	text1 = new Text({
    			props: {
    				color: "green",
    				size: "xsm",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text2 = new Text({
    			props: {
    				size: "sm",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block2 = /*isHealthBarVisible*/ ctx[3] && create_if_block_1$2(ctx);
    	let if_block3 = /*card*/ ctx[0].type === CardType.MINION && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(text0.$$.fragment);
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			if_block1.c();
    			t3 = space();
    			hr = element("hr");
    			t4 = space();
    			create_component(text1.$$.fragment);
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			create_component(text2.$$.fragment);
    			t7 = space();
    			span0 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			img0 = element("img");
    			t10 = space();
    			if (if_block2) if_block2.c();
    			t11 = space();
    			div4 = element("div");
    			div3 = element("div");
    			img1 = element("img");
    			t12 = space();
    			span1 = element("span");
    			t13 = text(t13_value);
    			t14 = space();
    			if (if_block3) if_block3.c();
    			add_location(br0, file$i, 159, 8, 3463);
    			add_location(hr, file$i, 167, 8, 3734);
    			add_location(br1, file$i, 169, 8, 3804);
    			attr_dev(div0, "class", "tooltip2 svelte-16vspcj");
    			add_location(div0, file$i, 157, 6, 3347);
    			attr_dev(div1, "class", "stat__type svelte-16vspcj");
    			add_location(div1, file$i, 147, 4, 2954);
    			attr_dev(span0, "class", "svelte-16vspcj");
    			toggle_class(span0, "isNeutral", /*isNeutral*/ ctx[6]);
    			toggle_class(span0, "isSolid", /*isSolid*/ ctx[7]);
    			toggle_class(span0, "isLiquid", /*isLiquid*/ ctx[8]);
    			toggle_class(span0, "isGas", /*isGas*/ ctx[9]);
    			toggle_class(span0, "isPlasma", /*isPlasma*/ ctx[10]);
    			add_location(span0, file$i, 175, 4, 3897);
    			attr_dev(div2, "class", "card__header svelte-16vspcj");
    			add_location(div2, file$i, 145, 2, 2920);
    			attr_dev(img0, "class", "card__img svelte-16vspcj");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*card*/ ctx[0].name);
    			add_location(img0, file$i, 179, 2, 4011);
    			attr_dev(img1, "class", "stat__img svelte-16vspcj");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/attrs/manacost.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Mana Cost");
    			add_location(img1, file$i, 189, 6, 4325);
    			attr_dev(span1, "class", "stat__text svelte-16vspcj");
    			add_location(span1, file$i, 190, 6, 4405);
    			attr_dev(div3, "class", "stat stat__mana svelte-16vspcj");
    			add_location(div3, file$i, 188, 4, 4288);
    			attr_dev(div4, "class", "card__attrs svelte-16vspcj");
    			add_location(div4, file$i, 187, 2, 4257);
    			attr_dev(div5, "class", "card svelte-16vspcj");
    			toggle_class(div5, "rotated", /*isFlipped*/ ctx[4]);
    			add_location(div5, file$i, 144, 0, 2872);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(text0, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, hr);
    			append_dev(div0, t4);
    			mount_component(text1, div0, null);
    			append_dev(div0, t5);
    			append_dev(div0, br1);
    			append_dev(div0, t6);
    			mount_component(text2, div0, null);
    			/*div0_binding*/ ctx[13](div0);
    			append_dev(div2, t7);
    			append_dev(div2, span0);
    			append_dev(span0, t8);
    			append_dev(div5, t9);
    			append_dev(div5, img0);
    			append_dev(div5, t10);
    			if (if_block2) if_block2.m(div5, null);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t12);
    			append_dev(div3, span1);
    			append_dev(span1, t13);
    			append_dev(div4, t14);
    			if (if_block3) if_block3.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "mousemove", /*passiveMouseMove*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			}

    			const text0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				text0_changes.$$scope = { dirty, ctx };
    			}

    			text0.$set(text0_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, t3);
    			}

    			const text1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				text1_changes.$$scope = { dirty, ctx };
    			}

    			text1.$set(text1_changes);
    			const text2_changes = {};

    			if (dirty & /*$$scope, card*/ 32769) {
    				text2_changes.$$scope = { dirty, ctx };
    			}

    			text2.$set(text2_changes);
    			if ((!current || dirty & /*card*/ 1) && t8_value !== (t8_value = /*card*/ ctx[0].name + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*card*/ 1 && !src_url_equal(img0.src, img0_src_value = "assets/cards/" + /*card*/ ctx[0].klass + "/" + /*card*/ ctx[0].id + ".jpg")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (!current || dirty & /*card*/ 1 && img0_alt_value !== (img0_alt_value = /*card*/ ctx[0].name)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (/*isHealthBarVisible*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*isHealthBarVisible*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div5, t11);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*card*/ 1) && t13_value !== (t13_value = /*card*/ ctx[0].manaCost + "")) set_data_dev(t13, t13_value);

    			if (/*card*/ ctx[0].type === CardType.MINION) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$8(ctx);
    					if_block3.c();
    					if_block3.m(div4, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*isFlipped*/ 16) {
    				toggle_class(div5, "rotated", /*isFlipped*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text0.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(text1.$$.fragment, local);
    			transition_in(text2.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text0.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(text1.$$.fragment, local);
    			transition_out(text2.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block0.d();
    			destroy_component(text0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(text1);
    			destroy_component(text2);
    			/*div0_binding*/ ctx[13](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardSm', slots, []);
    	let isFlipped = false, passiveTooltip;
    	let { card, health, damage, isHealthBarVisible = false } = $$props;
    	let isNeutral = card.klass === CardKlass.NEUTRAL;
    	let isSolid = card.klass === CardKlass.SOLID;
    	let isLiquid = card.klass === CardKlass.LIQUID;
    	let isGas = card.klass === CardKlass.GAS;
    	let isPlasma = card.klass === CardKlass.PLASMA;

    	const flip = () => {
    		$$invalidate(4, isFlipped = !isFlipped);
    	};

    	const passiveMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		$$invalidate(5, passiveTooltip.style.top = `calc(24px + ${offsetY}px)`, passiveTooltip);
    		$$invalidate(5, passiveTooltip.style.left = `calc(-12px + ${offsetX}px)`, passiveTooltip);
    	};

    	const writable_props = ['card', 'health', 'damage', 'isHealthBarVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardSm> was created with unknown prop '${key}'`);
    	});

    	const func = passive => passive.klass === card.klass;

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			passiveTooltip = $$value;
    			$$invalidate(5, passiveTooltip);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('damage' in $$props) $$invalidate(2, damage = $$props.damage);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    	};

    	$$self.$capture_state = () => ({
    		CardType,
    		CardKlass,
    		passives,
    		ProgressBar,
    		Text,
    		Img,
    		card,
    		health,
    		damage,
    		isFlipped,
    		isHealthBarVisible,
    		passiveTooltip,
    		isNeutral,
    		isSolid,
    		isLiquid,
    		isGas,
    		isPlasma,
    		flip,
    		passiveMouseMove
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('damage' in $$props) $$invalidate(2, damage = $$props.damage);
    		if ('isFlipped' in $$props) $$invalidate(4, isFlipped = $$props.isFlipped);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('passiveTooltip' in $$props) $$invalidate(5, passiveTooltip = $$props.passiveTooltip);
    		if ('isNeutral' in $$props) $$invalidate(6, isNeutral = $$props.isNeutral);
    		if ('isSolid' in $$props) $$invalidate(7, isSolid = $$props.isSolid);
    		if ('isLiquid' in $$props) $$invalidate(8, isLiquid = $$props.isLiquid);
    		if ('isGas' in $$props) $$invalidate(9, isGas = $$props.isGas);
    		if ('isPlasma' in $$props) $$invalidate(10, isPlasma = $$props.isPlasma);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		card,
    		health,
    		damage,
    		isHealthBarVisible,
    		isFlipped,
    		passiveTooltip,
    		isNeutral,
    		isSolid,
    		isLiquid,
    		isGas,
    		isPlasma,
    		passiveMouseMove,
    		func,
    		div0_binding
    	];
    }

    class CardSm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			card: 0,
    			health: 1,
    			damage: 2,
    			isHealthBarVisible: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardSm",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<CardSm> was created without expected prop 'card'");
    		}

    		if (/*health*/ ctx[1] === undefined && !('health' in props)) {
    			console.warn("<CardSm> was created without expected prop 'health'");
    		}

    		if (/*damage*/ ctx[2] === undefined && !('damage' in props)) {
    			console.warn("<CardSm> was created without expected prop 'damage'");
    		}
    	}

    	get card() {
    		throw new Error("<CardSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<CardSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<CardSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<CardSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damage() {
    		throw new Error("<CardSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damage(value) {
    		throw new Error("<CardSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHealthBarVisible() {
    		throw new Error("<CardSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHealthBarVisible(value) {
    		throw new Error("<CardSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\game\opponent\OpponentGraveyard.svelte generated by Svelte v3.46.4 */
    const file$h = "src\\game\\opponent\\OpponentGraveyard.svelte";

    // (28:2) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Graveyard");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(28:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if $gameStore.opponent.graveyard.length}
    function create_if_block$7(ctx) {
    	let cardsm;
    	let current;

    	cardsm = new CardSm({
    			props: {
    				card: cards.find(/*func*/ ctx[2]),
    				health: 10,
    				damage: 10
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsm.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsm, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardsm_changes = {};
    			if (dirty & /*$gameStore*/ 1) cardsm_changes.card = cards.find(/*func*/ ctx[2]);
    			cardsm.$set(cardsm_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsm, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(22:2) {#if $gameStore.opponent.graveyard.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gameStore*/ ctx[0].opponent.graveyard.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "graveyard svelte-c5o0s3");
    			add_location(div, file$h, 20, 0, 523);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onViewGraveyard*/ ctx[1], false, false, false);
    				mounted = true;
    			}
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
    				if_block.m(div, null);
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
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentGraveyard', slots, []);

    	const onViewGraveyard = () => {
    		miscService.openModal("graveyard", $gameStore.opponent.graveyard);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentGraveyard> was created with unknown prop '${key}'`);
    	});

    	const func = card => card.id === $gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1].id;

    	$$self.$capture_state = () => ({
    		cards,
    		miscService,
    		gameStore,
    		CardSm,
    		onViewGraveyard,
    		$gameStore
    	});

    	return [$gameStore, onViewGraveyard, func];
    }

    class OpponentGraveyard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentGraveyard",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\game\opponent\OpponentHandCards.svelte generated by Svelte v3.46.4 */
    const file$g = "src\\game\\opponent\\OpponentHandCards.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (28:2) {#each Array($gameStore.opponent.hand) as _}
    function create_each_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			attr_dev(img, "class", "player__deck__img svelte-7fir7k");
    			if (!src_url_equal(img.src, img_src_value = "assets/card-backs/default.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$g, 29, 6, 585);
    			attr_dev(div, "class", "player__hand__card svelte-7fir7k");
    			add_location(div, file$g, 28, 4, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(28:2) {#each Array($gameStore.opponent.hand) as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let each_value = Array(/*$gameStore*/ ctx[0].opponent.hand);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "player__hand svelte-7fir7k");
    			add_location(div, file$g, 26, 0, 465);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore*/ 1) {
    				const old_length = each_value.length;
    				each_value = Array(/*$gameStore*/ ctx[0].opponent.hand);
    				validate_each_argument(each_value);
    				let i;

    				for (i = old_length; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (!each_blocks[i]) {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (i = each_value.length; i < old_length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentHandCards', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentHandCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ gameStore, $gameStore });
    	return [$gameStore];
    }

    class OpponentHandCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentHandCards",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\ui\HeroSm.svelte generated by Svelte v3.46.4 */
    const file$f = "src\\ui\\HeroSm.svelte";

    // (158:2) {#if isHealthBarVisible}
    function create_if_block_1$1(ctx) {
    	let div;
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				size: "md",
    				progress: /*health*/ ctx[1] / /*hero*/ ctx[0].health * 100,
    				color: "green"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			attr_dev(div, "class", "card__bar svelte-1819kqf");
    			add_location(div, file$f, 158, 4, 4060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*health, hero*/ 3) progressbar_changes.progress = /*health*/ ctx[1] / /*hero*/ ctx[0].health * 100;
    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(158:2) {#if isHealthBarVisible}",
    		ctx
    	});

    	return block;
    }

    // (163:2) {#if isManaBarVisible}
    function create_if_block$6(ctx) {
    	let div;
    	let progressbar;
    	let current;

    	progressbar = new ProgressBar({
    			props: {
    				size: "sm",
    				progress: /*mana*/ ctx[2] / /*hero*/ ctx[0].mana * 100,
    				color: "blue"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(progressbar.$$.fragment);
    			attr_dev(div, "class", "card__manabar svelte-1819kqf");
    			add_location(div, file$f, 163, 4, 4220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(progressbar, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const progressbar_changes = {};
    			if (dirty & /*mana, hero*/ 5) progressbar_changes.progress = /*mana*/ ctx[2] / /*hero*/ ctx[0].mana * 100;
    			progressbar.$set(progressbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(progressbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(163:2) {#if isManaBarVisible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div8;
    	let div3;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let p0;
    	let raw0_value = /*hero*/ ctx[0].passive.info + "";
    	let t1;
    	let hr;
    	let t2;
    	let p1;
    	let raw1_value = /*hero*/ ctx[0].active.info + "";
    	let t3;
    	let div2;
    	let t4_value = /*hero*/ ctx[0].name + "";
    	let t4;
    	let t5;
    	let img1;
    	let img1_src_value;
    	let img1_alt_value;
    	let t6;
    	let t7;
    	let t8;
    	let div7;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t9;
    	let span0;
    	let t10_value = (/*mana*/ ctx[2] || /*hero*/ ctx[0].mana) + "";
    	let t10;
    	let t11;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let span1;
    	let t13_value = (/*health*/ ctx[1] || /*hero*/ ctx[0].health) + "";
    	let t13;
    	let t14;
    	let div6;
    	let img4;
    	let img4_src_value;
    	let t15;
    	let span2;
    	let t16_value = /*hero*/ ctx[0].damage + "";
    	let t16;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isHealthBarVisible*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block1 = /*isManaBarVisible*/ ctx[4] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			p1 = element("p");
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			img1 = element("img");
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();
    			div7 = element("div");
    			div4 = element("div");
    			img2 = element("img");
    			t9 = space();
    			span0 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t12 = space();
    			span1 = element("span");
    			t13 = text(t13_value);
    			t14 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t15 = space();
    			span2 = element("span");
    			t16 = text(t16_value);
    			attr_dev(img0, "class", "stat__img svelte-1819kqf");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/attrs/hero.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Hero");
    			add_location(img0, file$f, 143, 6, 3650);
    			add_location(p0, file$f, 146, 8, 3781);
    			add_location(hr, file$f, 147, 8, 3823);
    			add_location(p1, file$f, 148, 8, 3838);
    			attr_dev(div0, "class", "tooltip svelte-1819kqf");
    			add_location(div0, file$f, 145, 6, 3723);
    			attr_dev(div1, "class", "stat stat__type svelte-1819kqf");
    			add_location(div1, file$f, 142, 4, 3581);
    			add_location(div2, file$f, 152, 4, 3903);
    			attr_dev(div3, "class", "card__header svelte-1819kqf");
    			add_location(div3, file$f, 141, 2, 3549);
    			attr_dev(img1, "class", "card__img svelte-1819kqf");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/classes/" + /*hero*/ ctx[0].klass + "_hero.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", img1_alt_value = /*hero*/ ctx[0].name);
    			add_location(img1, file$f, 155, 2, 3941);
    			attr_dev(img2, "class", "stat__img svelte-1819kqf");
    			if (!src_url_equal(img2.src, img2_src_value = "assets/attrs/mana.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Mana Capacity");
    			add_location(img2, file$f, 171, 6, 4423);
    			attr_dev(span0, "class", "stat__text svelte-1819kqf");
    			add_location(span0, file$f, 172, 6, 4503);
    			attr_dev(div4, "class", "stat stat__mana svelte-1819kqf");
    			add_location(div4, file$f, 170, 4, 4386);
    			attr_dev(img3, "class", "stat__img svelte-1819kqf");
    			if (!src_url_equal(img3.src, img3_src_value = "assets/attrs/health.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Health");
    			add_location(img3, file$f, 176, 6, 4613);
    			attr_dev(span1, "class", "stat__text svelte-1819kqf");
    			add_location(span1, file$f, 177, 6, 4688);
    			attr_dev(div5, "class", "stat stat__health svelte-1819kqf");
    			add_location(div5, file$f, 175, 4, 4574);
    			attr_dev(img4, "class", "stat__img svelte-1819kqf");
    			if (!src_url_equal(img4.src, img4_src_value = "assets/attrs/damage.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Damage");
    			add_location(img4, file$f, 181, 6, 4802);
    			attr_dev(span2, "class", "stat__text svelte-1819kqf");
    			add_location(span2, file$f, 182, 6, 4877);
    			attr_dev(div6, "class", "stat stat__damage svelte-1819kqf");
    			add_location(div6, file$f, 180, 4, 4763);
    			attr_dev(div7, "class", "card__attrs svelte-1819kqf");
    			add_location(div7, file$f, 168, 2, 4353);
    			attr_dev(div8, "class", "card svelte-1819kqf");
    			add_location(div8, file$f, 139, 0, 3525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div3);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			p0.innerHTML = raw0_value;
    			append_dev(div0, t1);
    			append_dev(div0, hr);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			p1.innerHTML = raw1_value;
    			/*div0_binding*/ ctx[7](div0);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div8, t5);
    			append_dev(div8, img1);
    			append_dev(div8, t6);
    			if (if_block0) if_block0.m(div8, null);
    			append_dev(div8, t7);
    			if (if_block1) if_block1.m(div8, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t9);
    			append_dev(div4, span0);
    			append_dev(span0, t10);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t12);
    			append_dev(div5, span1);
    			append_dev(span1, t13);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, img4);
    			append_dev(div6, t15);
    			append_dev(div6, span2);
    			append_dev(span2, t16);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "mousemove", /*passiveMouseMove*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*hero*/ 1) && raw0_value !== (raw0_value = /*hero*/ ctx[0].passive.info + "")) p0.innerHTML = raw0_value;			if ((!current || dirty & /*hero*/ 1) && raw1_value !== (raw1_value = /*hero*/ ctx[0].active.info + "")) p1.innerHTML = raw1_value;			if ((!current || dirty & /*hero*/ 1) && t4_value !== (t4_value = /*hero*/ ctx[0].name + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*hero*/ 1 && !src_url_equal(img1.src, img1_src_value = "assets/classes/" + /*hero*/ ctx[0].klass + "_hero.jpg")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*hero*/ 1 && img1_alt_value !== (img1_alt_value = /*hero*/ ctx[0].name)) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if (/*isHealthBarVisible*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isHealthBarVisible*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div8, t7);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isManaBarVisible*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isManaBarVisible*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div8, t8);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*mana, hero*/ 5) && t10_value !== (t10_value = (/*mana*/ ctx[2] || /*hero*/ ctx[0].mana) + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*health, hero*/ 3) && t13_value !== (t13_value = (/*health*/ ctx[1] || /*hero*/ ctx[0].health) + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*hero*/ 1) && t16_value !== (t16_value = /*hero*/ ctx[0].damage + "")) set_data_dev(t16, t16_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			/*div0_binding*/ ctx[7](null);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeroSm', slots, []);
    	let { hero } = $$props;
    	let { health = hero.health } = $$props;
    	let { mana = hero.health } = $$props;
    	let { isHealthBarVisible = false } = $$props;
    	let { isManaBarVisible = false } = $$props;
    	let abilityTooltip;
    	let passiveTooltip;
    	let damageTooltip;
    	let manaTooltip;
    	var heroKlass;

    	(function (heroKlass) {
    		heroKlass[heroKlass["SOLID"] = 1] = "SOLID";
    		heroKlass[heroKlass["LIQUID"] = 2] = "LIQUID";
    		heroKlass[heroKlass["GAS"] = 3] = "GAS";
    		heroKlass[heroKlass["PLASMA"] = 4] = "PLASMA";
    	})(heroKlass || (heroKlass = {}));

    	const abilityMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		abilityTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		abilityTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const passiveMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		$$invalidate(5, passiveTooltip.style.bottom = `calc(48px + ${-offsetY}px)`, passiveTooltip);
    		$$invalidate(5, passiveTooltip.style.left = `calc(-80px + ${offsetX}px)`, passiveTooltip);
    	};

    	const damageMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		damageTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		damageTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const manaMouseMove = event => {
    		const { offsetX, offsetY } = event;
    		manaTooltip.style.bottom = `calc(64px + ${-offsetY}px)`;
    		manaTooltip.style.left = `calc(-80px + ${offsetX}px)`;
    	};

    	const writable_props = ['hero', 'health', 'mana', 'isHealthBarVisible', 'isManaBarVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HeroSm> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			passiveTooltip = $$value;
    			$$invalidate(5, passiveTooltip);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('hero' in $$props) $$invalidate(0, hero = $$props.hero);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('mana' in $$props) $$invalidate(2, mana = $$props.mana);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('isManaBarVisible' in $$props) $$invalidate(4, isManaBarVisible = $$props.isManaBarVisible);
    	};

    	$$self.$capture_state = () => ({
    		ProgressBar,
    		Text,
    		Img,
    		hero,
    		health,
    		mana,
    		isHealthBarVisible,
    		isManaBarVisible,
    		abilityTooltip,
    		passiveTooltip,
    		damageTooltip,
    		manaTooltip,
    		heroKlass,
    		abilityMouseMove,
    		passiveMouseMove,
    		damageMouseMove,
    		manaMouseMove
    	});

    	$$self.$inject_state = $$props => {
    		if ('hero' in $$props) $$invalidate(0, hero = $$props.hero);
    		if ('health' in $$props) $$invalidate(1, health = $$props.health);
    		if ('mana' in $$props) $$invalidate(2, mana = $$props.mana);
    		if ('isHealthBarVisible' in $$props) $$invalidate(3, isHealthBarVisible = $$props.isHealthBarVisible);
    		if ('isManaBarVisible' in $$props) $$invalidate(4, isManaBarVisible = $$props.isManaBarVisible);
    		if ('abilityTooltip' in $$props) abilityTooltip = $$props.abilityTooltip;
    		if ('passiveTooltip' in $$props) $$invalidate(5, passiveTooltip = $$props.passiveTooltip);
    		if ('damageTooltip' in $$props) damageTooltip = $$props.damageTooltip;
    		if ('manaTooltip' in $$props) manaTooltip = $$props.manaTooltip;
    		if ('heroKlass' in $$props) heroKlass = $$props.heroKlass;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hero,
    		health,
    		mana,
    		isHealthBarVisible,
    		isManaBarVisible,
    		passiveTooltip,
    		passiveMouseMove,
    		div0_binding
    	];
    }

    class HeroSm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			hero: 0,
    			health: 1,
    			mana: 2,
    			isHealthBarVisible: 3,
    			isManaBarVisible: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeroSm",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hero*/ ctx[0] === undefined && !('hero' in props)) {
    			console.warn("<HeroSm> was created without expected prop 'hero'");
    		}
    	}

    	get hero() {
    		throw new Error("<HeroSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hero(value) {
    		throw new Error("<HeroSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<HeroSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<HeroSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mana() {
    		throw new Error("<HeroSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mana(value) {
    		throw new Error("<HeroSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHealthBarVisible() {
    		throw new Error("<HeroSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHealthBarVisible(value) {
    		throw new Error("<HeroSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isManaBarVisible() {
    		throw new Error("<HeroSm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isManaBarVisible(value) {
    		throw new Error("<HeroSm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\game\opponent\OpponentHero.svelte generated by Svelte v3.46.4 */
    const file$e = "src\\game\\opponent\\OpponentHero.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let hero;
    	let current;
    	let mounted;
    	let dispose;

    	hero = new HeroSm({
    			props: {
    				hero: heroes.find(/*func*/ ctx[2]),
    				health: /*$gameStore*/ ctx[0].opponent.hero.health,
    				mana: /*$gameStore*/ ctx[0].opponent.hero.mana,
    				isHealthBarVisible: true,
    				isManaBarVisible: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(hero.$$.fragment);
    			attr_dev(div, "class", "hero svelte-smw579");
    			add_location(div, file$e, 22, 0, 599);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(hero, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onAttackHero*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const hero_changes = {};
    			if (dirty & /*$gameStore*/ 1) hero_changes.hero = heroes.find(/*func*/ ctx[2]);
    			if (dirty & /*$gameStore*/ 1) hero_changes.health = /*$gameStore*/ ctx[0].opponent.hero.health;
    			if (dirty & /*$gameStore*/ 1) hero_changes.mana = /*$gameStore*/ ctx[0].opponent.hero.mana;
    			hero.$set(hero_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(hero);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $playerStore;
    	let $gameStore;
    	let $selectedCardStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(3, $playerStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(4, $selectedCardStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentHero', slots, []);

    	const onAttackHero = () => {
    		const attacker = $selectedCardStore.field;

    		if ($gameStore.currentPlayer !== $playerStore.username) {
    			return;
    		}

    		if (!attacker) {
    			return;
    		}

    		socketService.socket.emit("attackHero", { attacker });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentHero> was created with unknown prop '${key}'`);
    	});

    	const func = hero => hero.klass === $gameStore.opponent.hero.id;

    	$$self.$capture_state = () => ({
    		heroes,
    		socketService,
    		gameStore,
    		selectedCardStore,
    		playerStore,
    		Hero: HeroSm,
    		onAttackHero,
    		$playerStore,
    		$gameStore,
    		$selectedCardStore
    	});

    	return [$gameStore, onAttackHero, func];
    }

    class OpponentHero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentHero",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\game\opponent\OpponentMagicField.svelte generated by Svelte v3.46.4 */
    const file$d = "src\\game\\opponent\\OpponentMagicField.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Magic Field";
    			attr_dev(span, "class", "f--green");
    			add_location(span, file$d, 21, 2, 448);
    			attr_dev(div, "class", "field svelte-1oeesi2");
    			toggle_class(div, "isHovered", /*isHovered*/ ctx[0]);
    			add_location(div, file$d, 20, 0, 409);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isHovered*/ 1) {
    				toggle_class(div, "isHovered", /*isHovered*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let isHovered;
    	let $hoveredCardStore;
    	validate_store(hoveredCardStore, 'hoveredCardStore');
    	component_subscribe($$self, hoveredCardStore, $$value => $$invalidate(1, $hoveredCardStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentMagicField', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentMagicField> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		hoveredCardStore,
    		isHovered,
    		$hoveredCardStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isHovered' in $$props) $$invalidate(0, isHovered = $$props.isHovered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$hoveredCardStore*/ 2) {
    			$$invalidate(0, isHovered = "magic" === $hoveredCardStore.field);
    		}
    	};

    	return [isHovered, $hoveredCardStore];
    }

    class OpponentMagicField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentMagicField",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\game\opponent\OpponentMinionField.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1 } = globals;
    const file$c = "src\\game\\opponent\\OpponentMinionField.svelte";

    // (50:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text("Minion Field ");
    			t1 = text(/*field*/ ctx[0]);
    			attr_dev(span, "class", "f--orange");
    			add_location(span, file$c, 51, 4, 1508);
    			attr_dev(div, "class", "field svelte-4yowu7");
    			add_location(div, file$c, 50, 2, 1483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*field*/ 1) set_data_dev(t1, /*field*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(50:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:0) {#if minion}
    function create_if_block$5(ctx) {
    	let div;
    	let card;
    	let current;
    	let mounted;
    	let dispose;

    	card = new CardSm({
    			props: {
    				card: /*getCard*/ ctx[3](),
    				health: /*minion*/ ctx[1].health,
    				damage: /*minion*/ ctx[1].damage,
    				isHealthBarVisible: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			attr_dev(div, "class", "field svelte-4yowu7");
    			toggle_class(div, "isHovered", /*isHovered*/ ctx[2]);
    			add_location(div, file$c, 41, 2, 1265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onAttackCard*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*minion*/ 2) card_changes.health = /*minion*/ ctx[1].health;
    			if (dirty & /*minion*/ 2) card_changes.damage = /*minion*/ ctx[1].damage;
    			card.$set(card_changes);

    			if (dirty & /*isHovered*/ 4) {
    				toggle_class(div, "isHovered", /*isHovered*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(41:0) {#if minion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*minion*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let minion;
    	let isHovered;
    	let $selectedCardStore;
    	let $playerStore;
    	let $gameStore;
    	let $hoveredCardStore;
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(7, $selectedCardStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(8, $playerStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(5, $gameStore = $$value));
    	validate_store(hoveredCardStore, 'hoveredCardStore');
    	component_subscribe($$self, hoveredCardStore, $$value => $$invalidate(6, $hoveredCardStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentMinionField', slots, []);
    	let { field } = $$props;

    	const getCard = () => {
    		const { gid } = minion;
    		const card = cards.find(card => card.id === minion.id);
    		return Object.assign(Object.assign({}, card), { gid });
    	};

    	const onAttackCard = () => {
    		if ($gameStore.currentPlayer !== $playerStore.username) {
    			return;
    		}

    		if (!$selectedCardStore.field) {
    			return;
    		}

    		const attacked = field;
    		const attacker = $selectedCardStore.field;
    		socketService.socket.emit("attackMinion", { attacked, attacker });
    	};

    	const writable_props = ['field'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentMinionField> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('field' in $$props) $$invalidate(0, field = $$props.field);
    	};

    	$$self.$capture_state = () => ({
    		cards,
    		socketService,
    		gameStore,
    		hoveredCardStore,
    		playerStore,
    		selectedCardStore,
    		Card: CardSm,
    		field,
    		getCard,
    		onAttackCard,
    		minion,
    		isHovered,
    		$selectedCardStore,
    		$playerStore,
    		$gameStore,
    		$hoveredCardStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('field' in $$props) $$invalidate(0, field = $$props.field);
    		if ('minion' in $$props) $$invalidate(1, minion = $$props.minion);
    		if ('isHovered' in $$props) $$invalidate(2, isHovered = $$props.isHovered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameStore, field*/ 33) {
    			$$invalidate(1, minion = $gameStore.opponent.minion[field]);
    		}

    		if ($$self.$$.dirty & /*$hoveredCardStore, field*/ 65) {
    			$$invalidate(2, isHovered = $hoveredCardStore.field === field);
    		}
    	};

    	return [field, minion, isHovered, getCard, onAttackCard, $gameStore, $hoveredCardStore];
    }

    class OpponentMinionField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { field: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentMinionField",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*field*/ ctx[0] === undefined && !('field' in props)) {
    			console.warn("<OpponentMinionField> was created without expected prop 'field'");
    		}
    	}

    	get field() {
    		throw new Error("<OpponentMinionField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set field(value) {
    		throw new Error("<OpponentMinionField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\game\opponent\OpponentTrapField.svelte generated by Svelte v3.46.4 */
    const file$b = "src\\game\\opponent\\OpponentTrapField.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Trap Field";
    			attr_dev(span, "class", "f--red");
    			add_location(span, file$b, 20, 2, 431);
    			attr_dev(div, "class", "field svelte-rjtnia");
    			toggle_class(div, "isHovered", /*isHovered*/ ctx[0]);
    			add_location(div, file$b, 19, 0, 392);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isHovered*/ 1) {
    				toggle_class(div, "isHovered", /*isHovered*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let isHovered;
    	let $hoveredCardStore;
    	validate_store(hoveredCardStore, 'hoveredCardStore');
    	component_subscribe($$self, hoveredCardStore, $$value => $$invalidate(1, $hoveredCardStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpponentTrapField', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpponentTrapField> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		hoveredCardStore,
    		isHovered,
    		$hoveredCardStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isHovered' in $$props) $$invalidate(0, isHovered = $$props.isHovered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$hoveredCardStore*/ 2) {
    			$$invalidate(0, isHovered = "trap" === $hoveredCardStore.field);
    		}
    	};

    	return [isHovered, $hoveredCardStore];
    }

    class OpponentTrapField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpponentTrapField",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\game\opponent\Opponent.svelte generated by Svelte v3.46.4 */
    const file$a = "src\\game\\opponent\\Opponent.svelte";

    // (46:2) {#if $gameStore.currentPlayer !== $playerStore.username}
    function create_if_block$4(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-arrow-left");
    			add_location(i, file$a, 47, 6, 1256);
    			attr_dev(div, "class", "turn svelte-1j9brnr");
    			add_location(div, file$a, 46, 4, 1230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(46:2) {#if $gameStore.currentPlayer !== $playerStore.username}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let opponentdeck;
    	let t0;
    	let opponentminionfield0;
    	let t1;
    	let opponentminionfield1;
    	let t2;
    	let opponenthero;
    	let t3;
    	let opponentminionfield2;
    	let t4;
    	let opponentminionfield3;
    	let t5;
    	let opponentgraveyard;
    	let t6;
    	let opponenthandcards;
    	let t7;
    	let current;
    	opponentdeck = new OpponentDeck({ $$inline: true });
    	opponentminionfield0 = new OpponentMinionField({ props: { field: "d" }, $$inline: true });
    	opponentminionfield1 = new OpponentMinionField({ props: { field: "c" }, $$inline: true });
    	opponenthero = new OpponentHero({ $$inline: true });
    	opponentminionfield2 = new OpponentMinionField({ props: { field: "b" }, $$inline: true });
    	opponentminionfield3 = new OpponentMinionField({ props: { field: "a" }, $$inline: true });
    	opponentgraveyard = new OpponentGraveyard({ $$inline: true });
    	opponenthandcards = new OpponentHandCards({ $$inline: true });
    	let if_block = /*$gameStore*/ ctx[0].currentPlayer !== /*$playerStore*/ ctx[1].username && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(opponentdeck.$$.fragment);
    			t0 = space();
    			create_component(opponentminionfield0.$$.fragment);
    			t1 = space();
    			create_component(opponentminionfield1.$$.fragment);
    			t2 = space();
    			create_component(opponenthero.$$.fragment);
    			t3 = space();
    			create_component(opponentminionfield2.$$.fragment);
    			t4 = space();
    			create_component(opponentminionfield3.$$.fragment);
    			t5 = space();
    			create_component(opponentgraveyard.$$.fragment);
    			t6 = space();
    			create_component(opponenthandcards.$$.fragment);
    			t7 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "fields svelte-1j9brnr");
    			add_location(div0, file$a, 33, 2, 886);
    			attr_dev(div1, "class", "fields-wrapper svelte-1j9brnr");
    			add_location(div1, file$a, 32, 0, 854);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(opponentdeck, div0, null);
    			append_dev(div0, t0);
    			mount_component(opponentminionfield0, div0, null);
    			append_dev(div0, t1);
    			mount_component(opponentminionfield1, div0, null);
    			append_dev(div0, t2);
    			mount_component(opponenthero, div0, null);
    			append_dev(div0, t3);
    			mount_component(opponentminionfield2, div0, null);
    			append_dev(div0, t4);
    			mount_component(opponentminionfield3, div0, null);
    			append_dev(div0, t5);
    			mount_component(opponentgraveyard, div0, null);
    			append_dev(div1, t6);
    			mount_component(opponenthandcards, div1, null);
    			append_dev(div1, t7);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$gameStore*/ ctx[0].currentPlayer !== /*$playerStore*/ ctx[1].username) {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opponentdeck.$$.fragment, local);
    			transition_in(opponentminionfield0.$$.fragment, local);
    			transition_in(opponentminionfield1.$$.fragment, local);
    			transition_in(opponenthero.$$.fragment, local);
    			transition_in(opponentminionfield2.$$.fragment, local);
    			transition_in(opponentminionfield3.$$.fragment, local);
    			transition_in(opponentgraveyard.$$.fragment, local);
    			transition_in(opponenthandcards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opponentdeck.$$.fragment, local);
    			transition_out(opponentminionfield0.$$.fragment, local);
    			transition_out(opponentminionfield1.$$.fragment, local);
    			transition_out(opponenthero.$$.fragment, local);
    			transition_out(opponentminionfield2.$$.fragment, local);
    			transition_out(opponentminionfield3.$$.fragment, local);
    			transition_out(opponentgraveyard.$$.fragment, local);
    			transition_out(opponenthandcards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(opponentdeck);
    			destroy_component(opponentminionfield0);
    			destroy_component(opponentminionfield1);
    			destroy_component(opponenthero);
    			destroy_component(opponentminionfield2);
    			destroy_component(opponentminionfield3);
    			destroy_component(opponentgraveyard);
    			destroy_component(opponenthandcards);
    			if (if_block) if_block.d();
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

    function instance$a($$self, $$props, $$invalidate) {
    	let $gameStore;
    	let $playerStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Opponent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Opponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameStore,
    		playerStore,
    		OpponentDeck,
    		OpponentGraveyard,
    		OpponentHandCards,
    		OpponentHero,
    		OpponentMagicField,
    		OpponentMinionField,
    		OpponentTrapField,
    		$gameStore,
    		$playerStore
    	});

    	return [$gameStore, $playerStore];
    }

    class Opponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Opponent",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\game\player\PlayerDeck.svelte generated by Svelte v3.46.4 */
    const file$9 = "src\\game\\player\\PlayerDeck.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let span;
    	let t0_value = /*$gameStore*/ ctx[0].player.deck.length + "";
    	let t0;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" / 30");
    			t2 = space();
    			img = element("img");
    			attr_dev(span, "class", "deck__cards svelte-13wo4vy");
    			add_location(span, file$9, 25, 2, 509);
    			attr_dev(img, "class", "deck__img svelte-13wo4vy");
    			if (!src_url_equal(img.src, img_src_value = "assets/card-backs/default.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Deck");
    			add_location(img, file$9, 26, 2, 582);
    			attr_dev(div, "class", "deck svelte-13wo4vy");
    			add_location(div, file$9, 24, 0, 466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, img);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onEndTurn*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*$gameStore*/ ctx[0].player.deck.length + "")) set_data_dev(t0, t0_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
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
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerDeck', slots, []);

    	const onEndTurn = () => {
    		socketService.socket.emit("endTurn");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerDeck> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		socketService,
    		gameStore,
    		onEndTurn,
    		$gameStore
    	});

    	return [$gameStore, onEndTurn];
    }

    class PlayerDeck extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerDeck",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\game\player\PlayerGraveyard.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\game\\player\\PlayerGraveyard.svelte";

    // (28:2) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Graveyard");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(28:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if $gameStore.player.graveyard.length}
    function create_if_block$3(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				card: cards.find(/*func*/ ctx[2]),
    				health: 10,
    				damage: 10
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*$gameStore*/ 1) card_changes.card = cards.find(/*func*/ ctx[2]);
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(22:2) {#if $gameStore.player.graveyard.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gameStore*/ ctx[0].player.graveyard.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "graveyard svelte-mf9rzo");
    			add_location(div, file$8, 20, 0, 606);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onViewGraveyard*/ ctx[1], false, false, false);
    				mounted = true;
    			}
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
    				if_block.m(div, null);
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
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
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
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerGraveyard', slots, []);

    	const onViewGraveyard = () => {
    		miscService.openModal("graveyard", $gameStore.player.graveyard);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerGraveyard> was created with unknown prop '${key}'`);
    	});

    	const func = card => card.id === $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1].id;

    	$$self.$capture_state = () => ({
    		cards,
    		miscService,
    		gameStore,
    		Card,
    		onViewGraveyard,
    		$gameStore
    	});

    	return [$gameStore, onViewGraveyard, func];
    }

    class PlayerGraveyard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerGraveyard",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\game\player\PlayerHandCards.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\game\\player\\PlayerHandCards.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].id;
    	child_ctx[7] = list[i].gid;
    	return child_ctx;
    }

    // (60:2) {#each $gameStore.player.hand as {id, gid}}
    function create_each_block(ctx) {
    	let div;
    	let card;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	card = new Card({
    			props: {
    				card: /*getCard*/ ctx[3](/*id*/ ctx[6]),
    				health: 1,
    				damage: 1
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*id*/ ctx[6], /*gid*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "hand__card svelte-1thoq6m");
    			toggle_class(div, "selected", /*gid*/ ctx[7] === /*$selectedCardStore*/ ctx[0].hand.gid);
    			add_location(div, file$7, 60, 4, 1413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const card_changes = {};
    			if (dirty & /*$gameStore*/ 2) card_changes.card = /*getCard*/ ctx[3](/*id*/ ctx[6]);
    			card.$set(card_changes);

    			if (dirty & /*$gameStore, $selectedCardStore*/ 3) {
    				toggle_class(div, "selected", /*gid*/ ctx[7] === /*$selectedCardStore*/ ctx[0].hand.gid);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(60:2) {#each $gameStore.player.hand as {id, gid}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	let each_value = /*$gameStore*/ ctx[1].player.hand;
    	validate_each_argument(each_value);
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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "hand svelte-1thoq6m");
    			add_location(div, file$7, 58, 0, 1342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore, $selectedCardStore, selectCard, getCard*/ 15) {
    				each_value = /*$gameStore*/ ctx[1].player.hand;
    				validate_each_argument(each_value);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let $selectedCardStore;
    	let $playerStore;
    	let $gameStore;
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(0, $selectedCardStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(5, $playerStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(1, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerHandCards', slots, []);

    	const selectCard = (id, gid) => {
    		if ($gameStore.currentPlayer !== $playerStore.username) {
    			return;
    		}

    		if ($selectedCardStore.field !== "") {
    			set_store_value(selectedCardStore, $selectedCardStore.field = "", $selectedCardStore);
    		}

    		const { type } = getCard(id);

    		if ($selectedCardStore.hand.gid !== gid) {
    			set_store_value(selectedCardStore, $selectedCardStore.hand = { gid, type }, $selectedCardStore);
    		} else {
    			set_store_value(selectedCardStore, $selectedCardStore.hand.gid = 0, $selectedCardStore);
    		}
    	};

    	const getCard = id => cards.find(card => card.id === id);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerHandCards> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (id, gid) => selectCard(id, gid);

    	$$self.$capture_state = () => ({
    		cards,
    		gameStore,
    		selectedCardStore,
    		playerStore,
    		Card,
    		selectCard,
    		getCard,
    		$selectedCardStore,
    		$playerStore,
    		$gameStore
    	});

    	return [$selectedCardStore, $gameStore, selectCard, getCard, click_handler];
    }

    class PlayerHandCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerHandCards",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\game\player\PlayerHero.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\game\\player\\PlayerHero.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let hero;
    	let current;

    	hero = new Hero({
    			props: {
    				hero: heroes.find(/*func*/ ctx[1]),
    				health: /*$gameStore*/ ctx[0].player.hero.health,
    				mana: /*$gameStore*/ ctx[0].player.hero.mana,
    				isHealthBarVisible: true,
    				isManaBarVisible: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(hero.$$.fragment);
    			attr_dev(div, "class", "hero svelte-n3tlr8");
    			add_location(div, file$6, 10, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(hero, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const hero_changes = {};
    			if (dirty & /*$gameStore*/ 1) hero_changes.hero = heroes.find(/*func*/ ctx[1]);
    			if (dirty & /*$gameStore*/ 1) hero_changes.health = /*$gameStore*/ ctx[0].player.hero.health;
    			if (dirty & /*$gameStore*/ 1) hero_changes.mana = /*$gameStore*/ ctx[0].player.hero.mana;
    			hero.$set(hero_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(hero);
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
    	let $gameStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerHero', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerHero> was created with unknown prop '${key}'`);
    	});

    	const func = hero => hero.klass === $gameStore.player.hero.id;
    	$$self.$capture_state = () => ({ heroes, gameStore, Hero, $gameStore });
    	return [$gameStore, func];
    }

    class PlayerHero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerHero",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\game\player\PlayerMagicField.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\game\\player\\PlayerMagicField.svelte";

    // (46:2) <Text>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Magic Field");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(46:2) <Text>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let text_1;
    	let current;
    	let mounted;
    	let dispose;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(text_1.$$.fragment);
    			attr_dev(div, "class", "field svelte-1hrltes");
    			toggle_class(div, "isSummonable", /*isSummonable*/ ctx[0]);
    			add_location(div, file$5, 44, 0, 1203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(text_1, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*onMouseEnter*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseleave", /*onMouseLeave*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);

    			if (dirty & /*isSummonable*/ 1) {
    				toggle_class(div, "isSummonable", /*isSummonable*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(text_1);
    			mounted = false;
    			run_all(dispose);
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
    	let isSummonable;
    	let isCurrentPlayer;
    	let $playerStore;
    	let $gameStore;
    	let $selectedCardStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(3, $playerStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(4, $gameStore = $$value));
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(5, $selectedCardStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerMagicField', slots, []);

    	const onMouseEnter = () => {
    		if (isCurrentPlayer) {
    			socketService.socket.emit("hoverCard", { field: "magic" });
    		}
    	};

    	const onMouseLeave = () => {
    		if (isCurrentPlayer) {
    			socketService.socket.emit("unhoverCard");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerMagicField> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CardType,
    		socketService,
    		gameStore,
    		selectedCardStore,
    		playerStore,
    		Text,
    		onMouseEnter,
    		onMouseLeave,
    		isCurrentPlayer,
    		isSummonable,
    		$playerStore,
    		$gameStore,
    		$selectedCardStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isCurrentPlayer' in $$props) isCurrentPlayer = $$props.isCurrentPlayer;
    		if ('isSummonable' in $$props) $$invalidate(0, isSummonable = $$props.isSummonable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedCardStore*/ 32) {
    			$$invalidate(0, isSummonable = $selectedCardStore.hand.gid !== 0 && $selectedCardStore.hand.type === CardType.MAGIC);
    		}

    		if ($$self.$$.dirty & /*$gameStore, $playerStore*/ 24) {
    			isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;
    		}
    	};

    	return [
    		isSummonable,
    		onMouseEnter,
    		onMouseLeave,
    		$playerStore,
    		$gameStore,
    		$selectedCardStore
    	];
    }

    class PlayerMagicField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerMagicField",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\game\player\PlayerMinionField.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;
    const file$4 = "src\\game\\player\\PlayerMinionField.svelte";

    // (104:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text("Minion Field ");
    			t1 = text(/*field*/ ctx[0]);
    			add_location(span, file$4, 105, 4, 2948);
    			attr_dev(div, "class", "field svelte-1ptpbzp");
    			toggle_class(div, "isSummonable", /*isSummonable*/ ctx[2]);
    			add_location(div, file$4, 104, 2, 2824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*onPlayCard*/ ctx[5], false, false, false),
    					listen_dev(div, "mouseenter", /*onMouseenter*/ ctx[7], false, false, false),
    					listen_dev(div, "mouseleave", /*onMouseleave*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*field*/ 1) set_data_dev(t1, /*field*/ ctx[0]);

    			if (dirty & /*isSummonable*/ 4) {
    				toggle_class(div, "isSummonable", /*isSummonable*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(104:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:0) {#if minion}
    function create_if_block$2(ctx) {
    	let div;
    	let card;
    	let current;
    	let mounted;
    	let dispose;

    	card = new Card({
    			props: {
    				card: /*getCard*/ ctx[4](),
    				health: /*minion*/ ctx[1].health,
    				damage: /*minion*/ ctx[1].damage,
    				isHealthBarVisible: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(card.$$.fragment);
    			attr_dev(div, "class", "field svelte-1ptpbzp");
    			toggle_class(div, "isSelected", /*isSelected*/ ctx[3]);
    			add_location(div, file$4, 100, 2, 2579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(card, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*onAttackSelect*/ ctx[6], false, false, false),
    					listen_dev(div, "mouseenter", /*onMouseenter*/ ctx[7], false, false, false),
    					listen_dev(div, "mouseleave", /*onMouseleave*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*minion*/ 2) card_changes.health = /*minion*/ ctx[1].health;
    			if (dirty & /*minion*/ 2) card_changes.damage = /*minion*/ ctx[1].damage;
    			card.$set(card_changes);

    			if (dirty & /*isSelected*/ 8) {
    				toggle_class(div, "isSelected", /*isSelected*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(card);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(100:0) {#if minion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*minion*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let isSelected;
    	let isSummonable;
    	let isCurrentPlayer;
    	let minion;
    	let $selectedCardStore;
    	let $gameStore;
    	let $playerStore;
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(9, $selectedCardStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(10, $gameStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(11, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerMinionField', slots, []);
    	let { field } = $$props;
    	const { socket } = socketService;

    	const getCard = () => {
    		const card = cards.find(({ id }) => id === minion.id);
    		const gid = minion.gid;
    		return Object.assign(Object.assign({}, card), { gid });
    	};

    	const onPlayCard = () => {
    		if (!isCurrentPlayer) {
    			return;
    		}

    		if (!$selectedCardStore.hand.gid) {
    			return;
    		}

    		if ($selectedCardStore.hand.type !== CardType.MINION) {
    			return;
    		}

    		if ($selectedCardStore.field !== "") {
    			set_store_value(selectedCardStore, $selectedCardStore.field = "", $selectedCardStore);
    		}

    		const { gid } = $selectedCardStore.hand;
    		socket.emit("playMinion", { field, gid });
    		set_store_value(selectedCardStore, $selectedCardStore.hand.gid = 0, $selectedCardStore);
    	};

    	const onAttackSelect = () => {
    		if (!isCurrentPlayer) {
    			return;
    		}

    		if ($selectedCardStore.hand.gid) {
    			set_store_value(selectedCardStore, $selectedCardStore.hand.gid = 0, $selectedCardStore);
    		}

    		if ($selectedCardStore.field === field) {
    			set_store_value(selectedCardStore, $selectedCardStore.field = "", $selectedCardStore);
    		} else {
    			set_store_value(selectedCardStore, $selectedCardStore.field = field, $selectedCardStore);
    		}
    	};

    	const onMouseenter = () => {
    		if (isCurrentPlayer) {
    			socket.emit("hoverCard", { field });
    		}
    	};

    	const onMouseleave = () => {
    		if (isCurrentPlayer) {
    			socket.emit("unhoverCard");
    		}
    	};

    	const writable_props = ['field'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerMinionField> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('field' in $$props) $$invalidate(0, field = $$props.field);
    	};

    	$$self.$capture_state = () => ({
    		CardType,
    		cards,
    		socketService,
    		gameStore,
    		selectedCardStore,
    		playerStore,
    		Card,
    		field,
    		socket,
    		getCard,
    		onPlayCard,
    		onAttackSelect,
    		onMouseenter,
    		onMouseleave,
    		isCurrentPlayer,
    		minion,
    		isSummonable,
    		isSelected,
    		$selectedCardStore,
    		$gameStore,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('field' in $$props) $$invalidate(0, field = $$props.field);
    		if ('isCurrentPlayer' in $$props) isCurrentPlayer = $$props.isCurrentPlayer;
    		if ('minion' in $$props) $$invalidate(1, minion = $$props.minion);
    		if ('isSummonable' in $$props) $$invalidate(2, isSummonable = $$props.isSummonable);
    		if ('isSelected' in $$props) $$invalidate(3, isSelected = $$props.isSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedCardStore, field*/ 513) {
    			$$invalidate(3, isSelected = $selectedCardStore.field === field);
    		}

    		if ($$self.$$.dirty & /*$selectedCardStore, $gameStore, field*/ 1537) {
    			$$invalidate(2, isSummonable = $selectedCardStore.hand.gid && $selectedCardStore.hand.type === CardType.MINION && !$gameStore.player.minion[field]);
    		}

    		if ($$self.$$.dirty & /*$gameStore, $playerStore*/ 3072) {
    			isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;
    		}

    		if ($$self.$$.dirty & /*$gameStore, field*/ 1025) {
    			$$invalidate(1, minion = $gameStore.player.minion[field]);
    		}
    	};

    	return [
    		field,
    		minion,
    		isSummonable,
    		isSelected,
    		getCard,
    		onPlayCard,
    		onAttackSelect,
    		onMouseenter,
    		onMouseleave,
    		$selectedCardStore,
    		$gameStore,
    		$playerStore
    	];
    }

    class PlayerMinionField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { field: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerMinionField",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*field*/ ctx[0] === undefined && !('field' in props)) {
    			console.warn("<PlayerMinionField> was created without expected prop 'field'");
    		}
    	}

    	get field() {
    		throw new Error("<PlayerMinionField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set field(value) {
    		throw new Error("<PlayerMinionField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\game\player\PlayerTrapField.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\game\\player\\PlayerTrapField.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Trap Field";
    			add_location(span, file$3, 49, 2, 1273);
    			attr_dev(div, "class", "field svelte-g7lnrm");
    			toggle_class(div, "isSummonable", /*isSummonable*/ ctx[0]);
    			add_location(div, file$3, 43, 0, 1159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*onMouseEnter*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseleave", /*onMouseLeave*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isSummonable*/ 1) {
    				toggle_class(div, "isSummonable", /*isSummonable*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
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
    	let isCurrentPlayer;
    	let isSummonable;
    	let $selectedCardStore;
    	let $playerStore;
    	let $gameStore;
    	validate_store(selectedCardStore, 'selectedCardStore');
    	component_subscribe($$self, selectedCardStore, $$value => $$invalidate(3, $selectedCardStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(4, $playerStore = $$value));
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(5, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerTrapField', slots, []);

    	const onMouseEnter = () => {
    		if (isCurrentPlayer) {
    			socketService.socket.emit("hoverCard", { field: "trap" });
    		}
    	};

    	const onMouseLeave = () => {
    		if (isCurrentPlayer) {
    			socketService.socket.emit("unhoverCard");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerTrapField> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CardType,
    		gameStore,
    		selectedCardStore,
    		playerStore,
    		socketService,
    		onMouseEnter,
    		onMouseLeave,
    		isCurrentPlayer,
    		isSummonable,
    		$selectedCardStore,
    		$playerStore,
    		$gameStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('isCurrentPlayer' in $$props) isCurrentPlayer = $$props.isCurrentPlayer;
    		if ('isSummonable' in $$props) $$invalidate(0, isSummonable = $$props.isSummonable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameStore, $playerStore*/ 48) {
    			isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;
    		}

    		if ($$self.$$.dirty & /*$selectedCardStore*/ 8) {
    			$$invalidate(0, isSummonable = $selectedCardStore.hand.gid !== 0 && $selectedCardStore.hand.type === CardType.TRAP);
    		}
    	};

    	return [
    		isSummonable,
    		onMouseEnter,
    		onMouseLeave,
    		$selectedCardStore,
    		$playerStore,
    		$gameStore
    	];
    }

    class PlayerTrapField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerTrapField",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\game\player\Player.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\game\\player\\Player.svelte";

    // (47:2) {#if $gameStore.currentPlayer === $playerStore.username}
    function create_if_block$1(ctx) {
    	let div;
    	let fontawesome;
    	let current;

    	fontawesome = new FontAwesome({
    			props: { icon: "arrow-left" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(fontawesome.$$.fragment);
    			attr_dev(div, "class", "turn svelte-1j9brnr");
    			add_location(div, file$2, 47, 4, 1242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(fontawesome, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontawesome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontawesome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fontawesome);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(47:2) {#if $gameStore.currentPlayer === $playerStore.username}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let playergraveyard;
    	let t0;
    	let playerminionfield0;
    	let t1;
    	let playerminionfield1;
    	let t2;
    	let playerhero;
    	let t3;
    	let playerminionfield2;
    	let t4;
    	let playerminionfield3;
    	let t5;
    	let playerdeck;
    	let t6;
    	let playerhandcards;
    	let t7;
    	let current;
    	playergraveyard = new PlayerGraveyard({ $$inline: true });
    	playerminionfield0 = new PlayerMinionField({ props: { field: "a" }, $$inline: true });
    	playerminionfield1 = new PlayerMinionField({ props: { field: "b" }, $$inline: true });
    	playerhero = new PlayerHero({ $$inline: true });
    	playerminionfield2 = new PlayerMinionField({ props: { field: "c" }, $$inline: true });
    	playerminionfield3 = new PlayerMinionField({ props: { field: "d" }, $$inline: true });
    	playerdeck = new PlayerDeck({ $$inline: true });
    	playerhandcards = new PlayerHandCards({ $$inline: true });
    	let if_block = /*$gameStore*/ ctx[0].currentPlayer === /*$playerStore*/ ctx[1].username && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(playergraveyard.$$.fragment);
    			t0 = space();
    			create_component(playerminionfield0.$$.fragment);
    			t1 = space();
    			create_component(playerminionfield1.$$.fragment);
    			t2 = space();
    			create_component(playerhero.$$.fragment);
    			t3 = space();
    			create_component(playerminionfield2.$$.fragment);
    			t4 = space();
    			create_component(playerminionfield3.$$.fragment);
    			t5 = space();
    			create_component(playerdeck.$$.fragment);
    			t6 = space();
    			create_component(playerhandcards.$$.fragment);
    			t7 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "fields svelte-1j9brnr");
    			add_location(div0, file$2, 34, 2, 914);
    			attr_dev(div1, "class", "fields-wrapper svelte-1j9brnr");
    			add_location(div1, file$2, 33, 0, 882);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(playergraveyard, div0, null);
    			append_dev(div0, t0);
    			mount_component(playerminionfield0, div0, null);
    			append_dev(div0, t1);
    			mount_component(playerminionfield1, div0, null);
    			append_dev(div0, t2);
    			mount_component(playerhero, div0, null);
    			append_dev(div0, t3);
    			mount_component(playerminionfield2, div0, null);
    			append_dev(div0, t4);
    			mount_component(playerminionfield3, div0, null);
    			append_dev(div0, t5);
    			mount_component(playerdeck, div0, null);
    			append_dev(div1, t6);
    			mount_component(playerhandcards, div1, null);
    			append_dev(div1, t7);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$gameStore*/ ctx[0].currentPlayer === /*$playerStore*/ ctx[1].username) {
    				if (if_block) {
    					if (dirty & /*$gameStore, $playerStore*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
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
    			transition_in(playergraveyard.$$.fragment, local);
    			transition_in(playerminionfield0.$$.fragment, local);
    			transition_in(playerminionfield1.$$.fragment, local);
    			transition_in(playerhero.$$.fragment, local);
    			transition_in(playerminionfield2.$$.fragment, local);
    			transition_in(playerminionfield3.$$.fragment, local);
    			transition_in(playerdeck.$$.fragment, local);
    			transition_in(playerhandcards.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playergraveyard.$$.fragment, local);
    			transition_out(playerminionfield0.$$.fragment, local);
    			transition_out(playerminionfield1.$$.fragment, local);
    			transition_out(playerhero.$$.fragment, local);
    			transition_out(playerminionfield2.$$.fragment, local);
    			transition_out(playerminionfield3.$$.fragment, local);
    			transition_out(playerdeck.$$.fragment, local);
    			transition_out(playerhandcards.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(playergraveyard);
    			destroy_component(playerminionfield0);
    			destroy_component(playerminionfield1);
    			destroy_component(playerhero);
    			destroy_component(playerminionfield2);
    			destroy_component(playerminionfield3);
    			destroy_component(playerdeck);
    			destroy_component(playerhandcards);
    			if (if_block) if_block.d();
    		}
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

    function instance$2($$self, $$props, $$invalidate) {
    	let $gameStore;
    	let $playerStore;
    	validate_store(gameStore, 'gameStore');
    	component_subscribe($$self, gameStore, $$value => $$invalidate(0, $gameStore = $$value));
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameStore,
    		playerStore,
    		FontAwesome,
    		PlayerDeck,
    		PlayerGraveyard,
    		PlayerHandCards,
    		PlayerHero,
    		PlayerMagicField,
    		PlayerMinionField,
    		PlayerTrapField,
    		$gameStore,
    		$playerStore
    	});

    	return [$gameStore, $playerStore];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\game\Game.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\game\\Game.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let opponent;
    	let t;
    	let player;
    	let current;
    	opponent = new Opponent({ $$inline: true });
    	player = new Player({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(opponent.$$.fragment);
    			t = space();
    			create_component(player.$$.fragment);
    			attr_dev(div, "class", "game svelte-pqlz1o");
    			add_location(div, file$1, 17, 0, 429);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(opponent, div, null);
    			append_dev(div, t);
    			mount_component(player, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opponent.$$.fragment, local);
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opponent.$$.fragment, local);
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(opponent);
    			destroy_component(player);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Game', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Opponent, Player });
    	return [];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (72:27) 
    function create_if_block_2(ctx) {
    	let game;
    	let current;
    	game = new Game({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(72:27) ",
    		ctx
    	});

    	return block;
    }

    // (65:59) 
    function create_if_block_1(ctx) {
    	let div1;
    	let client;
    	let t;
    	let div0;
    	let sidenav;
    	let current;
    	client = new Client({ $$inline: true });
    	sidenav = new Sidenav({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(client.$$.fragment);
    			t = space();
    			div0 = element("div");
    			create_component(sidenav.$$.fragment);
    			attr_dev(div0, "class", "app__sidenav svelte-1nfyaq");
    			add_location(div0, file, 67, 8, 1618);
    			attr_dev(div1, "class", "app__content svelte-1nfyaq");
    			add_location(div1, file, 65, 6, 1565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(client, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(sidenav, div0, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(client.$$.fragment, local);
    			transition_in(sidenav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(client.$$.fragment, local);
    			transition_out(sidenav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(client);
    			destroy_component(sidenav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(65:59) ",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if status === 0}
    function create_if_block(ctx) {
    	let auth;
    	let current;
    	auth = new Auth({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(auth.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(auth, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(auth, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(63:4) {#if status === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let style;
    	let t1;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let chatwindow;
    	let t3;
    	let notifications;
    	let t4;
    	let modals;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*status*/ ctx[0] === 0) return 0;
    		if (/*status*/ ctx[0] === 1 || /*status*/ ctx[0] === 2 || /*status*/ ctx[0] === 3) return 1;
    		if (/*status*/ ctx[0] === 4) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	chatwindow = new ChatWindow({ $$inline: true });
    	notifications = new Notifications({ $$inline: true });
    	modals = new Modals({ $$inline: true });

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "@font-face {\n      font-family: 'RomanCapitalz';\n      src: url(assets/font.woff);\n    }\n\n    body {\n      margin: 0;\n      font-family: \"RomanCapitalz\", sans-serif;\n      font-size: 20px;\n      line-height: 1;\n      user-select: none;\n    }";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(chatwindow.$$.fragment);
    			t3 = space();
    			create_component(notifications.$$.fragment);
    			t4 = space();
    			create_component(modals.$$.fragment);
    			add_location(style, file, 17, 2, 586);
    			attr_dev(div0, "class", "app--inner svelte-1nfyaq");
    			add_location(div0, file, 61, 2, 1437);
    			attr_dev(div1, "class", "app svelte-1nfyaq");
    			add_location(div1, file, 60, 0, 1417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			append_dev(div0, t2);
    			mount_component(chatwindow, div0, null);
    			append_dev(div0, t3);
    			mount_component(notifications, div0, null);
    			append_dev(div0, t4);
    			mount_component(modals, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, t2);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(chatwindow.$$.fragment, local);
    			transition_in(notifications.$$.fragment, local);
    			transition_in(modals.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(chatwindow.$$.fragment, local);
    			transition_out(notifications.$$.fragment, local);
    			transition_out(modals.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(style);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			destroy_component(chatwindow);
    			destroy_component(notifications);
    			destroy_component(modals);
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
    	let status;
    	let $playerStore;
    	validate_store(playerStore, 'playerStore');
    	component_subscribe($$self, playerStore, $$value => $$invalidate(1, $playerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		responses.forEach(response => response());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		playerStore,
    		responses,
    		ChatWindow,
    		Modals,
    		Notifications,
    		Auth,
    		Client,
    		Sidenav,
    		Game,
    		status,
    		$playerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('status' in $$props) $$invalidate(0, status = $$props.status);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$playerStore*/ 2) {
    			$$invalidate(0, status = $playerStore.status);
    		}
    	};

    	return [status, $playerStore];
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

    var main = new App({
        target: document.body
    });

    return main;

})();
//# sourceMappingURL=bundle.js.map
