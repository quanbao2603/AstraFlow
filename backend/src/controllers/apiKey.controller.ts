import type { Request, Response } from 'express';
import { ApiKeyService } from '../services/apiKey.service.js';

export const ApiKeyController = {
  /**
   * Lấy danh sách API Keys
   */
  async getKeys(req: Request, res: Response) {
    try {
      // Giả sử middleware xác thực nhét userId vào req.user.id
      const userId = (req as any).user?.id || (req as any).profile?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const keys = await ApiKeyService.getUserKeys(userId);
      return res.json({ data: keys });
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách API Key:', error);
      return res.status(500).json({ error: 'Lỗi server' });
    }
  },

  /**
   * Thêm API Key mới
   */
  async addKey(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).profile?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { provider, label, key, isDefault } = req.body;
      if (!provider || !key) {
        return res.status(400).json({ error: 'Vui lòng cung cấp provider và key' });
      }

      const newKey = await ApiKeyService.addKey(userId, provider, key, label, isDefault);
      return res.status(201).json({ message: 'Lưu API Key thành công', data: newKey });
    } catch (error: any) {
      console.error('Lỗi khi lưu API Key:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Key với tên này (label) đã tồn tại cho nhà cung cấp đã chọn' });
      }
      
      // Trả lại lỗi validation cho UI thay vì giấu nó làm 500 error
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Lỗi server khi lưu API Key' });
    }
  },

  /**
   * Xoá API Key
   */
  async deleteKey(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).profile?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const id = req.params.id as string;
      await ApiKeyService.removeKey(id, userId);
      return res.json({ message: 'Xoá API Key thành công' });
    } catch (error: any) {
      console.error('Lỗi khi xoá API Key:', error);
      return res.status(400).json({ error: error.message || 'Lỗi hệ thống' });
    }
  }
};
