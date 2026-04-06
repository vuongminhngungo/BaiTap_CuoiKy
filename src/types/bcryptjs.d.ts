declare module "bcryptjs" {
  export function compare(plain: string, hashed: string): Promise<boolean>;
  export function hash(
    data: string,
    saltOrRounds: string | number,
  ): Promise<string>;
}
