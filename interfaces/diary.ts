export interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  emotions: string[]; // Або масив іконок/enum
  content?: string;
}

export interface DiaryListProps {
  entries: DiaryEntry[];
  onEntrySelect?: (id: string) => void;
}

export interface DiaryEntryDetailsProps {
  entry: DiaryEntry | null; // null означає, що запис не вибрано
}

export interface GreetingBlockProps {
  userName?: string;
}