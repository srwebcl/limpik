import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string(),
        seoTitle: z.string().optional(),
        description: z.string(),
        pubDate: z.date(),
        updatedDate: z.date().optional(),
        author: z.string().default('Equipo Limpik'),
        image: image().optional(),
        imageAlt: z.string().optional(),
        ogImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false)
    })
});

export const collections = {
    'blog': blogCollection,
};
