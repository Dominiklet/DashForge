import { createContext } from 'react';
import type {TimeData} from "../types/TimeData.ts";

export const DataContext = createContext<TimeData | undefined>(undefined);