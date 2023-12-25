// types.ts

export interface SchulteResultsItem {
    currentRate: number;
    size: number;
    startTime: Date;
    endTime: Date;
    time: number;
    errors: number;
}

export interface SchulteSettings {
    size: number;
    gameMode: string;
    easyMode: boolean;
    tableCharsType: string;
}

export interface SchulteContext {
    currentRate: number;
    shuffledGrid: any[];
    gridData: any[];
    currentItem: any;
    currentIndex: number;
}

export interface State {
    theme: string | null;
    sourceText: string;
    fetchedData: any[];
    locale: string;
    schulteResults: SchulteResultsItem[];
    schulteSettings: SchulteSettings;
    schulteContext: SchulteContext;
}
