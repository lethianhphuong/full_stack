import { apiClient, API_BASE_URL, type ApiResponse } from '../apiClient';
import type { DocumentItem, DocumentStats } from '@/sections/onlyoffice/types/document.types';

export interface GetDocumentsParams {
  page?: number;
  size?: number;
  search?: string;
  fileType?: string;
  sort?: string;
}

export interface DocumentPageResponse {
  content: DocumentItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  stats?: DocumentStats;
  last?: boolean;
}

export interface CreateEmptyDocumentDto {
  title: string;
  fileType: string;
}

export const documentService = {
  /**
   * Lay danh sach tai lieu co phan trang, tim kiem, loc theo loai va sap xep
   */
  async getDocuments(
    params: GetDocumentsParams = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<DocumentPageResponse>> {
    const queryParams: Record<string, unknown> = {
      page: params.page ?? 0,
      size: params.size ?? 10,
    };

    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    if (params.fileType && params.fileType !== 'all') {
      queryParams.fileType = params.fileType.toLowerCase();
    }

    if (params.sort) {
      queryParams.sort = params.sort;
    }

    return apiClient.get('/documents', {
      params: queryParams,
      signal,
    });
  },

  /**
   * Lay thong ke so luong tai lieu theo tung dinh dang
   */
  async getDocumentStats(
    params?: { page?: number; size?: number },
    signal?: AbortSignal
  ): Promise<ApiResponse<DocumentStats>> {
    return apiClient.get('/documents/stats', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
      signal,
    });
  },

  /**
   * Xoa tai lieu theo ID
   */
  async deleteDocument(id: string, signal?: AbortSignal): Promise<ApiResponse<void>> {
    return apiClient.delete(`/documents/${id}`, { signal });
  },

  /**
   * Upload file tai lieu moi len server
   */
  async uploadDocument(
    file: File,
    title?: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<DocumentItem>> {
    const formData = new FormData();
    formData.append('file', file);
    if (title && title.trim()) {
      formData.append('title', title.trim());
    }

    return apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });
  },

  /**
   * Tao tai lieu trang moi (Word, Excel, PPTX, PDF)
   */
  async createEmptyDocument(
    dto: CreateEmptyDocumentDto,
    signal?: AbortSignal
  ): Promise<ApiResponse<DocumentItem>> {
    return apiClient.post('/documents/create-empty', dto, { signal });
  },

  /**
   * Lay config editor cho OnlyOffice Viewer / Editor
   */
  async getDocumentConfig(
    id: string,
    readOnly = false,
    signal?: AbortSignal
  ): Promise<ApiResponse<any>> {
    return apiClient.get(`/documents/${id}/config`, {
      params: { readOnly },
      signal,
    });
  },

  /**
   * Tra ve URL download truc tiep cho tai lieu
   */
  getDownloadUrl(id: string): string {
    return `${API_BASE_URL}/documents/${id}/download`;
  },

  /**
   * Mo tab moi de tai file ve may
   */
  downloadDocument(id: string): void {
    window.open(this.getDownloadUrl(id), '_blank');
  },
};

export default documentService;
