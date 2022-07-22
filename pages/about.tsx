export default function About() {
  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-8">
      <h1 className="text-3xl mb-6">About</h1>
      <article className="space-y-2">
        <p>
          This simple demo app is a show off of using{' '}
          <a
            href="https://supabase.io"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-500 underline"
          >
            Supabase.io
          </a>{' '}
          with{' '}
          <a
            href="https://nextjs.org"
            className="hover:text-gray-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Nextjs
          </a>{' '}
          and{' '}
          <a
            href="https://stripe.com"
            className="hover:text-gray-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Stripe
          </a>
          . The minimum amount of style is done using{' '}
          <a
            href="https://tailwindcss.com"
            className="hover:text-gray-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Tailwindcss
          </a>
        </p>
        <p>
          Signup is done using your{' '}
          <a
            href="https://github.com"
            className="hover:text-gray-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>{' '}
          account, and all transactions are in stripes testmode.
        </p>
      </article>
    </main>
  )
}
