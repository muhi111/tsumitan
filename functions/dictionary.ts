// 許可するドメインリスト（本番環境用）
const ALLOWED_ORIGINS = ['https://tsumitan.muhi111.com'];

interface CloudflareContext {
  request: Request;
  env?: Record<string, string>;
}

function checkCorsPermission(context: CloudflareContext): Response | null {
  const request = context.request;
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');

  // 開発環境では全ての制限をバイパス
  const isDevelopment = context.env?.NODE_ENV === 'development';
  if (isDevelopment) {
    console.log('Development mode: Bypassing CORS checks');
    return null;
  }

  // 通常のリクエストの検証
  const isAllowed =
    (origin && ALLOWED_ORIGINS.includes(origin)) ||
    (referer &&
      ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed))) ||
    // 直接ナビゲーション（ブラウザのアドレスバーからのアクセス）を許可
    (request.headers.get('sec-fetch-site') === 'none' &&
      request.headers.get('host') === 'tsumitan.muhi111.com');

  if (!isAllowed) {
    console.log('Blocked request from:', {
      origin,
      referer,
      isDevelopment,
      host: request.headers.get('host'),
      secFetchSite: request.headers.get('sec-fetch-site')
    });
    return new Response('Forbidden: Invalid origin', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return null;
}

export async function onRequestGet(context: CloudflareContext) {
  // CORS制限チェック
  const corsError = checkCorsPermission(context);
  if (corsError) {
    return corsError;
  }

  const url = new URL(context.request.url);
  const word = url.searchParams.get('word');

  if (!word) {
    return new Response('Word parameter is required', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    // 辞書APIへのリクエスト
    const response = await fetch(
      `https://api.excelapi.org/dictionary/enja?word=${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      throw new Error(`Dictionary API error: ${response.status}`);
    }

    const meanings = await response.text();
    const origin = context.request.headers.get('Origin');

    return new Response(meanings, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    console.error('Dictionary lookup error:', error);
    return new Response('Dictionary lookup failed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}
