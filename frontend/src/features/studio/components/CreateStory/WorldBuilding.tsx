import { Globe, Trash2, Sparkles, Plus } from 'lucide-react';

interface WorldEntity {
  id: number;
  type: string;
  name: string;
  description: string;
  conflict: string;
}

interface WorldBuildingProps {
  entities: WorldEntity[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  onChange: (id: number, field: string, value: string) => void;
}

export default function WorldBuilding({ entities, onAdd, onRemove, onChange }: WorldBuildingProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">4. Kiến Tạo Thế Giới (Tùy chọn)</h3>
          <p className="text-xs text-slate-500">Thêm vào các tổ chức, địa điểm gia tăng chiều sâu cho cốt truyện</p>
        </div>
      </div>

      <div className="space-y-6">
        {entities.map((entity) => (
          <div key={entity.id} className="p-5 bg-slate-800/50 border border-slate-800 rounded-xl relative group hover:border-emerald-500/30 transition-colors animate-in slide-in-from-bottom-2 duration-200">
            {entities.length > 1 && (
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
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-500 hover:text-emerald-400 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
        >
          <Plus size={18} /> Thêm Thực Thể Mới
        </button>
      </div>
    </div>
  );
}
