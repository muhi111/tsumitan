// 相互依存関係があるレイアウト値のみを一元管理
// これらの値は複数のコンポーネント間で整合性を保つ必要があります
export const LAYOUT_CONSTANTS = {
  // サイドバー幅（Footer の w-64 (256px) と Layout の grid-cols で共用）
  SIDEBAR_WIDTH: 256,

  // ヘッダー高さ（Header と Layout の高さ計算で共用）
  HEADER_HEIGHT: 80,

  // モバイルフッター高さ（py-2 + icon + text + safe-area を考慮）
  MOBILE_FOOTER_HEIGHT: 80,

  // z-index 階層（コンポーネント間の重なり順序の整合性を保つ）
  Z_INDEX: {
    HEADER: 50, // ヘッダーのz-index
    SIDEBAR: 50 // サイドバーのz-index（ヘッダーと同階層）
  }
} as const;
