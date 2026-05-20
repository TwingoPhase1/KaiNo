import { z } from 'zod';
import type { Prisma } from './prismaClient';
import { type TableSchema, DbSchema, Relation, ElectricClient, type HKT } from 'electric-sql/client/model';
import migrations from './migrations';
import pgMigrations from './pg-migrations';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const Admin_usersScalarFieldEnumSchema = z.enum(['id','username','password_hash','created_at']);

export const Article_referencesScalarFieldEnumSchema = z.enum(['id','article_name','last_price','suggested_category','updated_at']);

export const List_itemsScalarFieldEnumSchema = z.enum(['id','list_id','name','quantity','price','assigned_to','is_checked','updated_at']);

export const ListsScalarFieldEnumSchema = z.enum(['id','name','created_at']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ADMIN USERS SCHEMA
/////////////////////////////////////////

export const Admin_usersSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
})

export type Admin_users = z.infer<typeof Admin_usersSchema>

/////////////////////////////////////////
// ARTICLE REFERENCES SCHEMA
/////////////////////////////////////////

export const Article_referencesSchema = z.object({
  id: z.string().uuid(),
  article_name: z.string(),
  last_price: z.number().or(z.nan()).nullable(),
  suggested_category: z.string().nullable(),
  updated_at: z.coerce.date(),
})

export type Article_references = z.infer<typeof Article_referencesSchema>

/////////////////////////////////////////
// LIST ITEMS SCHEMA
/////////////////////////////////////////

export const List_itemsSchema = z.object({
  id: z.string().uuid(),
  list_id: z.string().uuid(),
  name: z.string(),
  quantity: z.string().nullable(),
  price: z.number().or(z.nan()).nullable(),
  assigned_to: z.string().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date(),
})

export type List_items = z.infer<typeof List_itemsSchema>

/////////////////////////////////////////
// LISTS SCHEMA
/////////////////////////////////////////

export const ListsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
})

export type Lists = z.infer<typeof ListsSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ADMIN USERS
//------------------------------------------------------

export const Admin_usersSelectSchema: z.ZodType<Prisma.Admin_usersSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  password_hash: z.boolean().optional(),
  created_at: z.boolean().optional(),
}).strict()

// ARTICLE REFERENCES
//------------------------------------------------------

export const Article_referencesSelectSchema: z.ZodType<Prisma.Article_referencesSelect> = z.object({
  id: z.boolean().optional(),
  article_name: z.boolean().optional(),
  last_price: z.boolean().optional(),
  suggested_category: z.boolean().optional(),
  updated_at: z.boolean().optional(),
}).strict()

// LIST ITEMS
//------------------------------------------------------

export const List_itemsIncludeSchema: z.ZodType<Prisma.List_itemsInclude> = z.object({
  lists: z.union([z.boolean(),z.lazy(() => ListsArgsSchema)]).optional(),
}).strict()

export const List_itemsArgsSchema: z.ZodType<Prisma.List_itemsArgs> = z.object({
  select: z.lazy(() => List_itemsSelectSchema).optional(),
  include: z.lazy(() => List_itemsIncludeSchema).optional(),
}).strict();

export const List_itemsSelectSchema: z.ZodType<Prisma.List_itemsSelect> = z.object({
  id: z.boolean().optional(),
  list_id: z.boolean().optional(),
  name: z.boolean().optional(),
  quantity: z.boolean().optional(),
  price: z.boolean().optional(),
  assigned_to: z.boolean().optional(),
  is_checked: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  lists: z.union([z.boolean(),z.lazy(() => ListsArgsSchema)]).optional(),
}).strict()

// LISTS
//------------------------------------------------------

export const ListsIncludeSchema: z.ZodType<Prisma.ListsInclude> = z.object({
  list_items: z.union([z.boolean(),z.lazy(() => List_itemsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListsCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ListsArgsSchema: z.ZodType<Prisma.ListsArgs> = z.object({
  select: z.lazy(() => ListsSelectSchema).optional(),
  include: z.lazy(() => ListsIncludeSchema).optional(),
}).strict();

export const ListsCountOutputTypeArgsSchema: z.ZodType<Prisma.ListsCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ListsCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ListsCountOutputTypeSelectSchema: z.ZodType<Prisma.ListsCountOutputTypeSelect> = z.object({
  list_items: z.boolean().optional(),
}).strict();

export const ListsSelectSchema: z.ZodType<Prisma.ListsSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  created_at: z.boolean().optional(),
  list_items: z.union([z.boolean(),z.lazy(() => List_itemsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListsCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const Admin_usersWhereInputSchema: z.ZodType<Prisma.Admin_usersWhereInput> = z.object({
  AND: z.union([ z.lazy(() => Admin_usersWhereInputSchema),z.lazy(() => Admin_usersWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => Admin_usersWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Admin_usersWhereInputSchema),z.lazy(() => Admin_usersWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password_hash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const Admin_usersOrderByWithRelationInputSchema: z.ZodType<Prisma.Admin_usersOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Admin_usersWhereUniqueInputSchema: z.ZodType<Prisma.Admin_usersWhereUniqueInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const Admin_usersOrderByWithAggregationInputSchema: z.ZodType<Prisma.Admin_usersOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => Admin_usersCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => Admin_usersMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => Admin_usersMinOrderByAggregateInputSchema).optional()
}).strict();

export const Admin_usersScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.Admin_usersScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => Admin_usersScalarWhereWithAggregatesInputSchema),z.lazy(() => Admin_usersScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => Admin_usersScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Admin_usersScalarWhereWithAggregatesInputSchema),z.lazy(() => Admin_usersScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password_hash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const Article_referencesWhereInputSchema: z.ZodType<Prisma.Article_referencesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => Article_referencesWhereInputSchema),z.lazy(() => Article_referencesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => Article_referencesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Article_referencesWhereInputSchema),z.lazy(() => Article_referencesWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  article_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  last_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  suggested_category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const Article_referencesOrderByWithRelationInputSchema: z.ZodType<Prisma.Article_referencesOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  article_name: z.lazy(() => SortOrderSchema).optional(),
  last_price: z.lazy(() => SortOrderSchema).optional(),
  suggested_category: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Article_referencesWhereUniqueInputSchema: z.ZodType<Prisma.Article_referencesWhereUniqueInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const Article_referencesOrderByWithAggregationInputSchema: z.ZodType<Prisma.Article_referencesOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  article_name: z.lazy(() => SortOrderSchema).optional(),
  last_price: z.lazy(() => SortOrderSchema).optional(),
  suggested_category: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => Article_referencesCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => Article_referencesAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => Article_referencesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => Article_referencesMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => Article_referencesSumOrderByAggregateInputSchema).optional()
}).strict();

export const Article_referencesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.Article_referencesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => Article_referencesScalarWhereWithAggregatesInputSchema),z.lazy(() => Article_referencesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => Article_referencesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => Article_referencesScalarWhereWithAggregatesInputSchema),z.lazy(() => Article_referencesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  article_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  last_price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  suggested_category: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const List_itemsWhereInputSchema: z.ZodType<Prisma.List_itemsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => List_itemsWhereInputSchema),z.lazy(() => List_itemsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => List_itemsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => List_itemsWhereInputSchema),z.lazy(() => List_itemsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  list_id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  assigned_to: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  is_checked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  lists: z.union([ z.lazy(() => ListsRelationFilterSchema),z.lazy(() => ListsWhereInputSchema) ]).optional(),
}).strict();

export const List_itemsOrderByWithRelationInputSchema: z.ZodType<Prisma.List_itemsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  list_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  assigned_to: z.lazy(() => SortOrderSchema).optional(),
  is_checked: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  lists: z.lazy(() => ListsOrderByWithRelationInputSchema).optional()
}).strict();

export const List_itemsWhereUniqueInputSchema: z.ZodType<Prisma.List_itemsWhereUniqueInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const List_itemsOrderByWithAggregationInputSchema: z.ZodType<Prisma.List_itemsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  list_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  assigned_to: z.lazy(() => SortOrderSchema).optional(),
  is_checked: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => List_itemsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => List_itemsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => List_itemsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => List_itemsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => List_itemsSumOrderByAggregateInputSchema).optional()
}).strict();

export const List_itemsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.List_itemsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => List_itemsScalarWhereWithAggregatesInputSchema),z.lazy(() => List_itemsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => List_itemsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => List_itemsScalarWhereWithAggregatesInputSchema),z.lazy(() => List_itemsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  list_id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  assigned_to: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  is_checked: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ListsWhereInputSchema: z.ZodType<Prisma.ListsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ListsWhereInputSchema),z.lazy(() => ListsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListsWhereInputSchema),z.lazy(() => ListsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  list_items: z.lazy(() => List_itemsListRelationFilterSchema).optional()
}).strict();

export const ListsOrderByWithRelationInputSchema: z.ZodType<Prisma.ListsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  list_items: z.lazy(() => List_itemsOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ListsWhereUniqueInputSchema: z.ZodType<Prisma.ListsWhereUniqueInput> = z.object({
  id: z.string().uuid().optional()
}).strict();

export const ListsOrderByWithAggregationInputSchema: z.ZodType<Prisma.ListsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ListsCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ListsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ListsMinOrderByAggregateInputSchema).optional()
}).strict();

export const ListsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ListsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ListsScalarWhereWithAggregatesInputSchema),z.lazy(() => ListsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListsScalarWhereWithAggregatesInputSchema),z.lazy(() => ListsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const Admin_usersCreateInputSchema: z.ZodType<Prisma.Admin_usersCreateInput> = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date()
}).strict();

export const Admin_usersUncheckedCreateInputSchema: z.ZodType<Prisma.Admin_usersUncheckedCreateInput> = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date()
}).strict();

export const Admin_usersUpdateInputSchema: z.ZodType<Prisma.Admin_usersUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_hash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Admin_usersUncheckedUpdateInputSchema: z.ZodType<Prisma.Admin_usersUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_hash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Admin_usersCreateManyInputSchema: z.ZodType<Prisma.Admin_usersCreateManyInput> = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date()
}).strict();

export const Admin_usersUpdateManyMutationInputSchema: z.ZodType<Prisma.Admin_usersUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_hash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Admin_usersUncheckedUpdateManyInputSchema: z.ZodType<Prisma.Admin_usersUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password_hash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Article_referencesCreateInputSchema: z.ZodType<Prisma.Article_referencesCreateInput> = z.object({
  id: z.string().uuid(),
  article_name: z.string(),
  last_price: z.number().or(z.nan()).optional().nullable(),
  suggested_category: z.string().optional().nullable(),
  updated_at: z.coerce.date()
}).strict();

export const Article_referencesUncheckedCreateInputSchema: z.ZodType<Prisma.Article_referencesUncheckedCreateInput> = z.object({
  id: z.string().uuid(),
  article_name: z.string(),
  last_price: z.number().or(z.nan()).optional().nullable(),
  suggested_category: z.string().optional().nullable(),
  updated_at: z.coerce.date()
}).strict();

export const Article_referencesUpdateInputSchema: z.ZodType<Prisma.Article_referencesUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  article_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  last_price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  suggested_category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Article_referencesUncheckedUpdateInputSchema: z.ZodType<Prisma.Article_referencesUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  article_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  last_price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  suggested_category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Article_referencesCreateManyInputSchema: z.ZodType<Prisma.Article_referencesCreateManyInput> = z.object({
  id: z.string().uuid(),
  article_name: z.string(),
  last_price: z.number().or(z.nan()).optional().nullable(),
  suggested_category: z.string().optional().nullable(),
  updated_at: z.coerce.date()
}).strict();

export const Article_referencesUpdateManyMutationInputSchema: z.ZodType<Prisma.Article_referencesUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  article_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  last_price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  suggested_category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const Article_referencesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.Article_referencesUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  article_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  last_price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  suggested_category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsCreateInputSchema: z.ZodType<Prisma.List_itemsCreateInput> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().or(z.nan()).optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date(),
  lists: z.lazy(() => ListsCreateNestedOneWithoutList_itemsInputSchema)
}).strict();

export const List_itemsUncheckedCreateInputSchema: z.ZodType<Prisma.List_itemsUncheckedCreateInput> = z.object({
  id: z.string().uuid(),
  list_id: z.string().uuid(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().or(z.nan()).optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date()
}).strict();

export const List_itemsUpdateInputSchema: z.ZodType<Prisma.List_itemsUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lists: z.lazy(() => ListsUpdateOneRequiredWithoutList_itemsNestedInputSchema).optional()
}).strict();

export const List_itemsUncheckedUpdateInputSchema: z.ZodType<Prisma.List_itemsUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  list_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsCreateManyInputSchema: z.ZodType<Prisma.List_itemsCreateManyInput> = z.object({
  id: z.string().uuid(),
  list_id: z.string().uuid(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().or(z.nan()).optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date()
}).strict();

export const List_itemsUpdateManyMutationInputSchema: z.ZodType<Prisma.List_itemsUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.List_itemsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  list_id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ListsCreateInputSchema: z.ZodType<Prisma.ListsCreateInput> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
  list_items: z.lazy(() => List_itemsCreateNestedManyWithoutListsInputSchema).optional()
}).strict();

export const ListsUncheckedCreateInputSchema: z.ZodType<Prisma.ListsUncheckedCreateInput> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date(),
  list_items: z.lazy(() => List_itemsUncheckedCreateNestedManyWithoutListsInputSchema).optional()
}).strict();

export const ListsUpdateInputSchema: z.ZodType<Prisma.ListsUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  list_items: z.lazy(() => List_itemsUpdateManyWithoutListsNestedInputSchema).optional()
}).strict();

export const ListsUncheckedUpdateInputSchema: z.ZodType<Prisma.ListsUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  list_items: z.lazy(() => List_itemsUncheckedUpdateManyWithoutListsNestedInputSchema).optional()
}).strict();

export const ListsCreateManyInputSchema: z.ZodType<Prisma.ListsCreateManyInput> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.coerce.date()
}).strict();

export const ListsUpdateManyMutationInputSchema: z.ZodType<Prisma.ListsUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ListsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ListsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UuidFilterSchema: z.ZodType<Prisma.UuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const Admin_usersCountOrderByAggregateInputSchema: z.ZodType<Prisma.Admin_usersCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Admin_usersMaxOrderByAggregateInputSchema: z.ZodType<Prisma.Admin_usersMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Admin_usersMinOrderByAggregateInputSchema: z.ZodType<Prisma.Admin_usersMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password_hash: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UuidWithAggregatesFilterSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const Article_referencesCountOrderByAggregateInputSchema: z.ZodType<Prisma.Article_referencesCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  article_name: z.lazy(() => SortOrderSchema).optional(),
  last_price: z.lazy(() => SortOrderSchema).optional(),
  suggested_category: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Article_referencesAvgOrderByAggregateInputSchema: z.ZodType<Prisma.Article_referencesAvgOrderByAggregateInput> = z.object({
  last_price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Article_referencesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.Article_referencesMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  article_name: z.lazy(() => SortOrderSchema).optional(),
  last_price: z.lazy(() => SortOrderSchema).optional(),
  suggested_category: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Article_referencesMinOrderByAggregateInputSchema: z.ZodType<Prisma.Article_referencesMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  article_name: z.lazy(() => SortOrderSchema).optional(),
  last_price: z.lazy(() => SortOrderSchema).optional(),
  suggested_category: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const Article_referencesSumOrderByAggregateInputSchema: z.ZodType<Prisma.Article_referencesSumOrderByAggregateInput> = z.object({
  last_price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const ListsRelationFilterSchema: z.ZodType<Prisma.ListsRelationFilter> = z.object({
  is: z.lazy(() => ListsWhereInputSchema).optional(),
  isNot: z.lazy(() => ListsWhereInputSchema).optional()
}).strict();

export const List_itemsCountOrderByAggregateInputSchema: z.ZodType<Prisma.List_itemsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  list_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  assigned_to: z.lazy(() => SortOrderSchema).optional(),
  is_checked: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const List_itemsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.List_itemsAvgOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const List_itemsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.List_itemsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  list_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  assigned_to: z.lazy(() => SortOrderSchema).optional(),
  is_checked: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const List_itemsMinOrderByAggregateInputSchema: z.ZodType<Prisma.List_itemsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  list_id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  assigned_to: z.lazy(() => SortOrderSchema).optional(),
  is_checked: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const List_itemsSumOrderByAggregateInputSchema: z.ZodType<Prisma.List_itemsSumOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const List_itemsListRelationFilterSchema: z.ZodType<Prisma.List_itemsListRelationFilter> = z.object({
  every: z.lazy(() => List_itemsWhereInputSchema).optional(),
  some: z.lazy(() => List_itemsWhereInputSchema).optional(),
  none: z.lazy(() => List_itemsWhereInputSchema).optional()
}).strict();

export const List_itemsOrderByRelationAggregateInputSchema: z.ZodType<Prisma.List_itemsOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ListsCountOrderByAggregateInputSchema: z.ZodType<Prisma.ListsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ListsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ListsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ListsMinOrderByAggregateInputSchema: z.ZodType<Prisma.ListsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const ListsCreateNestedOneWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsCreateNestedOneWithoutList_itemsInput> = z.object({
  create: z.union([ z.lazy(() => ListsCreateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedCreateWithoutList_itemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListsCreateOrConnectWithoutList_itemsInputSchema).optional(),
  connect: z.lazy(() => ListsWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ListsUpdateOneRequiredWithoutList_itemsNestedInputSchema: z.ZodType<Prisma.ListsUpdateOneRequiredWithoutList_itemsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ListsCreateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedCreateWithoutList_itemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListsCreateOrConnectWithoutList_itemsInputSchema).optional(),
  upsert: z.lazy(() => ListsUpsertWithoutList_itemsInputSchema).optional(),
  connect: z.lazy(() => ListsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ListsUpdateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedUpdateWithoutList_itemsInputSchema) ]).optional(),
}).strict();

export const List_itemsCreateNestedManyWithoutListsInputSchema: z.ZodType<Prisma.List_itemsCreateNestedManyWithoutListsInput> = z.object({
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsCreateWithoutListsInputSchema).array(),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema),z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => List_itemsCreateManyListsInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const List_itemsUncheckedCreateNestedManyWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUncheckedCreateNestedManyWithoutListsInput> = z.object({
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsCreateWithoutListsInputSchema).array(),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema),z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => List_itemsCreateManyListsInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const List_itemsUpdateManyWithoutListsNestedInputSchema: z.ZodType<Prisma.List_itemsUpdateManyWithoutListsNestedInput> = z.object({
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsCreateWithoutListsInputSchema).array(),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema),z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => List_itemsUpsertWithWhereUniqueWithoutListsInputSchema),z.lazy(() => List_itemsUpsertWithWhereUniqueWithoutListsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => List_itemsCreateManyListsInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => List_itemsUpdateWithWhereUniqueWithoutListsInputSchema),z.lazy(() => List_itemsUpdateWithWhereUniqueWithoutListsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => List_itemsUpdateManyWithWhereWithoutListsInputSchema),z.lazy(() => List_itemsUpdateManyWithWhereWithoutListsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => List_itemsScalarWhereInputSchema),z.lazy(() => List_itemsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const List_itemsUncheckedUpdateManyWithoutListsNestedInputSchema: z.ZodType<Prisma.List_itemsUncheckedUpdateManyWithoutListsNestedInput> = z.object({
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsCreateWithoutListsInputSchema).array(),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema),z.lazy(() => List_itemsCreateOrConnectWithoutListsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => List_itemsUpsertWithWhereUniqueWithoutListsInputSchema),z.lazy(() => List_itemsUpsertWithWhereUniqueWithoutListsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => List_itemsCreateManyListsInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => List_itemsWhereUniqueInputSchema),z.lazy(() => List_itemsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => List_itemsUpdateWithWhereUniqueWithoutListsInputSchema),z.lazy(() => List_itemsUpdateWithWhereUniqueWithoutListsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => List_itemsUpdateManyWithWhereWithoutListsInputSchema),z.lazy(() => List_itemsUpdateManyWithWhereWithoutListsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => List_itemsScalarWhereInputSchema),z.lazy(() => List_itemsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedUuidFilterSchema: z.ZodType<Prisma.NestedUuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedUuidWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ListsCreateWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsCreateWithoutList_itemsInput> = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.coerce.date()
}).strict();

export const ListsUncheckedCreateWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsUncheckedCreateWithoutList_itemsInput> = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.coerce.date()
}).strict();

export const ListsCreateOrConnectWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsCreateOrConnectWithoutList_itemsInput> = z.object({
  where: z.lazy(() => ListsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ListsCreateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedCreateWithoutList_itemsInputSchema) ]),
}).strict();

export const ListsUpsertWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsUpsertWithoutList_itemsInput> = z.object({
  update: z.union([ z.lazy(() => ListsUpdateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedUpdateWithoutList_itemsInputSchema) ]),
  create: z.union([ z.lazy(() => ListsCreateWithoutList_itemsInputSchema),z.lazy(() => ListsUncheckedCreateWithoutList_itemsInputSchema) ]),
}).strict();

export const ListsUpdateWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsUpdateWithoutList_itemsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ListsUncheckedUpdateWithoutList_itemsInputSchema: z.ZodType<Prisma.ListsUncheckedUpdateWithoutList_itemsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsCreateWithoutListsInputSchema: z.ZodType<Prisma.List_itemsCreateWithoutListsInput> = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date()
}).strict();

export const List_itemsUncheckedCreateWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUncheckedCreateWithoutListsInput> = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date()
}).strict();

export const List_itemsCreateOrConnectWithoutListsInputSchema: z.ZodType<Prisma.List_itemsCreateOrConnectWithoutListsInput> = z.object({
  where: z.lazy(() => List_itemsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema) ]),
}).strict();

export const List_itemsCreateManyListsInputEnvelopeSchema: z.ZodType<Prisma.List_itemsCreateManyListsInputEnvelope> = z.object({
  data: z.lazy(() => List_itemsCreateManyListsInputSchema).array(),
  skipDuplicates: z.boolean().optional()
}).strict();

export const List_itemsUpsertWithWhereUniqueWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUpsertWithWhereUniqueWithoutListsInput> = z.object({
  where: z.lazy(() => List_itemsWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => List_itemsUpdateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedUpdateWithoutListsInputSchema) ]),
  create: z.union([ z.lazy(() => List_itemsCreateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedCreateWithoutListsInputSchema) ]),
}).strict();

export const List_itemsUpdateWithWhereUniqueWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUpdateWithWhereUniqueWithoutListsInput> = z.object({
  where: z.lazy(() => List_itemsWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => List_itemsUpdateWithoutListsInputSchema),z.lazy(() => List_itemsUncheckedUpdateWithoutListsInputSchema) ]),
}).strict();

export const List_itemsUpdateManyWithWhereWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUpdateManyWithWhereWithoutListsInput> = z.object({
  where: z.lazy(() => List_itemsScalarWhereInputSchema),
  data: z.union([ z.lazy(() => List_itemsUpdateManyMutationInputSchema),z.lazy(() => List_itemsUncheckedUpdateManyWithoutList_itemsInputSchema) ]),
}).strict();

export const List_itemsScalarWhereInputSchema: z.ZodType<Prisma.List_itemsScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => List_itemsScalarWhereInputSchema),z.lazy(() => List_itemsScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => List_itemsScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => List_itemsScalarWhereInputSchema),z.lazy(() => List_itemsScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  list_id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  assigned_to: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  is_checked: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const List_itemsCreateManyListsInputSchema: z.ZodType<Prisma.List_itemsCreateManyListsInput> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  quantity: z.string().optional().nullable(),
  price: z.number().or(z.nan()).optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  is_checked: z.boolean(),
  updated_at: z.coerce.date()
}).strict();

export const List_itemsUpdateWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUpdateWithoutListsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsUncheckedUpdateWithoutListsInputSchema: z.ZodType<Prisma.List_itemsUncheckedUpdateWithoutListsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const List_itemsUncheckedUpdateManyWithoutList_itemsInputSchema: z.ZodType<Prisma.List_itemsUncheckedUpdateManyWithoutList_itemsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().or(z.nan()),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assigned_to: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  is_checked: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const Admin_usersFindFirstArgsSchema: z.ZodType<Prisma.Admin_usersFindFirstArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereInputSchema.optional(),
  orderBy: z.union([ Admin_usersOrderByWithRelationInputSchema.array(),Admin_usersOrderByWithRelationInputSchema ]).optional(),
  cursor: Admin_usersWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Admin_usersScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Admin_usersFindFirstOrThrowArgsSchema: z.ZodType<Prisma.Admin_usersFindFirstOrThrowArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereInputSchema.optional(),
  orderBy: z.union([ Admin_usersOrderByWithRelationInputSchema.array(),Admin_usersOrderByWithRelationInputSchema ]).optional(),
  cursor: Admin_usersWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Admin_usersScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Admin_usersFindManyArgsSchema: z.ZodType<Prisma.Admin_usersFindManyArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereInputSchema.optional(),
  orderBy: z.union([ Admin_usersOrderByWithRelationInputSchema.array(),Admin_usersOrderByWithRelationInputSchema ]).optional(),
  cursor: Admin_usersWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Admin_usersScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Admin_usersAggregateArgsSchema: z.ZodType<Prisma.Admin_usersAggregateArgs> = z.object({
  where: Admin_usersWhereInputSchema.optional(),
  orderBy: z.union([ Admin_usersOrderByWithRelationInputSchema.array(),Admin_usersOrderByWithRelationInputSchema ]).optional(),
  cursor: Admin_usersWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Admin_usersGroupByArgsSchema: z.ZodType<Prisma.Admin_usersGroupByArgs> = z.object({
  where: Admin_usersWhereInputSchema.optional(),
  orderBy: z.union([ Admin_usersOrderByWithAggregationInputSchema.array(),Admin_usersOrderByWithAggregationInputSchema ]).optional(),
  by: Admin_usersScalarFieldEnumSchema.array(),
  having: Admin_usersScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Admin_usersFindUniqueArgsSchema: z.ZodType<Prisma.Admin_usersFindUniqueArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereUniqueInputSchema,
}).strict() 

export const Admin_usersFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.Admin_usersFindUniqueOrThrowArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereUniqueInputSchema,
}).strict() 

export const Article_referencesFindFirstArgsSchema: z.ZodType<Prisma.Article_referencesFindFirstArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereInputSchema.optional(),
  orderBy: z.union([ Article_referencesOrderByWithRelationInputSchema.array(),Article_referencesOrderByWithRelationInputSchema ]).optional(),
  cursor: Article_referencesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Article_referencesScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Article_referencesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.Article_referencesFindFirstOrThrowArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereInputSchema.optional(),
  orderBy: z.union([ Article_referencesOrderByWithRelationInputSchema.array(),Article_referencesOrderByWithRelationInputSchema ]).optional(),
  cursor: Article_referencesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Article_referencesScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Article_referencesFindManyArgsSchema: z.ZodType<Prisma.Article_referencesFindManyArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereInputSchema.optional(),
  orderBy: z.union([ Article_referencesOrderByWithRelationInputSchema.array(),Article_referencesOrderByWithRelationInputSchema ]).optional(),
  cursor: Article_referencesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: Article_referencesScalarFieldEnumSchema.array().optional(),
}).strict() 

export const Article_referencesAggregateArgsSchema: z.ZodType<Prisma.Article_referencesAggregateArgs> = z.object({
  where: Article_referencesWhereInputSchema.optional(),
  orderBy: z.union([ Article_referencesOrderByWithRelationInputSchema.array(),Article_referencesOrderByWithRelationInputSchema ]).optional(),
  cursor: Article_referencesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Article_referencesGroupByArgsSchema: z.ZodType<Prisma.Article_referencesGroupByArgs> = z.object({
  where: Article_referencesWhereInputSchema.optional(),
  orderBy: z.union([ Article_referencesOrderByWithAggregationInputSchema.array(),Article_referencesOrderByWithAggregationInputSchema ]).optional(),
  by: Article_referencesScalarFieldEnumSchema.array(),
  having: Article_referencesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() 

export const Article_referencesFindUniqueArgsSchema: z.ZodType<Prisma.Article_referencesFindUniqueArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereUniqueInputSchema,
}).strict() 

export const Article_referencesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.Article_referencesFindUniqueOrThrowArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereUniqueInputSchema,
}).strict() 

export const List_itemsFindFirstArgsSchema: z.ZodType<Prisma.List_itemsFindFirstArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereInputSchema.optional(),
  orderBy: z.union([ List_itemsOrderByWithRelationInputSchema.array(),List_itemsOrderByWithRelationInputSchema ]).optional(),
  cursor: List_itemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: List_itemsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.List_itemsFindFirstArgs>

export const List_itemsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.List_itemsFindFirstOrThrowArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereInputSchema.optional(),
  orderBy: z.union([ List_itemsOrderByWithRelationInputSchema.array(),List_itemsOrderByWithRelationInputSchema ]).optional(),
  cursor: List_itemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: List_itemsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.List_itemsFindFirstOrThrowArgs>

export const List_itemsFindManyArgsSchema: z.ZodType<Prisma.List_itemsFindManyArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereInputSchema.optional(),
  orderBy: z.union([ List_itemsOrderByWithRelationInputSchema.array(),List_itemsOrderByWithRelationInputSchema ]).optional(),
  cursor: List_itemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: List_itemsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.List_itemsFindManyArgs>

export const List_itemsAggregateArgsSchema: z.ZodType<Prisma.List_itemsAggregateArgs> = z.object({
  where: List_itemsWhereInputSchema.optional(),
  orderBy: z.union([ List_itemsOrderByWithRelationInputSchema.array(),List_itemsOrderByWithRelationInputSchema ]).optional(),
  cursor: List_itemsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.List_itemsAggregateArgs>

export const List_itemsGroupByArgsSchema: z.ZodType<Prisma.List_itemsGroupByArgs> = z.object({
  where: List_itemsWhereInputSchema.optional(),
  orderBy: z.union([ List_itemsOrderByWithAggregationInputSchema.array(),List_itemsOrderByWithAggregationInputSchema ]).optional(),
  by: List_itemsScalarFieldEnumSchema.array(),
  having: List_itemsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.List_itemsGroupByArgs>

export const List_itemsFindUniqueArgsSchema: z.ZodType<Prisma.List_itemsFindUniqueArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.List_itemsFindUniqueArgs>

export const List_itemsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.List_itemsFindUniqueOrThrowArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.List_itemsFindUniqueOrThrowArgs>

export const ListsFindFirstArgsSchema: z.ZodType<Prisma.ListsFindFirstArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereInputSchema.optional(),
  orderBy: z.union([ ListsOrderByWithRelationInputSchema.array(),ListsOrderByWithRelationInputSchema ]).optional(),
  cursor: ListsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ListsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.ListsFindFirstArgs>

export const ListsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ListsFindFirstOrThrowArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereInputSchema.optional(),
  orderBy: z.union([ ListsOrderByWithRelationInputSchema.array(),ListsOrderByWithRelationInputSchema ]).optional(),
  cursor: ListsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ListsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.ListsFindFirstOrThrowArgs>

export const ListsFindManyArgsSchema: z.ZodType<Prisma.ListsFindManyArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereInputSchema.optional(),
  orderBy: z.union([ ListsOrderByWithRelationInputSchema.array(),ListsOrderByWithRelationInputSchema ]).optional(),
  cursor: ListsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ListsScalarFieldEnumSchema.array().optional(),
}).strict() as z.ZodType<Prisma.ListsFindManyArgs>

export const ListsAggregateArgsSchema: z.ZodType<Prisma.ListsAggregateArgs> = z.object({
  where: ListsWhereInputSchema.optional(),
  orderBy: z.union([ ListsOrderByWithRelationInputSchema.array(),ListsOrderByWithRelationInputSchema ]).optional(),
  cursor: ListsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ListsAggregateArgs>

export const ListsGroupByArgsSchema: z.ZodType<Prisma.ListsGroupByArgs> = z.object({
  where: ListsWhereInputSchema.optional(),
  orderBy: z.union([ ListsOrderByWithAggregationInputSchema.array(),ListsOrderByWithAggregationInputSchema ]).optional(),
  by: ListsScalarFieldEnumSchema.array(),
  having: ListsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ListsGroupByArgs>

export const ListsFindUniqueArgsSchema: z.ZodType<Prisma.ListsFindUniqueArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListsFindUniqueArgs>

export const ListsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ListsFindUniqueOrThrowArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListsFindUniqueOrThrowArgs>

export const Admin_usersCreateArgsSchema: z.ZodType<Prisma.Admin_usersCreateArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  data: z.union([ Admin_usersCreateInputSchema,Admin_usersUncheckedCreateInputSchema ]),
}).strict() 

export const Admin_usersUpsertArgsSchema: z.ZodType<Prisma.Admin_usersUpsertArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereUniqueInputSchema,
  create: z.union([ Admin_usersCreateInputSchema,Admin_usersUncheckedCreateInputSchema ]),
  update: z.union([ Admin_usersUpdateInputSchema,Admin_usersUncheckedUpdateInputSchema ]),
}).strict() 

export const Admin_usersCreateManyArgsSchema: z.ZodType<Prisma.Admin_usersCreateManyArgs> = z.object({
  data: Admin_usersCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() 

export const Admin_usersDeleteArgsSchema: z.ZodType<Prisma.Admin_usersDeleteArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  where: Admin_usersWhereUniqueInputSchema,
}).strict() 

export const Admin_usersUpdateArgsSchema: z.ZodType<Prisma.Admin_usersUpdateArgs> = z.object({
  select: Admin_usersSelectSchema.optional(),
  data: z.union([ Admin_usersUpdateInputSchema,Admin_usersUncheckedUpdateInputSchema ]),
  where: Admin_usersWhereUniqueInputSchema,
}).strict() 

export const Admin_usersUpdateManyArgsSchema: z.ZodType<Prisma.Admin_usersUpdateManyArgs> = z.object({
  data: z.union([ Admin_usersUpdateManyMutationInputSchema,Admin_usersUncheckedUpdateManyInputSchema ]),
  where: Admin_usersWhereInputSchema.optional(),
}).strict() 

export const Admin_usersDeleteManyArgsSchema: z.ZodType<Prisma.Admin_usersDeleteManyArgs> = z.object({
  where: Admin_usersWhereInputSchema.optional(),
}).strict() 

export const Article_referencesCreateArgsSchema: z.ZodType<Prisma.Article_referencesCreateArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  data: z.union([ Article_referencesCreateInputSchema,Article_referencesUncheckedCreateInputSchema ]),
}).strict() 

export const Article_referencesUpsertArgsSchema: z.ZodType<Prisma.Article_referencesUpsertArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereUniqueInputSchema,
  create: z.union([ Article_referencesCreateInputSchema,Article_referencesUncheckedCreateInputSchema ]),
  update: z.union([ Article_referencesUpdateInputSchema,Article_referencesUncheckedUpdateInputSchema ]),
}).strict() 

export const Article_referencesCreateManyArgsSchema: z.ZodType<Prisma.Article_referencesCreateManyArgs> = z.object({
  data: Article_referencesCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() 

export const Article_referencesDeleteArgsSchema: z.ZodType<Prisma.Article_referencesDeleteArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  where: Article_referencesWhereUniqueInputSchema,
}).strict() 

export const Article_referencesUpdateArgsSchema: z.ZodType<Prisma.Article_referencesUpdateArgs> = z.object({
  select: Article_referencesSelectSchema.optional(),
  data: z.union([ Article_referencesUpdateInputSchema,Article_referencesUncheckedUpdateInputSchema ]),
  where: Article_referencesWhereUniqueInputSchema,
}).strict() 

export const Article_referencesUpdateManyArgsSchema: z.ZodType<Prisma.Article_referencesUpdateManyArgs> = z.object({
  data: z.union([ Article_referencesUpdateManyMutationInputSchema,Article_referencesUncheckedUpdateManyInputSchema ]),
  where: Article_referencesWhereInputSchema.optional(),
}).strict() 

export const Article_referencesDeleteManyArgsSchema: z.ZodType<Prisma.Article_referencesDeleteManyArgs> = z.object({
  where: Article_referencesWhereInputSchema.optional(),
}).strict() 

export const List_itemsCreateArgsSchema: z.ZodType<Prisma.List_itemsCreateArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  data: z.union([ List_itemsCreateInputSchema,List_itemsUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.List_itemsCreateArgs>

export const List_itemsUpsertArgsSchema: z.ZodType<Prisma.List_itemsUpsertArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereUniqueInputSchema,
  create: z.union([ List_itemsCreateInputSchema,List_itemsUncheckedCreateInputSchema ]),
  update: z.union([ List_itemsUpdateInputSchema,List_itemsUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.List_itemsUpsertArgs>

export const List_itemsCreateManyArgsSchema: z.ZodType<Prisma.List_itemsCreateManyArgs> = z.object({
  data: List_itemsCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.List_itemsCreateManyArgs>

export const List_itemsDeleteArgsSchema: z.ZodType<Prisma.List_itemsDeleteArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  where: List_itemsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.List_itemsDeleteArgs>

export const List_itemsUpdateArgsSchema: z.ZodType<Prisma.List_itemsUpdateArgs> = z.object({
  select: List_itemsSelectSchema.optional(),
  include: List_itemsIncludeSchema.optional(),
  data: z.union([ List_itemsUpdateInputSchema,List_itemsUncheckedUpdateInputSchema ]),
  where: List_itemsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.List_itemsUpdateArgs>

export const List_itemsUpdateManyArgsSchema: z.ZodType<Prisma.List_itemsUpdateManyArgs> = z.object({
  data: z.union([ List_itemsUpdateManyMutationInputSchema,List_itemsUncheckedUpdateManyInputSchema ]),
  where: List_itemsWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.List_itemsUpdateManyArgs>

export const List_itemsDeleteManyArgsSchema: z.ZodType<Prisma.List_itemsDeleteManyArgs> = z.object({
  where: List_itemsWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.List_itemsDeleteManyArgs>

export const ListsCreateArgsSchema: z.ZodType<Prisma.ListsCreateArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  data: z.union([ ListsCreateInputSchema,ListsUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ListsCreateArgs>

export const ListsUpsertArgsSchema: z.ZodType<Prisma.ListsUpsertArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereUniqueInputSchema,
  create: z.union([ ListsCreateInputSchema,ListsUncheckedCreateInputSchema ]),
  update: z.union([ ListsUpdateInputSchema,ListsUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ListsUpsertArgs>

export const ListsCreateManyArgsSchema: z.ZodType<Prisma.ListsCreateManyArgs> = z.object({
  data: ListsCreateManyInputSchema.array(),
  skipDuplicates: z.boolean().optional(),
}).strict() as z.ZodType<Prisma.ListsCreateManyArgs>

export const ListsDeleteArgsSchema: z.ZodType<Prisma.ListsDeleteArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  where: ListsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListsDeleteArgs>

export const ListsUpdateArgsSchema: z.ZodType<Prisma.ListsUpdateArgs> = z.object({
  select: ListsSelectSchema.optional(),
  include: ListsIncludeSchema.optional(),
  data: z.union([ ListsUpdateInputSchema,ListsUncheckedUpdateInputSchema ]),
  where: ListsWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ListsUpdateArgs>

export const ListsUpdateManyArgsSchema: z.ZodType<Prisma.ListsUpdateManyArgs> = z.object({
  data: z.union([ ListsUpdateManyMutationInputSchema,ListsUncheckedUpdateManyInputSchema ]),
  where: ListsWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ListsUpdateManyArgs>

export const ListsDeleteManyArgsSchema: z.ZodType<Prisma.ListsDeleteManyArgs> = z.object({
  where: ListsWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ListsDeleteManyArgs>

interface Admin_usersGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.Admin_usersArgs
  readonly type: Omit<Prisma.Admin_usersGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

interface Article_referencesGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.Article_referencesArgs
  readonly type: Omit<Prisma.Article_referencesGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

interface List_itemsGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.List_itemsArgs
  readonly type: Omit<Prisma.List_itemsGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

interface ListsGetPayload extends HKT {
  readonly _A?: boolean | null | undefined | Prisma.ListsArgs
  readonly type: Omit<Prisma.ListsGetPayload<this['_A']>, "Please either choose `select` or `include`">
}

export const tableSchemas = {
  admin_users: {
    fields: new Map([
      [
        "id",
        "UUID"
      ],
      [
        "username",
        "TEXT"
      ],
      [
        "password_hash",
        "TEXT"
      ],
      [
        "created_at",
        "TIMESTAMPTZ"
      ]
    ]),
    relations: [
    ],
    modelSchema: (Admin_usersCreateInputSchema as any)
      .partial()
      .or((Admin_usersUncheckedCreateInputSchema as any).partial()),
    createSchema: Admin_usersCreateArgsSchema,
    createManySchema: Admin_usersCreateManyArgsSchema,
    findUniqueSchema: Admin_usersFindUniqueArgsSchema,
    findSchema: Admin_usersFindFirstArgsSchema,
    updateSchema: Admin_usersUpdateArgsSchema,
    updateManySchema: Admin_usersUpdateManyArgsSchema,
    upsertSchema: Admin_usersUpsertArgsSchema,
    deleteSchema: Admin_usersDeleteArgsSchema,
    deleteManySchema: Admin_usersDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof Admin_usersUncheckedCreateInputSchema>,
    Prisma.Admin_usersCreateArgs['data'],
    Prisma.Admin_usersUpdateArgs['data'],
    Prisma.Admin_usersFindFirstArgs['select'],
    Prisma.Admin_usersFindFirstArgs['where'],
    Prisma.Admin_usersFindUniqueArgs['where'],
    never,
    Prisma.Admin_usersFindFirstArgs['orderBy'],
    Prisma.Admin_usersScalarFieldEnum,
    Admin_usersGetPayload
  >,
  article_references: {
    fields: new Map([
      [
        "id",
        "UUID"
      ],
      [
        "article_name",
        "TEXT"
      ],
      [
        "last_price",
        "FLOAT4"
      ],
      [
        "suggested_category",
        "TEXT"
      ],
      [
        "updated_at",
        "TIMESTAMPTZ"
      ]
    ]),
    relations: [
    ],
    modelSchema: (Article_referencesCreateInputSchema as any)
      .partial()
      .or((Article_referencesUncheckedCreateInputSchema as any).partial()),
    createSchema: Article_referencesCreateArgsSchema,
    createManySchema: Article_referencesCreateManyArgsSchema,
    findUniqueSchema: Article_referencesFindUniqueArgsSchema,
    findSchema: Article_referencesFindFirstArgsSchema,
    updateSchema: Article_referencesUpdateArgsSchema,
    updateManySchema: Article_referencesUpdateManyArgsSchema,
    upsertSchema: Article_referencesUpsertArgsSchema,
    deleteSchema: Article_referencesDeleteArgsSchema,
    deleteManySchema: Article_referencesDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof Article_referencesUncheckedCreateInputSchema>,
    Prisma.Article_referencesCreateArgs['data'],
    Prisma.Article_referencesUpdateArgs['data'],
    Prisma.Article_referencesFindFirstArgs['select'],
    Prisma.Article_referencesFindFirstArgs['where'],
    Prisma.Article_referencesFindUniqueArgs['where'],
    never,
    Prisma.Article_referencesFindFirstArgs['orderBy'],
    Prisma.Article_referencesScalarFieldEnum,
    Article_referencesGetPayload
  >,
  list_items: {
    fields: new Map([
      [
        "id",
        "UUID"
      ],
      [
        "list_id",
        "UUID"
      ],
      [
        "name",
        "TEXT"
      ],
      [
        "quantity",
        "TEXT"
      ],
      [
        "price",
        "FLOAT4"
      ],
      [
        "assigned_to",
        "TEXT"
      ],
      [
        "is_checked",
        "BOOL"
      ],
      [
        "updated_at",
        "TIMESTAMPTZ"
      ]
    ]),
    relations: [
      new Relation("lists", "list_id", "id", "lists", "List_itemsToLists", "one"),
    ],
    modelSchema: (List_itemsCreateInputSchema as any)
      .partial()
      .or((List_itemsUncheckedCreateInputSchema as any).partial()),
    createSchema: List_itemsCreateArgsSchema,
    createManySchema: List_itemsCreateManyArgsSchema,
    findUniqueSchema: List_itemsFindUniqueArgsSchema,
    findSchema: List_itemsFindFirstArgsSchema,
    updateSchema: List_itemsUpdateArgsSchema,
    updateManySchema: List_itemsUpdateManyArgsSchema,
    upsertSchema: List_itemsUpsertArgsSchema,
    deleteSchema: List_itemsDeleteArgsSchema,
    deleteManySchema: List_itemsDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof List_itemsUncheckedCreateInputSchema>,
    Prisma.List_itemsCreateArgs['data'],
    Prisma.List_itemsUpdateArgs['data'],
    Prisma.List_itemsFindFirstArgs['select'],
    Prisma.List_itemsFindFirstArgs['where'],
    Prisma.List_itemsFindUniqueArgs['where'],
    Omit<Prisma.List_itemsInclude, '_count'>,
    Prisma.List_itemsFindFirstArgs['orderBy'],
    Prisma.List_itemsScalarFieldEnum,
    List_itemsGetPayload
  >,
  lists: {
    fields: new Map([
      [
        "id",
        "UUID"
      ],
      [
        "name",
        "TEXT"
      ],
      [
        "created_at",
        "TIMESTAMPTZ"
      ]
    ]),
    relations: [
      new Relation("list_items", "", "", "list_items", "List_itemsToLists", "many"),
    ],
    modelSchema: (ListsCreateInputSchema as any)
      .partial()
      .or((ListsUncheckedCreateInputSchema as any).partial()),
    createSchema: ListsCreateArgsSchema,
    createManySchema: ListsCreateManyArgsSchema,
    findUniqueSchema: ListsFindUniqueArgsSchema,
    findSchema: ListsFindFirstArgsSchema,
    updateSchema: ListsUpdateArgsSchema,
    updateManySchema: ListsUpdateManyArgsSchema,
    upsertSchema: ListsUpsertArgsSchema,
    deleteSchema: ListsDeleteArgsSchema,
    deleteManySchema: ListsDeleteManyArgsSchema
  } as TableSchema<
    z.infer<typeof ListsUncheckedCreateInputSchema>,
    Prisma.ListsCreateArgs['data'],
    Prisma.ListsUpdateArgs['data'],
    Prisma.ListsFindFirstArgs['select'],
    Prisma.ListsFindFirstArgs['where'],
    Prisma.ListsFindUniqueArgs['where'],
    Omit<Prisma.ListsInclude, '_count'>,
    Prisma.ListsFindFirstArgs['orderBy'],
    Prisma.ListsScalarFieldEnum,
    ListsGetPayload
  >,
}

export const schema = new DbSchema(tableSchemas, migrations, pgMigrations)
export type Electric = ElectricClient<typeof schema>
