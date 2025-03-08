import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

export function markdownService() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: (str: string, lang: string): string => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(str, { 
            language: lang, 
            ignoreIllegals: true 
          }).value
          return `<pre class="hljs language-${lang}"><code>${highlighted}</code></pre>`
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    },
  })

  // Replace \n\n with proper line breaks
  md.renderer.rules.paragraph_open = (tokens, idx) => {
    return '<p class="mb-4">'
  }

  // Add classes to headers
  md.renderer.rules.heading_open = (tokens, idx) => {
    const level = tokens[idx].tag
    return `<${level} class="text-h${level.slice(1)} font-weight-bold mb-4 mt-6">`
  }

  // link
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    token.attrPush(['target', '_blank'])
    token.attrPush(['rel', 'noopener noreferrer'])
    token.attrPush(['class', 'markdown-link'])
    // Add title attribute for better UX
    const href = token.attrGet('href')
    if (href) {
      token.attrPush(['title', `Open ${href} in new tab`])
    }
    return self.renderToken(tokens, idx, options)
  }

  function renderMarkdown(content: string) {
    // Pre-process content to handle consecutive newlines
    const processedContent = content
      .replace(/\\n\\n/g, '\n\n')
      .replace(/\\n/g, '\n')
    
    let html = md.render(processedContent)
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['pre', 'code', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li'],
      ADD_ATTR: ['class', 'target', 'rel', 'language']
    })
  }

  return {
    renderMarkdown
  }
}