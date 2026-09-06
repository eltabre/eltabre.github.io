import { defineCollection } from 'astro:content';
import {glob } from 'astro/loaders';
import {z} from 'astro/zod';

const blog = defineCollection({
    loader: glob({base: './src/content/blog', pattern: '**/*.{md,mdx}'}),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
    loader: glob({base: './src/content/projects', pattern: '**/*.{md,mdx}'}),
    schema: z.object({
        title: z.string(),
        tagline: z.string(),
        status: z.enum(['shipped', 'building']), 
        order: z.int(),
        stack: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        repo: z.url().optional(),
        demo: z.url().optional(),
        blogPost: z.url().optional(),
    }),
});

export const collections = { blog, projects };