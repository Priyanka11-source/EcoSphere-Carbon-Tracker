/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LedgerEntry {
  id: string;
  category: 'transport' | 'food' | 'energy' | 'shopping';
  description: string;
  value: number; // e.g. 15 km, 2 meals, 40 kWh
  unit: string;
  carbonImpact: number; // in kg of CO2e
  date: string;
  isReduction: boolean; // whether this action avoided/reduced CO2e (positive vs negative impact)
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string;
  impactMetrics?: {
    co2Amount: number;
    category: string;
  };
}

export interface CYOAScenario {
  id: string;
  title: string;
  chapter: string;
  prompt: string;
  options: CYOAOption[];
}

export interface CYOAOption {
  text: string;
  impact: number; // change to carbon footprint rating (+ or -)
  points: number; // game points
  narrativeOutcome: string;
  nextScenarioId: string | 'end';
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'food' | 'energy' | 'shopping';
  co2SavedPerDay: number;
  completed: boolean;
  daysDuration: number;
  daysSucceeded: number;
}
