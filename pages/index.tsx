import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { ILessons } from './interface'

export default function Home({ lessons }: ILessons) {
  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link href={`/${lesson.id}`} key={lesson.id}>
          <a className="p-8 h-40 mb-4 rouned shadow text-xl flex">
            {lesson.title}
          </a>
        </Link>
      ))}
    </main>
  )
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from<ILessons>('lesson').select('*')

  return { props: { lessons } }
}
