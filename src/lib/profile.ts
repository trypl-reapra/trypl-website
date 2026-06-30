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
  /** その他の補足（区分=その他） */
  note?: string;
  /** 生年月日（YYYY-MM-DD） */
  birthday?: string;
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

/** 登録情報が「入力済み」とみなせるか（性別・電話以外は必須）。 */
export function profileComplete(
  p: Partial<Record<keyof MemberProfile, string>> | null | undefined,
): boolean {
  if (!p) return false;
  if (!p.fullName || !p.furigana || !p.status || !p.birthday) return false;
  switch (p.status) {
    case "highschool":
      return !!p.affiliation && !!p.grade;
    case "university":
      return !!p.affiliation && !!p.department && !!p.grade;
    case "working":
      return !!p.affiliation;
    case "other":
      return !!p.note;
    default:
      return false;
  }
}
