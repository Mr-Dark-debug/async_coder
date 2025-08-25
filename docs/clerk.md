---
title: Clerk Next.js SDK
description: The Clerk Next.js SDK gives you access to prebuilt components,
  React hooks, and helpers to make user authentication easier.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/references/nextjs/overview
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,nodejs,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend,sdk-development
activeSdk: nextjs
---

The Clerk Next.js SDK gives you access to prebuilt components, React hooks, and helpers to make user authentication easier. Refer to the <SDKLink href="/docs/quickstarts/nextjs" sdks={["nextjs"]}>quickstart guide</SDKLink> to get started.

## Client-side helpers

Because the Next.js SDK is built on top of the Clerk React SDK, you can use the hooks that the React SDK provides. These hooks include access to the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> object, <SDKLink href="/docs/references/javascript/user" sdks={["js-frontend"]} code={true}>User object</SDKLink>, <SDKLink href="/docs/references/javascript/organization" sdks={["js-frontend"]} code={true}>Organization object</SDKLink>, and a set of useful helper methods for signing in and signing up.

* [`useUser()`](/docs/hooks/use-user)
* [`useClerk()`](/docs/hooks/use-clerk)
* [`useAuth()`](/docs/hooks/use-auth)
* [`useSignIn()`](/docs/hooks/use-sign-in)
* [`useSignUp()`](/docs/hooks/use-sign-up)
* [`useSession()`](/docs/hooks/use-session)
* [`useSessionList()`](/docs/hooks/use-session-list)
* [`useOrganization()`](/docs/hooks/use-organization)
* [`useOrganizationList()`](/docs/hooks/use-organization-list)
* [`useReverification()`](/docs/hooks/use-reverification)
* [`useCheckout()`](/docs/hooks/use-checkout)
* [`usePaymentElement()`](/docs/hooks/use-payment-element)
* [`usePaymentMethods()`](/docs/hooks/use-payment-methods)
* [`usePlans()`](/docs/hooks/use-plans)
* [`useSubscription()`](/docs/hooks/use-subscription)
* [`useStatements()`](/docs/hooks/use-statements)
* [`usePaymentAttempts()`](/docs/hooks/use-payment-attempts)

## Server-side helpers

### App router

Clerk provides first-class support for the [Next.js App Router](https://nextjs.org/docs/app). The following references show how to integrate Clerk features into apps using the latest App Router and React Server Components features.

* <SDKLink href="/docs/references/nextjs/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink>
* <SDKLink href="/docs/references/nextjs/current-user" sdks={["nextjs"]} code={true}>currentUser()</SDKLink>
* <SDKLink href="/docs/references/nextjs/route-handlers" sdks={["nextjs"]}>Route Handlers</SDKLink>
* <SDKLink href="/docs/references/nextjs/server-actions" sdks={["nextjs"]}>Server Actions</SDKLink>

### Pages router

Clerk continues to provide drop-in support for the Next.js Pages Router. In addition to the main Clerk integration, the following references are available for apps using Pages Router.

* <SDKLink href="/docs/references/nextjs/get-auth" sdks={["nextjs"]} code={true}>getAuth()</SDKLink>
* <SDKLink href="/docs/references/nextjs/build-clerk-props" sdks={["nextjs"]} code={true}>buildClerkProps()</SDKLink>

## `Auth` object

Both `auth()` (App Router) and `getAuth()` (Pages Router) return an `Auth` object. This JavaScript object contains important information like the current user's session ID, user ID, and organization ID. Learn more about the <SDKLink href="/docs/references/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth object</SDKLink>{{ target: '_blank' }}.

## `clerkMiddleware()`

The `clerkMiddleware()` helper integrates Clerk authentication into your Next.js application through middleware. It allows you to integrate authorization into both the client and server of your application. You can learn more <SDKLink href="/docs/references/nextjs/clerk-middleware" sdks={["nextjs"]}>here</SDKLink>.

## Demo repositories

For examples of Clerk's features, such as user and organization management, integrated into a single application, see the Next.js demo repositories:

* [Clerk + Next.js App Router Demo](https://github.com/clerk/clerk-nextjs-demo-app-router)
* [Clerk + Next.js Pages Router Demo](https://github.com/clerk/clerk-nextjs-demo-pages-router)

---
title: Set up a waitlist in your Next.js app
description: Learn how to add a waitlist to your Next.js application.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/references/nextjs/waitlist
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,nodejs,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend,sdk-development
activeSdk: nextjs
---

In [**Waitlist** mode](/docs/authentication/configuration/restrictions#waitlist), users can register their interest in your app by joining a waitlist. This mode is ideal for apps in early development stages or those wanting to generate interest before launch. This guide shows you how to get Clerk integrated and how to add a waitlist to your Next.js application.

<Steps>
  ## Install `@clerk/nextjs`

  The <SDKLink href="/docs/references/nextjs/overview" sdks={["nextjs"]}>Clerk Next.js SDK</SDKLink> gives you access to prebuilt components, React hooks, and helpers to make user authentication easier.

  Run the following command to install the SDK:

  <CodeBlockTabs options={["npm", "yarn", "pnpm", "bun"]}>
    ```bash {{ filename: 'terminal' }}
    npm install @clerk/nextjs
    ```

    ```bash {{ filename: 'terminal' }}
    yarn add @clerk/nextjs
    ```

    ```bash {{ filename: 'terminal' }}
    pnpm add @clerk/nextjs
    ```

    ```bash {{ filename: 'terminal' }}
    bun add @clerk/nextjs
    ```
  </CodeBlockTabs>

  ## Set your Clerk API keys

  <If condition={experiment.enabled}>
    <ExperimentCreateAccountFromDocsQuickstart params={experiment} />
  </If>

  <If condition={!experiment.enabled}>
    <SignedIn>
      Add the following keys to your `.env` file. These keys can always be retrieved from the [**API keys**](https://dashboard.clerk.com/last-active?path=api-keys) page in the Clerk Dashboard.
    </SignedIn>

    <SignedOut>
      1. In the Clerk Dashboard, navigate to the [**API keys**](https://dashboard.clerk.com/last-active?path=api-keys){{ track: 'exp_create_account_nextjs_quickstart' }} page.
      2. In the **Quick Copy** section, copy your Clerk Publishable and Secret Keys.
      3. Paste your keys into your `.env` file.

      The final result should resemble the following:
    </SignedOut>
  </If>

  ```env {{ filename: '.env' }}
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={{pub_key}}
  CLERK_SECRET_KEY={{secret}}
  ```

  ## Enable Waitlist mode

  To enable **Waitlist** mode, follow these steps:

  1. In the Clerk Dashboard, navigate to the [**Restrictions**](https://dashboard.clerk.com/last-active?path=user-authentication/restrictions) page.
  2. Under the **Sign-up modes** section, enable **Waitlist**.

  To manage users on your waitlist:

  1. In the Clerk Dashboard, navigate to the [**Waitlist**](https://dashboard.clerk.com/last-active?path=waitlist) page.
  2. On the right-side of a user's row, select the menu icon (...).
  3. Select **Invite** to invite the user to your application. Select **Deny** to deny the user access to your application.

  ## Add the `<Waitlist />` component

  The <SDKLink href="/docs/:sdk:/components/waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<Waitlist /></SDKLink> component renders a form that allows users to join for early access to your app.

  The following example includes a basic implementation of the `<Waitlist />` component hosted on the `/` route (the home page). You can use this as a starting point for your own implementation.

  ```jsx {{ filename: 'app/page.tsx' }}
  import { Waitlist } from '@clerk/nextjs'

  export default function Page() {
    return <Waitlist />
  }
  ```

  ## Add `<ClerkProvider>` to your app

  The [`<ClerkProvider>`](/docs/components/clerk-provider) component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the [reference docs](/docs/components/clerk-provider) for other configuration options.

  To use the `<Waitlist />` component in your app, you must provide the `waitlistUrl` prop, which points to the URL of your waitlist page.

  ```tsx {{ filename: 'app/layout.tsx', mark: [6] }}
  import { ClerkProvider } from '@clerk/nextjs'
  import './globals.css'

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <ClerkProvider waitlistUrl="/">
        <html lang="en">
          <body>{children}</body>
        </html>
      </ClerkProvider>
    )
  }
  ```

  ## Add sign-in functionality

  To allow users to sign in once they've been approved from the waitlist, you must:

  * <SDKLink href="/docs/references/nextjs/waitlist#add-clerk-middleware-to-your-app" sdks={["nextjs"]}>Add `clerkMiddleware()` to your app.</SDKLink>
  * <SDKLink href="/docs/references/nextjs/waitlist#add-a-sign-in-page" sdks={["nextjs"]}>Add a sign-in page.</SDKLink>

  ### Add `clerkMiddleware()` to your app

  <SDKLink href="/docs/references/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware()</SDKLink> grants you access to user authentication state throughout your app, on any route or page. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

  1. Create a `middleware.ts` file.

  * If you're using the `/src` directory, create `middleware.ts` in the `/src` directory.
  * If you're not using the `/src` directory, create `middleware.ts` in the root directory alongside `.env`.

  1. In your `middleware.ts` file, export the `clerkMiddleware()` helper:

  ```tsx {{ filename: 'middleware.ts' }}
  import { clerkMiddleware } from '@clerk/nextjs/server'

  export default clerkMiddleware()

  export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  ```

  1. By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the <SDKLink href="/docs/references/nextjs/clerk-middleware" sdks={["nextjs"]} code={true}>clerkMiddleware() reference</SDKLink> to learn how to require authentication for specific routes.

  ### Add a sign-in page

  The following example demonstrates how to render the `<SignIn />` component.

  ```tsx {{ filename: 'app/sign-in/[[...sign-in]]/page.tsx' }}
  import { SignIn } from '@clerk/nextjs'

  export default function Page() {
    return <SignIn />
  }
  ```

  Update your environment variables to point to your custom sign-in page. For more information on building a custom sign-in-or-up page, see the <SDKLink href="/docs/references/nextjs/custom-sign-in-or-up-page" sdks={["nextjs"]}>dedicated guide</SDKLink>.

  ```env {{ filename: '.env' }}
  NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
  ```
</Steps>
---
title: Implement basic Role Based Access Control (RBAC) with metadata
description: Learn how to leverage Clerk's publicMetadata to implement your own
  basic Role Based Access Controls.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/references/nextjs/basic-rbac
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,nodejs,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend,sdk-development
activeSdk: nextjs
---

To control which users can access certain parts of your app, you can use the [roles feature](/docs/organizations/roles-permissions#roles). Although Clerk offers roles as part of the [organizations](/docs/organizations/overview) feature set, not every app implements organizations. **This guide covers a workaround to set up a basic Role Based Access Control (RBAC) system for products that don't use Clerk's organizations or roles.**

This guide assumes that you're using Next.js App Router, but the concepts can be adapted to Next.js Pages Router and Remix.

<Steps>
  ## Configure the session token

  Clerk provides [user metadata](/docs/users/metadata), which can be used to store information, and in this case, it can be used to store a user's role. Since `publicMetadata` can only be read but not modified in the browser, it is the safest and most appropriate choice for storing information.

  To build a basic RBAC system, you first need to make `publicMetadata` available to the application directly from the session token. By attaching `publicMetadata` to the user's session, you can access the data without needing to make a network request each time.

  1. In the Clerk Dashboard, navigate to the [**Sessions**](https://dashboard.clerk.com/last-active?path=sessions) page.
  2. Under **Customize session token**, in the **Claims** editor, enter the following JSON and select **Save**. If you have already customized your session token, you may need to merge this with what you currently have.

  ```json
  {
    "metadata": "{{user.public_metadata}}"
  }
  ```

  ## Create a global TypeScript definition

  1. In your application's root folder, create a `types/` directory.
  2. Inside this directory, create a `globals.d.ts` file with the following code. This file will provide auto-completion and prevent TypeScript errors when working with roles. For this guide, only the `admin` and `moderator` roles will be defined.

  ```ts {{ filename: 'types/globals.d.ts' }}
  export {}

  // Create a type for the roles
  export type Roles = 'admin' | 'moderator'

  declare global {
    interface CustomJwtSessionClaims {
      metadata: {
        role?: Roles
      }
    }
  }
  ```

  ## Set the admin role for your user

  Later in the guide, you will add a basic admin tool to change a user's role. For now, manually add the `admin` role to your own user account.

  1. In the Clerk Dashboard, navigate to the [**Users**](https://dashboard.clerk.com/last-active?path=users) page.
  2. Select your own user account.
  3. Scroll down to the **User metadata** section and next to the **Public** option, select **Edit**.
  4. Add the following JSON and select **Save**.

  ```json
  {
    "role": "admin"
  }
  ```

  ## Create a reusable function to check roles

  Create a helper function to simplify checking roles.

  1. In your application's root directory, create a `utils/` folder.
  2. Inside this directory, create a `roles.ts` file with the following code. The `checkRole()` helper uses the <SDKLink href="/docs/references/nextjs/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> helper to access the user's session claims. From the session claims, it accesses the `metadata` object to check the user's role. The `checkRole()` helper accepts a role of type `Roles`, which you created in the <SDKLink href="/docs/references/nextjs/basic-rbac#create-a-global-type-script-definition" sdks={["nextjs"]}>Create a global TypeScript definition</SDKLink> step. It returns `true` if the user has that role or `false` if they do not.

  ```ts {{ filename: 'utils/roles.ts' }}
  import { Roles } from '@/types/globals'
  import { auth } from '@clerk/nextjs/server'

  export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth()
    return sessionClaims?.metadata.role === role
  }
  ```

  > \[!NOTE]
  > You can customize the behavior of the `checkRole()` helper function to suit your needs. For example, you could modify it to return the roles a user has or create a `protectByRole()` function that handles role-based redirects.

  ## Create the admin dashboard

  Now, it's time to create an admin dashboard. The first step is to create the `/admin` route.

  1. In your `app/` directory, create an `admin/` folder.
  2. In the `admin/` folder, create a `page.tsx` file with the following placeholder code.

  ```tsx {{ filename: 'app/admin/page.tsx' }}
  export default function AdminDashboard() {
    return <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>
  }
  ```

  ## Protect the admin dashboard

  To protect the `/admin` route, choose **one** of the two following methods:

  1. **Middleware**: Apply role-based access control globally at the route level. This method restricts access to all routes matching `/admin` before the request reaches the actual page.
  2. **Page-level role check**: Apply role-based access control directly in the `/admin` page component. This method protects this specific page. To protect other pages in the admin dashboard, apply this protection to each route.

  > \[!IMPORTANT]
  > You only need to follow **one** of the following methods to secure your `/admin` route.

  ### Option 1: Protect the `/admin` route using middleware

  1. In your app's root directory, create a `middleware.ts` file with the following code. The `createRouteMatcher()` function identifies routes starting with `/admin`. `clerkMiddleware()` intercepts requests to the `/admin` route, and checks the user's role in their `metadata` to verify that they have the `admin` role. If they don't, it redirects them to the home page.

  ```tsx {{ filename: 'middleware.ts' }}
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
  import { NextResponse } from 'next/server'

  const isAdminRoute = createRouteMatcher(['/admin(.*)'])

  export default clerkMiddleware(async (auth, req) => {
    // Protect all routes starting with `/admin`
    if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
      const url = new URL('/', req.url)
      return NextResponse.redirect(url)
    }
  })

  export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  ```

  ### Option 2: Protect the `/admin` route at the page-level

  1. Add the following code to the `app/admin/page.tsx` file. The `checkRole()` function checks if the user has the `admin` role. If they don't, it redirects them to the home page.

  ```tsx {{ filename: 'app/admin/page.tsx' }}
  import { checkRole } from '@/utils/roles'
  import { redirect } from 'next/navigation'

  export default async function AdminDashboard() {
    // Protect the page from users who are not admins
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
      redirect('/')
    }

    return <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>
  }
  ```

  ## Create server actions for managing a user's role

  1. In your `app/admin/` directory, create an `_actions.ts` file with the following code. The `setRole()` action checks that the current user has the `admin` role before updating the specified user's role using Clerk's <SDKLink href="/docs/references/backend/user/update-user" sdks={["js-backend"]}>JavaScript Backend SDK</SDKLink>. The `removeRole()` action removes the role from the specified user.

  ```ts {{ filename: 'app/admin/_actions.ts' }}
  'use server'

  import { checkRole } from '@/utils/roles'
  import { clerkClient } from '@clerk/nextjs/server'

  export async function setRole(formData: FormData) {
    const client = await clerkClient()

    // Check that the user trying to set the role is an admin
    if (!checkRole('admin')) {
      return { message: 'Not Authorized' }
    }

    try {
      const res = await client.users.updateUserMetadata(formData.get('id') as string, {
        publicMetadata: { role: formData.get('role') },
      })
      return { message: res.publicMetadata }
    } catch (err) {
      return { message: err }
    }
  }

  export async function removeRole(formData: FormData) {
    const client = await clerkClient()

    try {
      const res = await client.users.updateUserMetadata(formData.get('id') as string, {
        publicMetadata: { role: null },
      })
      return { message: res.publicMetadata }
    } catch (err) {
      return { message: err }
    }
  }
  ```

  ## Create a component for searching for users

  1. In your `app/admin/` directory, create a `SearchUsers.tsx` file with the following code. The `<SearchUsers />` component includes a form for searching for users. When submitted, it appends the search term to the URL as a search parameter. Your `/admin` route will then perform a query based on the updated URL.

  ```tsx {{ filename: 'app/admin/SearchUsers.tsx' }}
  'use client'

  import { usePathname, useRouter } from 'next/navigation'

  export const SearchUsers = () => {
    const router = useRouter()
    const pathname = usePathname()

    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const formData = new FormData(form)
            const queryTerm = formData.get('search') as string
            router.push(pathname + '?search=' + queryTerm)
          }}
        >
          <label htmlFor="search">Search for users</label>
          <input id="search" name="search" type="text" />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
  ```

  ## Refactor the admin dashboard

  With the server action and the search form set up, it's time to refactor the `app/admin/page.tsx`.

  1. Replace the code in your `app/admin/page.tsx` file with the following code. It checks whether a search parameter has been appended to the URL by the search form. If a search parameter is present, it queries for users matching the entered term. If one or more users are found, the component displays a list of users, showing their first and last names, primary email address, and current role. Each user has `Make Admin` and `Make Moderator` buttons, which include hidden inputs for the user ID and role. These buttons use the `setRole()` server action to update the user's role.

  ```tsx {{ filename: 'app/admin/page.tsx' }}
  import { redirect } from 'next/navigation'
  import { checkRole } from '@/utils/roles'
  import { SearchUsers } from './SearchUsers'
  import { clerkClient } from '@clerk/nextjs/server'
  import { removeRole, setRole } from './_actions'

  export default async function AdminDashboard(params: {
    searchParams: Promise<{ search?: string }>
  }) {
    if (!checkRole('admin')) {
      redirect('/')
    }

    const query = (await params.searchParams).search

    const client = await clerkClient()

    const users = query ? (await client.users.getUserList({ query })).data : []

    return (
      <>
        <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>

        <SearchUsers />

        {users.map((user) => {
          return (
            <div key={user.id}>
              <div>
                {user.firstName} {user.lastName}
              </div>

              <div>
                {
                  user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                    ?.emailAddress
                }
              </div>

              <div>{user.publicMetadata.role as string}</div>

              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>

              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button type="submit">Make Moderator</button>
              </form>

              <form action={removeRole}>
                <input type="hidden" value={user.id} name="id" />
                <button type="submit">Remove Role</button>
              </form>
            </div>
          )
        })}
      </>
    )
  }
  ```

  ## Finished 🎉

  The foundation of a custom RBAC (Role-Based Access Control) system is now set up. Roles are attached directly to the user's session, allowing your application to access them without the need for additional network requests. The `checkRole()` helper function simplifies role checks and reduces code complexity. The final component is the admin dashboard, which enables admins to efficiently search for users and manage roles.
</Steps>
---
title: "`<UserButton />` component"
description: Clerk's <UserButton /> component is used to render the familiar
  user button UI popularized by Google.
search:
  rank: 1
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/components/user/user-button
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,nodejs,expressjs,fastify,go,ruby,js-backend,sdk-development
activeSdk: nextjs
---

![The \<UserButton /> component renders the familiar user button UI popularized by Google.](/docs/images/ui-components/user-button.png){{ style: { maxWidth: '436px' } }}

The `<UserButton />` component renders the familiar user button UI popularized by Google. When selected, it opens a dropdown menu with options to manage account settings and sign out. The "Manage account" option launches the <SDKLink href="/docs/:sdk:/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component, providing access to profile and security settings.

For users that have [multi-session](/docs/authentication/configuration/session-options#multi-session-applications) enabled, the `<UserButton />` also allows users to sign into multiple accounts at once and instantly switch between them without the need for a full page reload. Learn more [here](/docs/authentication/configuration/session-options#multi-session-applications).

## Properties

The `<UserButton />` component accepts the following properties, all of which are **optional**:

<Properties>
  * `afterMultiSessionSingleSignOutUrl` (deprecated)
  * `string`

  **Deprecated. Move `afterMultiSessionSingleSignOutUrl` to <SDKLink href="/docs/:sdk:/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>\<ClerkProvider /></SDKLink>.** The full URL or path to navigate to after signing out from a currently active account in a multi-session app.

  ***

  * `afterSignOutUrl` (deprecated)
  * `string`

  **Deprecated. Move `afterSignOutUrl` to <SDKLink href="/docs/:sdk:/components/clerk-provider" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>\<ClerkProvider /></SDKLink>.** The full URL or path to navigate to after a successful sign-out.

  ***

  * `afterSwitchSessionUrl`
  * `string`

  The full URL or path to navigate to after a successful account change in a multi-session app.

  ***

  * `appearance`
  * <code>[Appearance](/docs/customization/overview) | undefined</code>

  Optional object to style your components. Will only affect [Clerk components](/docs/components/overview) and not [Account Portal](/docs/account-portal/overview) pages.

  ***

  * `defaultOpen`
  * `boolean`

  Controls whether the `<UserButton />` should open by default during the first render.

  ***

  * `showName`
  * `boolean`

  Controls if the user name is displayed next to the user image button.

  ***

  * `signInUrl`
  * `string`

  The full URL or path to navigate to when the **Add another account** button is clicked. It's recommended to use [the environment variable](/docs/deployments/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.

  ***

  * `userProfileMode`
  * `'modal' | 'navigation'`

  Controls whether selecting the **Manage your account** button will cause the <SDKLink href="/docs/:sdk:/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component to open as a modal, or if the browser will navigate to the `userProfileUrl` where `<UserProfile />` is mounted as a page. Defaults to: `'modal'`.

  ***

  * `userProfileProps`
  * `object`

  Specify options for the underlying <SDKLink href="/docs/:sdk:/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink> component. For example: `{additionalOAuthScopes: {google: ['foo', 'bar'], github: ['qux']}}`.

  ***

  * `userProfileUrl`
  * `string`

  The full URL or path leading to the user management interface.

  ***

  * `fallback?`
  * `ReactNode`

  An optional element to be rendered while the component is mounting.
</Properties>

## Usage with frameworks

In the following example, `<UserButton />` is mounted inside a header component, which is a common pattern on many websites and applications. When the user is signed in, they will see their avatar and be able to open the popup menu.

<Tabs items={["Next.js", "React", "Astro", "Expo", "Remix", "Tanstack React Start", "Vue"]}>
  <Tab>
    <CodeBlockTabs options={["App Router", "Pages Router"]}>
      ```tsx {{ filename: 'layout.tsx', mark: [8] }}
      import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

      function Header() {
        return (
          <header style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            <h1>My App</h1>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </header>
        )
      }

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en">
            <ClerkProvider>
              <Header />
              {children}
            </ClerkProvider>
          </html>
        )
      }
      ```

      ```jsx {{ filename: 'userButtonExample.tsx', mark: [8] }}
      import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

      function Header() {
        return (
          <header style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            <h1>My App</h1>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </header>
        )
      }

      function MyApp({ pageProps }) {
        return (
          <ClerkProvider {...pageProps}>
            <Header />
          </ClerkProvider>
        )
      }

      export default MyApp
      ```
    </CodeBlockTabs>
  </Tab>

  <Tab>
    ```tsx {{ filename: 'src/App.tsx' }}
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-react'

    export default function App() {
      return (
        <header>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </Tab>

  <Tab>
    ```astro {{ filename: 'pages/index.astro' }}
    ---
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/astro/components'
    ---

    <SignedIn>
      <UserButton />
    </SignedIn>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    ```
  </Tab>

  <Tab>
    > \[!NOTE]
    > This component can be used in Expo Web projects, but won't work in native environments (iOS or Android). For native apps, use the supported native components instead.

    ```jsx {{ filename: '/app/user-button.web.tsx' }}
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-expo/web'

    export default function Header() {
      return (
        <header>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'router/index.tsx' }}
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/remix'
    import { getAuth } from '@clerk/remix/ssr.server'
    import { LoaderFunction, redirect } from '@remix-run/node'

    export const loader: LoaderFunction = async (args) => {
      const { userId } = await getAuth(args)

      if (!userId) {
        return redirect('/sign-in')
      }

      return {
        props: {
          userId,
        },
      }
    }

    export default function Index() {
      return (
        <header>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/routes/index.tsx' }}
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/tanstack-react-start'
    import { createFileRoute } from '@tanstack/react-router'

    export const Route = createFileRoute('/')({
      component: Home,
    })

    function Home() {
      return (
        <header>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </header>
      )
    }
    ```
  </Tab>

  <Tab>
    ```vue {{ filename: 'header.vue' }}
    <script setup>
    import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/vue'
    </script>

    <template>
      <header>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
    </template>
    ```
  </Tab>
</Tabs>

## Customization

To learn about how to customize Clerk components, see the [customization documentation](/docs/customization/overview).

You can also [add custom actions and links to the `<UserButton />` menu](/docs/customization/user-button).
---
title: "`<UserProfile />` component"
description: Clerk's <UserProfile /> component is used to render a beautiful,
  full-featured account management UI that allows users to manage their profile
  and security settings.
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/components/user/user-profile
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,nodejs,expressjs,fastify,go,ruby,js-backend,sdk-development
activeSdk: nextjs
---

![The \<UserProfile /> component renders a full-featured account management UI that allows users to manage their profile and security settings.](/docs/images/ui-components/user-profile.png){{ style: { maxWidth: '100%' } }}

The `<UserProfile />` component is used to render a beautiful, full-featured account management UI that allows users to manage their profile, security, and billing settings.

## Properties

All props are optional.

<Properties>
  * `appearance`
  * <code>[Appearance](/docs/customization/overview) | undefined</code>

  Optional object to style your components. Will only affect [Clerk components](/docs/components/overview) and not [Account Portal](/docs/account-portal/overview) pages.

  ***

  * `routing`
  * `'hash' | 'path'`

  The [routing](/docs/guides/routing) strategy for your pages. Defaults to `'path'` for frameworks that handle routing, such as Next.js and Remix. Defaults to `hash` for all other SDK's, such as React.

  ***

  * `path`
  * `string`

  The path where the component is mounted on when `routing` is set to `path`. It is ignored in hash-based routing. For example: `/user-profile`.

  ***

  * `additionalOAuthScopes`
  * `object`

  Specify additional scopes per OAuth provider that your users would like to provide if not already approved.  For example: `{google: ['foo', 'bar'], github: ['qux']}`.

  ***

  * `customPages`
  * <code><SDKLink href="/docs/references/javascript/types/custom-page" sdks={["js-frontend"]}>CustomPage</SDKLink>\[]</code>

  An array of custom pages to add to the user profile. Only available for the <SDKLink href="/docs/references/javascript/overview" sdks={["js-frontend"]}>JavaScript SDK</SDKLink>. To add custom pages with React-based SDK's, see the [dedicated guide](/docs/customization/user-profile).

  ***

  * `fallback?`
  * `ReactNode`

  An optional element to be rendered while the component is mounting.
</Properties>

## Usage with frameworks

<Tabs items={["Next.js", "React", "Astro", "Expo", "Remix", "Tanstack React Start", "Vue"]}>
  <Tab>
    The `<UserProfile />` component must embedded using the [Next.js optional catch-all route](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-routes) in order for the routing to work.

    ```jsx {{ filename: 'app/user-profile/[[...user-profile]]/page.tsx' }}
    import { UserProfile } from '@clerk/nextjs'

    const UserProfilePage = () => <UserProfile />

    export default UserProfilePage
    ```
  </Tab>

  <Tab>
    ```jsx {{ filename: '/user-profile.tsx' }}
    import { UserProfile } from '@clerk/clerk-react'

    const UserProfilePage = () => <UserProfile />

    export default UserProfilePage
    ```
  </Tab>

  <Tab>
    ```astro {{ filename: 'pages/user.astro' }}
    ---
    import { UserProfile } from '@clerk/astro/components'
    ---

    <UserProfile />
    ```
  </Tab>

  <Tab>
    > \[!NOTE]
    > This component can be used in Expo Web projects, but won't work in native environments (iOS or Android). For native apps, use the supported native components instead.

    ```jsx {{ filename: '/app/user.profile.web.tsx' }}
    import { UserProfile } from '@clerk/clerk-expo/web'

    export default function UserProfilePage() {
      return <UserProfile />
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'routes/user/$.tsx' }}
    import { UserProfile } from '@clerk/remix'

    export default function UserProfilePage() {
      return <UserProfile />
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/routes/user-profile.tsx' }}
    import { UserProfile } from '@clerk/tanstack-react-start'
    import { createFileRoute } from '@tanstack/react-router'

    export const Route = createFileRoute('/user-profile')({
      component: UserProfilePage,
    })

    function UserProfilePage() {
      return <UserProfile />
    }
    ```
  </Tab>

  <Tab>
    ```vue {{ filename: 'user.vue' }}
    <script setup>
    import { UserProfile } from '@clerk/vue'
    </script>

    <template>
      <UserProfile />
    </template>
    ```
  </Tab>
</Tabs>

## Usage with JavaScript

The following methods available on an instance of the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> class are used to render and control the `<UserProfile />` component:

* <SDKLink href="/docs/:sdk:/components/user/user-profile#mount-user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>mountUserProfile()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/user/user-profile#unmount-user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>unmountUserProfile()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/user/user-profile#open-user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>openUserProfile()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/user/user-profile#close-user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>closeUserProfile()</SDKLink>

The following examples assume that you have followed the <SDKLink href="/docs/quickstarts/javascript" sdks={["js-frontend"]}>quickstart</SDKLink> in order to add Clerk to your JavaScript application.

### `mountUserProfile()`

Render the `<UserProfile />` component to an HTML `<div>` element.

```typescript
function mountUserProfile(node: HTMLDivElement, props?: UserProfileProps): void
```

#### `mountUserProfile()` params

<Properties>
  * `node`
  * [`HTMLDivElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement)

  The `<div>` element used to render in the `<UserProfile />` component

  ***

  * `props?`
  * <SDKLink href="/docs/:sdk:/components/user/user-profile#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>UserProfileProps</SDKLink>

  The properties to pass to the `<UserProfile />` component
</Properties>

#### `mountUserProfile()` usage

```js {{ filename: 'main.js', mark: [15] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="user-profile"></div>
`

const userProfileDiv = document.getElementById('user-profile')

clerk.mountUserProfile(userProfileDiv)
```

### `unmountUserProfile()`

Unmount and run cleanup on an existing `<UserProfile />` component instance.

```typescript
function unmountUserProfile(node: HTMLDivElement): void
```

#### `unmountUserProfile()` params

<Properties>
  * `node`
  * [`HTMLDivElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement)

  The container `<div>` element with a rendered `<UserProfile />` component instance.
</Properties>

#### `unmountUserProfile()` usage

```js {{ filename: 'main.js', mark: [19] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="user-profile"></div>
`

const userProfileDiv = document.getElementById('user-profile')

clerk.mountUserProfile(userProfileDiv)

// ...

clerk.unmountUserProfile(userProfileDiv)
```

### `openUserProfile()`

Opens the `<UserProfile />` component as an overlay at the root of your HTML `body` element.

```typescript
function openUserProfile(props?: UserProfileProps): void
```

#### `openUserProfile()` params

<Properties>
  * `props?`
  * <SDKLink href="/docs/:sdk:/components/user/user-profile#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>UserProfileProps</SDKLink>

  The properties to pass to the `<UserProfile />` component
</Properties>

#### `openUserProfile()` usage

```js {{ filename: 'main.js', mark: [15] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="user-profile"></div>
`

const userProfileDiv = document.getElementById('user-profile')

clerk.openUserProfile(userProfileDiv)
```

### `closeUserProfile()`

Closes the user profile overlay.

```typescript
function closeUserProfile(): void
```

#### `closeUserProfile()` usage

```js {{ filename: 'main.js', mark: [15] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="user-profile"></div>
`

const userProfileDiv = document.getElementById('user-profile')

clerk.closeUserProfile(userProfileDiv)
```

## Customization

To learn about how to customize Clerk components, see the [customization documentation](/docs/customization/overview).

In addition, you also can add custom pages and links to the `<UserProfile />` navigation sidenav. For more information, refer to the [Custom Pages documentation](/docs/customization/user-profile).
---
title: "`<Waitlist />` component"
description: The <Waitlist /> component renders a waitlist form that allows
  users to join for early access to your application.
sdk: astro, chrome-extension, expo, nextjs, nuxt, react, react-router, remix,
  tanstack-react-start, vue, js-frontend
sdkScoped: "true"
canonical: /docs/:sdk:/components/waitlist
lastUpdated: 2025-08-22T18:16:19.000Z
availableSdks: astro,chrome-extension,expo,nextjs,nuxt,react,react-router,remix,tanstack-react-start,vue,js-frontend
notAvailableSdks: android,ios,nodejs,expressjs,fastify,go,ruby,js-backend,sdk-development
activeSdk: nextjs
---

![The \<Waitlist /> component renders a form that allows users to join for early access to your app.](/docs/images/ui-components/waitlist.png){{ style: { maxWidth: '460px' } }}

In **Waitlist** mode, users can register their interest in your app by joining a waitlist. This mode is ideal for apps in early development stages or those wanting to generate interest before launch. [Learn more about additional features available in **Waitlist** mode](/docs/authentication/configuration/restrictions#waitlist).

The `<Waitlist />` component renders a form that allows users to join for early access to your app.

> \[!NOTE]
> If you're using Next.js, the`<Waitlist />` component is available in `@clerk/nextjs@6.2.0` and above.

## Enable Waitlist mode

Before using the `<Waitlist />` component, you must enable **Waitlist** mode in the Clerk Dashboard:

1. In the Clerk Dashboard, navigate to the [**Restrictions**](https://dashboard.clerk.com/last-active?path=user-authentication/restrictions) page.
2. Under the **Sign-up modes** section, enable **Waitlist**.

## Properties

All props are optional.

<Properties>
  * `afterJoinWaitlistUrl`
  * `string`

  The full URL or path to navigate to after joining the waitlist.

  ***

  * `appearance`
  * <code>[Appearance](/docs/customization/overview) | undefined</code>

  Optional object to style your components. Will only affect [Clerk components](/docs/components/overview) and not [Account Portal](/docs/account-portal/overview) pages.

  ***

  * `fallback?`
  * `ReactNode`

  An optional element to be rendered while the component is mounting.

  ***

  * `signInUrl`
  * `string`

  The full URL or path to the sign in page. Used for the 'Already have an account? Sign in' link that's rendered. It's recommended to use [the environment variable](/docs/deployments/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
</Properties>

## Usage with frameworks

> \[!WARNING]
> Before using the `<Waitlist />` component, you must provide the `waitlistUrl` prop either in the <SDKLink href="/docs/:sdk:/components/clerk-provider#properties" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>\<ClerkProvider></SDKLink> or <SDKLink href="/docs/:sdk:/components/authentication/sign-in#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink> component to ensure proper functionality.

The following example includes a basic implementation of the `<Waitlist />` component. You can use this as a starting point for your own implementation.

<Tabs items={["Next.js", "React", "Astro", "Expo", "Tanstack React Start", "Vue"]}>
  <Tab>
    ```tsx {{ filename: 'app/waitlist/[[...waitlist]]/page.tsx' }}
    import { Waitlist } from '@clerk/nextjs'

    export default function WaitlistPage() {
      return <Waitlist />
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'src/waitlist.tsx' }}
    import { Waitlist } from '@clerk/clerk-react'

    export default function WaitlistPage() {
      return <Waitlist />
    }
    ```
  </Tab>

  <Tab>
    ```astro {{ filename: 'pages/waitlist.astro' }}
    ---
    import { Waitlist as WaitlistAstro } from '@clerk/astro/components'
    ---

    <WaitlistAstro />
    ```
  </Tab>

  <Tab>
    > \[!NOTE]
    > This component can be used in Expo Web projects, but won't work in native environments (iOS or Android). For native apps, use the supported native components instead.

    ```jsx {{ filename: '/app/waitlist.web.tsx' }}
    import { Waitlist } from '@clerk/clerk-expo/web'

    export default function WaitlistPage() {
      return <Waitlist />
    }
    ```
  </Tab>

  <Tab>
    ```tsx {{ filename: 'app/routes/waitlist.tsx' }}
    import { Waitlist } from '@clerk/tanstack-react-start'
    import { createFileRoute } from '@tanstack/react-router'

    export const Route = createFileRoute('/waitlist')({
      component: WaitlistPage,
    })

    function WaitlistPage() {
      return <Waitlist />
    }
    ```
  </Tab>

  <Tab>
    ```vue {{ filename: 'waitlist.vue' }}
    <script setup lang="ts">
    import { Waitlist } from '@clerk/vue'
    </script>

    <template>
      <Waitlist />
    </template>
    ```
  </Tab>
</Tabs>

## Usage with JavaScript

The following methods available on an instance of the <SDKLink href="/docs/references/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> class are used to render and control the `<Waitlist />` component:

* <SDKLink href="/docs/:sdk:/components/waitlist#mount-waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>mountWaitlist()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/waitlist#unmount-waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>unmountWaitlist()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/waitlist#open-waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>openWaitlist()</SDKLink>
* <SDKLink href="/docs/:sdk:/components/waitlist#close-waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>closeWaitlist()</SDKLink>

The following examples assume that you followed the <SDKLink href="/docs/quickstarts/javascript" sdks={["js-frontend"]}>quickstart</SDKLink> to add Clerk to your JavaScript app.

### <code>mount<wbr />Waitlist()</code>

Render the `<Waitlist />` component to an HTML `<div>` element.

```typescript
function mountWaitlist(node: HTMLDivElement, props?: WaitlistProps): void
```

### <code>mount<wbr />Waitlist()</code> params

<Properties>
  * `node`
  * [`HTMLDivElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement)

  The `<div>` element used to render in the `<Waitlist />` component

  ***

  * `props?`
  * <SDKLink href="/docs/:sdk:/components/waitlist#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>WaitlistProps</SDKLink>

  The properties to pass to the `<Waitlist />` component
</Properties>

#### `mountWaitlist()` usage

```js {{ filename: 'main.js', mark: [13] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerk = new Clerk('{{pub_key}}')
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="waitlist"></div>
`

const waitlistDiv = document.getElementById('waitlist')

clerk.mountWaitlist(waitlistDiv)
```

### <code>unmount<wbr />Waitlist()</code>

Unmount and run cleanup on an existing `<Waitlist />` component instance.

```typescript
function unmountWaitlist(node: HTMLDivElement): void
```

#### `unmountWaitlist()` params

<Properties>
  * `node`
  * [`HTMLDivElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement)

  The container `<div>` element with a rendered `<Waitlist />` component instance
</Properties>

#### `unmountWaitlist()` usage

```js {{ filename: 'main.js', mark: [17] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerk = new Clerk('{{pub_key}}')
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="waitlist"></div>
`

const waitlistDiv = document.getElementById('waitlist')

clerk.mountWaitlist(waitlistDiv)

// ...

clerk.unmountWaitlist(waitlistDiv)
```

### `openWaitlist()`

Opens the `<Waitlist />` component as an overlay at the root of your HTML `body` element.

```typescript
function openWaitlist(props?: WaitlistProps): void
```

#### `openWaitlist()` params

<Properties>
  * `props?`
  * <SDKLink href="/docs/:sdk:/components/waitlist#properties" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>WaitlistProps</SDKLink>

  The properties to pass to the `<Waitlist />` component
</Properties>

#### `openWaitlist()` usage

```js {{ filename: 'main.js', mark: [13] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerk = new Clerk('{{pub_key}}')
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="waitlist"></div>
`

const waitlistDiv = document.getElementById('waitlist')

clerk.openWaitlist(waitlistDiv)
```

### `closeWaitlist()`

Closes the waitlist overlay.

```typescript
function closeWaitlist(): void
```

#### `closeWaitlist()` usage

```js {{ filename: 'main.js', mark: [17] }}
import { Clerk } from '@clerk/clerk-js'

// Initialize Clerk with your Clerk Publishable Key
const clerk = new Clerk('{{pub_key}}')
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="waitlist"></div>
`

const waitlistDiv = document.getElementById('waitlist')

clerk.openWaitlist(waitlistDiv)

// ...

clerk.closeWaitlist(waitlistDiv)
```

## Customization

To learn about how to customize Clerk components, see the [customization guide](/docs/customization/overview).
