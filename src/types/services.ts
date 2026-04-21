import { ReactNode } from 'react';

export interface BentoCard {
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  borderColor: string;
  animationDelay?: string;
  spans?: number; // for desktop grid
}

export interface ServiceIncludeItem {
  name: string;
  icon: ReactNode | string; // SVG or Lucide component
  gradient: string;
  color: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface AudiovisualPackage {
  name: string;
  price: number;
  icon: ReactNode;
  features: string[];
  popular?: boolean;
}

export interface AudiovisualExtra {
  name: string;
  price: number;
  icon: ReactNode;
}

export interface ServiceData {
  id: string;
  title: string;
  heroDescription: string;
  heroCards: BentoCard[];
  includes: ServiceIncludeItem[];
  process: ProcessStep[];
  nextStep?: {
    id: string;
    title: string;
    logic: string;
    image?: string;
  };
}
