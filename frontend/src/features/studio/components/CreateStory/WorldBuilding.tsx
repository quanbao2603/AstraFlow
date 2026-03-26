import { Globe, Plus } from 'lucide-react';
import type { WorldEntity } from '../../types/studio';
import EntityItem from './EntityItem';

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
          <EntityItem
            key={entity.id}
            entity={entity}
            showRemove={entities.length > 1}
            onRemove={onRemove}
            onChange={onChange}
          />
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

