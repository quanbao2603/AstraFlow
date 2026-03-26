import { Trash2, Sparkles } from 'lucide-react';
import type { WorldEntity } from '../../types/studio';

interface EntityItemProps {
  entity: WorldEntity;
  showRemove: boolean;
  onRemove: (id: number) => void;
  onChange: (id: number, field: string, value: string) => void;
}

export default function EntityItem({ entity, showRemove, onRemove, onChange }: EntityItemProps) {
  return (
    <div className="p-5 bg-slate-800/50 border border-slate-800 rounded-xl relative group hover:border-emerald-500/30 transition-colors animate-in slide-in-from-bottom-2 duration-200">
      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(entity.id)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <select
            value={entity.type}
            onChange={(e) => onChange(entity.id, 'type', e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="faction">Thế Lực</option>
            <option value="location">Địa Điểm</option>
            <option value="item">Vật Phẩm</option>
          </select>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <input
          type="text"
          value={entity.name}
          onChange={(e) => onChange(entity.id, 'name', e.target.value)}
          placeholder="Tên (VD: Ma quỷ, Sài Gòn 2077...)"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500"
        />

        <div className="md:col-span-2 flex justify-end">
          <button
            type="button"
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Sparkles size={14} /> AI Mô tả
          </button>
        </div>

        <div className="md:col-span-2">
          <textarea
            value={entity.description}
            onChange={(e) => onChange(entity.id, 'description', e.target.value)}
            placeholder="Mô tả chi tiết, đặc tính, hoạt động..."
            rows={2}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <textarea
            value={entity.conflict}
            onChange={(e) => onChange(entity.id, 'conflict', e.target.value)}
            placeholder="Xung đột nội bộ hoặc Bí mật bị ẩn giấu..."
            rows={1}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-emerald-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
