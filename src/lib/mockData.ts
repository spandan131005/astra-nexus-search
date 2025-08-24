import type { ResultItem, Summary } from '../store';

export const mockResults: ResultItem[] = [
  {
    id: '1',
    modality: 'text',
    title: 'Advanced RAG Techniques for Multi-Modal Document Processing',
    url: 'https://arxiv.org/abs/2024.01234',
    sourceDomain: 'arxiv.org',
    publishedAt: '2024-01-15',
    score: 95,
    snippet: 'We present novel approaches to retrieval-augmented generation that combine text, image, and table understanding for comprehensive document analysis. Our method achieves state-of-the-art performance on multi-modal benchmarks.',
    highlights: ['RAG', 'multi-modal', 'document analysis'],
  },
  {
    id: '2',
    modality: 'pdf',
    title: 'Vision-Language Models for Chart Understanding',
    url: 'https://research.microsoft.com/chart-understanding.pdf',
    sourceDomain: 'research.microsoft.com',
    publishedAt: '2024-02-10',
    score: 92,
    snippet: 'This paper introduces a comprehensive framework for understanding charts and graphs using vision-language models, with applications in data analysis and business intelligence.',
    highlights: ['vision-language', 'charts', 'data analysis'],
    thumbnailUrl: '/placeholder-pdf.png',
  },
  {
    id: '3',
    modality: 'image',
    title: 'Graph Neural Network Architecture Diagram',
    url: 'https://cdn.openai.com/research/gnn-architecture.png',
    sourceDomain: 'openai.com',
    publishedAt: '2024-01-28',
    score: 88,
    snippet: 'Detailed architectural diagram showing the flow of information through graph neural networks for recommendation systems.',
    highlights: ['graph neural network', 'architecture', 'recommendation'],
    thumbnailUrl: '/placeholder-image.png',
  },
  {
    id: '4',
    modality: 'table',
    title: 'LLM Evaluation Benchmark Results',
    url: 'https://huggingface.co/benchmarks/llm-eval-2024',
    sourceDomain: 'huggingface.co',
    publishedAt: '2024-02-05',
    score: 91,
    snippet: 'Comprehensive evaluation results comparing major language models across various tasks including reasoning, coding, and multi-modal understanding.',
    highlights: ['LLM evaluation', 'benchmarks', 'performance'],
    tablePreview: {
      headers: ['Model', 'MMLU Score', 'HumanEval', 'Multi-Modal Score'],
      rows: [
        ['GPT-4', '86.4', '67.0', '82.1'],
        ['Claude-3', '84.2', '64.5', '79.8'],
        ['Gemini Pro', '83.7', '63.4', '78.9'],
        ['GPT-3.5', '70.0', '48.1', '65.2'],
        ['LLaMA-2', '68.9', '29.9', '62.4'],
      ],
    },
  },
  {
    id: '5',
    modality: 'text',
    title: 'Implementing Semantic Search with Vector Databases',
    url: 'https://blog.pinecone.io/semantic-search-implementation',
    sourceDomain: 'pinecone.io',
    publishedAt: '2024-01-20',
    score: 87,
    snippet: 'Step-by-step guide to building production-ready semantic search systems using vector embeddings and modern database technologies.',
    highlights: ['semantic search', 'vector databases', 'embeddings'],
  },
  {
    id: '6',
    modality: 'pdf',
    title: 'Attention Mechanisms in Transformer Models',
    url: 'https://papers.nips.cc/attention-transformers-2024.pdf',
    sourceDomain: 'papers.nips.cc',
    publishedAt: '2024-02-14',
    score: 94,
    snippet: 'Deep dive into the mathematical foundations of attention mechanisms and their applications in modern transformer architectures for NLP and computer vision.',
    highlights: ['attention mechanisms', 'transformers', 'deep learning'],
    thumbnailUrl: '/placeholder-pdf.png',
  },
  {
    id: '7',
    modality: 'image',
    title: 'Multi-Modal AI Pipeline Visualization',
    url: 'https://storage.googleapis.com/ai-research/pipeline-viz.png',
    sourceDomain: 'google.com',
    publishedAt: '2024-01-12',
    score: 85,
    snippet: 'Interactive visualization showing how different modalities (text, image, audio) are processed through a unified AI pipeline.',
    highlights: ['multi-modal', 'AI pipeline', 'visualization'],
    thumbnailUrl: '/placeholder-image.png',
  },
  {
    id: '8',
    modality: 'table',
    title: 'Performance Comparison: Embedding Models',
    url: 'https://www.anthropic.com/research/embedding-comparison',
    sourceDomain: 'anthropic.com',
    publishedAt: '2024-02-08',
    score: 89,
    snippet: 'Detailed performance analysis of various embedding models across different domains and tasks, including retrieval accuracy and computational efficiency.',
    highlights: ['embedding models', 'performance', 'comparison'],
    tablePreview: {
      headers: ['Model', 'Retrieval@10', 'Speed (ms)', 'Memory (GB)'],
      rows: [
        ['text-embedding-ada-002', '0.847', '45', '2.1'],
        ['sentence-transformers', '0.832', '23', '1.8'],
        ['e5-large-v2', '0.856', '67', '3.2'],
        ['bge-large-en', '0.841', '52', '2.7'],
      ],
    },
  },
];

export function getMockResults(query: string): ResultItem[] {
  // Simple filtering based on query for demo
  if (!query.trim()) return mockResults;
  
  const lowerQuery = query.toLowerCase();
  return mockResults
    .filter(result => 
      result.title.toLowerCase().includes(lowerQuery) ||
      result.snippet?.toLowerCase().includes(lowerQuery) ||
      result.highlights?.some(h => h.toLowerCase().includes(lowerQuery))
    )
    .sort((a, b) => b.score - a.score);
}

export function getMockSummary(query: string): Summary {
  return {
    bullets: [
      `Found ${getMockResults(query).length} relevant results for "${query}" across multiple modalities`,
      'Latest research shows significant advances in multi-modal AI systems combining text, vision, and structured data',
      'Vector databases and semantic search are becoming essential for modern AI applications',
      'Performance benchmarks indicate continued improvements in model capabilities and efficiency',
      'Open-source models are closing the gap with proprietary solutions in many domains',
    ],
    citations: [
      { id: '1', shortRef: 'Advanced RAG Techniques (arxiv.org)' },
      { id: '2', shortRef: 'Vision-Language Models (microsoft.com)' },
      { id: '4', shortRef: 'LLM Evaluation Benchmark (huggingface.co)' },
      { id: '6', shortRef: 'Attention Mechanisms (nips.cc)' },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export const sampleQueries = [
  'LLM evaluation techniques',
  'Graph RAG for PDFs', 
  'Vision-language models for charts',
  'Multi-modal embeddings comparison',
  'Semantic search implementation',
  'Attention mechanisms in transformers',
];