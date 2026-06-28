// 会員プロフィール（クライアント／サーバー共通の型・判定）。server-only ではない。

export type ProfileStatus =
  | "highschool"
  | "university"
  | "working"
  | "other"
  | "";

export type MemberProfile = {
  fullName: string;
  furigana?: string;
  /** 区分：高校生 / 大学生 / 社会人 / その他 */
  status: ProfileStatus;
  /** 所属（高校名・大学名・勤務先など）。「その他」以外は必須扱い。 */
  affiliation?: string;
  /** 学部・学科（大学生） */
  department?: string;
  /** 学年（高校生・大学生） */
  grade?: string;
  /** 職種（社会人） */
  jobTitle?: string;
  /** その他の補足（区分=その他） */
  note?: string;
  /** 年齢（任意） */
  age?: string;
  /** 性別（任意） */
  gender?: string;
  /** 電話番号（任意） */
  phone?: string;
};

export const STATUS_KEYS: Exclude<ProfileStatus, "">[] = [
  "highschool",
  "university",
  "working",
  "other",
];

/** 登録情報が「入力済み」とみなせるか。 */
export function profileComplete(
  p:
    | Pick<MemberProfile, "fullName" | "status" | "affiliation">
    | null
    | undefined,
): boolean {
  if (!p) return false;
  if (!p.fullName || !p.status) return false;
  if (p.status !== "other" && !p.affiliation) return false;
  return true;
}
