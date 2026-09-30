declare module "better-sqlite3" {
  interface Statement {
    get(...args: unknown[]): unknown;
    all(...args: unknown[]): unknown[];
    run(...args: unknown[]): unknown;
  }
  interface Database {
    pragma(source: string): unknown;
    exec(source: string): void;
    prepare(source: string): Statement;
    transaction<T>(fn: () => T): () => T;
    close(): void;
  }
  interface DatabaseConstructor {
    new (filename: string): Database;
  }
  const Database: DatabaseConstructor;
  export default Database;
}
