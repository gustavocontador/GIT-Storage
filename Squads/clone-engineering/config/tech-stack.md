# Tech Stack — Clone Engineering Squad

## Core Tools
| Tool | Purpose | Required |
|------|---------|----------|
| Claude Code | MMOS pipeline execution, agent orchestration | Yes |
| YAML Parser | Layer/chunk file generation and validation | Yes (built-in) |
| Markdown Renderer | Documentation generation | Yes (built-in) |

## Knowledge Base
| Component | Options | Default |
|-----------|---------|---------|
| Embedding Model | text-embedding-3-large (3072 dim) | OpenAI |
| Vector Database | Pinecone, Qdrant, Chroma | Configurable |
| Similarity Metric | Cosine | Cosine |
| Storage Format | YAML (human) + JSON (programmatic) | YAML |

## LLM Integration
| Component | Options | Notes |
|-----------|---------|-------|
| Clone Deployment | Claude, GPT-4, Custom | Configurable per project |
| Analysis Engine | Claude (200K context) | Required for large source processing |
| Embedding API | OpenAI text-embedding-3-large | For KB vector indexing |

## Infrastructure
| Component | Purpose |
|-----------|---------|
| Git | Version control for all artifacts |
| File System | Local storage for YAML/MD artifacts |
| RAG System | Knowledge retrieval (Phase 4-5) |
