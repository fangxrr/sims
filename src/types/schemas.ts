import { z } from 'zod';

export const SimTraitSchema = z.object({
    name: z.string(),
    icon: z.string().optional(),
});

export const SimSkillSchema = z.object({
    name: z.string(),
    level: z.number(),
    icon: z.string().optional(),
});

export const RelationshipSchema = z.object({
    id: z.string(),
});

export const SimSchema = z.object({
    id: z.string(),
    familyId: z.string(),
    name: z.string(),
    chineseName: z.string().optional(),
    image: z.string().optional(), // Now optional because it's usually generated
    gender: z.string(),
    age: z.string(),
    maritalStatus: z.string(),
    world: z.string(),
    worldId: z.string(),
    career: z.string(),
    isHomeless: z.boolean().optional(),
    traits: z.array(SimTraitSchema).optional(),
    aspiration: z.object({ name: z.string(), icon: z.string().optional() }).optional(),
    skills: z.array(SimSkillSchema).optional(),
    relationships: z.object({
        spouse: z.array(RelationshipSchema).optional(),
        lover: z.array(RelationshipSchema).optional(),
        children: z.array(RelationshipSchema).optional(),
        parents: z.array(RelationshipSchema).optional(),
        siblings: z.array(RelationshipSchema).optional(),
        grandparents: z.array(RelationshipSchema).optional(),
        grandchildren: z.array(RelationshipSchema).optional(),
        relatives: z.array(RelationshipSchema).optional(),
    }).optional(),
});

export const FamilyMemberSchema = z.object({
    id: z.string(),
});

export const FamilySchema = z.object({
    id: z.string(),
    name: z.string(),
    chineseName: z.string().optional(),
    description: z.string().optional(),
    world: z.string(),
    worldId: z.string(),
    lot: z.string().optional(),
    lotId: z.string().optional(),
    image: z.string().optional(),
    members: z.array(FamilyMemberSchema).optional(),
});

export const DistrictSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string().optional(),
});

export const WorldSchema = z.object({
    id: z.string(),
    name: z.string(),
    chineseName: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    sizes: z.array(z.string()),
    districts: z.array(DistrictSchema),
});

export const LotSchema = z.object({
    id: z.string(),
    name: z.string(),
    chineseName: z.string().optional(),
    size: z.string(),
    image: z.string().optional(),
    worldId: z.string(),
    districtId: z.string().optional(),
    type: z.string(),
    downloadUrl: z.string().optional(),
    isBuilt: z.boolean().optional(),
});

export const CreatorSchema = z.object({
    id: z.string(),
    name: z.string(),
    favLevel: z.union([z.string(), z.number()]).transform(val => String(val)),
    types: z.array(z.string()),
    status: z.string(),
    url: z.string(),
});

export const TrackersSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    type: z.string(),
    subtype: z.string(),
    downloadUrl: z.string(),
    translationUrl: z.string().optional(),
});

export const FinderSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
});

export const GallerySchema = z.object({
    id: z.string(),
});

export type Sim = z.infer<typeof SimSchema>;
export type Family = z.infer<typeof FamilySchema>;
export type World = z.infer<typeof WorldSchema>;
export type District = z.infer<typeof DistrictSchema>;
export type Lot = z.infer<typeof LotSchema>;
export type Creator = z.infer<typeof CreatorSchema>;
export type Tracker = z.infer<typeof TrackersSchema>;
export type Finder = z.infer<typeof FinderSchema>;
export type Gallery = z.infer<typeof GallerySchema>;
