import Link from 'next/link'
import { ILesson, ILessons } from '../interface'
import { supabase } from '../utils/supabase'

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
  const sortedLessons = lessons?.sort((a, b) => a.id - b.id)
  return { props: { sortedLessons } }
}
