// 相互依存関係があるレイアウト値のみを一元管理
// これらの値は複数のコンポーネント間で整合性を保つ必要があります
export const LAYOUT_CONSTANTS = {
  // サイドバー幅（Footer の w-64 (256px) と Layout の grid-cols で共用）
  SIDEBAR_WIDTH: 256,

  // ヘッダー高さ（Header と Layout の高さ計算で共用）
  // py-4 (32px) + icon height: モバイル64px/デスクトップ80px
  HEADER_HEIGHT: 96, // モバイル基準: 32px + 64px
  HEADER_HEIGHT_DESKTOP: 112, // デスクトップ: 32px + 80px

  // モバイルフッター高さ（正確な計算値）
  // nav py-3 (24px) + link py-2 (16px) + icon text-xl (24px) + text (10.4px) + gap-1 (4px) = 78.4px
  MOBILE_FOOTER_HEIGHT: 78, // Safe area除外
  MOBILE_FOOTER_HEIGHT_WITH_SAFE_AREA: 112, // Safe area (34px) 含む

  // z-index 階層（コンポーネント間の重なり順序の整合性を保つ）
  Z_INDEX: {
    HEADER: 50, // ヘッダーのz-index
    SIDEBAR: 50, // サイドバーのz-index（ヘッダーと同階層）
    FOOTER: 50 // フッターのz-index
  }
} as const;
