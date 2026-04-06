import { useState } from 'react';
import type { WorldEntity } from '../types/studio';

export const useWorldEntities = (initialEntities: WorldEntity[]) => {
  const [entities, setEntities] = useState<WorldEntity[]>(initialEntities);

  const handleAddEntity = () => {
    setEntities(prev => [
      ...prev,
      { id: Date.now(), type: 'faction', name: '', description: '', conflict: '' }
    ]);
  };

  const handleRemoveEntity = (id: number) => {
    if (entities.length <= 1) return; // Luôn giữ ít nhất 1 thực thể
    setEntities(prev => prev.filter(entity => entity.id !== id));
  };

  const handleEntityChange = (id: number, field: string, value: string) => {
    setEntities(prev => prev.map(entity =>
      entity.id === id ? { ...entity, [field]: value } : entity
    ));
  };

  const resetEntities = (newEntities?: WorldEntity[]) => {
    setEntities(newEntities ?? initialEntities);
  };

  return {
    entities,
    setEntities,
    handleAddEntity,
    handleRemoveEntity,
    handleEntityChange,
    resetEntities
  };
};
