
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Admin_users
 * 
 */
export type Admin_users = {
  /**
   * @zod.string.uuid()
   */
  id: string
  username: string
  password_hash: string
  created_at: Date
}

/**
 * Model Article_references
 * 
 */
export type Article_references = {
  /**
   * @zod.string.uuid()
   */
  id: string
  article_name: string
  /**
   * @zod.custom.use(z.number().or(z.nan()))
   */
  last_price: number | null
  suggested_category: string | null
  updated_at: Date
}

/**
 * Model List_items
 * 
 */
export type List_items = {
  /**
   * @zod.string.uuid()
   */
  id: string
  /**
   * @zod.string.uuid()
   */
  list_id: string
  name: string
  quantity: string | null
  /**
   * @zod.custom.use(z.number().or(z.nan()))
   */
  price: number | null
  assigned_to: string | null
  is_checked: boolean
  updated_at: Date
}

/**
 * Model Lists
 * 
 */
export type Lists = {
  /**
   * @zod.string.uuid()
   */
  id: string
  name: string
  created_at: Date
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admin_users
 * const admin_users = await prisma.admin_users.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Admin_users
   * const admin_users = await prisma.admin_users.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>;

  $transaction<R>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: {maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel}): Promise<R>;

      /**
   * `prisma.admin_users`: Exposes CRUD operations for the **Admin_users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admin_users
    * const admin_users = await prisma.admin_users.findMany()
    * ```
    */
  get admin_users(): Prisma.Admin_usersDelegate<GlobalReject>;

  /**
   * `prisma.article_references`: Exposes CRUD operations for the **Article_references** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Article_references
    * const article_references = await prisma.article_references.findMany()
    * ```
    */
  get article_references(): Prisma.Article_referencesDelegate<GlobalReject>;

  /**
   * `prisma.list_items`: Exposes CRUD operations for the **List_items** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more List_items
    * const list_items = await prisma.list_items.findMany()
    * ```
    */
  get list_items(): Prisma.List_itemsDelegate<GlobalReject>;

  /**
   * `prisma.lists`: Exposes CRUD operations for the **Lists** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lists
    * const lists = await prisma.lists.findMany()
    * ```
    */
  get lists(): Prisma.ListsDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.8.1
   * Query Engine version: d6e67a83f971b175a593ccc12e15c4a757f93ffe
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
export type InputJsonValue = null | string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Admin_users: 'Admin_users',
    Article_references: 'Article_references',
    List_items: 'List_items',
    Lists: 'Lists'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ListsCountOutputType
   */


  export type ListsCountOutputType = {
    list_items: number
  }

  export type ListsCountOutputTypeSelect = {
    list_items?: boolean
  }

  export type ListsCountOutputTypeGetPayload<S extends boolean | null | undefined | ListsCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? ListsCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (ListsCountOutputTypeArgs)
    ? ListsCountOutputType 
    : S extends { select: any } & (ListsCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof ListsCountOutputType ? ListsCountOutputType[P] : never
  } 
      : ListsCountOutputType




  // Custom InputTypes

  /**
   * ListsCountOutputType without action
   */
  export type ListsCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ListsCountOutputType
     * 
    **/
    select?: ListsCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Admin_users
   */


  export type AggregateAdmin_users = {
    _count: Admin_usersCountAggregateOutputType | null
    _min: Admin_usersMinAggregateOutputType | null
    _max: Admin_usersMaxAggregateOutputType | null
  }

  export type Admin_usersMinAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    created_at: Date | null
  }

  export type Admin_usersMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    created_at: Date | null
  }

  export type Admin_usersCountAggregateOutputType = {
    id: number
    username: number
    password_hash: number
    created_at: number
    _all: number
  }


  export type Admin_usersMinAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
  }

  export type Admin_usersMaxAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
  }

  export type Admin_usersCountAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
    _all?: true
  }

  export type Admin_usersAggregateArgs = {
    /**
     * Filter which Admin_users to aggregate.
     * 
    **/
    where?: Admin_usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admin_users to fetch.
     * 
    **/
    orderBy?: Enumerable<Admin_usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: Admin_usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admin_users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admin_users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admin_users
    **/
    _count?: true | Admin_usersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Admin_usersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Admin_usersMaxAggregateInputType
  }

  export type GetAdmin_usersAggregateType<T extends Admin_usersAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin_users]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin_users[P]>
      : GetScalarType<T[P], AggregateAdmin_users[P]>
  }




  export type Admin_usersGroupByArgs = {
    where?: Admin_usersWhereInput
    orderBy?: Enumerable<Admin_usersOrderByWithAggregationInput>
    by: Array<Admin_usersScalarFieldEnum>
    having?: Admin_usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Admin_usersCountAggregateInputType | true
    _min?: Admin_usersMinAggregateInputType
    _max?: Admin_usersMaxAggregateInputType
  }


  export type Admin_usersGroupByOutputType = {
    id: string
    username: string
    password_hash: string
    created_at: Date
    _count: Admin_usersCountAggregateOutputType | null
    _min: Admin_usersMinAggregateOutputType | null
    _max: Admin_usersMaxAggregateOutputType | null
  }

  type GetAdmin_usersGroupByPayload<T extends Admin_usersGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Admin_usersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Admin_usersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Admin_usersGroupByOutputType[P]>
            : GetScalarType<T[P], Admin_usersGroupByOutputType[P]>
        }
      >
    >


  export type Admin_usersSelect = {
    id?: boolean
    username?: boolean
    password_hash?: boolean
    created_at?: boolean
  }


  export type Admin_usersGetPayload<S extends boolean | null | undefined | Admin_usersArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Admin_users :
    S extends undefined ? never :
    S extends { include: any } & (Admin_usersArgs | Admin_usersFindManyArgs)
    ? Admin_users 
    : S extends { select: any } & (Admin_usersArgs | Admin_usersFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Admin_users ? Admin_users[P] : never
  } 
      : Admin_users


  type Admin_usersCountArgs = Merge<
    Omit<Admin_usersFindManyArgs, 'select' | 'include'> & {
      select?: Admin_usersCountAggregateInputType | true
    }
  >

  export interface Admin_usersDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Admin_users that matches the filter.
     * @param {Admin_usersFindUniqueArgs} args - Arguments to find a Admin_users
     * @example
     * // Get one Admin_users
     * const admin_users = await prisma.admin_users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends Admin_usersFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, Admin_usersFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Admin_users'> extends True ? Prisma__Admin_usersClient<Admin_usersGetPayload<T>> : Prisma__Admin_usersClient<Admin_usersGetPayload<T> | null, null>

    /**
     * Find one Admin_users that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {Admin_usersFindUniqueOrThrowArgs} args - Arguments to find a Admin_users
     * @example
     * // Get one Admin_users
     * const admin_users = await prisma.admin_users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends Admin_usersFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, Admin_usersFindUniqueOrThrowArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Find the first Admin_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersFindFirstArgs} args - Arguments to find a Admin_users
     * @example
     * // Get one Admin_users
     * const admin_users = await prisma.admin_users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends Admin_usersFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, Admin_usersFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Admin_users'> extends True ? Prisma__Admin_usersClient<Admin_usersGetPayload<T>> : Prisma__Admin_usersClient<Admin_usersGetPayload<T> | null, null>

    /**
     * Find the first Admin_users that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersFindFirstOrThrowArgs} args - Arguments to find a Admin_users
     * @example
     * // Get one Admin_users
     * const admin_users = await prisma.admin_users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends Admin_usersFindFirstOrThrowArgs>(
      args?: SelectSubset<T, Admin_usersFindFirstOrThrowArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Find zero or more Admin_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admin_users
     * const admin_users = await prisma.admin_users.findMany()
     * 
     * // Get first 10 Admin_users
     * const admin_users = await prisma.admin_users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const admin_usersWithIdOnly = await prisma.admin_users.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends Admin_usersFindManyArgs>(
      args?: SelectSubset<T, Admin_usersFindManyArgs>
    ): PrismaPromise<Array<Admin_usersGetPayload<T>>>

    /**
     * Create a Admin_users.
     * @param {Admin_usersCreateArgs} args - Arguments to create a Admin_users.
     * @example
     * // Create one Admin_users
     * const Admin_users = await prisma.admin_users.create({
     *   data: {
     *     // ... data to create a Admin_users
     *   }
     * })
     * 
    **/
    create<T extends Admin_usersCreateArgs>(
      args: SelectSubset<T, Admin_usersCreateArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Create many Admin_users.
     *     @param {Admin_usersCreateManyArgs} args - Arguments to create many Admin_users.
     *     @example
     *     // Create many Admin_users
     *     const admin_users = await prisma.admin_users.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends Admin_usersCreateManyArgs>(
      args?: SelectSubset<T, Admin_usersCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Admin_users.
     * @param {Admin_usersDeleteArgs} args - Arguments to delete one Admin_users.
     * @example
     * // Delete one Admin_users
     * const Admin_users = await prisma.admin_users.delete({
     *   where: {
     *     // ... filter to delete one Admin_users
     *   }
     * })
     * 
    **/
    delete<T extends Admin_usersDeleteArgs>(
      args: SelectSubset<T, Admin_usersDeleteArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Update one Admin_users.
     * @param {Admin_usersUpdateArgs} args - Arguments to update one Admin_users.
     * @example
     * // Update one Admin_users
     * const admin_users = await prisma.admin_users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends Admin_usersUpdateArgs>(
      args: SelectSubset<T, Admin_usersUpdateArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Delete zero or more Admin_users.
     * @param {Admin_usersDeleteManyArgs} args - Arguments to filter Admin_users to delete.
     * @example
     * // Delete a few Admin_users
     * const { count } = await prisma.admin_users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends Admin_usersDeleteManyArgs>(
      args?: SelectSubset<T, Admin_usersDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admin_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admin_users
     * const admin_users = await prisma.admin_users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends Admin_usersUpdateManyArgs>(
      args: SelectSubset<T, Admin_usersUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin_users.
     * @param {Admin_usersUpsertArgs} args - Arguments to update or create a Admin_users.
     * @example
     * // Update or create a Admin_users
     * const admin_users = await prisma.admin_users.upsert({
     *   create: {
     *     // ... data to create a Admin_users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin_users we want to update
     *   }
     * })
    **/
    upsert<T extends Admin_usersUpsertArgs>(
      args: SelectSubset<T, Admin_usersUpsertArgs>
    ): Prisma__Admin_usersClient<Admin_usersGetPayload<T>>

    /**
     * Count the number of Admin_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersCountArgs} args - Arguments to filter Admin_users to count.
     * @example
     * // Count the number of Admin_users
     * const count = await prisma.admin_users.count({
     *   where: {
     *     // ... the filter for the Admin_users we want to count
     *   }
     * })
    **/
    count<T extends Admin_usersCountArgs>(
      args?: Subset<T, Admin_usersCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Admin_usersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Admin_usersAggregateArgs>(args: Subset<T, Admin_usersAggregateArgs>): PrismaPromise<GetAdmin_usersAggregateType<T>>

    /**
     * Group by Admin_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Admin_usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Admin_usersGroupByArgs['orderBy'] }
        : { orderBy?: Admin_usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Admin_usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdmin_usersGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin_users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__Admin_usersClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Admin_users base type for findUnique actions
   */
  export type Admin_usersFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter, which Admin_users to fetch.
     * 
    **/
    where: Admin_usersWhereUniqueInput
  }

  /**
   * Admin_users findUnique
   */
  export interface Admin_usersFindUniqueArgs extends Admin_usersFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Admin_users findUniqueOrThrow
   */
  export type Admin_usersFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter, which Admin_users to fetch.
     * 
    **/
    where: Admin_usersWhereUniqueInput
  }


  /**
   * Admin_users base type for findFirst actions
   */
  export type Admin_usersFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter, which Admin_users to fetch.
     * 
    **/
    where?: Admin_usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admin_users to fetch.
     * 
    **/
    orderBy?: Enumerable<Admin_usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admin_users.
     * 
    **/
    cursor?: Admin_usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admin_users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admin_users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admin_users.
     * 
    **/
    distinct?: Enumerable<Admin_usersScalarFieldEnum>
  }

  /**
   * Admin_users findFirst
   */
  export interface Admin_usersFindFirstArgs extends Admin_usersFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Admin_users findFirstOrThrow
   */
  export type Admin_usersFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter, which Admin_users to fetch.
     * 
    **/
    where?: Admin_usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admin_users to fetch.
     * 
    **/
    orderBy?: Enumerable<Admin_usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admin_users.
     * 
    **/
    cursor?: Admin_usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admin_users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admin_users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admin_users.
     * 
    **/
    distinct?: Enumerable<Admin_usersScalarFieldEnum>
  }


  /**
   * Admin_users findMany
   */
  export type Admin_usersFindManyArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter, which Admin_users to fetch.
     * 
    **/
    where?: Admin_usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admin_users to fetch.
     * 
    **/
    orderBy?: Enumerable<Admin_usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admin_users.
     * 
    **/
    cursor?: Admin_usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admin_users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admin_users.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Admin_usersScalarFieldEnum>
  }


  /**
   * Admin_users create
   */
  export type Admin_usersCreateArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * The data needed to create a Admin_users.
     * 
    **/
    data: XOR<Admin_usersCreateInput, Admin_usersUncheckedCreateInput>
  }


  /**
   * Admin_users createMany
   */
  export type Admin_usersCreateManyArgs = {
    /**
     * The data used to create many Admin_users.
     * 
    **/
    data: Enumerable<Admin_usersCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Admin_users update
   */
  export type Admin_usersUpdateArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * The data needed to update a Admin_users.
     * 
    **/
    data: XOR<Admin_usersUpdateInput, Admin_usersUncheckedUpdateInput>
    /**
     * Choose, which Admin_users to update.
     * 
    **/
    where: Admin_usersWhereUniqueInput
  }


  /**
   * Admin_users updateMany
   */
  export type Admin_usersUpdateManyArgs = {
    /**
     * The data used to update Admin_users.
     * 
    **/
    data: XOR<Admin_usersUpdateManyMutationInput, Admin_usersUncheckedUpdateManyInput>
    /**
     * Filter which Admin_users to update
     * 
    **/
    where?: Admin_usersWhereInput
  }


  /**
   * Admin_users upsert
   */
  export type Admin_usersUpsertArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * The filter to search for the Admin_users to update in case it exists.
     * 
    **/
    where: Admin_usersWhereUniqueInput
    /**
     * In case the Admin_users found by the `where` argument doesn't exist, create a new Admin_users with this data.
     * 
    **/
    create: XOR<Admin_usersCreateInput, Admin_usersUncheckedCreateInput>
    /**
     * In case the Admin_users was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<Admin_usersUpdateInput, Admin_usersUncheckedUpdateInput>
  }


  /**
   * Admin_users delete
   */
  export type Admin_usersDeleteArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
    /**
     * Filter which Admin_users to delete.
     * 
    **/
    where: Admin_usersWhereUniqueInput
  }


  /**
   * Admin_users deleteMany
   */
  export type Admin_usersDeleteManyArgs = {
    /**
     * Filter which Admin_users to delete
     * 
    **/
    where?: Admin_usersWhereInput
  }


  /**
   * Admin_users without action
   */
  export type Admin_usersArgs = {
    /**
     * Select specific fields to fetch from the Admin_users
     * 
    **/
    select?: Admin_usersSelect | null
  }



  /**
   * Model Article_references
   */


  export type AggregateArticle_references = {
    _count: Article_referencesCountAggregateOutputType | null
    _avg: Article_referencesAvgAggregateOutputType | null
    _sum: Article_referencesSumAggregateOutputType | null
    _min: Article_referencesMinAggregateOutputType | null
    _max: Article_referencesMaxAggregateOutputType | null
  }

  export type Article_referencesAvgAggregateOutputType = {
    last_price: number | null
  }

  export type Article_referencesSumAggregateOutputType = {
    last_price: number | null
  }

  export type Article_referencesMinAggregateOutputType = {
    id: string | null
    article_name: string | null
    last_price: number | null
    suggested_category: string | null
    updated_at: Date | null
  }

  export type Article_referencesMaxAggregateOutputType = {
    id: string | null
    article_name: string | null
    last_price: number | null
    suggested_category: string | null
    updated_at: Date | null
  }

  export type Article_referencesCountAggregateOutputType = {
    id: number
    article_name: number
    last_price: number
    suggested_category: number
    updated_at: number
    _all: number
  }


  export type Article_referencesAvgAggregateInputType = {
    last_price?: true
  }

  export type Article_referencesSumAggregateInputType = {
    last_price?: true
  }

  export type Article_referencesMinAggregateInputType = {
    id?: true
    article_name?: true
    last_price?: true
    suggested_category?: true
    updated_at?: true
  }

  export type Article_referencesMaxAggregateInputType = {
    id?: true
    article_name?: true
    last_price?: true
    suggested_category?: true
    updated_at?: true
  }

  export type Article_referencesCountAggregateInputType = {
    id?: true
    article_name?: true
    last_price?: true
    suggested_category?: true
    updated_at?: true
    _all?: true
  }

  export type Article_referencesAggregateArgs = {
    /**
     * Filter which Article_references to aggregate.
     * 
    **/
    where?: Article_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Article_references to fetch.
     * 
    **/
    orderBy?: Enumerable<Article_referencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: Article_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Article_references from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Article_references.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Article_references
    **/
    _count?: true | Article_referencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Article_referencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Article_referencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Article_referencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Article_referencesMaxAggregateInputType
  }

  export type GetArticle_referencesAggregateType<T extends Article_referencesAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle_references]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle_references[P]>
      : GetScalarType<T[P], AggregateArticle_references[P]>
  }




  export type Article_referencesGroupByArgs = {
    where?: Article_referencesWhereInput
    orderBy?: Enumerable<Article_referencesOrderByWithAggregationInput>
    by: Array<Article_referencesScalarFieldEnum>
    having?: Article_referencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Article_referencesCountAggregateInputType | true
    _avg?: Article_referencesAvgAggregateInputType
    _sum?: Article_referencesSumAggregateInputType
    _min?: Article_referencesMinAggregateInputType
    _max?: Article_referencesMaxAggregateInputType
  }


  export type Article_referencesGroupByOutputType = {
    id: string
    article_name: string
    last_price: number | null
    suggested_category: string | null
    updated_at: Date
    _count: Article_referencesCountAggregateOutputType | null
    _avg: Article_referencesAvgAggregateOutputType | null
    _sum: Article_referencesSumAggregateOutputType | null
    _min: Article_referencesMinAggregateOutputType | null
    _max: Article_referencesMaxAggregateOutputType | null
  }

  type GetArticle_referencesGroupByPayload<T extends Article_referencesGroupByArgs> = PrismaPromise<
    Array<
      PickArray<Article_referencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Article_referencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Article_referencesGroupByOutputType[P]>
            : GetScalarType<T[P], Article_referencesGroupByOutputType[P]>
        }
      >
    >


  export type Article_referencesSelect = {
    id?: boolean
    article_name?: boolean
    last_price?: boolean
    suggested_category?: boolean
    updated_at?: boolean
  }


  export type Article_referencesGetPayload<S extends boolean | null | undefined | Article_referencesArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Article_references :
    S extends undefined ? never :
    S extends { include: any } & (Article_referencesArgs | Article_referencesFindManyArgs)
    ? Article_references 
    : S extends { select: any } & (Article_referencesArgs | Article_referencesFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Article_references ? Article_references[P] : never
  } 
      : Article_references


  type Article_referencesCountArgs = Merge<
    Omit<Article_referencesFindManyArgs, 'select' | 'include'> & {
      select?: Article_referencesCountAggregateInputType | true
    }
  >

  export interface Article_referencesDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Article_references that matches the filter.
     * @param {Article_referencesFindUniqueArgs} args - Arguments to find a Article_references
     * @example
     * // Get one Article_references
     * const article_references = await prisma.article_references.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends Article_referencesFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, Article_referencesFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Article_references'> extends True ? Prisma__Article_referencesClient<Article_referencesGetPayload<T>> : Prisma__Article_referencesClient<Article_referencesGetPayload<T> | null, null>

    /**
     * Find one Article_references that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {Article_referencesFindUniqueOrThrowArgs} args - Arguments to find a Article_references
     * @example
     * // Get one Article_references
     * const article_references = await prisma.article_references.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends Article_referencesFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, Article_referencesFindUniqueOrThrowArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Find the first Article_references that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesFindFirstArgs} args - Arguments to find a Article_references
     * @example
     * // Get one Article_references
     * const article_references = await prisma.article_references.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends Article_referencesFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, Article_referencesFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Article_references'> extends True ? Prisma__Article_referencesClient<Article_referencesGetPayload<T>> : Prisma__Article_referencesClient<Article_referencesGetPayload<T> | null, null>

    /**
     * Find the first Article_references that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesFindFirstOrThrowArgs} args - Arguments to find a Article_references
     * @example
     * // Get one Article_references
     * const article_references = await prisma.article_references.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends Article_referencesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, Article_referencesFindFirstOrThrowArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Find zero or more Article_references that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Article_references
     * const article_references = await prisma.article_references.findMany()
     * 
     * // Get first 10 Article_references
     * const article_references = await prisma.article_references.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const article_referencesWithIdOnly = await prisma.article_references.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends Article_referencesFindManyArgs>(
      args?: SelectSubset<T, Article_referencesFindManyArgs>
    ): PrismaPromise<Array<Article_referencesGetPayload<T>>>

    /**
     * Create a Article_references.
     * @param {Article_referencesCreateArgs} args - Arguments to create a Article_references.
     * @example
     * // Create one Article_references
     * const Article_references = await prisma.article_references.create({
     *   data: {
     *     // ... data to create a Article_references
     *   }
     * })
     * 
    **/
    create<T extends Article_referencesCreateArgs>(
      args: SelectSubset<T, Article_referencesCreateArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Create many Article_references.
     *     @param {Article_referencesCreateManyArgs} args - Arguments to create many Article_references.
     *     @example
     *     // Create many Article_references
     *     const article_references = await prisma.article_references.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends Article_referencesCreateManyArgs>(
      args?: SelectSubset<T, Article_referencesCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Article_references.
     * @param {Article_referencesDeleteArgs} args - Arguments to delete one Article_references.
     * @example
     * // Delete one Article_references
     * const Article_references = await prisma.article_references.delete({
     *   where: {
     *     // ... filter to delete one Article_references
     *   }
     * })
     * 
    **/
    delete<T extends Article_referencesDeleteArgs>(
      args: SelectSubset<T, Article_referencesDeleteArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Update one Article_references.
     * @param {Article_referencesUpdateArgs} args - Arguments to update one Article_references.
     * @example
     * // Update one Article_references
     * const article_references = await prisma.article_references.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends Article_referencesUpdateArgs>(
      args: SelectSubset<T, Article_referencesUpdateArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Delete zero or more Article_references.
     * @param {Article_referencesDeleteManyArgs} args - Arguments to filter Article_references to delete.
     * @example
     * // Delete a few Article_references
     * const { count } = await prisma.article_references.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends Article_referencesDeleteManyArgs>(
      args?: SelectSubset<T, Article_referencesDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Article_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Article_references
     * const article_references = await prisma.article_references.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends Article_referencesUpdateManyArgs>(
      args: SelectSubset<T, Article_referencesUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Article_references.
     * @param {Article_referencesUpsertArgs} args - Arguments to update or create a Article_references.
     * @example
     * // Update or create a Article_references
     * const article_references = await prisma.article_references.upsert({
     *   create: {
     *     // ... data to create a Article_references
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article_references we want to update
     *   }
     * })
    **/
    upsert<T extends Article_referencesUpsertArgs>(
      args: SelectSubset<T, Article_referencesUpsertArgs>
    ): Prisma__Article_referencesClient<Article_referencesGetPayload<T>>

    /**
     * Count the number of Article_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesCountArgs} args - Arguments to filter Article_references to count.
     * @example
     * // Count the number of Article_references
     * const count = await prisma.article_references.count({
     *   where: {
     *     // ... the filter for the Article_references we want to count
     *   }
     * })
    **/
    count<T extends Article_referencesCountArgs>(
      args?: Subset<T, Article_referencesCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Article_referencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Article_referencesAggregateArgs>(args: Subset<T, Article_referencesAggregateArgs>): PrismaPromise<GetArticle_referencesAggregateType<T>>

    /**
     * Group by Article_references.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Article_referencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Article_referencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Article_referencesGroupByArgs['orderBy'] }
        : { orderBy?: Article_referencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Article_referencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticle_referencesGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Article_references.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__Article_referencesClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Article_references base type for findUnique actions
   */
  export type Article_referencesFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter, which Article_references to fetch.
     * 
    **/
    where: Article_referencesWhereUniqueInput
  }

  /**
   * Article_references findUnique
   */
  export interface Article_referencesFindUniqueArgs extends Article_referencesFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Article_references findUniqueOrThrow
   */
  export type Article_referencesFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter, which Article_references to fetch.
     * 
    **/
    where: Article_referencesWhereUniqueInput
  }


  /**
   * Article_references base type for findFirst actions
   */
  export type Article_referencesFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter, which Article_references to fetch.
     * 
    **/
    where?: Article_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Article_references to fetch.
     * 
    **/
    orderBy?: Enumerable<Article_referencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Article_references.
     * 
    **/
    cursor?: Article_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Article_references from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Article_references.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Article_references.
     * 
    **/
    distinct?: Enumerable<Article_referencesScalarFieldEnum>
  }

  /**
   * Article_references findFirst
   */
  export interface Article_referencesFindFirstArgs extends Article_referencesFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Article_references findFirstOrThrow
   */
  export type Article_referencesFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter, which Article_references to fetch.
     * 
    **/
    where?: Article_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Article_references to fetch.
     * 
    **/
    orderBy?: Enumerable<Article_referencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Article_references.
     * 
    **/
    cursor?: Article_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Article_references from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Article_references.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Article_references.
     * 
    **/
    distinct?: Enumerable<Article_referencesScalarFieldEnum>
  }


  /**
   * Article_references findMany
   */
  export type Article_referencesFindManyArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter, which Article_references to fetch.
     * 
    **/
    where?: Article_referencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Article_references to fetch.
     * 
    **/
    orderBy?: Enumerable<Article_referencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Article_references.
     * 
    **/
    cursor?: Article_referencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Article_references from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Article_references.
     * 
    **/
    skip?: number
    distinct?: Enumerable<Article_referencesScalarFieldEnum>
  }


  /**
   * Article_references create
   */
  export type Article_referencesCreateArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * The data needed to create a Article_references.
     * 
    **/
    data: XOR<Article_referencesCreateInput, Article_referencesUncheckedCreateInput>
  }


  /**
   * Article_references createMany
   */
  export type Article_referencesCreateManyArgs = {
    /**
     * The data used to create many Article_references.
     * 
    **/
    data: Enumerable<Article_referencesCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Article_references update
   */
  export type Article_referencesUpdateArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * The data needed to update a Article_references.
     * 
    **/
    data: XOR<Article_referencesUpdateInput, Article_referencesUncheckedUpdateInput>
    /**
     * Choose, which Article_references to update.
     * 
    **/
    where: Article_referencesWhereUniqueInput
  }


  /**
   * Article_references updateMany
   */
  export type Article_referencesUpdateManyArgs = {
    /**
     * The data used to update Article_references.
     * 
    **/
    data: XOR<Article_referencesUpdateManyMutationInput, Article_referencesUncheckedUpdateManyInput>
    /**
     * Filter which Article_references to update
     * 
    **/
    where?: Article_referencesWhereInput
  }


  /**
   * Article_references upsert
   */
  export type Article_referencesUpsertArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * The filter to search for the Article_references to update in case it exists.
     * 
    **/
    where: Article_referencesWhereUniqueInput
    /**
     * In case the Article_references found by the `where` argument doesn't exist, create a new Article_references with this data.
     * 
    **/
    create: XOR<Article_referencesCreateInput, Article_referencesUncheckedCreateInput>
    /**
     * In case the Article_references was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<Article_referencesUpdateInput, Article_referencesUncheckedUpdateInput>
  }


  /**
   * Article_references delete
   */
  export type Article_referencesDeleteArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
    /**
     * Filter which Article_references to delete.
     * 
    **/
    where: Article_referencesWhereUniqueInput
  }


  /**
   * Article_references deleteMany
   */
  export type Article_referencesDeleteManyArgs = {
    /**
     * Filter which Article_references to delete
     * 
    **/
    where?: Article_referencesWhereInput
  }


  /**
   * Article_references without action
   */
  export type Article_referencesArgs = {
    /**
     * Select specific fields to fetch from the Article_references
     * 
    **/
    select?: Article_referencesSelect | null
  }



  /**
   * Model List_items
   */


  export type AggregateList_items = {
    _count: List_itemsCountAggregateOutputType | null
    _avg: List_itemsAvgAggregateOutputType | null
    _sum: List_itemsSumAggregateOutputType | null
    _min: List_itemsMinAggregateOutputType | null
    _max: List_itemsMaxAggregateOutputType | null
  }

  export type List_itemsAvgAggregateOutputType = {
    price: number | null
  }

  export type List_itemsSumAggregateOutputType = {
    price: number | null
  }

  export type List_itemsMinAggregateOutputType = {
    id: string | null
    list_id: string | null
    name: string | null
    quantity: string | null
    price: number | null
    assigned_to: string | null
    is_checked: boolean | null
    updated_at: Date | null
  }

  export type List_itemsMaxAggregateOutputType = {
    id: string | null
    list_id: string | null
    name: string | null
    quantity: string | null
    price: number | null
    assigned_to: string | null
    is_checked: boolean | null
    updated_at: Date | null
  }

  export type List_itemsCountAggregateOutputType = {
    id: number
    list_id: number
    name: number
    quantity: number
    price: number
    assigned_to: number
    is_checked: number
    updated_at: number
    _all: number
  }


  export type List_itemsAvgAggregateInputType = {
    price?: true
  }

  export type List_itemsSumAggregateInputType = {
    price?: true
  }

  export type List_itemsMinAggregateInputType = {
    id?: true
    list_id?: true
    name?: true
    quantity?: true
    price?: true
    assigned_to?: true
    is_checked?: true
    updated_at?: true
  }

  export type List_itemsMaxAggregateInputType = {
    id?: true
    list_id?: true
    name?: true
    quantity?: true
    price?: true
    assigned_to?: true
    is_checked?: true
    updated_at?: true
  }

  export type List_itemsCountAggregateInputType = {
    id?: true
    list_id?: true
    name?: true
    quantity?: true
    price?: true
    assigned_to?: true
    is_checked?: true
    updated_at?: true
    _all?: true
  }

  export type List_itemsAggregateArgs = {
    /**
     * Filter which List_items to aggregate.
     * 
    **/
    where?: List_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of List_items to fetch.
     * 
    **/
    orderBy?: Enumerable<List_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: List_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` List_items from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` List_items.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned List_items
    **/
    _count?: true | List_itemsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: List_itemsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: List_itemsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: List_itemsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: List_itemsMaxAggregateInputType
  }

  export type GetList_itemsAggregateType<T extends List_itemsAggregateArgs> = {
        [P in keyof T & keyof AggregateList_items]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateList_items[P]>
      : GetScalarType<T[P], AggregateList_items[P]>
  }




  export type List_itemsGroupByArgs = {
    where?: List_itemsWhereInput
    orderBy?: Enumerable<List_itemsOrderByWithAggregationInput>
    by: Array<List_itemsScalarFieldEnum>
    having?: List_itemsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: List_itemsCountAggregateInputType | true
    _avg?: List_itemsAvgAggregateInputType
    _sum?: List_itemsSumAggregateInputType
    _min?: List_itemsMinAggregateInputType
    _max?: List_itemsMaxAggregateInputType
  }


  export type List_itemsGroupByOutputType = {
    id: string
    list_id: string
    name: string
    quantity: string | null
    price: number | null
    assigned_to: string | null
    is_checked: boolean
    updated_at: Date
    _count: List_itemsCountAggregateOutputType | null
    _avg: List_itemsAvgAggregateOutputType | null
    _sum: List_itemsSumAggregateOutputType | null
    _min: List_itemsMinAggregateOutputType | null
    _max: List_itemsMaxAggregateOutputType | null
  }

  type GetList_itemsGroupByPayload<T extends List_itemsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<List_itemsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof List_itemsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], List_itemsGroupByOutputType[P]>
            : GetScalarType<T[P], List_itemsGroupByOutputType[P]>
        }
      >
    >


  export type List_itemsSelect = {
    id?: boolean
    list_id?: boolean
    name?: boolean
    quantity?: boolean
    price?: boolean
    assigned_to?: boolean
    is_checked?: boolean
    updated_at?: boolean
    lists?: boolean | ListsArgs
  }


  export type List_itemsInclude = {
    lists?: boolean | ListsArgs
  } 

  export type List_itemsGetPayload<S extends boolean | null | undefined | List_itemsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? List_items :
    S extends undefined ? never :
    S extends { include: any } & (List_itemsArgs | List_itemsFindManyArgs)
    ? List_items  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'lists' ? ListsGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (List_itemsArgs | List_itemsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'lists' ? ListsGetPayload<S['select'][P]> :  P extends keyof List_items ? List_items[P] : never
  } 
      : List_items


  type List_itemsCountArgs = Merge<
    Omit<List_itemsFindManyArgs, 'select' | 'include'> & {
      select?: List_itemsCountAggregateInputType | true
    }
  >

  export interface List_itemsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one List_items that matches the filter.
     * @param {List_itemsFindUniqueArgs} args - Arguments to find a List_items
     * @example
     * // Get one List_items
     * const list_items = await prisma.list_items.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends List_itemsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, List_itemsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'List_items'> extends True ? Prisma__List_itemsClient<List_itemsGetPayload<T>> : Prisma__List_itemsClient<List_itemsGetPayload<T> | null, null>

    /**
     * Find one List_items that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {List_itemsFindUniqueOrThrowArgs} args - Arguments to find a List_items
     * @example
     * // Get one List_items
     * const list_items = await prisma.list_items.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends List_itemsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, List_itemsFindUniqueOrThrowArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Find the first List_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsFindFirstArgs} args - Arguments to find a List_items
     * @example
     * // Get one List_items
     * const list_items = await prisma.list_items.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends List_itemsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, List_itemsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'List_items'> extends True ? Prisma__List_itemsClient<List_itemsGetPayload<T>> : Prisma__List_itemsClient<List_itemsGetPayload<T> | null, null>

    /**
     * Find the first List_items that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsFindFirstOrThrowArgs} args - Arguments to find a List_items
     * @example
     * // Get one List_items
     * const list_items = await prisma.list_items.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends List_itemsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, List_itemsFindFirstOrThrowArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Find zero or more List_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all List_items
     * const list_items = await prisma.list_items.findMany()
     * 
     * // Get first 10 List_items
     * const list_items = await prisma.list_items.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const list_itemsWithIdOnly = await prisma.list_items.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends List_itemsFindManyArgs>(
      args?: SelectSubset<T, List_itemsFindManyArgs>
    ): PrismaPromise<Array<List_itemsGetPayload<T>>>

    /**
     * Create a List_items.
     * @param {List_itemsCreateArgs} args - Arguments to create a List_items.
     * @example
     * // Create one List_items
     * const List_items = await prisma.list_items.create({
     *   data: {
     *     // ... data to create a List_items
     *   }
     * })
     * 
    **/
    create<T extends List_itemsCreateArgs>(
      args: SelectSubset<T, List_itemsCreateArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Create many List_items.
     *     @param {List_itemsCreateManyArgs} args - Arguments to create many List_items.
     *     @example
     *     // Create many List_items
     *     const list_items = await prisma.list_items.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends List_itemsCreateManyArgs>(
      args?: SelectSubset<T, List_itemsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a List_items.
     * @param {List_itemsDeleteArgs} args - Arguments to delete one List_items.
     * @example
     * // Delete one List_items
     * const List_items = await prisma.list_items.delete({
     *   where: {
     *     // ... filter to delete one List_items
     *   }
     * })
     * 
    **/
    delete<T extends List_itemsDeleteArgs>(
      args: SelectSubset<T, List_itemsDeleteArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Update one List_items.
     * @param {List_itemsUpdateArgs} args - Arguments to update one List_items.
     * @example
     * // Update one List_items
     * const list_items = await prisma.list_items.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends List_itemsUpdateArgs>(
      args: SelectSubset<T, List_itemsUpdateArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Delete zero or more List_items.
     * @param {List_itemsDeleteManyArgs} args - Arguments to filter List_items to delete.
     * @example
     * // Delete a few List_items
     * const { count } = await prisma.list_items.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends List_itemsDeleteManyArgs>(
      args?: SelectSubset<T, List_itemsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more List_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many List_items
     * const list_items = await prisma.list_items.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends List_itemsUpdateManyArgs>(
      args: SelectSubset<T, List_itemsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one List_items.
     * @param {List_itemsUpsertArgs} args - Arguments to update or create a List_items.
     * @example
     * // Update or create a List_items
     * const list_items = await prisma.list_items.upsert({
     *   create: {
     *     // ... data to create a List_items
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the List_items we want to update
     *   }
     * })
    **/
    upsert<T extends List_itemsUpsertArgs>(
      args: SelectSubset<T, List_itemsUpsertArgs>
    ): Prisma__List_itemsClient<List_itemsGetPayload<T>>

    /**
     * Count the number of List_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsCountArgs} args - Arguments to filter List_items to count.
     * @example
     * // Count the number of List_items
     * const count = await prisma.list_items.count({
     *   where: {
     *     // ... the filter for the List_items we want to count
     *   }
     * })
    **/
    count<T extends List_itemsCountArgs>(
      args?: Subset<T, List_itemsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], List_itemsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a List_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends List_itemsAggregateArgs>(args: Subset<T, List_itemsAggregateArgs>): PrismaPromise<GetList_itemsAggregateType<T>>

    /**
     * Group by List_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {List_itemsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends List_itemsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: List_itemsGroupByArgs['orderBy'] }
        : { orderBy?: List_itemsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, List_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetList_itemsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for List_items.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__List_itemsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    lists<T extends ListsArgs= {}>(args?: Subset<T, ListsArgs>): Prisma__ListsClient<ListsGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * List_items base type for findUnique actions
   */
  export type List_itemsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter, which List_items to fetch.
     * 
    **/
    where: List_itemsWhereUniqueInput
  }

  /**
   * List_items findUnique
   */
  export interface List_itemsFindUniqueArgs extends List_itemsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * List_items findUniqueOrThrow
   */
  export type List_itemsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter, which List_items to fetch.
     * 
    **/
    where: List_itemsWhereUniqueInput
  }


  /**
   * List_items base type for findFirst actions
   */
  export type List_itemsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter, which List_items to fetch.
     * 
    **/
    where?: List_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of List_items to fetch.
     * 
    **/
    orderBy?: Enumerable<List_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for List_items.
     * 
    **/
    cursor?: List_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` List_items from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` List_items.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of List_items.
     * 
    **/
    distinct?: Enumerable<List_itemsScalarFieldEnum>
  }

  /**
   * List_items findFirst
   */
  export interface List_itemsFindFirstArgs extends List_itemsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * List_items findFirstOrThrow
   */
  export type List_itemsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter, which List_items to fetch.
     * 
    **/
    where?: List_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of List_items to fetch.
     * 
    **/
    orderBy?: Enumerable<List_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for List_items.
     * 
    **/
    cursor?: List_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` List_items from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` List_items.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of List_items.
     * 
    **/
    distinct?: Enumerable<List_itemsScalarFieldEnum>
  }


  /**
   * List_items findMany
   */
  export type List_itemsFindManyArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter, which List_items to fetch.
     * 
    **/
    where?: List_itemsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of List_items to fetch.
     * 
    **/
    orderBy?: Enumerable<List_itemsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing List_items.
     * 
    **/
    cursor?: List_itemsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` List_items from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` List_items.
     * 
    **/
    skip?: number
    distinct?: Enumerable<List_itemsScalarFieldEnum>
  }


  /**
   * List_items create
   */
  export type List_itemsCreateArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * The data needed to create a List_items.
     * 
    **/
    data: XOR<List_itemsCreateInput, List_itemsUncheckedCreateInput>
  }


  /**
   * List_items createMany
   */
  export type List_itemsCreateManyArgs = {
    /**
     * The data used to create many List_items.
     * 
    **/
    data: Enumerable<List_itemsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * List_items update
   */
  export type List_itemsUpdateArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * The data needed to update a List_items.
     * 
    **/
    data: XOR<List_itemsUpdateInput, List_itemsUncheckedUpdateInput>
    /**
     * Choose, which List_items to update.
     * 
    **/
    where: List_itemsWhereUniqueInput
  }


  /**
   * List_items updateMany
   */
  export type List_itemsUpdateManyArgs = {
    /**
     * The data used to update List_items.
     * 
    **/
    data: XOR<List_itemsUpdateManyMutationInput, List_itemsUncheckedUpdateManyInput>
    /**
     * Filter which List_items to update
     * 
    **/
    where?: List_itemsWhereInput
  }


  /**
   * List_items upsert
   */
  export type List_itemsUpsertArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * The filter to search for the List_items to update in case it exists.
     * 
    **/
    where: List_itemsWhereUniqueInput
    /**
     * In case the List_items found by the `where` argument doesn't exist, create a new List_items with this data.
     * 
    **/
    create: XOR<List_itemsCreateInput, List_itemsUncheckedCreateInput>
    /**
     * In case the List_items was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<List_itemsUpdateInput, List_itemsUncheckedUpdateInput>
  }


  /**
   * List_items delete
   */
  export type List_itemsDeleteArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    /**
     * Filter which List_items to delete.
     * 
    **/
    where: List_itemsWhereUniqueInput
  }


  /**
   * List_items deleteMany
   */
  export type List_itemsDeleteManyArgs = {
    /**
     * Filter which List_items to delete
     * 
    **/
    where?: List_itemsWhereInput
  }


  /**
   * List_items without action
   */
  export type List_itemsArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
  }



  /**
   * Model Lists
   */


  export type AggregateLists = {
    _count: ListsCountAggregateOutputType | null
    _min: ListsMinAggregateOutputType | null
    _max: ListsMaxAggregateOutputType | null
  }

  export type ListsMinAggregateOutputType = {
    id: string | null
    name: string | null
    created_at: Date | null
  }

  export type ListsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    created_at: Date | null
  }

  export type ListsCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    _all: number
  }


  export type ListsMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type ListsMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type ListsCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    _all?: true
  }

  export type ListsAggregateArgs = {
    /**
     * Filter which Lists to aggregate.
     * 
    **/
    where?: ListsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lists to fetch.
     * 
    **/
    orderBy?: Enumerable<ListsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ListsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lists.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lists
    **/
    _count?: true | ListsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListsMaxAggregateInputType
  }

  export type GetListsAggregateType<T extends ListsAggregateArgs> = {
        [P in keyof T & keyof AggregateLists]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLists[P]>
      : GetScalarType<T[P], AggregateLists[P]>
  }




  export type ListsGroupByArgs = {
    where?: ListsWhereInput
    orderBy?: Enumerable<ListsOrderByWithAggregationInput>
    by: Array<ListsScalarFieldEnum>
    having?: ListsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListsCountAggregateInputType | true
    _min?: ListsMinAggregateInputType
    _max?: ListsMaxAggregateInputType
  }


  export type ListsGroupByOutputType = {
    id: string
    name: string
    created_at: Date
    _count: ListsCountAggregateOutputType | null
    _min: ListsMinAggregateOutputType | null
    _max: ListsMaxAggregateOutputType | null
  }

  type GetListsGroupByPayload<T extends ListsGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ListsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListsGroupByOutputType[P]>
            : GetScalarType<T[P], ListsGroupByOutputType[P]>
        }
      >
    >


  export type ListsSelect = {
    id?: boolean
    name?: boolean
    created_at?: boolean
    list_items?: boolean | Lists$list_itemsArgs
    _count?: boolean | ListsCountOutputTypeArgs
  }


  export type ListsInclude = {
    list_items?: boolean | Lists$list_itemsArgs
    _count?: boolean | ListsCountOutputTypeArgs
  } 

  export type ListsGetPayload<S extends boolean | null | undefined | ListsArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Lists :
    S extends undefined ? never :
    S extends { include: any } & (ListsArgs | ListsFindManyArgs)
    ? Lists  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'list_items' ? Array < List_itemsGetPayload<S['include'][P]>>  :
        P extends '_count' ? ListsCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (ListsArgs | ListsFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'list_items' ? Array < List_itemsGetPayload<S['select'][P]>>  :
        P extends '_count' ? ListsCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Lists ? Lists[P] : never
  } 
      : Lists


  type ListsCountArgs = Merge<
    Omit<ListsFindManyArgs, 'select' | 'include'> & {
      select?: ListsCountAggregateInputType | true
    }
  >

  export interface ListsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Lists that matches the filter.
     * @param {ListsFindUniqueArgs} args - Arguments to find a Lists
     * @example
     * // Get one Lists
     * const lists = await prisma.lists.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ListsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ListsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Lists'> extends True ? Prisma__ListsClient<ListsGetPayload<T>> : Prisma__ListsClient<ListsGetPayload<T> | null, null>

    /**
     * Find one Lists that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ListsFindUniqueOrThrowArgs} args - Arguments to find a Lists
     * @example
     * // Get one Lists
     * const lists = await prisma.lists.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ListsFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ListsFindUniqueOrThrowArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Find the first Lists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsFindFirstArgs} args - Arguments to find a Lists
     * @example
     * // Get one Lists
     * const lists = await prisma.lists.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ListsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ListsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Lists'> extends True ? Prisma__ListsClient<ListsGetPayload<T>> : Prisma__ListsClient<ListsGetPayload<T> | null, null>

    /**
     * Find the first Lists that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsFindFirstOrThrowArgs} args - Arguments to find a Lists
     * @example
     * // Get one Lists
     * const lists = await prisma.lists.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ListsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ListsFindFirstOrThrowArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Find zero or more Lists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lists
     * const lists = await prisma.lists.findMany()
     * 
     * // Get first 10 Lists
     * const lists = await prisma.lists.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listsWithIdOnly = await prisma.lists.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ListsFindManyArgs>(
      args?: SelectSubset<T, ListsFindManyArgs>
    ): PrismaPromise<Array<ListsGetPayload<T>>>

    /**
     * Create a Lists.
     * @param {ListsCreateArgs} args - Arguments to create a Lists.
     * @example
     * // Create one Lists
     * const Lists = await prisma.lists.create({
     *   data: {
     *     // ... data to create a Lists
     *   }
     * })
     * 
    **/
    create<T extends ListsCreateArgs>(
      args: SelectSubset<T, ListsCreateArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Create many Lists.
     *     @param {ListsCreateManyArgs} args - Arguments to create many Lists.
     *     @example
     *     // Create many Lists
     *     const lists = await prisma.lists.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ListsCreateManyArgs>(
      args?: SelectSubset<T, ListsCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Lists.
     * @param {ListsDeleteArgs} args - Arguments to delete one Lists.
     * @example
     * // Delete one Lists
     * const Lists = await prisma.lists.delete({
     *   where: {
     *     // ... filter to delete one Lists
     *   }
     * })
     * 
    **/
    delete<T extends ListsDeleteArgs>(
      args: SelectSubset<T, ListsDeleteArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Update one Lists.
     * @param {ListsUpdateArgs} args - Arguments to update one Lists.
     * @example
     * // Update one Lists
     * const lists = await prisma.lists.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ListsUpdateArgs>(
      args: SelectSubset<T, ListsUpdateArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Delete zero or more Lists.
     * @param {ListsDeleteManyArgs} args - Arguments to filter Lists to delete.
     * @example
     * // Delete a few Lists
     * const { count } = await prisma.lists.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ListsDeleteManyArgs>(
      args?: SelectSubset<T, ListsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lists
     * const lists = await prisma.lists.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ListsUpdateManyArgs>(
      args: SelectSubset<T, ListsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Lists.
     * @param {ListsUpsertArgs} args - Arguments to update or create a Lists.
     * @example
     * // Update or create a Lists
     * const lists = await prisma.lists.upsert({
     *   create: {
     *     // ... data to create a Lists
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lists we want to update
     *   }
     * })
    **/
    upsert<T extends ListsUpsertArgs>(
      args: SelectSubset<T, ListsUpsertArgs>
    ): Prisma__ListsClient<ListsGetPayload<T>>

    /**
     * Count the number of Lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsCountArgs} args - Arguments to filter Lists to count.
     * @example
     * // Count the number of Lists
     * const count = await prisma.lists.count({
     *   where: {
     *     // ... the filter for the Lists we want to count
     *   }
     * })
    **/
    count<T extends ListsCountArgs>(
      args?: Subset<T, ListsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListsAggregateArgs>(args: Subset<T, ListsAggregateArgs>): PrismaPromise<GetListsAggregateType<T>>

    /**
     * Group by Lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListsGroupByArgs['orderBy'] }
        : { orderBy?: ListsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListsGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Lists.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ListsClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    list_items<T extends Lists$list_itemsArgs= {}>(args?: Subset<T, Lists$list_itemsArgs>): PrismaPromise<Array<List_itemsGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Lists base type for findUnique actions
   */
  export type ListsFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter, which Lists to fetch.
     * 
    **/
    where: ListsWhereUniqueInput
  }

  /**
   * Lists findUnique
   */
  export interface ListsFindUniqueArgs extends ListsFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lists findUniqueOrThrow
   */
  export type ListsFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter, which Lists to fetch.
     * 
    **/
    where: ListsWhereUniqueInput
  }


  /**
   * Lists base type for findFirst actions
   */
  export type ListsFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter, which Lists to fetch.
     * 
    **/
    where?: ListsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lists to fetch.
     * 
    **/
    orderBy?: Enumerable<ListsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lists.
     * 
    **/
    cursor?: ListsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lists.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lists.
     * 
    **/
    distinct?: Enumerable<ListsScalarFieldEnum>
  }

  /**
   * Lists findFirst
   */
  export interface ListsFindFirstArgs extends ListsFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lists findFirstOrThrow
   */
  export type ListsFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter, which Lists to fetch.
     * 
    **/
    where?: ListsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lists to fetch.
     * 
    **/
    orderBy?: Enumerable<ListsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lists.
     * 
    **/
    cursor?: ListsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lists.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lists.
     * 
    **/
    distinct?: Enumerable<ListsScalarFieldEnum>
  }


  /**
   * Lists findMany
   */
  export type ListsFindManyArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter, which Lists to fetch.
     * 
    **/
    where?: ListsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lists to fetch.
     * 
    **/
    orderBy?: Enumerable<ListsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lists.
     * 
    **/
    cursor?: ListsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lists from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lists.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ListsScalarFieldEnum>
  }


  /**
   * Lists create
   */
  export type ListsCreateArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * The data needed to create a Lists.
     * 
    **/
    data: XOR<ListsCreateInput, ListsUncheckedCreateInput>
  }


  /**
   * Lists createMany
   */
  export type ListsCreateManyArgs = {
    /**
     * The data used to create many Lists.
     * 
    **/
    data: Enumerable<ListsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Lists update
   */
  export type ListsUpdateArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * The data needed to update a Lists.
     * 
    **/
    data: XOR<ListsUpdateInput, ListsUncheckedUpdateInput>
    /**
     * Choose, which Lists to update.
     * 
    **/
    where: ListsWhereUniqueInput
  }


  /**
   * Lists updateMany
   */
  export type ListsUpdateManyArgs = {
    /**
     * The data used to update Lists.
     * 
    **/
    data: XOR<ListsUpdateManyMutationInput, ListsUncheckedUpdateManyInput>
    /**
     * Filter which Lists to update
     * 
    **/
    where?: ListsWhereInput
  }


  /**
   * Lists upsert
   */
  export type ListsUpsertArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * The filter to search for the Lists to update in case it exists.
     * 
    **/
    where: ListsWhereUniqueInput
    /**
     * In case the Lists found by the `where` argument doesn't exist, create a new Lists with this data.
     * 
    **/
    create: XOR<ListsCreateInput, ListsUncheckedCreateInput>
    /**
     * In case the Lists was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ListsUpdateInput, ListsUncheckedUpdateInput>
  }


  /**
   * Lists delete
   */
  export type ListsDeleteArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
    /**
     * Filter which Lists to delete.
     * 
    **/
    where: ListsWhereUniqueInput
  }


  /**
   * Lists deleteMany
   */
  export type ListsDeleteManyArgs = {
    /**
     * Filter which Lists to delete
     * 
    **/
    where?: ListsWhereInput
  }


  /**
   * Lists.list_items
   */
  export type Lists$list_itemsArgs = {
    /**
     * Select specific fields to fetch from the List_items
     * 
    **/
    select?: List_itemsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: List_itemsInclude | null
    where?: List_itemsWhereInput
    orderBy?: Enumerable<List_itemsOrderByWithRelationInput>
    cursor?: List_itemsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<List_itemsScalarFieldEnum>
  }


  /**
   * Lists without action
   */
  export type ListsArgs = {
    /**
     * Select specific fields to fetch from the Lists
     * 
    **/
    select?: ListsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ListsInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const Admin_usersScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    created_at: 'created_at'
  };

  export type Admin_usersScalarFieldEnum = (typeof Admin_usersScalarFieldEnum)[keyof typeof Admin_usersScalarFieldEnum]


  export const Article_referencesScalarFieldEnum: {
    id: 'id',
    article_name: 'article_name',
    last_price: 'last_price',
    suggested_category: 'suggested_category',
    updated_at: 'updated_at'
  };

  export type Article_referencesScalarFieldEnum = (typeof Article_referencesScalarFieldEnum)[keyof typeof Article_referencesScalarFieldEnum]


  export const List_itemsScalarFieldEnum: {
    id: 'id',
    list_id: 'list_id',
    name: 'name',
    quantity: 'quantity',
    price: 'price',
    assigned_to: 'assigned_to',
    is_checked: 'is_checked',
    updated_at: 'updated_at'
  };

  export type List_itemsScalarFieldEnum = (typeof List_itemsScalarFieldEnum)[keyof typeof List_itemsScalarFieldEnum]


  export const ListsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at'
  };

  export type ListsScalarFieldEnum = (typeof ListsScalarFieldEnum)[keyof typeof ListsScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type Admin_usersWhereInput = {
    AND?: Enumerable<Admin_usersWhereInput>
    OR?: Enumerable<Admin_usersWhereInput>
    NOT?: Enumerable<Admin_usersWhereInput>
    id?: UuidFilter | string
    username?: StringFilter | string
    password_hash?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
  }

  export type Admin_usersOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type Admin_usersWhereUniqueInput = {
    id?: string
  }

  export type Admin_usersOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    _count?: Admin_usersCountOrderByAggregateInput
    _max?: Admin_usersMaxOrderByAggregateInput
    _min?: Admin_usersMinOrderByAggregateInput
  }

  export type Admin_usersScalarWhereWithAggregatesInput = {
    AND?: Enumerable<Admin_usersScalarWhereWithAggregatesInput>
    OR?: Enumerable<Admin_usersScalarWhereWithAggregatesInput>
    NOT?: Enumerable<Admin_usersScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    username?: StringWithAggregatesFilter | string
    password_hash?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type Article_referencesWhereInput = {
    AND?: Enumerable<Article_referencesWhereInput>
    OR?: Enumerable<Article_referencesWhereInput>
    NOT?: Enumerable<Article_referencesWhereInput>
    id?: UuidFilter | string
    article_name?: StringFilter | string
    last_price?: FloatNullableFilter | number | null
    suggested_category?: StringNullableFilter | string | null
    updated_at?: DateTimeFilter | Date | string
  }

  export type Article_referencesOrderByWithRelationInput = {
    id?: SortOrder
    article_name?: SortOrder
    last_price?: SortOrder
    suggested_category?: SortOrder
    updated_at?: SortOrder
  }

  export type Article_referencesWhereUniqueInput = {
    id?: string
  }

  export type Article_referencesOrderByWithAggregationInput = {
    id?: SortOrder
    article_name?: SortOrder
    last_price?: SortOrder
    suggested_category?: SortOrder
    updated_at?: SortOrder
    _count?: Article_referencesCountOrderByAggregateInput
    _avg?: Article_referencesAvgOrderByAggregateInput
    _max?: Article_referencesMaxOrderByAggregateInput
    _min?: Article_referencesMinOrderByAggregateInput
    _sum?: Article_referencesSumOrderByAggregateInput
  }

  export type Article_referencesScalarWhereWithAggregatesInput = {
    AND?: Enumerable<Article_referencesScalarWhereWithAggregatesInput>
    OR?: Enumerable<Article_referencesScalarWhereWithAggregatesInput>
    NOT?: Enumerable<Article_referencesScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    article_name?: StringWithAggregatesFilter | string
    last_price?: FloatNullableWithAggregatesFilter | number | null
    suggested_category?: StringNullableWithAggregatesFilter | string | null
    updated_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type List_itemsWhereInput = {
    AND?: Enumerable<List_itemsWhereInput>
    OR?: Enumerable<List_itemsWhereInput>
    NOT?: Enumerable<List_itemsWhereInput>
    id?: UuidFilter | string
    list_id?: UuidFilter | string
    name?: StringFilter | string
    quantity?: StringNullableFilter | string | null
    price?: FloatNullableFilter | number | null
    assigned_to?: StringNullableFilter | string | null
    is_checked?: BoolFilter | boolean
    updated_at?: DateTimeFilter | Date | string
    lists?: XOR<ListsRelationFilter, ListsWhereInput>
  }

  export type List_itemsOrderByWithRelationInput = {
    id?: SortOrder
    list_id?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    assigned_to?: SortOrder
    is_checked?: SortOrder
    updated_at?: SortOrder
    lists?: ListsOrderByWithRelationInput
  }

  export type List_itemsWhereUniqueInput = {
    id?: string
  }

  export type List_itemsOrderByWithAggregationInput = {
    id?: SortOrder
    list_id?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    assigned_to?: SortOrder
    is_checked?: SortOrder
    updated_at?: SortOrder
    _count?: List_itemsCountOrderByAggregateInput
    _avg?: List_itemsAvgOrderByAggregateInput
    _max?: List_itemsMaxOrderByAggregateInput
    _min?: List_itemsMinOrderByAggregateInput
    _sum?: List_itemsSumOrderByAggregateInput
  }

  export type List_itemsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<List_itemsScalarWhereWithAggregatesInput>
    OR?: Enumerable<List_itemsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<List_itemsScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    list_id?: UuidWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    quantity?: StringNullableWithAggregatesFilter | string | null
    price?: FloatNullableWithAggregatesFilter | number | null
    assigned_to?: StringNullableWithAggregatesFilter | string | null
    is_checked?: BoolWithAggregatesFilter | boolean
    updated_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ListsWhereInput = {
    AND?: Enumerable<ListsWhereInput>
    OR?: Enumerable<ListsWhereInput>
    NOT?: Enumerable<ListsWhereInput>
    id?: UuidFilter | string
    name?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    list_items?: List_itemsListRelationFilter
  }

  export type ListsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    list_items?: List_itemsOrderByRelationAggregateInput
  }

  export type ListsWhereUniqueInput = {
    id?: string
  }

  export type ListsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    _count?: ListsCountOrderByAggregateInput
    _max?: ListsMaxOrderByAggregateInput
    _min?: ListsMinOrderByAggregateInput
  }

  export type ListsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ListsScalarWhereWithAggregatesInput>
    OR?: Enumerable<ListsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ListsScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type Admin_usersCreateInput = {
    id: string
    username: string
    password_hash: string
    created_at: Date | string
  }

  export type Admin_usersUncheckedCreateInput = {
    id: string
    username: string
    password_hash: string
    created_at: Date | string
  }

  export type Admin_usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Admin_usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Admin_usersCreateManyInput = {
    id: string
    username: string
    password_hash: string
    created_at: Date | string
  }

  export type Admin_usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Admin_usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Article_referencesCreateInput = {
    id: string
    article_name: string
    last_price?: number | null
    suggested_category?: string | null
    updated_at: Date | string
  }

  export type Article_referencesUncheckedCreateInput = {
    id: string
    article_name: string
    last_price?: number | null
    suggested_category?: string | null
    updated_at: Date | string
  }

  export type Article_referencesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_name?: StringFieldUpdateOperationsInput | string
    last_price?: NullableFloatFieldUpdateOperationsInput | number | null
    suggested_category?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Article_referencesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_name?: StringFieldUpdateOperationsInput | string
    last_price?: NullableFloatFieldUpdateOperationsInput | number | null
    suggested_category?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Article_referencesCreateManyInput = {
    id: string
    article_name: string
    last_price?: number | null
    suggested_category?: string | null
    updated_at: Date | string
  }

  export type Article_referencesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_name?: StringFieldUpdateOperationsInput | string
    last_price?: NullableFloatFieldUpdateOperationsInput | number | null
    suggested_category?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Article_referencesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_name?: StringFieldUpdateOperationsInput | string
    last_price?: NullableFloatFieldUpdateOperationsInput | number | null
    suggested_category?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsCreateInput = {
    id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
    lists: ListsCreateNestedOneWithoutList_itemsInput
  }

  export type List_itemsUncheckedCreateInput = {
    id: string
    list_id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
  }

  export type List_itemsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    lists?: ListsUpdateOneRequiredWithoutList_itemsNestedInput
  }

  export type List_itemsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    list_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsCreateManyInput = {
    id: string
    list_id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
  }

  export type List_itemsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    list_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListsCreateInput = {
    id: string
    name: string
    created_at: Date | string
    list_items?: List_itemsCreateNestedManyWithoutListsInput
  }

  export type ListsUncheckedCreateInput = {
    id: string
    name: string
    created_at: Date | string
    list_items?: List_itemsUncheckedCreateNestedManyWithoutListsInput
  }

  export type ListsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    list_items?: List_itemsUpdateManyWithoutListsNestedInput
  }

  export type ListsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    list_items?: List_itemsUncheckedUpdateManyWithoutListsNestedInput
  }

  export type ListsCreateManyInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type ListsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidFilter | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type Admin_usersCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type Admin_usersMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type Admin_usersMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type UuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type FloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type Article_referencesCountOrderByAggregateInput = {
    id?: SortOrder
    article_name?: SortOrder
    last_price?: SortOrder
    suggested_category?: SortOrder
    updated_at?: SortOrder
  }

  export type Article_referencesAvgOrderByAggregateInput = {
    last_price?: SortOrder
  }

  export type Article_referencesMaxOrderByAggregateInput = {
    id?: SortOrder
    article_name?: SortOrder
    last_price?: SortOrder
    suggested_category?: SortOrder
    updated_at?: SortOrder
  }

  export type Article_referencesMinOrderByAggregateInput = {
    id?: SortOrder
    article_name?: SortOrder
    last_price?: SortOrder
    suggested_category?: SortOrder
    updated_at?: SortOrder
  }

  export type Article_referencesSumOrderByAggregateInput = {
    last_price?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedFloatNullableFilter
    _min?: NestedFloatNullableFilter
    _max?: NestedFloatNullableFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type ListsRelationFilter = {
    is?: ListsWhereInput
    isNot?: ListsWhereInput
  }

  export type List_itemsCountOrderByAggregateInput = {
    id?: SortOrder
    list_id?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    assigned_to?: SortOrder
    is_checked?: SortOrder
    updated_at?: SortOrder
  }

  export type List_itemsAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type List_itemsMaxOrderByAggregateInput = {
    id?: SortOrder
    list_id?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    assigned_to?: SortOrder
    is_checked?: SortOrder
    updated_at?: SortOrder
  }

  export type List_itemsMinOrderByAggregateInput = {
    id?: SortOrder
    list_id?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    assigned_to?: SortOrder
    is_checked?: SortOrder
    updated_at?: SortOrder
  }

  export type List_itemsSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type List_itemsListRelationFilter = {
    every?: List_itemsWhereInput
    some?: List_itemsWhereInput
    none?: List_itemsWhereInput
  }

  export type List_itemsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ListsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type ListsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type ListsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ListsCreateNestedOneWithoutList_itemsInput = {
    create?: XOR<ListsCreateWithoutList_itemsInput, ListsUncheckedCreateWithoutList_itemsInput>
    connectOrCreate?: ListsCreateOrConnectWithoutList_itemsInput
    connect?: ListsWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ListsUpdateOneRequiredWithoutList_itemsNestedInput = {
    create?: XOR<ListsCreateWithoutList_itemsInput, ListsUncheckedCreateWithoutList_itemsInput>
    connectOrCreate?: ListsCreateOrConnectWithoutList_itemsInput
    upsert?: ListsUpsertWithoutList_itemsInput
    connect?: ListsWhereUniqueInput
    update?: XOR<ListsUpdateWithoutList_itemsInput, ListsUncheckedUpdateWithoutList_itemsInput>
  }

  export type List_itemsCreateNestedManyWithoutListsInput = {
    create?: XOR<Enumerable<List_itemsCreateWithoutListsInput>, Enumerable<List_itemsUncheckedCreateWithoutListsInput>>
    connectOrCreate?: Enumerable<List_itemsCreateOrConnectWithoutListsInput>
    createMany?: List_itemsCreateManyListsInputEnvelope
    connect?: Enumerable<List_itemsWhereUniqueInput>
  }

  export type List_itemsUncheckedCreateNestedManyWithoutListsInput = {
    create?: XOR<Enumerable<List_itemsCreateWithoutListsInput>, Enumerable<List_itemsUncheckedCreateWithoutListsInput>>
    connectOrCreate?: Enumerable<List_itemsCreateOrConnectWithoutListsInput>
    createMany?: List_itemsCreateManyListsInputEnvelope
    connect?: Enumerable<List_itemsWhereUniqueInput>
  }

  export type List_itemsUpdateManyWithoutListsNestedInput = {
    create?: XOR<Enumerable<List_itemsCreateWithoutListsInput>, Enumerable<List_itemsUncheckedCreateWithoutListsInput>>
    connectOrCreate?: Enumerable<List_itemsCreateOrConnectWithoutListsInput>
    upsert?: Enumerable<List_itemsUpsertWithWhereUniqueWithoutListsInput>
    createMany?: List_itemsCreateManyListsInputEnvelope
    set?: Enumerable<List_itemsWhereUniqueInput>
    disconnect?: Enumerable<List_itemsWhereUniqueInput>
    delete?: Enumerable<List_itemsWhereUniqueInput>
    connect?: Enumerable<List_itemsWhereUniqueInput>
    update?: Enumerable<List_itemsUpdateWithWhereUniqueWithoutListsInput>
    updateMany?: Enumerable<List_itemsUpdateManyWithWhereWithoutListsInput>
    deleteMany?: Enumerable<List_itemsScalarWhereInput>
  }

  export type List_itemsUncheckedUpdateManyWithoutListsNestedInput = {
    create?: XOR<Enumerable<List_itemsCreateWithoutListsInput>, Enumerable<List_itemsUncheckedCreateWithoutListsInput>>
    connectOrCreate?: Enumerable<List_itemsCreateOrConnectWithoutListsInput>
    upsert?: Enumerable<List_itemsUpsertWithWhereUniqueWithoutListsInput>
    createMany?: List_itemsCreateManyListsInputEnvelope
    set?: Enumerable<List_itemsWhereUniqueInput>
    disconnect?: Enumerable<List_itemsWhereUniqueInput>
    delete?: Enumerable<List_itemsWhereUniqueInput>
    connect?: Enumerable<List_itemsWhereUniqueInput>
    update?: Enumerable<List_itemsUpdateWithWhereUniqueWithoutListsInput>
    updateMany?: Enumerable<List_itemsUpdateManyWithWhereWithoutListsInput>
    deleteMany?: Enumerable<List_itemsScalarWhereInput>
  }

  export type NestedUuidFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidFilter | string
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedUuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedFloatNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedFloatNullableFilter
    _min?: NestedFloatNullableFilter
    _max?: NestedFloatNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type ListsCreateWithoutList_itemsInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type ListsUncheckedCreateWithoutList_itemsInput = {
    id: string
    name: string
    created_at: Date | string
  }

  export type ListsCreateOrConnectWithoutList_itemsInput = {
    where: ListsWhereUniqueInput
    create: XOR<ListsCreateWithoutList_itemsInput, ListsUncheckedCreateWithoutList_itemsInput>
  }

  export type ListsUpsertWithoutList_itemsInput = {
    update: XOR<ListsUpdateWithoutList_itemsInput, ListsUncheckedUpdateWithoutList_itemsInput>
    create: XOR<ListsCreateWithoutList_itemsInput, ListsUncheckedCreateWithoutList_itemsInput>
  }

  export type ListsUpdateWithoutList_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListsUncheckedUpdateWithoutList_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsCreateWithoutListsInput = {
    id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
  }

  export type List_itemsUncheckedCreateWithoutListsInput = {
    id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
  }

  export type List_itemsCreateOrConnectWithoutListsInput = {
    where: List_itemsWhereUniqueInput
    create: XOR<List_itemsCreateWithoutListsInput, List_itemsUncheckedCreateWithoutListsInput>
  }

  export type List_itemsCreateManyListsInputEnvelope = {
    data: Enumerable<List_itemsCreateManyListsInput>
    skipDuplicates?: boolean
  }

  export type List_itemsUpsertWithWhereUniqueWithoutListsInput = {
    where: List_itemsWhereUniqueInput
    update: XOR<List_itemsUpdateWithoutListsInput, List_itemsUncheckedUpdateWithoutListsInput>
    create: XOR<List_itemsCreateWithoutListsInput, List_itemsUncheckedCreateWithoutListsInput>
  }

  export type List_itemsUpdateWithWhereUniqueWithoutListsInput = {
    where: List_itemsWhereUniqueInput
    data: XOR<List_itemsUpdateWithoutListsInput, List_itemsUncheckedUpdateWithoutListsInput>
  }

  export type List_itemsUpdateManyWithWhereWithoutListsInput = {
    where: List_itemsScalarWhereInput
    data: XOR<List_itemsUpdateManyMutationInput, List_itemsUncheckedUpdateManyWithoutList_itemsInput>
  }

  export type List_itemsScalarWhereInput = {
    AND?: Enumerable<List_itemsScalarWhereInput>
    OR?: Enumerable<List_itemsScalarWhereInput>
    NOT?: Enumerable<List_itemsScalarWhereInput>
    id?: UuidFilter | string
    list_id?: UuidFilter | string
    name?: StringFilter | string
    quantity?: StringNullableFilter | string | null
    price?: FloatNullableFilter | number | null
    assigned_to?: StringNullableFilter | string | null
    is_checked?: BoolFilter | boolean
    updated_at?: DateTimeFilter | Date | string
  }

  export type List_itemsCreateManyListsInput = {
    id: string
    name: string
    quantity?: string | null
    price?: number | null
    assigned_to?: string | null
    is_checked: boolean
    updated_at: Date | string
  }

  export type List_itemsUpdateWithoutListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsUncheckedUpdateWithoutListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type List_itemsUncheckedUpdateManyWithoutList_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    is_checked?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}

type Buffer = Omit<Uint8Array, 'set'>
