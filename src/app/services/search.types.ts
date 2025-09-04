// src/app/services/search.types.ts
export interface Person {
    cedula?: string;
    name?: string;
    phone?: string;
    plate?: string;
    link?: string;
}

export interface SearchResponse {
    query_type: string;
    query_value: string;
    results: Person[];
}
