import RootLayout, { metadata } from './layout'

describe('RootLayout', () => {
  it('declares French document metadata and wraps the main content', () => {
    const layout = RootLayout({ children: 'Contenu de test' })

    expect(metadata.title).toBe('Spity - Communauté Escalade')
    expect(layout.type).toBe('html')
    expect(layout.props.lang).toBe('fr')
    expect(layout.props.children.props.children[1].props.id).toBe('contenu-principal')
    expect(layout.props.children.props.children[1].props.children).toBe('Contenu de test')
  })
})
