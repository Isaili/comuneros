"use client";

import React from 'react';
import { usePantallaBienvenidaViewModel } from '../viewmodel/usePantallaBienvenidaViewModel';
import { BienvenidaComuneroView } from '../view/BienvenidaComuneroView';

export default function BienvenidaComuneroFeature() {
  const estado = usePantallaBienvenidaViewModel();
  return <BienvenidaComuneroView {...estado} />;
}