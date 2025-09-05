// src/app/services/search.types.ts
export interface Person {
    name?: string;
    cedula?: string;
    link?: string;
    image: string;   
    phone?: string;
    plate?: string;
}

export interface SearchResponse {
    query_type: string;
    query_value: string;
    results: Person[];
}
