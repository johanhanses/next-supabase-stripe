import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { ILesson, IPremiumContent } from './interface'
import Video from 'react-player'

export default function LessonDetails({ lesson }: { lesson: ILesson }) {
  const [videoUrl, setVideoUrl] = useState('')

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from<IPremiumContent>('premium_content')
      .select('video_url')
      .eq('id', lesson.id)
      .single()

    if (data) setVideoUrl(data?.video_url)
  }

  useEffect(() => {
    getPremiumContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p className="mb-8">{lesson.description}</p>
      {videoUrl && <Video url={videoUrl} width="100%" />}
    </div>
  )
}

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from<ILesson>('lesson').select('id')

  const paths = lessons?.map((lesson) => {
    return { params: { id: lesson.id.toString() } }
  })

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams

  const { data: lesson } = await supabase
    .from<ILesson>('lesson')
    .select('*')
    .eq('id', id)
    .single()

  return { props: { lesson } }
}
