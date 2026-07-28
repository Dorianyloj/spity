import { imageSourceSchema } from './image-source'

describe('imageSourceSchema', () => {
  it('accepts an internal application asset path', () => {
    expect(imageSourceSchema.safeParse('/images/demo/climbing/indoor-gym-overview.jpg').success).toBe(true)
  })

  it('accepts absolute external image URLs but rejects malformed sources', () => {
    expect(imageSourceSchema.safeParse('https://cdn.example.com/climbing.jpg').success).toBe(true)
    expect(imageSourceSchema.safeParse('localhost:3001/images/climbing.jpg').success).toBe(false)
  })
})
