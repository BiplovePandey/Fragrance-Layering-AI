import React from 'react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { PrivateFragranceCabinet } from '../cabinet/PrivateFragranceCabinet.js';

export interface WardrobeViewProps {
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  onAddToCollection: (id: number) => void;
  onRemoveFromCollection: (id: number) => void;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  weather: WeatherCondition;
  onWearToday?: (fragA: Fragrance, fragB?: Fragrance) => void;
  onNavigate?: (tab: any) => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  allFragrances,
  ownedFragrances,
  onAddToCollection,
  onRemoveFromCollection,
  onSendToLab,
  weather,
  onWearToday,
  onNavigate
}) => {
  const handleWearToday = (fragA: Fragrance, fragB?: Fragrance) => {
    if (onWearToday) {
      onWearToday(fragA, fragB);
    }
  };

  const handleNavigate = (tab: any) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <PrivateFragranceCabinet
      ownedFragrances={ownedFragrances}
      allFragrances={allFragrances}
      weather={weather}
      onWearToday={handleWearToday}
      onSendToLab={(frag) => onSendToLab(frag)}
      onAddToCabinet={onAddToCollection}
      onRemoveFromCabinet={onRemoveFromCollection}
      onNavigate={handleNavigate}
    />
  );
};
