export interface IChunk {
  available_int: number;
  chunk_id: string;
  content_with_weight: string;
  doc_id: string;
  doc_name: string;
  img_id: string;
  important_kwd: any[];
  positions: number[][];
}

export interface Docagg {
  count: number;
  doc_id: string;
  doc_name: string;
}

export interface IReference {
  chunks: IChunk[];
  doc_aggs: Docagg[];
  total: number;
}

export interface IAnswer {
  answer: string;
  reference: IReference;
  conversationId?: string;
  prompt?: string;
  id?: string;
  audio_binary?: string;
}
