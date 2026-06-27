### Example Application URL Output

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/07-adapters/04-testing-adapters.mdx

This is an example of the expected URL output from the deployment or start command, indicating the application's accessible address.

```bash
echo "http://127.0.0.1:3000"
```

--------------------------------

### Create Next.js App with Official Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/create-next-app.mdx

Use these commands to initialize a new Next.js project based on an official Next.js example from the repository, specifying the example name and your desired project name.

```bash
pnpm create next-app --example [example-name] [your-project-name]
```

```bash
npx create next-app@latest --example [example-name] [your-project-name]
```

```bash
yarn create next-app --example [example-name] [your-project-name]
```

```bash
bun create next-app --example [example-name] [your-project-name]
```

--------------------------------

### Start Development Server to Install Partytown

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx

Run the development server with your preferred package manager to initiate the installation of required Partytown packages for web worker script offloading.

```bash
pnpm dev
```

```bash
npm run dev
```

```bash
yarn dev
```

```bash
bun dev
```

--------------------------------

### Deploy or Start Application

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/07-adapters/04-testing-adapters.mdx

This placeholder represents the command used to start or deploy the application, which should output the application's URL.

```bash
provider-cli-to-deploy
```

--------------------------------

### GET Route Handler Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route.mdx

A basic example demonstrating how to create a GET Route Handler that returns a JSON response.

```APIDOC
## GET /api/hello

### Description
This example demonstrates a simple GET request handler that returns a JSON object. Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.

### Method
GET

### Endpoint
/api/hello

### Response
#### Success Response (200)
- **message** (string) - A greeting message.

#### Response Example
```json
{
  "message": "Hello World"
}
```
```

--------------------------------

### Install next-cache-components-adoption skill

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating-to-cache-components.mdx

Use this command to install the `next-cache-components-adoption` skill, which assists in migrating to Cache Components in Next.js projects.

```bash
npx skills add vercel/next.js --skill next-cache-components-adoption
```

--------------------------------

### File System Routing Example for App Router

Source: https://github.com/vercel/next.js/blob/canary/docs/04-community/01-contribution-guide.mdx

Demonstrates numerical prefixing for sorting pages in the App Router section, guiding developers through concepts in a specific order.

```txt
01-getting-started
├── 01-installation.mdx
├── 02-project-structure.mdx
├── 03-layouts-and-pages.mdx
└── ...
```

--------------------------------

### Install Playwright Manually

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/playwright.mdx

Run the Playwright creation command to initiate a guided setup process for Playwright in your existing project.

```bash
pnpm create playwright
```

```bash
npm init playwright
```

```bash
yarn create playwright
```

```bash
bun create playwright
```

--------------------------------

### Create Next.js App with Cypress Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/cypress.mdx

Use `create-next-app` with the `with-cypress` example to quickly scaffold a new Next.js project pre-configured for Cypress.

```bash
pnpm create next-app --example with-cypress with-cypress-app
```

```bash
npx create-next-app@latest --example with-cypress with-cypress-app
```

```bash
yarn create next-app --example with-cypress with-cypress-app
```

```bash
bun create next-app --example with-cypress with-cypress-app
```

--------------------------------

### Install `@next/third-parties` Library

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx

Install the `@next/third-parties` library and Next.js to enable optimized third-party integrations. This library is currently experimental and recommended to be installed with `@latest` or `@canary`.

```bash
pnpm add @next/third-parties@latest next@latest
```

```bash
npm install @next/third-parties@latest next@latest
```

```bash
yarn add @next/third-parties@latest next@latest
```

```bash
bun add @next/third-parties@latest next@latest
```

--------------------------------

### Create Next.js App with Playwright Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/playwright.mdx

Use `create-next-app` with the `with-playwright` example to quickly set up a Next.js project pre-configured with Playwright.

```bash
pnpm create next-app --example with-playwright with-playwright-app
```

```bash
npx create-next-app@latest --example with-playwright with-playwright-app
```

```bash
yarn create next-app --example with-playwright with-playwright-app
```

```bash
bun create next-app --example with-playwright with-playwright-app
```

--------------------------------

### Create Next.js App with Vitest Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/vitest.mdx

Use `create-next-app` with the `with-vitest` example to quickly scaffold a new Next.js project pre-configured for Vitest.

```bash
pnpm create next-app --example with-vitest with-vitest-app
```

```bash
npx create-next-app@latest --example with-vitest with-vitest-app
```

```bash
yarn create next-app --example with-vitest with-vitest-app
```

```bash
bun create next-app --example with-vitest with-vitest-app
```

--------------------------------

### Install Vitest and Testing Dependencies

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/vitest.mdx

Install Vitest and related testing libraries as development dependencies for manual setup. Choose the appropriate command based on your package manager and whether you are using TypeScript or JavaScript.

```bash
# Using TypeScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Using TypeScript
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Using TypeScript
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Using TypeScript
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

--------------------------------

### Manually Install Next.js Dependencies

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx

Install `next`, `react`, and `react-dom` using various package managers for a manual Next.js project setup.

```bash
pnpm i next@latest react@latest react-dom@latest
```

```bash
npm i next@latest react@latest react-dom@latest
```

```bash
yarn add next@latest react@latest react-dom@latest
```

```bash
bun add next@latest react@latest react-dom@latest
```

--------------------------------

### Create Next.js App with Public GitHub Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/create-next-app.mdx

Use these commands to initialize a new Next.js project from any public GitHub repository by providing its URL as the example source.

```bash
pnpm create next-app --example "https://github.com/.../" [your-project-name]
```

```bash
npx create next-app@latest --example "https://github.com/.../" [your-project-name]
```

```bash
yarn create next-app --example "https://github.com/.../" [your-project-name]
```

```bash
bun create next-app --example "https://github.com/.../" [your-project-name]
```

--------------------------------

### Create Next.js App with Jest Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx

Use `create-next-app` with the `with-jest` example to quickly scaffold a new Next.js project pre-configured with Jest.

```bash
pnpm create next-app --example with-jest with-jest-app
```

```bash
npx create-next-app@latest --example with-jest with-jest-app
```

```bash
yarn create next-app --example with-jest with-jest-app
```

```bash
bun create next-app --example with-jest with-jest-app
```

--------------------------------

### Implement CacheHandler get() Method

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.mdx

Example implementation of the `get()` method for a custom cache handler, demonstrating how to retrieve a cache entry and check for expiration based on the `revalidate` time.

```javascript
const cacheHandler = {
  async get(cacheKey, softTags) {
    const entry = cache.get(cacheKey)
    if (!entry) return undefined

    // Check if expired
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },
}
```

--------------------------------

### Install web-push CLI Globally

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx

Installs the `web-push` command-line interface globally to generate VAPID keys. Choose the command corresponding to your preferred package manager.

```bash
pnpm add -g web-push
```

```bash
npm install -g web-push
```

```bash
yarn global add web-push
```

```bash
bun add -g web-push
```

--------------------------------

### Start Next.js Development Server

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mcp.mdx

Start your Next.js development server using your preferred package manager to enable MCP agent connection.

```bash
pnpm dev
```

```bash
npm run dev
```

```bash
yarn dev
```

```bash
bun dev
```

--------------------------------

### Install OpenTelemetry packages

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx

Install the necessary OpenTelemetry SDK and exporter packages for manual configuration in your Next.js project.

```bash
pnpm add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash
npm install @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash
yarn add @opentelemetry/sdk-node @opetelemety/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

```bash
bun add @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http
```

--------------------------------

### Start Next.js Standalone Server Locally

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/output.mdx

Run the minimal `server.js` file generated in the `standalone` output directory to start the Next.js production server.

```bash
node .next/standalone/server.js
```

--------------------------------

### Install @next/bundle-analyzer plugin

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/package-bundling.mdx

Install the `@next/bundle-analyzer` plugin as a development dependency for Webpack-based bundle analysis.

```bash
pnpm add @next/bundle-analyzer
```

```bash
npm install @next/bundle-analyzer
```

```bash
yarn add @next/bundle-analyzer
```

```bash
bun add @next/bundle-analyzer
```

--------------------------------

### Examples of Next.js Upgrade Command

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx

These examples demonstrate how to use the npx @next/codemod upgrade command with different revision options to target specific upgrade types or versions.

```bash
# Upgrade to the latest patch (e.g. 16.0.7 -> 16.0.8)
npx @next/codemod upgrade patch
```

```bash
# Upgrade to the latest minor (e.g. 15.3.7 -> 15.4.8). This is the default.
npx @next/codemod upgrade minor
```

```bash
# Upgrade to the latest major (e.g. 15.5.7 -> 16.0.7)
npx @next/codemod upgrade major
```

```bash
# Upgrade to a specific version
npx @next/codemod upgrade 16
```

```bash
# Upgrade to the canary release
npx @next/codemod upgrade canary
```

--------------------------------

### Update Next.js and run development server with Turbopack

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/local-development.mdx

Ensures the latest Next.js version is installed and starts the development server, which uses Turbopack by default for improved performance.

```bash
pnpm add next@latest
pnpm dev  # Turbopack is used by default
```

```bash
npm install next@latest
npm run dev  # Turbopack is used by default
```

```bash
yarn add next@latest
yarn dev  # Turbopack is used by default
```

```bash
bun add next@latest
bun dev  # Turbopack is used by default
```

--------------------------------

### Install ESLint and Next.js Configuration

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/03-eslint.mdx

Install the necessary ESLint and Next.js configuration packages as development dependencies using your preferred package manager.

```bash
pnpm add -D eslint eslint-config-next
```

```bash
npm i -D eslint eslint-config-next
```

```bash
yarn add --dev eslint eslint-config-next
```

```bash
bun add -d eslint eslint-config-next
```

--------------------------------

### GET /api

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/backend-for-frontend.mdx

This snippet demonstrates how to create a basic GET Route Handler that responds to requests sent to `/api`.

```APIDOC
## GET /api

### Description
This endpoint handles GET requests to the `/api` path. It serves as a basic example of a Route Handler that can be accessed by any client.

### Method
GET

### Endpoint
/api

### Response
#### Success Response (200)
This endpoint returns an empty response with a 200 OK status.

#### Response Example
(No body)
```

--------------------------------

### Initialize Next.js Project with CLI

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx

Run `create-next-app` to start the interactive command-line interface for creating a new Next.js project, allowing customization of settings.

```bash
pnpm create next-app
```

```bash
npx create-next-app@latest
```

```bash
yarn create next-app
```

```bash
bun create next-app
```

--------------------------------

### Configure Jest to load setup files

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx

Add this option to your Jest configuration file to specify a setup file that runs before each test.

```ts
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
```

```js
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

--------------------------------

### Install Jest and React Testing Library

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx

Install Jest, `jest-environment-jsdom`, and React Testing Library packages as development dependencies for testing Next.js applications.

```bash
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
bun add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

--------------------------------

### Run Next.js Dev Server with bun

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Command to start the Next.js development server using the bun package manager.

```bash
bun dev
```

--------------------------------

### Install Tailwind CSS

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/11-css.mdx

Install Tailwind CSS and its PostCSS plugin using your preferred package manager.

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

```bash
yarn add -D tailwindcss @tailwindcss/postcss
```

```bash
bun add -D tailwindcss @tailwindcss/postcss
```

--------------------------------

### Start Next.js with custom port using PORT environment variable

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/upgrading/version-11.mdx

Use the `PORT` environment variable to specify the port for `next start` when `-p`/`--port` is not feasible.

```bash
PORT=4000 next start
```

--------------------------------

### Install React Compiler Babel Plugin

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-16.mdx

Install the `babel-plugin-react-compiler` package as a development dependency using your preferred package manager.

```bash
pnpm add -D babel-plugin-react-compiler
```

```bash
npm install -D babel-plugin-react-compiler
```

```bash
yarn add -D babel-plugin-react-compiler
```

```bash
bun add -D babel-plugin-react-compiler
```

--------------------------------

### Install @next/eslint-plugin-next

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/03-eslint.mdx

Install the Next.js ESLint plugin as a development dependency to integrate Next.js specific linting rules into your project.

```bash
pnpm add -D @next/eslint-plugin-next
```

```bash
npm i -D @next/eslint-plugin-next
```

```bash
yarn add --dev @next/eslint-plugin-next
```

```bash
bun add -d @next/eslint-plugin-next
```

--------------------------------

### Implement Basic In-Memory Cache Handler in JavaScript

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.mdx

This example provides a minimal in-memory cache handler using a JavaScript Map for storage. It includes basic logic for getting and setting cache entries, handling expiration, and managing pending set operations, while `refreshTags` and `getExpiration` are no-ops.

```js
const cache = new Map()
const pendingSets = new Map()

module.exports = {
  async get(cacheKey, softTags) {
    // Wait for any pending set operation to complete
    const pendingPromise = pendingSets.get(cacheKey)
    if (pendingPromise) {
      await pendingPromise
    }

    const entry = cache.get(cacheKey)
    if (!entry) {
      return undefined
    }

    // Check if entry has expired
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },

  async set(cacheKey, pendingEntry) {
    // Create a promise to track this set operation
    let resolvePending
    const pendingPromise = new Promise((resolve) => {
      resolvePending = resolve
    })
    pendingSets.set(cacheKey, pendingPromise)

    try {
      // Wait for the entry to be ready
      const entry = await pendingEntry

      // Store the entry in the cache
      cache.set(cacheKey, entry)
    } finally {
      resolvePending()
      pendingSets.delete(cacheKey)
    }
  },

  async refreshTags() {
    // No-op for in-memory cache
  },

  async getExpiration(tags) {
    // Return 0 to indicate no tags have been revalidated
    return 0
  },

  async updateTags(tags, durations) {
    // Implement tag-based invalidation
    for (const [key, entry] of cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  }
}
```

--------------------------------

### Basic Next.js Adapter Structure (my-adapter.js)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/07-adapters/02-creating-an-adapter.mdx

This example demonstrates a minimal Next.js adapter, showing how to implement `modifyConfig` to adjust the Next.js configuration during different build phases and `onBuildComplete` to process build outputs and routing information.

```js
/** @type {import('next').NextAdapter} */
const adapter = {
  name: 'my-custom-adapter',

  async modifyConfig(config, { phase }) {
    // Modify the Next.js config based on the build phase
    if (phase === 'phase-production-build') {
      return {
        ...config,
        // Add your modifications
      }
    }
    return config
  },

  async onBuildComplete({
    routing,
    outputs,
    projectDir,
    repoRoot,
    distDir,
    config,
    nextVersion,
    buildId,
  }) {
    // Process the build output
    console.log('Build completed with', outputs.pages.length, 'pages')
    console.log('Build ID:', buildId)
    console.log('Dynamic routes:', routing.dynamicRoutes.length)

    // Access emitted output entries
    for (const page of outputs.pages) {
      console.log('Page:', page.pathname, 'at', page.filePath)
    }

    for (const apiRoute of outputs.pagesApi) {
      console.log('API Route:', apiRoute.pathname, 'at', apiRoute.filePath)
    }

    for (const appPage of outputs.appPages) {
      console.log('App Page:', appPage.pathname, 'at', appPage.filePath)
    }

    for (const prerender of outputs.prerenders) {
      console.log('Prerendered:', prerender.pathname)
    }
  },
}

module.exports = adapter
```

--------------------------------

### Install Next.js Dependency

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Install the latest version of Next.js in your existing project using your preferred package manager.

```bash
pnpm add next@latest
```

```bash
npm install next@latest
```

```bash
yarn add next@latest
```

```bash
bun add next@latest
```

--------------------------------

### Next.js Info Command Output Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/next.mdx

This snippet shows the typical output of the `next info` command, providing details about the operating system, binaries, relevant Next.js packages, and configuration.

```bash
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 23.6.0
  Available memory (MB): 65536
  Available CPU cores: 10
Binaries:
  Node: 20.12.0
  npm: 10.5.0
  Yarn: 1.22.19
  pnpm: 9.6.0
Relevant Packages:
  next: 15.0.0-canary.115 // Latest available version is detected (15.0.0-canary.115).
  eslint-config-next: 14.2.5
  react: 19.0.0-rc
  react-dom: 19.0.0
  typescript: 5.5.4
Next.js Config:
  output: N/A
```

--------------------------------

### Create and Run Next.js App

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx

Use `create-next-app` to quickly scaffold a new Next.js project and then start the development server using various package managers.

```bash
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev
```

```bash
npx create-next-app@latest my-app --yes
cd my-app
npm run dev
```

```bash
yarn create next-app@latest my-app --yes
cd my-app
yarn dev
```

```bash
bun create next-app@latest my-app --yes
cd my-app
bun dev
```

--------------------------------

### Define a GET Request Handler in Next.js Route Handlers

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/backend-for-frontend.mdx

Create a Route Handler to respond to GET requests at a specific API route. This example shows the basic structure for handling incoming requests.

```ts
export function GET(request: Request) {}
```

```js
export function GET(request) {}
```

--------------------------------

### Start Next.js Dev Server with Turbopack

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Run the Next.js development server, which uses Turbopack by default for optimized local development.

```bash
next dev
```

--------------------------------

### Create Next.js App with Default Template

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/create-next-app.mdx

Use these commands to initialize a new Next.js project with the default template, which will then prompt you for configuration options during installation.

```bash
pnpm create next-app
```

```bash
npx create next-app@latest
```

```bash
yarn create next-app
```

```bash
bun create next-app
```

--------------------------------

### Install @vercel/otel packages for OpenTelemetry instrumentation

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx

Installs the core `@vercel/otel` package along with OpenTelemetry SDKs for logs and instrumentation APIs, required for setting up observability in a Next.js application.

```bash
pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash
npm install @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash
yarn add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

```bash
bun add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

--------------------------------

### Example Pages Router component for testing

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx

A simple Next.js Pages Router component to be used as an example for writing tests.

```jsx
export default function Home() {
  return <h1>Home</h1>
}
```

--------------------------------

### Install MDX Dependencies

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Installs the `@next/mdx` package and related MDX dependencies required for Next.js projects using various package managers.

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash
yarn add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

```bash
bun add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

--------------------------------

### Client-side Instrumentation Setup

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.mdx

Use this file to add monitoring, analytics, and error tracking that runs before your Next.js application becomes interactive. Place the file in the root or `src` folder.

```ts
// Set up performance monitoring
performance.mark('app-init')

// Initialize analytics
console.log('Analytics initialized')

// Set up error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  reportError(event.error)
})
```

```js
// Set up performance monitoring
performance.mark('app-init')

// Initialize analytics
console.log('Analytics initialized')

// Set up error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  reportError(event.error)
})
```

--------------------------------

### Manual Prefetching with useRouter

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/prefetching.mdx

This example shows how to manually prefetch a route using `router.prefetch()` from `next/navigation`. This is useful for warming routes based on user interactions like hover events.

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { CustomLink } from '@components/link'

export function PricingCard() {
  const router = useRouter()

  return (
    <div onMouseEnter={() => router.prefetch('/pricing')}>
      {/* other UI elements */}
      <CustomLink href="/pricing">View Pricing</CustomLink>
    </div>
  )
}
```

--------------------------------

### Configure Manual Signal Handling in package.json

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/self-hosting.mdx

Set the `NEXT_MANUAL_SIG_HANDLE` environment variable to `true` in the `start` script to enable manual signal handling for graceful shutdowns.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "NEXT_MANUAL_SIG_HANDLE=true next start"
  }
}
```

--------------------------------

### Serverless waitUntil Implementation Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/after.mdx

An example showing how to implement `RequestContext` using `AsyncLocalStorage` and inject a custom `waitUntil` function for a Next.js handler in a serverless context.

```tsx
import { AsyncLocalStorage } from 'node:async_hooks'

const RequestContextStorage = new AsyncLocalStorage<NextRequestContextValue>()

// Define and inject the accessor that next.js will use
const RequestContext: NextRequestContext = {
  get() {
    return RequestContextStorage.getStore()
  },
}
globalThis[Symbol.for('@next/request-context')] = RequestContext

const handler = (req, res) => {
  const contextValue = { waitUntil: YOUR_WAITUNTIL }
  // Provide the value
  return RequestContextStorage.run(contextValue, () => nextJsHandler(req, res))
}
```

--------------------------------

### Install Adapter by Modifying package.json

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/07-adapters/04-testing-adapters.mdx

Use this Node.js command to programmatically add the adapter as a file dependency in the `package.json` of your Next.js application.

```bash
node -e "\nconst pkg=JSON.parse(require('fs').readFileSync('package.json','utf8'));\npkg.dependencies=pkg.dependencies||{};\npkg.dependencies['adapter']='file:${ADAPTER_DIR}';\nrequire('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));\n" >&2
```

--------------------------------

### Basic Markdown Input Example

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Shows a simple Markdown string with bold text and a link.

```md
I **love** using [Next.js](https://nextjs.org/)
```

--------------------------------

### Creating a Next.js App with Different Package Managers

Source: https://github.com/vercel/next.js/blob/canary/docs/04-community/01-contribution-guide.mdx

Shows how to use pnpm, npm, yarn, and bun to initialize a new Next.js project, demonstrating the 'package' prop for CLI commands.

```bash
pnpm create next-app
```

```bash
npx create-next-app@latest
```

```bash
yarn create next-app
```

```bash
bun create next-app
```

--------------------------------

### Install Sass package

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/sass.mdx

Installs the Sass package as a development dependency using various package managers.

```bash
pnpm add -D sass
```

```bash
npm install --save-dev sass
```

```bash
yarn add -D sass
```

```bash
bun add -D sass
```

--------------------------------

### Install Next.js Canary Version

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/18-upgrading.mdx

Install the latest canary release of Next.js to access experimental features. It's recommended to be on the latest stable version before upgrading to canary.

```bash
pnpm add next@canary
```

```bash
npm i next@canary
```

```bash
yarn add next@canary
```

```bash
bun add next@canary
```

--------------------------------

### Next.js CLI Customization Prompts

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx

These prompts appear when choosing to customize settings during `create-next-app` installation.

```txt
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No / Yes
```

--------------------------------

### Run Next.js Dev Server with pnpm

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Command to start the Next.js development server using the pnpm package manager.

```bash
pnpm dev
```

--------------------------------

### Basic Usage of create-next-app CLI

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/create-next-app.mdx

Use these commands to initialize a new Next.js project with your preferred package manager. Replace `[project-name]` with your desired project directory and `[options]` for additional configurations.

```bash
pnpm create next-app [project-name] [options]
```

```bash
npx create-next-app@latest [project-name] [options]
```

```bash
yarn create next-app [project-name] [options]
```

```bash
bun create next-app [project-name] [options]
```

--------------------------------

### Install @next/env Package

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx

Installs the `@next/env` package using various package managers, enabling environment variable loading outside the Next.js runtime.

```bash
pnpm add @next/env
```

```bash
npm install @next/env
```

```bash
yarn add @next/env
```

```bash
bun add @next/env
```

--------------------------------

### Client Component with Prism for Syntax Highlighting

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/package-bundling.mdx

This example shows a Client Component using `prism-react-renderer` for syntax highlighting, which bundles the entire library to the client.

```tsx
'use client'

import Highlight from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'

export default function Page() {
  const code = `export function hello() {
    console.log("hi")
  }`

  return (
    <article>
      <h1>Blog Post Title</h1>

      {/* The prism package and its tokenization logic are shipped to the client */}
      <Highlight code={code} language="tsx" theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </article>
  )
}
```

--------------------------------

### Start Next.js Standalone Server with Custom Port and Hostname

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/output.mdx

Define `PORT` and `HOSTNAME` environment variables before running `server.js` to specify the server's listening address and port.

```bash
PORT=8080 HOSTNAME=0.0.0.0 node server.js
```

--------------------------------

### Install Prompt Component for iOS Devices

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx

This React component checks for iOS devices and standalone display mode to conditionally show an "Add to Home Screen" prompt. It helps guide users to install the PWA for a native app experience.

```tsx
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}
```

```jsx
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
```

--------------------------------

### Start Next.js Development Server

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mcp.mdx

Execute this command to launch your Next.js development server, which is essential for the MCP endpoint to be active and for next-devtools-mcp to establish a connection.

```bash
npm run dev
```

--------------------------------

### Example Agent Response for Error Diagnosis

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mcp.mdx

This example illustrates a coding agent's diagnostic process, identifying a hydration error, detailing its steps, and presenting the structured error output from next-devtools.

```bash
> fix errors on the page

⏺ I'll help you fix the errors on the page. Let me first check what errors exist by looking at the
  current state of the project.

⏺ next-devtools - nextjs_runtime (MCP)(action: "discover_servers")
⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")

⏺ I found a hydration error on the /about page. The error shows that the server is rendering
  "server" but the client is rendering "client", causing a mismatch. Let me create a todo list and fix
   this issue.

⏺ Perfect! Now let me check for errors on the page.           01:14 PM  claude-sonnet-4-5-20250929

⏺ next-devtools - nextjs_runtime (MCP)(action: "call_tool", toolName: "get_errors")
  ⎿ {
      "success": true,
      "port": 3000,
      "toolName": "get_errors",
      "result": {
        "content": [
          {
            "type": "text",
            "text": "# Found errors in 1 browser session(s)\n\n## Session: /about\n\n**1 error(s)\n     found**\n\n### Runtime Errors\n\n#### Error 1 (Type: recoverable)\n\n**Error**: Hydration failed"
          }
        ]
      }
    }

```

--------------------------------

### Install eslint-config-prettier

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/03-eslint.mdx

Install `eslint-config-prettier` as a development dependency using your preferred package manager to prevent conflicts between ESLint and Prettier formatting rules.

```bash
pnpm add -D eslint-config-prettier
```

```bash
npm i -D eslint-config-prettier
```

```bash
yarn add --dev eslint-config-prettier
```

```bash
bun add -d eslint-config-prettier
```

--------------------------------

### Output Next.js Bundle Analysis to Disk and Copy

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/06-cli/next.mdx

Use the `--output` flag to save bundle analysis files to disk without starting the server, then copy the output for comparison or sharing.

```bash
# Write output to .next/diagnostics/analyze
npx next experimental-analyze --output
```

```bash
# Copy the output for comparison with a future analysis
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

--------------------------------

### Installing the `server-only` Package

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx

Install the `server-only` package using your preferred package manager. This package helps prevent server-only code from being bundled into client components.

```bash
npm install server-only
```

```bash
yarn add server-only
```

```bash
pnpm add server-only
```

```bash
bun add server-only
```

--------------------------------

### File System Routing Example for Functions API

Source: https://github.com/vercel/next.js/blob/canary/docs/04-community/01-contribution-guide.mdx

Illustrates the alphabetical sorting of pages in the functions API reference, where files are not prefixed with numbers.

```txt
04-functions
├── after.mdx
├── cacheLife.mdx
├── cacheTag.mdx
└── ...
```

--------------------------------

### Prerendering posts with getStaticPaths and fallback: false

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-paths.mdx

This example demonstrates how to use `getStaticPaths` with `fallback: false` to prerender a fixed set of pages at build time. It fetches a list of posts from an external API and generates a static page for each post ID, resulting in a 404 for any unlisted paths.

```jsx
function Post({ post }) {
  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to prerender based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll prerender only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
```

--------------------------------

### Basic MDX File with React Component Import

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Shows an example MDX file (`welcome.mdx`) that includes markdown syntax and imports a React component for use within the MDX content.

```mdx
import { MyComponent } from 'my-component'

# Welcome to my MDX page!

This is some **bold** and _italics_ text.

This is a list in markdown:

- One
- Two
- Three

Checkout my React component:

<MyComponent />
```

--------------------------------

### Reading the Active Segment with useSelectedLayoutSegment

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/use-selected-layout-segment.mdx

This example demonstrates how to use the `useSelectedLayoutSegment` hook within a Client Component to get the currently active route segment. The returned segment represents the part of the URL one level below the layout where the component is rendered.

```tsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>Active segment: {segment}</p>
}
```

```jsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()

  return <p>Active segment: {segment}</p>
}
```

--------------------------------

### Example of Absolute Imports in JSX

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx

Illustrates the benefit of absolute imports, showing how they simplify import paths by replacing verbose relative paths with cleaner aliases.

```jsx
// Before
import { Button } from '../../../components/button'

// After
import { Button } from '@/components/button'
```

--------------------------------

### Install OpenTelemetry API

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx

Add the OpenTelemetry API package to your project using various package managers to enable custom tracing capabilities.

```bash
pnpm add @opentelemetry/api
```

```bash
npm install @opentelemetry/api
```

```bash
yarn add @opentelemetry/api
```

```bash
bun add @opentelemetry/api
```

--------------------------------

### Example Bash Script for Adapter Deployment

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/07-adapters/04-testing-adapters.mdx

This is a basic template for a custom deploy script required by the Next.js test harness. It must print the deployment URL to stdout and exit with a non-zero code on failure, writing diagnostic output to stderr or files.

```bash
#!/usr/bin/env bash
set -euo pipefail

```

--------------------------------

### Monitor Performance and Track Navigation Start (TypeScript/JavaScript)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.mdx

Use the Performance Observer API to track metrics like Time to Interactive and mark router transition starts for performance analysis.

```ts
const startTime = performance.now()

const observer = new PerformanceObserver(
  (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry instanceof PerformanceNavigationTiming) {
        console.log('Time to Interactive:', entry.loadEventEnd - startTime)
      }
    }
  }
)

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url: string) {
  performance.mark(`nav-start-${url}`)
}
```

```js
const startTime = performance.now()

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry instanceof PerformanceNavigationTiming) {
      console.log('Time to Interactive:', entry.loadEventEnd - startTime)
    }
  }
})

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url) {
  performance.mark(`nav-start-${url}`)
}
```

--------------------------------

### Create User Account with `signup` Action (App Router)

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx

This server action demonstrates how to create a new user account, including validating form fields, hashing the password, and inserting user data into a database. It's designed for use within the App Router.

```jsx
export async function signup(state, formData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Library API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

--------------------------------

### Start Next.js Dev Server with Webpack

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Run the Next.js development server using Webpack, providing compatibility with Create React App's bundling approach.

```bash
next dev --webpack
```

--------------------------------

### Navigating Back in History with router.back

Source: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx

This example shows how to use `router.back` to programmatically navigate back in the browser's history, similar to clicking the back button.

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      Click here to go back
    </button>
  )
}
```

--------------------------------

### Run Next.js Dev Server with yarn

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx

Command to start the Next.js development server using the yarn package manager.

```bash
yarn dev
```

--------------------------------

### Manually Install Latest Next.js and React Dependencies

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/18-upgrading.mdx

Manually install the latest stable versions of Next.js, React, React DOM, and `eslint-config-next` using your preferred package manager.

```bash
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

--------------------------------

### Example `cache-components-instant-false` Codemod Output

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx

Shows the `instant = false` export added to an `app/page.tsx` file by the codemod, along with a TODO comment.

```diff
+ // TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
+ // See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
+ export const instant = false
+
  export default function Page() {
    return <h1>Hello</h1>
  }
```