import type { MDXComponents } from 'mdx/types'

// ChartWrapper will be added in a later task
// import { ChartWrapper } from '@/app/components/ChartWrapper'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // ChartWrapper will be added here once the component is created
  }
}
