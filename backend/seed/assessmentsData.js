// LearnSphere Comprehensive Assessment Dataset
// 10 Courses x 3 Quizzes (Beginner: 5 Qs, Intermediate: 7 Qs, Advanced: 10 Qs) = 30 Quizzes (220 MCQs)
// 10 Courses x 3 Assignments (Beginner: 20 pts, Intermediate: 30 pts, Advanced: 50 pts) = 30 Assignments

const assessmentsByCourse = [
  // 1. JavaScript Fundamentals
  {
    courseTitle: 'JavaScript Fundamentals',
    quizzes: [
      {
        title: 'JavaScript Fundamentals & Lexical Scopes Quiz',
        difficulty: 'Beginner',
        description: 'Test your understanding of JavaScript variables, primitive types, and basic operators.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which keyword declares a block-scoped variable in modern ECMAScript (ES6)?',
            options: ['var', 'let', 'global', 'dim'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: '`let` and `const` have block scope in JavaScript, whereas `var` is function scoped.'
          },
          {
            questionText: 'What is the evaluated output of the expression `typeof null` in standard JavaScript?',
            options: ['"undefined"', '"null"', '"object"', '"number"'],
            correctOptionIndex: 2,
            marks: 2,
            explanation: 'In JavaScript, `typeof null === "object"` due to a legacy design quirk in the initial engine implementation.'
          },
          {
            questionText: 'What is a Closure in JavaScript?',
            options: [
              'A function bundled together with references to its surrounding lexical environment',
              'A syntax error that closes the Node.js runtime process',
              'A browser method used solely to close browser tabs',
              'A database connection pool termination handler'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A closure gives a function access to its outer scope even after the outer function has finished executing.'
          },
          {
            questionText: 'Which asynchronous mechanism queues a callback into the Microtask queue?',
            options: ['setTimeout(fn, 0)', 'setImmediate(fn)', 'Promise.prototype.then(fn)', 'requestAnimationFrame(fn)'],
            correctOptionIndex: 2,
            marks: 2,
            explanation: 'Promise reactions and queueMicrotask callbacks enter the microtask queue, which executes before macrotasks.'
          },
          {
            questionText: 'What will the expression `[] == ![]` evaluate to in JavaScript coercion rules?',
            options: ['true', 'false', 'TypeError', 'undefined'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`![]` evaluates to `false`. Then `[] == false` converts both to numbers: `0 == 0`, evaluating to `true`.'
          }
        ]
      },
      {
        title: 'Functions, Arrays, and Object Prototypes',
        difficulty: 'Intermediate',
        description: 'Assess deeper knowledge of array methods, arrow functions, `this` binding, and object prototypes.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'How does an arrow function handle the `this` keyword differently from a standard function expression?',
            options: [
              'It dynamically rebinds `this` based on how it is invoked',
              'It lexically inherits `this` from the enclosing execution context',
              'It always binds `this` to the global window object',
              'It sets `this` to undefined in non-strict mode'
            ],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Arrow functions do not have their own `this` binding; they capture the `this` value of the enclosing lexical scope.'
          },
          {
            questionText: 'Which array method transforms an array without mutating the original array, returning a single accumulated value?',
            options: ['Array.prototype.splice()', 'Array.prototype.reduce()', 'Array.prototype.push()', 'Array.prototype.sort()'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: '`reduce()` iterates over elements to accumulate a single result without mutating the underlying input array.'
          },
          {
            questionText: 'What is the purpose of `Object.freeze()` compared to `Object.seal()`?',
            options: [
              '`freeze()` prevents adding new properties and makes existing properties non-writable; `seal()` allows modifying existing values',
              '`seal()` prevents reading properties while `freeze()` makes them hidden',
              'Both methods behave identically in V8 engine',
              '`freeze()` only works on arrays, while `seal()` only works on functions'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`Object.freeze()` prevents property addition, removal, and value modification. `Object.seal()` prevents adding or deleting properties but allows modifying existing writable properties.'
          },
          {
            questionText: 'What does `Array.prototype.filter()` return when no elements satisfy the provided callback predicate?',
            options: ['null', 'undefined', 'An empty array `[]`', '-1'],
            correctOptionIndex: 2,
            marks: 2,
            explanation: '`filter()` always returns a new array. If no elements pass the test, it returns an empty array `[]`.'
          },
          {
            questionText: 'In prototypical inheritance, which property points to the prototype of an object instance?',
            options: ['`__proto__` / `Object.getPrototypeOf()`', '`instance.class`', '`instance.super`', '`instance.base`'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Objects link to their prototype through their internal `[[Prototype]]`, accessed via `Object.getPrototypeOf()` or `__proto__`.'
          },
          {
            questionText: 'What is the difference between `call()` and `apply()` in JavaScript Function prototypes?',
            options: [
              '`call()` accepts arguments as a comma-separated list, while `apply()` takes arguments as an array',
              '`apply()` permanently binds `this`, while `call()` is temporary',
              '`call()` is asynchronous, whereas `apply()` executes synchronously',
              'There is no difference; they are aliases'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Both invoke a function with an explicit `this`. `call(thisArg, arg1, arg2)` takes individual arguments, while `apply(thisArg, [args])` takes an array of arguments.'
          },
          {
            questionText: 'What does the spread operator (`...`) do when applied to an array inside another array literal?',
            options: [
              'Shallow copies the elements of the source array into the new array',
              'Deep copies all nested objects inside the source array',
              'Converts the array to a JSON string',
              'Throws a syntax error unless used inside a function call'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The spread syntax unpacks elements into a new array literal, performing a shallow copy.'
          }
        ]
      },
      {
        title: 'Asynchronous JavaScript, Event Loop & Memory Management',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering Promises, Event Loop microtasks/macrotasks, memory leaks, and concurrency.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the output order of: `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`?',
            options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 3, 4, 2', '4, 1, 3, 2'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Synchronous code runs first (1, 4), then microtasks in the microtask queue (3), and finally macrotasks (2).'
          },
          {
            questionText: 'What happens when `Promise.all([p1, p2, p3])` encounters a rejection in `p2` while `p1` and `p3` are still pending?',
            options: [
              'It immediately rejects with the reason of `p2` without waiting for `p1` or `p3` to settle',
              'It waits for all promises to settle and returns an array of errors',
              'It ignores `p2` and returns the resolved values of `p1` and `p3`',
              'It converts the rejection into an uncaught exception and halts the process'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`Promise.all` follows fail-fast behavior: if any promise rejects, it immediately rejects with that error.'
          },
          {
            questionText: 'How does `Promise.allSettled()` differ from `Promise.all()`?',
            options: [
              '`Promise.allSettled()` never rejects; it waits for all promises to finish and returns an array of result objects with status `fulfilled` or `rejected`',
              '`Promise.allSettled()` rejects if any promise takes longer than 5 seconds',
              '`Promise.allSettled()` executes promises sequentially rather than concurrently',
              '`Promise.allSettled()` only works with fetch requests'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`Promise.allSettled()` resolves after all input promises have settled, providing `{ status, value }` or `{ status, reason }` for each.'
          },
          {
            questionText: 'In V8 garbage collection, which generation collects objects that survive multiple scavenging cycles?',
            options: ['Old Generation (Mark-Sweep-Compact)', 'Young Generation (Semi-space Scavenger)', 'Ephemeral Cache', 'Stack Allocation Frame'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Objects that survive young generation scavenges are promoted to the Old Generation, which uses Mark-Sweep and Mark-Compact algorithms.'
          },
          {
            questionText: 'What common programming pattern is a frequent cause of memory leaks in single-page JavaScript applications?',
            options: [
              'Detached DOM tree references retained by global event listeners or closures',
              'Using `const` instead of `let` in loop blocks',
              'Invoking `JSON.stringify()` on large objects',
              'Using template literals for string concatenation'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'When DOM elements are removed from the document but retained in JavaScript variables or event callbacks, the garbage collector cannot reclaim their memory.'
          },
          {
            questionText: 'What is the purpose of `WeakMap` in JavaScript compared to standard `Map`?',
            options: [
              'Keys must be objects and are held weakly, allowing garbage collection when no other references exist',
              '`WeakMap` is simply a slower version of `Map` with string keys',
              '`WeakMap` is serialized to localStorage automatically',
              '`WeakMap` cannot be used in asynchronous functions'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In a `WeakMap`, object keys are weakly referenced, preventing memory leaks when storing metadata about external DOM elements or objects.'
          },
          {
            questionText: 'What is the effect of the `async` keyword on a function declaration?',
            options: [
              'It guarantees the function always returns a Promise, wrapping non-promise return values in `Promise.resolve()`',
              'It runs the function on a separate background OS worker thread automatically',
              'It forces all variables inside the function to be immutable',
              'It blocks the main JavaScript thread until all operations inside complete'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An `async` function always returns a Promise. If the function returns a value, the Promise resolves with that value.'
          },
          {
            questionText: 'What occurs if an `await` expression is followed by a rejected promise and is not wrapped in a `try...catch` block?',
            options: [
              'The async function execution halts at that point and returns a rejected promise to the caller',
              'The browser restarts the active tab',
              'The rejected value is silently replaced with `null`',
              'JavaScript logs a warning and continues with the next statement'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An unhandled rejection in an `await` causes the containing async function to reject with that error.'
          },
          {
            questionText: 'Which Web API allows running heavy JavaScript calculations in true background threads without freezing the UI?',
            options: ['Web Workers (`Worker`)', 'Service Workers', 'MutationObserver', 'IntersectionObserver'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Web Workers run scripts in background threads, communicating with the main thread via `postMessage()`, keeping the UI responsive.'
          },
          {
            questionText: 'What will `typeof (async () => {})` evaluate to in JavaScript?',
            options: ['"function"', '"promise"', '"asyncfunction"', '"object"'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In JavaScript type introspection, all functions—including generator and async functions—return `"function"` from `typeof`.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Basic JavaScript Interactive Calculator',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Build a modular JavaScript calculator supporting addition, subtraction, multiplication, and division with input validation for division-by-zero.'
      },
      {
        title: 'Build an Interactive DOM Todo Application',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Design and implement an interactive Task Management interface using pure DOM manipulation, localStorage persistence, event delegation, and filter states.'
      },
      {
        title: 'Enterprise Async Data Fetcher and Cache Manager',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Implement a production-grade asynchronous data client with in-memory TTL caching, automatic exponential backoff retry logic, request deduplication, and abort controller signals.'
      }
    ]
  },

  // 2. Web Development Basics
  {
    courseTitle: 'Web Development Basics',
    quizzes: [
      {
        title: 'Web Development Foundations Quiz',
        difficulty: 'Beginner',
        description: 'Verify foundational knowledge of HTML5 semantic tags, CSS selectors, and page structure.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which HTML5 semantic element is most appropriate for grouping self-contained content such as a blog post or news story?',
            options: ['<article>', '<section>', '<div>', '<aside>'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The `<article>` element represents a complete, or self-contained, composition in a document, page, or site.'
          },
          {
            questionText: 'What is the default value of the `position` property in standard CSS?',
            options: ['relative', 'static', 'absolute', 'fixed'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Elements are positioned `static` by default according to the normal document flow.'
          },
          {
            questionText: 'Which HTTP status code signifies that a requested resource was not found on the server?',
            options: ['200', '301', '404', '500'],
            correctOptionIndex: 2,
            marks: 2,
            explanation: 'HTTP 404 indicates that the server cannot find the requested URL.'
          },
          {
            questionText: 'Which CSS selector possesses the highest specificity value?',
            options: ['Tag selector (e.g. `p`)', 'Class selector (e.g. `.card`)', 'ID selector (e.g. `#main`)', 'Universal selector (`*`)'],
            correctOptionIndex: 2,
            marks: 2,
            explanation: 'An ID selector has specificity (0,1,0,0), which outweighs classes (0,0,1,0) and tag elements (0,0,0,1).'
          },
          {
            questionText: 'What is the role of the `alt` attribute on an `<img>` tag in HTML?',
            options: [
              'Provides alternative text for screen readers and displays when the image fails to load',
              'Specifies the animation speed of the graphic',
              'Determines the alignment of the image on the screen',
              'Defines a hyperlink destination when clicked'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The `alt` attribute provides accessible text descriptions for visually impaired users and fallback rendering.'
          }
        ]
      },
      {
        title: 'Modern CSS Flexbox, Grid, and Responsive Design',
        difficulty: 'Intermediate',
        description: 'Test skills in modern layout engines, media queries, CSS variables, and fluid typography.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'In CSS Flexbox, which property aligns flex items along the cross axis?',
            options: ['justify-content', 'align-items', 'flex-direction', 'align-content'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: '`align-items` aligns flex items along the cross axis, while `justify-content` controls alignment on the main axis.'
          },
          {
            questionText: 'What CSS Grid property allows columns to automatically repeat and fit available space without fixed column counts?',
            options: [
              'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))',
              'grid-columns: flex-auto',
              'grid-auto-flow: columns',
              'grid-template: auto-fill 100%'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`repeat(auto-fit, minmax(min, 1fr))` creates a responsive grid that wraps items without requiring media queries.'
          },
          {
            questionText: 'What is the difference between `em` and `rem` units in CSS?',
            options: [
              '`rem` is relative to the root (`<html>`) element font-size, while `em` is relative to the font-size of its immediate parent',
              '`em` is fixed in pixels while `rem` is scalable',
              '`rem` only works in media queries, while `em` works everywhere',
              'There is no difference in modern browsers'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`rem` stands for Root EM (relative to the html root element), preventing compound scaling issues caused by nested `em` units.'
          },
          {
            questionText: 'Which viewport meta tag setting ensures correct mobile scaling and responsiveness?',
            options: [
              '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
              '<meta name="mobile" content="responsive">',
              '<meta name="screen" content="fluid">',
              '<meta name="zoom" content="enable">'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`width=device-width, initial-scale=1.0` tells mobile browsers to match screen width and render at 1:1 scale.'
          },
          {
            questionText: 'What does `box-sizing: border-box` do to the element box calculation?',
            options: [
              'Includes padding and border in the element\'s specified width and height',
              'Removes all borders from the box',
              'Adds extra margins equal to the border width',
              'Renders the element as a 3D isometric box'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`border-box` ensures `width` includes content, padding, and borders, making responsive calculations predictable.'
          },
          {
            questionText: 'How are native CSS custom properties (variables) declared and accessed?',
            options: [
              'Declared with `--name: value;` and accessed with `var(--name)`',
              'Declared with `$name: value;` and accessed with `$name`',
              'Declared with `@name: value;` and accessed with `get(@name)`',
              'Declared with `let name = value;` and accessed with `css(name)`'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Native CSS variables use the `--` prefix and are retrieved using the `var()` function.'
          },
          {
            questionText: 'Which media feature query detects if the user preferred a dark color scheme in their operating system?',
            options: ['@media (prefers-color-scheme: dark)', '@media (theme: dark)', '@media (contrast: high)', '@media (night-mode: true)'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`prefers-color-scheme: dark` is the standard CSS media feature query for supporting user theme preferences.'
          }
        ]
      },
      {
        title: 'Web Performance, Security Headers, and Browser APIs',
        difficulty: 'Advanced',
        description: 'Comprehensive assessment on web performance budgets, Core Web Vitals, CSP headers, and service workers.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which Core Web Vital metric measures visual stability and unexpected layout shifts during page load?',
            options: ['Cumulative Layout Shift (CLS)', 'Largest Contentful Paint (LCP)', 'Interaction to Next Paint (INP)', 'Time to First Byte (TTFB)'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'CLS measures unexpected layout shifts that occur while the user is viewing the page.'
          },
          {
            questionText: 'What HTTP security header prevents clickjacking attacks by controlling whether the site can be framed?',
            options: ['X-Frame-Options: DENY / Content-Security-Policy: frame-ancestors \'none\'', 'X-XSS-Protection', 'Strict-Transport-Security', 'Access-Control-Allow-Origin'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`X-Frame-Options: DENY` and CSP `frame-ancestors \'none\'` block embedding inside unauthorized `<iframe>` elements.'
          },
          {
            questionText: 'What is the role of `rel="noopener noreferrer"` when opening external links with `target="_blank"`?',
            options: [
              'Prevents the new page from accessing `window.opener` to prevent tab-nabbing and avoids leaking the referrer header',
              'Forces the browser to cache the external site in offline storage',
              'Compresses the outgoing HTTP headers',
              'Disables JavaScript on the target page'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`noopener` prevents cross-origin tab-nabbing by setting `window.opener` to null, while `noreferrer` strips the referrer header.'
          },
          {
            questionText: 'How does the `defer` attribute on a `<script>` tag behave compared to `async`?',
            options: [
              '`defer` downloads the script in parallel and executes it after DOM parsing completes in order of appearance',
              '`defer` blocks HTML parsing immediately while downloading',
              '`defer` only works on internal inline scripts',
              '`defer` and `async` behave identically in modern browsers'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`defer` scripts execute in source order after the document has been parsed, preserving dependency sequence.'
          },
          {
            questionText: 'Which browser caching mechanism operates as a programmable network proxy intercepting requests even when offline?',
            options: ['Service Worker Cache Storage API', 'localStorage', 'SessionStorage', 'Cookies'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Service Workers run in the background, intercept network fetch events, and serve assets directly from the Cache API.'
          },
          {
            questionText: 'What is the primary security vulnerability mitigated by implementing a strict Content Security Policy (CSP)?',
            options: ['Cross-Site Scripting (XSS)', 'SQL Injection', 'Server-Side Denial of Service', 'DNS Spoofing'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'CSP restricts where scripts and resources can be loaded and executed from, significantly neutralizing XSS exploits.'
          },
          {
            questionText: 'What is Tree Shaking in modern web bundlers such as Vite / Rollup?',
            options: [
              'Dead-code elimination that removes unused ES module exports from the final production bundle',
              'A CSS animation that shakes DOM nodes during validation errors',
              'A directory compression algorithm for image assets',
              'A method for encrypting JavaScript source files'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Tree shaking analyzes static ES6 `import`/`export` syntax to exclude unused code from bundles.'
          },
          {
            questionText: 'What does the `SameSite=Strict` cookie attribute enforce?',
            options: [
              'The cookie is never sent in cross-site requests, mitigating Cross-Site Request Forgery (CSRF)',
              'The cookie can only be read by JavaScript `document.cookie`',
              'The cookie expires within 60 seconds',
              'The cookie only works on localhost'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`SameSite=Strict` stops cookies from being sent along with third-party website requests, preventing CSRF attacks.'
          },
          {
            questionText: 'What optimization technique splits code into smaller chunks that load only when a user navigates to a specific route?',
            options: ['Dynamic Import / Code Splitting (`import()`)', 'Gzip compression', 'Image Lazy Loading', 'Server-Side Rendering'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Dynamic `import()` enables code splitting, allowing browsers to download only the JavaScript needed for the current view.'
          },
          {
            questionText: 'Which HTTP/2 and HTTP/3 capability solves the Head-of-Line blocking issue present in HTTP/1.1?',
            options: ['Multiplexed Streams over a single connection', 'Cookie compression', 'Base64 image inlining', 'DNS prefetching'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Multiplexing interleaves multiple bidirectional request and response frames simultaneously over a single TCP/QUIC stream.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Build a Semantic HTML5 Personal Resume Page',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Construct a fully semantic single-page resume using HTML5 landmarks (<header>, <nav>, <main>, <section>, <article>, <footer>) with valid document outline.'
      },
      {
        title: 'Create a Responsive Product Landing Page',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Design and code a fully responsive product landing page incorporating CSS Grid, Flexbox, media queries for mobile/tablet/desktop, and a functional contact modal.'
      },
      {
        title: 'Web Application Performance & Accessibility Audit',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Audit and refactor an existing web template to achieve 95+ Google Lighthouse scores across Performance, Accessibility, Best Practices, and SEO, submitting a comprehensive report.'
      }
    ]
  },

  // 3. Python Programming
  {
    courseTitle: 'Python Programming',
    quizzes: [
      {
        title: 'Python Programming Core Concepts Quiz',
        difficulty: 'Beginner',
        description: 'Test foundational understanding of Python syntax, data types, slicing, and flow control.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which built-in Python data structure is ordered, indexed, and immutable?',
            options: ['list', 'tuple', 'set', 'dictionary'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Tuples are ordered and indexed sequences that cannot be modified after instantiation.'
          },
          {
            questionText: 'What will `print([1, 2, 3] * 2)` output in Python?',
            options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '[[1, 2, 3], [1, 2, 3]]', 'TypeError'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Multiplying a list by an integer concatenates duplicates of the elements into a single list.'
          },
          {
            questionText: 'What is the correct syntax for defining a function in Python?',
            options: ['function my_func():', 'def my_func():', 'func my_func():', 'define my_func():'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Functions in Python are defined with the `def` keyword followed by the identifier and parentheses.'
          },
          {
            questionText: 'What is the output of `bool("")`, `bool(0)`, and `bool([])` in Python?',
            options: ['All evaluate to False', 'All evaluate to True', 'True, False, False', 'False, True, False'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In Python, empty strings, integer zero, and empty collections are falsy and evaluate to `False`.'
          },
          {
            questionText: 'Which Python keyword is used to handle exceptions inside a `try` block?',
            options: ['catch', 'except', 'handle', 'rescue'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'Python uses `try ... except ... finally` syntax to catch and process exceptions.'
          }
        ]
      },
      {
        title: 'Functions, Comprehensions, and Data Structures',
        difficulty: 'Intermediate',
        description: 'Assess proficiency in list/dict comprehensions, `*args`/`**kwargs`, lambda functions, and file I/O.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the evaluated output of the list comprehension `[x**2 for x in range(5) if x % 2 == 1]`?',
            options: ['[1, 9]', '[0, 4, 16]', '[1, 4, 9]', '[0, 1, 4, 9, 16]'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Range(5) produces 0, 1, 2, 3, 4. Odd numbers are 1 and 3; their squares are 1 and 9.'
          },
          {
            questionText: 'What do `*args` and `**kwargs` represent in a Python function parameter list?',
            options: [
              '`*args` gathers variable positional arguments as a tuple; `**kwargs` gathers keyword arguments as a dictionary',
              '`*args` represents pointers; `**kwargs` represents double pointers',
              '`*args` must be integers; `**kwargs` must be strings',
              '`*args` and `**kwargs` are reserved keywords for mathematical operators'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`*args` collects arbitrary positional arguments into a tuple, while `**kwargs` collects keyword arguments into a dictionary.'
          },
          {
            questionText: 'What is the advantage of using `with open("file.txt", "r") as f:` over calling `f = open()` directly?',
            options: [
              'The context manager guarantees the file is automatically closed upon block exit, even if exceptions occur',
              'It reads the file 10x faster using binary threads',
              'It encrypts the contents of the file on disk',
              'It prevents other processes from reading the file permanently'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The `with` statement utilizes the context manager protocol (`__enter__` and `__exit__`) to reliably release file resources.'
          },
          {
            questionText: 'What happens when you look up a non-existent key in a Python `dict` using `my_dict.get(key, "default")`?',
            options: [
              'It returns `"default"` without raising a `KeyError`',
              'It raises a `KeyError` exception immediately',
              'It inserts the key with `"default"` into the dictionary',
              'It crashes the Python runtime'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`dict.get(key, default)` safely returns the default value if the key is not present, avoiding `KeyError`.'
          },
          {
            questionText: 'Which Python standard library module provides high-performance container types like `defaultdict`, `Counter`, and `deque`?',
            options: ['collections', 'itertools', 'functools', 'containers'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The `collections` module provides specialized alternatives to Python\'s built-in general purpose containers.'
          },
          {
            questionText: 'What is the behavior of the `zip()` function when passed two lists of unequal length?',
            options: [
              'It stops aggregating elements when the shortest input iterable is exhausted',
              'It raises a `ValueError` exception',
              'It fills missing elements with `None` automatically',
              'It repeats elements of the shorter list'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Standard `zip()` truncates to the length of the shortest iterable. To pad missing values, `itertools.zip_longest()` is used.'
          },
          {
            questionText: 'What does a Python generator function contain that differentiates it from a regular function?',
            options: ['The `yield` keyword', 'The `return async` keyword', 'The `@generator` decorator', 'No parentheses in its definition'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A function containing `yield` returns a generator iterator, producing values lazily on demand.'
          }
        ]
      },
      {
        title: 'Object-Oriented Python, Metaclasses & Concurrency',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering OOP dunder methods, decorators, descriptors, GIL, and multiprocessing.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'In Python class design, what is the role of the `__init__` method compared to `__new__`?',
            options: [
              '`__new__` creates and returns the new instance, while `__init__` initializes the newly created instance',
              '`__init__` allocates OS memory, while `__new__` destroys garbage objects',
              '`__new__` is only called for subclasses of dictionary',
              'Both methods are identical and interchangeable'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`__new__` is the static constructor that creates the instance, and `__init__` is the initializer called with the instance.'
          },
          {
            questionText: 'What is Python\'s Global Interpreter Lock (GIL) and its impact on multithreading in CPython?',
            options: [
              'A mutex that allows only one native thread to execute Python bytecode at a time, preventing CPU-bound multithreaded parallelism',
              'A security lock that encrypts variables during execution',
              'A mechanism that speeds up mathematical loops by 100%',
              'A database deadlock prevention protocol'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The GIL prevents multi-core CPU scaling for CPU-bound tasks in CPython. `multiprocessing` or `asyncio` is used instead.'
          },
          {
            questionText: 'What does the `@property` decorator achieve on a Python class method?',
            options: [
              'Allows a method to be accessed as an attribute getter, with optional `@attr.setter` definitions',
              'Makes the method private and uncallable from outside the class',
              'Converts the method to run as a static method without `self`',
              'Serializes the return value to JSON'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`@property` creates a getter descriptor, allowing encapsulation and attribute-style access.'
          },
          {
            questionText: 'What algorithm does Python utilize to compute Method Resolution Order (MRO) for multiple inheritance?',
            options: ['C3 Linearization', 'Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra\'s Shortest Path'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Python uses the C3 Superclass Linearization algorithm to determine a deterministic order in multiple inheritance hierarchies.'
          },
          {
            questionText: 'What is a Python Decorator fundamentally under the hood?',
            options: [
              'A callable that takes a function as an argument and returns a modified or wrapped function',
              'A special class compiled in C language',
              'An HTML template styling tag',
              'A syntax error if used outside a class'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Decorators are higher-order functions that accept and wrap a callable to extend its behavior without modifying source code.'
          },
          {
            questionText: 'What is the purpose of `__slots__` inside a Python class definition?',
            options: [
              'Restricts valid attributes to an explicit sequence, preventing `__dict__` creation and saving significant memory for millions of instances',
              'Allocates GPU memory for machine learning operations',
              'Allows multiple constructors in a class',
              'Automatically creates database table columns'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`__slots__` bypasses per-instance `__dict__` generation, decreasing memory overhead and optimizing attribute lookup.'
          },
          {
            questionText: 'Which Python standard library module is used to run CPU-bound parallel tasks across multiple CPU cores?',
            options: ['multiprocessing', 'threading', 'asyncio', 'concurrent.futures.ThreadPoolExecutor'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`multiprocessing` bypasses the GIL by spawning separate Python processes with their own memory space and interpreter.'
          },
          {
            questionText: 'What is the difference between `deepcopy` and `copy` in Python\'s `copy` module?',
            options: [
              '`copy` creates a shallow copy where nested objects are referenced; `deepcopy` recursively clones all nested objects',
              '`deepcopy` only works on strings and numbers',
              '`copy` deletes the original object after copying',
              'There is no functional difference'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Shallow copies duplicate the container but copy references to nested elements. Deep copies duplicate all nested objects recursively.'
          },
          {
            questionText: 'How can you implement a Singleton design pattern cleanly in Python?',
            options: [
              'By overriding the `__new__` method of a class or implementing a custom Metaclass',
              'By declaring all variables as `global`',
              'By marking the file as read-only',
              'Python does not support singletons'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Overriding `__new__` allows returning an existing class instance if one has already been created, enforcing a single instance.'
          },
          {
            questionText: 'What will `isinstance(True, int)` evaluate to in Python?',
            options: ['True', 'False', 'TypeError', 'None'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In Python, `bool` is a direct subclass of `int` where `True == 1` and `False == 0`.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Simple Python Command-Line Calculator',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Create an interactive command-line calculator in Python that accepts user expressions, validates inputs, handles division by zero, and logs history to a text file.'
      },
      {
        title: 'File Handling & Data Parsing Program',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Write a Python program that reads a structured CSV file, sanitizes missing fields, aggregates departmental statistical metrics, and generates a formatted JSON report.'
      },
      {
        title: 'Build a Student Grade Management System',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Architect a complete object-oriented system with Student, Course, and GradeBook classes featuring data persistence, GPA calculations, report generation, and automated unit tests.'
      }
    ]
  },

  // 4. Java Programming
  {
    courseTitle: 'Java Programming',
    quizzes: [
      {
        title: 'Java Object-Oriented Programming Quiz',
        difficulty: 'Beginner',
        description: 'Test introductory knowledge of Java primitives, classes, JVM, and control flow.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the platform-independent intermediate representation produced by the `javac` compiler?',
            options: ['Java Bytecode (.class files)', 'Native x86 Machine Code', 'Assembly Text (.asm)', 'C++ Source Code'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Java source code is compiled into platform-neutral bytecode that runs on any compatible Java Virtual Machine (JVM).'
          },
          {
            questionText: 'Which keyword in Java prevents a class from being inherited or a method from being overridden?',
            options: ['static', 'final', 'abstract', 'const'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'The `final` keyword prevents method overriding, variable reassignment, and class inheritance.'
          },
          {
            questionText: 'Which primitive data type in Java occupies exactly 64 bits of storage in memory?',
            options: ['int', 'long', 'short', 'float'],
            correctOptionIndex: 1,
            marks: 2,
            explanation: 'In Java, `long` and `double` occupy 64 bits (8 bytes), while `int` and `float` occupy 32 bits.'
          },
          {
            questionText: 'What is the default value of an uninitialized instance variable of reference type (e.g. `String s;`) in Java?',
            options: ['null', '"" (empty string)', 'undefined', '0'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'All object references in Java default to `null` if not explicitly initialized.'
          },
          {
            questionText: 'What is method overloading in Java?',
            options: [
              'Defining multiple methods in the same class with identical names but different parameter lists',
              'Redefining a superclass method in a subclass with the same signature',
              'Running a method across multiple threads simultaneously',
              'Calling a method recursively until a stack overflow occurs'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Overloading occurs when methods share the same name within a class but differ in parameter type, number, or order.'
          }
        ]
      },
      {
        title: 'Inheritance, Interfaces, and Exception Handling',
        difficulty: 'Intermediate',
        description: 'Assess understanding of abstract classes, interface contracts, checked vs unchecked exceptions, and polymorphism.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the difference between an Abstract Class and an Interface in modern Java (Java 8+)?',
            options: [
              'A class can implement multiple interfaces but extend only one abstract class; abstract classes can maintain instance state',
              'Interfaces cannot contain any method implementations under any circumstances',
              'Abstract classes cannot have constructors',
              'Interfaces can instantiate objects directly using `new`'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Java supports multiple interface implementation, while abstract classes provide single inheritance and can store instance state.'
          },
          {
            questionText: 'Which category of exceptions in Java must be either caught with a `try-catch` block or declared in a `throws` clause?',
            options: ['Checked Exceptions (subclasses of Exception excluding RuntimeException)', 'Unchecked Exceptions (RuntimeException)', 'Errors (OutOfMemoryError)', 'StackOverflowError'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Checked exceptions are verified at compile time by the compiler, requiring explicit handling.'
          },
          {
            questionText: 'What is the purpose of the `try-with-resources` statement introduced in Java 7?',
            options: [
              'Automatically closes resources that implement `AutoCloseable` upon block completion',
              'Increases heap memory size dynamically',
              'Catches all runtime errors without requiring a catch block',
              'Allows downloading external jar files automatically'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`try-with-resources` ensures that any resource implementing `java.lang.AutoCloseable` is closed automatically.'
          },
          {
            questionText: 'What will happen if you attempt to instantiate an abstract class using `new AbstractClass()` in Java?',
            options: ['Compilation Error', 'Runtime NullPointerException', 'A dummy object is created', 'JVM warning only'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Abstract classes are incomplete blueprints and cannot be instantiated directly; they must be extended.'
          },
          {
            questionText: 'What is the access level of a member marked with the `protected` modifier in Java?',
            options: [
              'Accessible within the same package and by subclasses in any package',
              'Accessible only within the same class',
              'Accessible only by subclasses in different packages',
              'Universally accessible to all code everywhere'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`protected` grants access to all classes in the same package, plus subclasses regardless of their package location.'
          },
          {
            questionText: 'Why should the `@Override` annotation always be used when overriding a superclass method?',
            options: [
              'It instructs the compiler to verify that the method actually overrides a superclass method, catching spelling/signature errors',
              'It is strictly mandatory for the code to compile in Java',
              'It turns the method into an asynchronous thread',
              'It disables garbage collection for the method'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`@Override` provides compile-time safety by raising a compilation error if no matching superclass method exists.'
          },
          {
            questionText: 'What is the purpose of `super()` in a subclass constructor in Java?',
            options: [
              'Invokes the constructor of the direct superclass to initialize inherited state',
              'Creates a static reference to the JVM runtime',
              'Instantiates a superuser thread',
              'Bypasses private access modifiers'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`super()` invokes a constructor in the superclass, ensuring base class state is properly constructed.'
          }
        ]
      },
      {
        title: 'Java Collections Framework, Generics & Multithreading',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering HashMaps, ConcurrentHashMap, Generics type erasure, and Thread Synchronization.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'How does Java\'s `HashMap` handle bucket collisions when the number of items in a bucket exceeds the `TREEIFY_THRESHOLD` (default 8)?',
            options: [
              'Converts the linked list in the bucket into a balanced Red-Black Tree (O(log n) lookup)',
              'Discards older keys and replaces them with new entries',
              'Throws a `CollisionException`',
              'Doubles the thread stack size'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In Java 8+, heavily collided HashMap buckets transition from linked lists to red-black trees to prevent O(n) denial-of-service degradation.'
          },
          {
            questionText: 'What is Type Erasure in Java Generics?',
            options: [
              'Generic type parameters are removed by the compiler at compile time and replaced with their bounds or `Object`',
              'A garbage collector technique that clears generic variables',
              'An IDE feature that deletes untyped code',
              'A runtime error that occurs when casting arrays'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Java uses type erasure for backward compatibility with pre-generics code; generic types are not retained at runtime.'
          },
          {
            questionText: 'Why is `ConcurrentHashMap` significantly more scalable for concurrent writes than `Collections.synchronizedMap()`?',
            options: [
              '`ConcurrentHashMap` uses fine-grained lock striping and compare-and-swap (CAS) operations rather than locking the entire map',
              '`ConcurrentHashMap` disables thread synchronization entirely',
              '`ConcurrentHashMap` stores data in non-volatile SSD memory',
              '`ConcurrentHashMap` creates duplicate maps for every thread'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`ConcurrentHashMap` allows concurrent reads and partitions write locks per bucket/segment, while synchronizedMap locks the entire collection.'
          },
          {
            questionText: 'What does the `volatile` keyword guarantee when applied to a variable in Java?',
            options: [
              'Guarantees memory visibility across all threads and prevents instruction reordering optimizations for that variable',
              'Guarantees atomic execution of compound operations like `count++`',
              'Prevents the variable from being modified after initialization',
              'Stores the variable in the GPU register'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`volatile` ensures changes made by one thread are immediately visible to all other threads, preventing CPU cache staleness.'
          },
          {
            questionText: 'What contract must be upheld between `equals()` and `hashCode()` methods in Java?',
            options: [
              'If two objects are equal according to `equals()`, they MUST produce the same `hashCode()` value',
              'If two objects have the same `hashCode()`, they must be equal according to `equals()`',
              '`hashCode()` must always return an odd positive integer',
              'There is no required relationship between them'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'If `a.equals(b)` is true, `a.hashCode() == b.hashCode()` must strictly hold true to ensure correct behavior in hash-based collections.'
          },
          {
            questionText: 'Which class in `java.util.concurrent` represents a thread pool executor for managing asynchronous task execution?',
            options: ['ThreadPoolExecutor / Executors', 'ThreadDispatcher', 'TaskManager', 'ParallelRunner'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`ThreadPoolExecutor` manages a pool of worker threads, queuing tasks and reusing existing threads efficiently.'
          },
          {
            questionText: 'What is the purpose of the Java Memory Model (JMM) "happens-before" guarantee?',
            options: [
              'Defines formal conditions under which memory writes by one thread are guaranteed to be visible to another thread',
              'Ensures that constructors run before any methods are invoked',
              'Guarantees database transactions commit in order',
              'Prevents out of memory exceptions in heap allocations'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The happens-before relationship specifies memory visibility constraints across concurrent threads in Java.'
          },
          {
            questionText: 'What is the difference between `Comparable<T>` and `Comparator<T>` in Java?',
            options: [
              '`Comparable` provides natural ordering within the class itself via `compareTo()`; `Comparator` defines external custom sorting logic via `compare()`',
              '`Comparable` is for numbers only; `Comparator` is for strings only',
              '`Comparator` cannot be used with `Collections.sort()`',
              'There is no difference between them'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`Comparable` defines default/natural sorting inside a class, while `Comparator` allows multiple external ordering strategies.'
          },
          {
            questionText: 'What does `Thread.join()` do when called on thread instance `t1` from the main thread?',
            options: [
              'Blocks the current thread until `t1` finishes execution',
              'Merges the memory of both threads into one',
              'Forces `t1` to stop immediately',
              'Synchronizes all locks held by `t1`'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`join()` blocks the calling thread until the referenced thread completes its task.'
          },
          {
            questionText: 'Which Java functional interface represents a function that accepts one argument and produces a boolean result?',
            options: ['Predicate<T>', 'Function<T, R>', 'Consumer<T>', 'Supplier<T>'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`java.util.function.Predicate<T>` accepts an argument of type T and returns a `boolean` from its `test()` method.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Java Console Utility with Control Flow & Arrays',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Implement a Java console program demonstrating proper object encapsulation, array processing, user input handling with Scanner, and data validation.'
      },
      {
        title: 'Implement an Object-Oriented Banking System',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Design and implement a banking domain model with BankAccount base class, SavingsAccount, and CheckingAccount subclasses featuring interest calculation and custom exceptions.'
      },
      {
        title: 'Multithreaded Producer-Consumer Queue System',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Build a high-performance multithreaded simulation using blocking queues, reentrant locks, thread pools, and producer/consumer threads with comprehensive unit testing.'
      }
    ]
  },

  // 5. Database Management Systems
  {
    courseTitle: 'Database Management Systems',
    quizzes: [
      {
        title: 'Relational Database Design & SQL Quiz',
        difficulty: 'Beginner',
        description: 'Verify core relational model principles, primary keys, foreign keys, and basic SQL commands.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What does the primary key constraint enforce on a relational database table?',
            options: [
              'Uniqueness of values and disallowance of NULL values for the designated column(s)',
              'Automatic encryption of the table data',
              'Sorting of data in descending alphabetical order',
              'Linking the table to an external cloud database'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A Primary Key uniquely identifies each row in a table and cannot contain NULL values.'
          },
          {
            questionText: 'Which SQL clause is used to filter records based on aggregate function results (e.g. `COUNT() > 5`)?',
            options: ['HAVING', 'WHERE', 'GROUP BY', 'ORDER BY'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`HAVING` filters grouped rows after aggregation, while `WHERE` filters individual rows prior to aggregation.'
          },
          {
            questionText: 'What does ACID stand for in database transaction management?',
            options: [
              'Atomicity, Consistency, Isolation, Durability',
              'Authentication, Cryptography, Integrity, Decryption',
              'Access, Control, Indexing, Data',
              'Allocation, Clustered, Indexed, Direct'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'ACID defines the four fundamental transaction properties: Atomicity, Consistency, Isolation, and Durability.'
          },
          {
            questionText: 'Which SQL statement is used to remove all records from a table quickly while preserving table structure, without logging individual row deletions?',
            options: ['TRUNCATE TABLE', 'DROP TABLE', 'DELETE ALL', 'REMOVE FROM'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`TRUNCATE TABLE` resets the table by deallocating data pages, operating much faster than row-by-row `DELETE`.'
          },
          {
            questionText: 'What type of JOIN returns all records from the left table and matched records from the right table, filling missing right-side attributes with NULL?',
            options: ['LEFT OUTER JOIN', 'INNER JOIN', 'CROSS JOIN', 'FULL OUTER JOIN'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A `LEFT JOIN` returns all rows from the left table and matching rows from the right table, or NULL if no match exists.'
          }
        ]
      },
      {
        title: 'SQL Queries, Joins, and Relational Algebra',
        difficulty: 'Intermediate',
        description: 'Test advanced SQL querying, subqueries, group by operations, and relational algebra operators.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which relational algebra operation corresponds to filtering rows based on a boolean condition (horizontal partitioning)?',
            options: ['Selection (σ)', 'Projection (π)', 'Cartesian Product (×)', 'Intersection (∩)'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Selection (denoted by Greek letter sigma σ) selects tuples that satisfy a given predicate.'
          },
          {
            questionText: 'What is a Correlated Subquery in SQL?',
            options: [
              'A subquery that uses values from the outer query, evaluating once per each row processed by the outer query',
              'A subquery that runs independently and only executes once',
              'A subquery that joins two databases on different servers',
              'A query that creates database indexes automatically'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A correlated subquery references columns from the outer query and re-evaluates for every candidate row.'
          },
          {
            questionText: 'What does `UNION` do compared to `UNION ALL` in standard SQL?',
            options: [
              '`UNION` eliminates duplicate rows from the combined result sets; `UNION ALL` retains all duplicates',
              '`UNION ALL` is faster because it sorts all results alphabetically',
              '`UNION` only works on numbers while `UNION ALL` works on text',
              'There is no difference between them'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`UNION` performs a duplicate elimination step, whereas `UNION ALL` directly concatenates rows without deduplication.'
          },
          {
            questionText: 'Which SQL window function assigns sequential rank numbers to rows within a partition without leaving gaps in ranking for tied values?',
            options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'NTILE()'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`DENSE_RANK()` produces consecutive rankings (e.g. 1, 2, 2, 3), whereas `RANK()` skips positions on ties (e.g. 1, 2, 2, 4).'
          },
          {
            questionText: 'What is a Database View?',
            options: [
              'A virtual table based on the result-set of an SQL statement, which does not store physical data unless materialized',
              'A graphical dashboard showing server CPU usage',
              'A physical backup file stored on disk',
              'A special table that only stores images'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A standard View is a stored query definition that dynamically generates its result set whenever queried.'
          },
          {
            questionText: 'What relational algebra operator corresponds to selecting specific columns (vertical partitioning)?',
            options: ['Projection (π)', 'Selection (σ)', 'Join (⋈)', 'Division (÷)'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Projection (denoted by Greek letter pi π) extracts specified columns from a relation while dropping all others.'
          },
          {
            questionText: 'What happens when an `INNER JOIN` is executed between two tables with no matching keys?',
            options: ['It returns an empty result set (0 rows)', 'It returns all rows from both tables', 'It raises a foreign key violation', 'It returns NULL rows'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An `INNER JOIN` requires predicate matches in both tables; if no keys match, 0 rows are returned.'
          }
        ]
      },
      {
        title: 'Normalization, Transactions, Indexing & Concurrency',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering 1NF through BCNF normalization, B-tree indexes, isolation levels, and WAL logging.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What condition must a relation satisfy to be in Third Normal Form (3NF)?',
            options: [
              'It must be in 2NF, and no non-prime attribute may be transitively dependent on any candidate key',
              'It must have no composite primary keys',
              'It must only contain string and integer attributes',
              'All attributes must be foreign keys'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '3NF eliminates transitive functional dependencies (where non-key attribute A determines non-key attribute B).'
          },
          {
            questionText: 'How does Boyce-Codd Normal Form (BCNF) differ from standard 3NF?',
            options: [
              'In BCNF, for every functional dependency X -> Y, X MUST be a superkey (no exceptions for prime attributes)',
              'BCNF allows multi-valued dependencies while 3NF does not',
              '3NF is strictly more restrictive than BCNF',
              'BCNF does not require 1NF compliance'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'BCNF is a stricter version of 3NF where every determinant in a functional dependency must be a superkey.'
          },
          {
            questionText: 'What concurrency phenomenon is permitted under the `READ COMMITTED` isolation level but prevented under `REPEATABLE READ`?',
            options: ['Non-Repeatable Reads', 'Dirty Reads', 'Lost Updates', 'Deadlocks'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In `READ COMMITTED`, reading the same row twice within a transaction may return different values if another transaction committed changes in between.'
          },
          {
            questionText: 'What is a Phantom Read in database transaction isolation anomalies?',
            options: [
              'A transaction re-executes a range query and discovers new rows inserted and committed by another transaction',
              'Reading uncommitted data that is later rolled back',
              'Reading data that was corrupted during disk failure',
              'A query that takes infinite time to finish'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Phantom reads occur when a transaction queries a set of rows matching a condition, and a concurrent transaction commits new matching rows.'
          },
          {
            questionText: 'Why do relational databases commonly use B+ Tree data structures for disk indexing rather than standard Binary Search Trees?',
            options: [
              'High fanout minimizes disk I/O seeks, and leaf nodes are linked in a sequential chain for rapid range scans',
              'B+ Trees only work in RAM and avoid disk access completely',
              'B+ Trees require less memory than simple arrays',
              'Binary trees cannot store string keys'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'B+ trees maintain shallow depth with massive fanout, reducing the number of slow disk block reads needed to locate keys.'
          },
          {
            questionText: 'What is the purpose of the Write-Ahead Logging (WAL) protocol in database durability?',
            options: [
              'Ensures log records describing changes are written to persistent disk BEFORE corresponding data pages are modified on disk',
              'Logs all user passwords for audit purposes',
              'Backs up the database to Amazon S3 hourly',
              'Prevents users from executing DELETE statements'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'WAL guarantees that transaction changes are preserved on disk log records before dirty buffer pages are flushed, enabling crash recovery.'
          },
          {
            questionText: 'What does the Two-Phase Locking (2PL) protocol guarantee in concurrent transaction execution?',
            options: [
              'Conflict Serializability of transaction execution schedules',
              'Guaranteed freedom from deadlocks',
              'Zero lock wait time',
              'Instant query execution'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '2PL (growing phase where locks are acquired, shrinking phase where locks are released) guarantees conflict-serializable schedules.'
          },
          {
            questionText: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
            options: [
              'A clustered index dictates the physical sorting order of table rows on disk (only 1 per table); non-clustered indexes store pointers to rows',
              'Non-clustered indexes are always faster for large range scans',
              'Clustered indexes can be applied to 100 columns simultaneously',
              'There is no difference in modern relational engines'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Table rows are physically stored on disk in the order of the clustered index. Non-clustered indexes maintain separate leaf nodes with pointers.'
          },
          {
            questionText: 'What is a Deadlock in relational database locking, and how do database engines resolve it?',
            options: [
              'A cycle of mutual waiting among transactions for locks held by each other; engines detect cycles and abort/rollback one transaction (victim)',
              'A hardware disk failure that crashes the server',
              'A query that returns infinite results',
              'A situation resolved by waiting indefinitely'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Database engines use wait-for graph cycle detection or lock timeouts, choosing a transaction to abort and roll back.'
          },
          {
            questionText: 'What is a Surrogate Key in relational database schema design?',
            options: [
              'An artificially generated unique identifier (such as an auto-increment integer or UUID) with no business meaning',
              'A natural key derived from a government social security number',
              'A temporary key that expires after 24 hours',
              'A foreign key that points to multiple tables'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Surrogate keys are synthetic, meaningless unique identifiers used purely for stable primary key referencing.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Design an Entity-Relationship (ER) Diagram',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Model an educational institution domain including Students, Courses, Departments, and Instructors, identifying cardinalities, primary keys, and relationships in Chen or Crow\'s Foot notation.'
      },
      {
        title: 'Implement Advanced SQL Queries & Views',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Author a complete SQL script implementing complex multi-table joins, subqueries, aggregation with HAVING, and analytic window functions on an e-commerce schema.'
      },
      {
        title: 'Relational Schema Normalization & Query Design',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Normalize an unnormalized restaurant management database through 1NF, 2NF, 3NF, and BCNF, providing functional dependency diagrams, lossless join proofs, and index optimization plans.'
      }
    ]
  }
];

module.exports = assessmentsByCourse;
