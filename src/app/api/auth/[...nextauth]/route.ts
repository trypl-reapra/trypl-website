/**
 * Auth.js のルートハンドラ（/api/auth/* を処理）。
 * 会員・管理者ともに Google（/ Apple）OAuth で認証する。
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
