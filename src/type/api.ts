export type ApiResponse = {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  status: number;
};

declare module "express" {
  interface Request {
    userId?: number;
  }
}
