import { createContext } from 'react';
import type {MetaData} from "../types/MetaData.ts";

export const MetaDataContext = createContext<MetaData | undefined>(undefined);