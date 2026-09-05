import type { CollectionEntry } from "astro:content";

type Status = CollectionEntry<'projects'>['data']['status'];

interface StatusMeta {
    label: string;
    filled: boolean;
}

export const STATUS_META: Record<Status, StatusMeta> = {
    shipped: {label: 'Shipped', filled: true},
    building: {label: 'Building', filled: false}
}

export function sortProjects(projects: CollectionEntry<'projects'>[]): CollectionEntry<'projects'>[] {
    return projects.toSorted((a, b) => a.data.order - b.data.order);
}

export function countShipped(projects: CollectionEntry<'projects'>[]): number {
    return projects.filter(project => project.data.status === 'shipped').length; 
}