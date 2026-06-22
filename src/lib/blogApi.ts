const API_URL = import.meta.env.PUBLIC_API_URL;

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string;
  authorName: string;
  categoriesJson: string;
}

export interface PostsResponse {
  data: Post[];
}

export interface PostResponse {
  data: Post;
}

interface RawPost {
  id: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string | null;
  featuredImage?: string | null;
  status?: string;
  published_at?: string;
  publishedAt?: string;
  author_name?: string;
  authorName?: string;
  categories_json?: string;
  categoriesJson?: string;
}

function mapApiPost(raw: RawPost): Post {
  return {
    id: raw.id,
    title: raw.title || '',
    slug: raw.slug || '',
    excerpt: raw.excerpt || raw.content?.substring(0, 200) || '',
    content: raw.content || '',
    featuredImage: raw.featured_image || raw.featuredImage || null,
    status: raw.status || 'published',
    publishedAt: raw.published_at || raw.publishedAt || new Date().toISOString(),
    authorName: raw.author_name || raw.authorName || 'Artricenter',
    categoriesJson: raw.categories_json || raw.categoriesJson || '[]',
  };
}

export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
}

export function parseCategories(categoriesJson: string): string[] {
  try {
    const parsed = JSON.parse(categoriesJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function fetchPosts(page = 1, pageSize = 10): Promise<Post[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/blog/posts?page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result: PostsResponse = await response.json();
    if (!result?.data || !Array.isArray(result.data)) {
      throw new Error('Formato de respuesta inválido: no se encontraron posts');
    }
    return result.data.map(mapApiPost);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_URL}/api/blog/posts/${slug}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result?.status?.success) {
      throw new Error(result?.status?.message || 'Error al cargar el artículo');
    }
    if (!result?.data) {
      return null;
    }
    return mapApiPost(result.data);
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error);
    throw error;
  }
}
