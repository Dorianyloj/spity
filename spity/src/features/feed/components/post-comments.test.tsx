import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { FeedComment } from '../schemas'
import PostComments from './post-comments'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()
const postId = '11111111-1111-4111-8111-111111111111'

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const comment: FeedComment = {
  id: '22222222-2222-4222-8222-222222222222',
  postId,
  content: 'Partant pour la session !',
  author: { name: 'Lina M.', avatarUrl: null },
  meta: 'Il y a 4 min',
  isAuthor: true,
  isEdited: false,
}

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function close(this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    },
  })
})

describe('PostComments', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('creates a comment below the post', async () => {
    const createdComment: FeedComment = {
      ...comment,
      id: '33333333-3333-4333-8333-333333333333',
      content: 'Je vous rejoins après le travail.',
    }
    fetchMock.mockResolvedValueOnce(jsonResponse({ comment: createdComment }, 201))

    render(
      <PostComments composerOpen initialComments={[]} onComposerClose={jest.fn()} postId={postId} />,
    )
    fireEvent.change(screen.getByLabelText('Ajouter un commentaire'), {
      target: { value: createdComment.content },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publier le commentaire' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/posts/${postId}/comments`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ content: createdComment.content }),
      })
    ))
    expect(await screen.findByText(createdComment.content)).toBeInTheDocument()
  })

  it('edits a comment authored by the current user', async () => {
    const editedComment: FeedComment = {
      ...comment,
      content: 'Partant, je peux aussi assurer.',
      isEdited: true,
    }
    fetchMock.mockResolvedValueOnce(jsonResponse({ comment: editedComment }))

    render(
      <PostComments
        composerOpen={false}
        initialComments={[comment]}
        onComposerClose={jest.fn()}
        postId={postId}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }))
    fireEvent.change(screen.getByLabelText('Modifier le commentaire de Lina M.'), {
      target: { value: editedComment.content },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/posts/${postId}/comments/${comment.id}`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ content: editedComment.content }),
      })
    ))
    expect(await screen.findByText(editedComment.content)).toBeInTheDocument()
    expect(screen.getByText(/Modifié/)).toBeInTheDocument()
  })

  it('confirms then deletes a comment authored by the current user', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ deletedCommentId: comment.id }))

    render(
      <PostComments
        composerOpen={false}
        initialComments={[comment]}
        onComposerClose={jest.fn()}
        postId={postId}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer le commentaire' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/posts/${postId}/comments/${comment.id}`,
      expect.objectContaining({ method: 'DELETE' })
    ))
    await waitFor(() => expect(screen.queryByText(comment.content)).not.toBeInTheDocument())
  })
})
