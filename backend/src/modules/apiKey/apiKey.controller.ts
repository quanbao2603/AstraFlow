/**
 * apiKey.controller.ts
 * Chịu trách nhiệm DUY NHẤT: xử lý HTTP request/response cho API Key endpoints.
 * Không chứa business logic — chỉ parse request, gọi service, format response.
 */
import type { Request, Response } from 'express';
import type { IApiKeyService } from './interfaces/IApiKeyService.js';

export class ApiKeyController {
  constructor(private readonly apiKeyService: IApiKeyService) {}

  /**
   * [GET] /api/v1/keys
   * Lấy danh sách API Keys của user hiện tại
   */
  getKeys = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const keys = await this.apiKeyService.getUserKeys(userId);
      return res.json({ success: true, data: keys });
    } catch (error: any) {
      console.error('[ApiKeyController.getKeys]', error);
      return res.status(500).json({ success: false, error: 'Lỗi server' });
    }
  };

  /**
   * [POST] /api/v1/keys
   * Thêm API Key mới
   */
  addKey = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { provider, label, key, isDefault } = req.body;
      if (!provider || !key) {
        return res.status(400).json({ success: false, error: 'Vui lòng cung cấp provider và key' });
      }

      const newKey = await this.apiKeyService.addKey(userId, provider, key, label, isDefault);
      return res.status(201).json({ success: true, message: 'Lưu API Key thành công', data: newKey });
    } catch (error: any) {
      console.error('[ApiKeyController.addKey]', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ success: false, error: 'Key với tên này (label) đã tồn tại cho nhà cung cấp đã chọn' });
      }
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Lỗi server khi lưu API Key' });
    }
  };

  /**
   * [DELETE] /api/v1/keys/:id
   * Xoá API Key
   */
  deleteKey = async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;
      await this.apiKeyService.removeKey(id, userId);
      return res.json({ success: true, message: 'Xoá API Key thành công' });
    } catch (error: any) {
      console.error('[ApiKeyController.deleteKey]', error);
      return res.status(400).json({ success: false, error: error.message || 'Lỗi hệ thống' });
    }
  };
}

