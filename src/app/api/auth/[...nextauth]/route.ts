/**
 * Auth.js のルートハンドラ（/api/auth/* を処理）。
 * 既存の /api/auth/login・/api/auth/logout（admin 用の静的ルート）は
 * より具体的なパスとして優先され、そちら以外の /api/auth/* をここが受ける。
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
