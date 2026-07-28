import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { FeedPost } from '../schemas'
import FeedTimeline from './feed-timeline'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const post: FeedPost = {
  id: '11111111-1111-4111-8111-111111111111',
  author: { name: 'Lina M.', avatarUrl: null },
  context: 'Arkose Lyon · 6b',
  content: 'Session bloc ce soir.',
  tag: 'Session',
  meta: 'Il y a 18 min',
  imageUrl: null,
  likeCount: 24,
  commentCount: 6,
  comments: [],
  likedByViewer: false,
}

describe('FeedTimeline', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('likes a post and refreshes its count from the API response', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      like: { postId: post.id, liked: true, likeCount: 25 },
    }))

    render(<FeedTimeline initialPosts={[post]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aimer la publication de Lina M.' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/posts/${post.id}/likes`,
      expect.objectContaining({ method: 'POST' })
    ))
    expect(await screen.findByText('25 J’aime')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retirer le like de la publication de Lina M.' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('removes an existing like', async () => {
    const likedPost: FeedPost = { ...post, likedByViewer: true, likeCount: 25 }
    fetchMock.mockResolvedValueOnce(jsonResponse({
      like: { postId: post.id, liked: false, likeCount: 24 },
    }))

    render(<FeedTimeline initialPosts={[likedPost]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Retirer le like de la publication de Lina M.' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/posts/${post.id}/likes`,
      expect.objectContaining({ method: 'DELETE' })
    ))
    expect(await screen.findByText('24 J’aime')).toBeInTheDocument()
  })

  it('opens the comment composer from the comment button', async () => {
    render(<FeedTimeline initialPosts={[post]} />)

    expect(screen.queryByLabelText('Ajouter un commentaire')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Commenter la publication de Lina M.' }),
    )

    expect(await screen.findByLabelText('Ajouter un commentaire')).toHaveFocus()
  })

  it('shows an actionable error next to the affected like button', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Publication introuvable' }, 404))

    render(<FeedTimeline initialPosts={[post]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aimer la publication de Lina M.' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Publication introuvable')
    expect(screen.getByText('24 J’aime')).toBeInTheDocument()
  })

  it('renders a first-party image from a local path', () => {
    render(<FeedTimeline initialPosts={[{
      ...post,
      imageUrl: '/images/demo/climbing/indoor-gym-overview.jpg',
    }]} />)

    expect(screen.getByRole('img', { name: 'Publication de Lina M.' })).toBeInTheDocument()
  })
})
