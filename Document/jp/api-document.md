---
# ドキュメント情報
プロジェクト: PintHop
ファイル名: api-document.md
ファイルパス: Document/jp/api-document.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成
- 2025-05-04 ratings構造の更新（スコアとURLを含むオブジェクト型へ変更）

# 説明
PintHopアプリケーションのAPIインターフェース仕様を定義するドキュメント。各エンドポイント、リクエスト/レスポンス形式、認証方法、およびWebSocketイベントを詳細に説明します。
---

# PintHop API仕様書

## 1. 概要

本文書はPintHopアプリケーションのAPIインターフェース仕様を定義するものです。PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

### 1.1 ベースURL

- 開発環境: `http://localhost:5000/api`
- 本番環境: `https://api.pinthop.com/api`

### 1.2 APIバージョニング

APIのバージョンはURLパスに含めます。

```
https://api.pinthop.com/api/v1/resource
```

現在の最新バージョン: `v1`

### 1.3 認証

APIの認証はJWT (JSON Web Token) を使用します。

- トークン取得後、リクエストヘッダーの `Authorization` に `Bearer <token>` 形式でトークンを含めてください。
- アクセストークンの有効期限は15分です。
- リフレッシュトークンの有効期限は7日間です。

### 1.4 レスポンス形式

すべてのAPIレスポンスはJSON形式で返されます。

成功時のレスポンス例:
```json
{
  "success": true,
  "data": { ... }
}
```

エラー時のレスポンス例:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

### 1.5 ステータスコード

- `200 OK`: リクエスト成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: 不正なリクエスト
- `401 Unauthorized`: 未認証
- `403 Forbidden`: アクセス権限なし
- `404 Not Found`: リソースが見つからない
- `429 Too Many Requests`: リクエスト制限超過
- `500 Internal Server Error`: サーバーエラー

### 1.6 クエリパラメータ

共通のクエリパラメータ:

- `limit`: 返却するアイテム数 (デフォルト: 20, 最大: 100)
- `page`: ページ番号 (デフォルト: 1)
- `sort`: ソート順 (例: `createdAt:desc`)
- `fields`: 返却するフィールド (カンマ区切り)

### 1.7 レート制限

APIレート制限は以下の通りです:

- 認証エンドポイント: 10リクエスト/5分 (IPベース)
- 一般エンドポイント: 100リクエスト/分 (認証ユーザーベース)

レート制限ヘッダー:
- `X-RateLimit-Limit`: 期間内の最大リクエスト数
- `X-RateLimit-Remaining`: 残りのリクエスト数
- `X-RateLimit-Reset`: 制限がリセットされる時間 (UNIX timestamp)

## 2. 認証 API

### 2.1 ユーザー登録

新しいユーザーを登録します。

**エンドポイント:** `POST /api/v1/auth/register`

**認証:** 不要

**リクエスト本文:**
```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d5f8b7a9ab8a2d9c7e5b1d",
      "username": "example_user",
      "email": "user@example.com",
      "profile": {
        "displayName": "example_user",
        "createdAt": "2025-04-19T08:00:00.000Z"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2.2 ログイン

既存ユーザーでログインします。

**エンドポイント:** `POST /api/v1/auth/login`

**認証:** 不要

**リクエスト本文:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d5f8b7a9ab8a2d9c7e5b1d",
      "username": "example_user",
      "email": "user@example.com",
      "profile": {
        "displayName": "Example User",
        "avatar": "https://example.com/avatar.jpg"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2.3 トークン更新

アクセストークンを更新します。

**エンドポイント:** `POST /api/v1/auth/refresh`

**認証:** 不要

**リクエスト本文:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.4 ログアウト

現在のセッションからログアウトします。

**エンドポイント:** `POST /api/v1/auth/logout`

**認証:** 必須

**リクエスト本文:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### 2.5 パスワードリセットリクエスト

パスワードリセットメールを送信します。

**エンドポイント:** `POST /api/v1/auth/forgot-password`

**認証:** 不要

**リクエスト本文:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 2.6 パスワードリセット

パスワードをリセットします。

**エンドポイント:** `POST /api/v1/auth/reset-password`

**認証:** 不要

**リクエスト本文:**
```json
{
  "token": "reset-token-from-email",
  "password": "newSecurePassword123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## 3. ユーザー API

### 3.1 現在のユーザー情報取得

ログインユーザーの情報を取得します。

**エンドポイント:** `GET /api/v1/users/me`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5b1d",
    "username": "example_user",
    "email": "user@example.com",
    "profile": {
      "displayName": "Example User",
      "bio": "Craft beer enthusiast",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2025-04-19T08:00:00.000Z"
    },
    "friends": [
      {
        "user": {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          }
        },
        "status": "accepted",
        "since": "2025-04-15T08:00:00.000Z"
      }
    ],
    "badges": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5c3f",
        "name": "Seattle Explorer",
        "icon": "https://assets.pinthop.com/badges/explorer.png",
        "earnedAt": "2025-04-10T08:00:00.000Z"
      }
    ],
    "privacySettings": {
      "locationSharing": "friends",
      "activitySharing": "friends",
      "profileVisibility": "everyone"
    },
    "preferences": {
      "favoriteStyles": ["IPA", "Stout", "Sour"],
      "notifications": {
        "friendNearby": true,
        "newTaplist": true,
        "friendCheckin": true,
        "events": true
      }
    }
  }
}
```

### 3.2 プロフィール更新

ユーザープロフィールを更新します。

**エンドポイント:** `PATCH /api/v1/users/me`

**認証:** 必須

**リクエスト本文:**
```json
{
  "profile": {
    "displayName": "Updated Name",
    "bio": "Updated bio information"
  }
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "displayName": "Updated Name",
      "bio": "Updated bio information",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### 3.3 アバター画像アップロード

ユーザーのアバター画像をアップロードします。

**エンドポイント:** `POST /api/v1/users/me/avatar`

**認証:** 必須

**リクエスト:** `multipart/form-data` 形式で画像ファイルを送信

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "avatar": "https://assets.pinthop.com/avatars/user_60d5f8b7.jpg"
  }
}
```

### 3.4 プライバシー設定更新

ユーザーのプライバシー設定を更新します。

**エンドポイント:** `PATCH /api/v1/users/me/privacy`

**認証:** 必須

**リクエスト本文:**
```json
{
  "locationSharing": "friends",
  "activitySharing": "everyone",
  "profileVisibility": "everyone"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "privacySettings": {
      "locationSharing": "friends",
      "activitySharing": "everyone",
      "profileVisibility": "everyone"
    }
  }
}
```

### 3.5 通知設定更新

ユーザーの通知設定を更新します。

**エンドポイント:** `PATCH /api/v1/users/me/notifications`

**認証:** 必須

**リクエスト本文:**
```json
{
  "friendNearby": true,
  "newTaplist": false,
  "friendCheckin": true,
  "events": true
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "notifications": {
        "friendNearby": true,
        "newTaplist": false,
        "friendCheckin": true,
        "events": true
      }
    }
  }
}
```

### 3.6 ユーザー検索

ユーザーを検索します。

**エンドポイント:** `GET /api/v1/users/search`

**認証:** 必須

**クエリパラメータ:**
- `q`: 検索キーワード (ユーザー名または表示名)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy",
        "profile": {
          "displayName": "Beer Buddy",
          "avatar": "https://example.com/buddy.jpg"
        }
      },
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b3f",
        "username": "craft_lover",
        "profile": {
          "displayName": "Craft Beer Lover",
          "avatar": "https://example.com/craft.jpg"
        }
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 3.7 ユーザープロフィール取得

特定のユーザープロフィールを取得します。

**エンドポイント:** `GET /api/v1/users/:userId`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5b2e",
    "username": "beer_buddy",
    "profile": {
      "displayName": "Beer Buddy",
      "bio": "Love trying new beers",
      "avatar": "https://example.com/buddy.jpg"
    },
    "badges": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5c3f",
        "name": "IPA Master",
        "icon": "https://assets.pinthop.com/badges/ipa.png"
      }
    ],
    "friendship": {
      "status": "accepted",
      "since": "2025-04-15T08:00:00.000Z"
    }
  }
}
```

## 4. 友達 API

### 4.1 友達リスト取得

ユーザーの友達リストを取得します。

**エンドポイント:** `GET /api/v1/friends`

**認証:** 必須

**クエリパラメータ:**
- `status`: フィルター (all, accepted, pending)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy",
        "profile": {
          "displayName": "Beer Buddy",
          "avatar": "https://example.com/buddy.jpg"
        },
        "status": "accepted",
        "since": "2025-04-15T08:00:00.000Z",
        "presence": {
          "status": "online",
          "lastSeen": "2025-04-19T08:00:00.000Z",
          "brewery": {
            "id": "60d5f8b7a9ab8a2d9c7e5d4g",
            "name": "Cloudburst Brewing"
          }
        }
      },
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b3f",
        "username": "craft_lover",
        "profile": {
          "displayName": "Craft Beer Lover",
          "avatar": "https://example.com/craft.jpg"
        },
        "status": "pending",
        "since": "2025-04-18T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 4.2 友達リクエスト送信

友達リクエストを送信します。

**エンドポイント:** `POST /api/v1/friends/requests`

**認証:** 必須

**リクエスト本文:**
```json
{
  "userId": "60d5f8b7a9ab8a2d9c7e5b3f"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "requestId": "60d5f8b7a9ab8a2d9c7e5e5h",
    "status": "pending",
    "user": {
      "id": "60d5f8b7a9ab8a2d9c7e5b3f",
      "username": "craft_lover",
      "profile": {
        "displayName": "Craft Beer Lover",
        "avatar": "https://example.com/craft.jpg"
      }
    },
    "createdAt": "2025-04-19T08:00:00.000Z"
  }
}
```

### 4.3 友達リクエスト一覧取得

受信した友達リクエストを取得します。

**エンドポイント:** `GET /api/v1/friends/requests`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5e5i",
        "from": {
          "id": "60d5f8b7a9ab8a2d9c7e5b4g",
          "username": "hops_fan",
          "profile": {
            "displayName": "Hops Fan",
            "avatar": "https://example.com/hops.jpg"
          }
        },
        "createdAt": "2025-04-18T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 4.4 友達リクエスト承認

友達リクエストを承認します。

**エンドポイント:** `POST /api/v1/friends/requests/:requestId/accept`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "friend": {
      "id": "60d5f8b7a9ab8a2d9c7e5b4g",
      "username": "hops_fan",
      "profile": {
        "displayName": "Hops Fan",
        "avatar": "https://example.com/hops.jpg"
      },
      "status": "accepted",
      "since": "2025-04-19T08:00:00.000Z"
    }
  }
}
```

### 4.5 友達リクエスト拒否

友達リクエストを拒否します。

**エンドポイント:** `POST /api/v1/friends/requests/:requestId/reject`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "message": "Friend request rejected"
}
```

### 4.6 友達削除

友達関係を削除します。

**エンドポイント:** `DELETE /api/v1/friends/:friendId`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "message": "Friend removed successfully"
}
```

## 5. ブルワリー API

### 5.1 ブルワリー一覧取得

ブルワリーの一覧を取得します。

**エンドポイント:** `GET /api/v1/breweries`

**認証:** 必須

**クエリパラメータ:**
- `region`: 地域フィルター (例: seattle)
- `near`: 現在地からの検索 (例: 47.606209,-122.332071)
- `radius`: 検索半径（キロメートル、デフォルト: 5）
- `sort`: ソート順 (rating, name, distance)
- `style`: ビアスタイルフィルター
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "breweries": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5d4g",
        "breweryId": "brewery-001",
        "name": "Cloudburst Brewing",
        "address": {
          "street": "2116 Western Ave",
          "city": "Seattle",
          "state": "WA",
          "zipCode": "98121",
          "formattedAddress": "2116 Western Ave, Seattle, WA 98121"
        },
        "location": {
          "type": "Point",
          "coordinates": [-122.342911, 47.611561]
        },
        "ratings": {
          "untappd": {
            "score": 4.2,
            "url": "https://untappd.com/CloudburstBrewing"
          },
          "rateBeer": {
            "score": 92,
            "url": "https://www.ratebeer.com/brewers/cloudburst-brewing/29288/"
          },
          "beerAdvocate": {
            "score": 88,
            "url": "https://www.beeradvocate.com/beer/profile/42156/"
          },
          "aggregateScore": 90
        },
        "specialtyStyles": [
          {
            "style": "New England IPA",
            "rating": 4.5
          }
        ],
        "distance": 1.2, // キロメートル単位（near パラメータ使用時のみ）
        "currentPresence": {
          "friendsCount": 2,
          "friends": [
            {
              "id": "60d5f8b7a9ab8a2d9c7e5b2e",
              "username": "beer_buddy",
              "profile": {
                "displayName": "Beer Buddy",
                "avatar": "https://example.com/buddy.jpg"
              }
            }
          ]
        },
        "latestTaplist": {
          "id": "60d5f8b7a9ab8a2d9c7e5f6j",
          "updatedAt": "2025-04-18T15:30:00.000Z",
          "photo": "https://assets.pinthop.com/taplists/brewery001_20250418.jpg"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 5.2 ブルワリー詳細取得

ブルワリーの詳細情報を取得します。

**エンドポイント:** `GET /api/v1/breweries/:breweryId`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5d4g",
    "breweryId": "brewery-001",
    "name": "Cloudburst Brewing",
    "address": {
      "street": "2116 Western Ave",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98121",
      "formattedAddress": "2116 Western Ave, Seattle, WA 98121"
    },
    "location": {
      "type": "Point",
      "coordinates": [-122.342911, 47.611561]
    },
    "region": "seattle",
    "businessHours": {
      "monday": { "open": "16:00", "close": "22:00" },
      "tuesday": { "open": "16:00", "close": "22:00" },
      "wednesday": { "open": "16:00", "close": "22:00" },
      "thursday": { "open": "14:00", "close": "22:00" },
      "friday": { "open": "14:00", "close": "23:00" },
      "saturday": { "open": "12:00", "close": "23:00" },
      "sunday": { "open": "12:00", "close": "20:00" }
    },
    "contact": {
      "phone": "+1-206-555-0100",
      "email": "info@cloudburst.com",
      "website": "https://cloudburstbrew.com"
    },
    "ratings": {
      "untappd": {
        "score": 4.2,
        "url": "https://untappd.com/CloudburstBrewing"
      },
      "rateBeer": {
        "score": 92,
        "url": "https://www.ratebeer.com/brewers/cloudburst-brewing/29288/"
      },
      "beerAdvocate": {
        "score": 88,
        "url": "https://www.beeradvocate.com/beer/profile/42156/"
      },
      "aggregateScore": 90
    },
    "specialtyStyles": [
      {
        "style": "New England IPA",
        "rating": 4.5,
        "confidence": 0.9
      },
      {
        "style": "Imperial Stout",
        "rating": 4.3,
        "confidence": 0.8
      }
    ],
    "awards": [
      {
        "name": "Great American Beer Festival",
        "year": 2023,
        "category": "Hazy IPA",
        "beerName": "Cloudy Logic",
        "medal": "Silver"
      }
    ],
    "description": "A Seattle favorite known for their hazy IPAs and barrel-aged stouts.",
    "photos": [
      "https://assets.pinthop.com/breweries/cloudburst1.jpg",
      "https://assets.pinthop.com/breweries/cloudburst2.jpg"
    ],
    "currentPresence": {
      "friendsCount": 2,
      "friends": [
        {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          },
          "checkinTime": "2025-04-19T18:30:00.000Z"
        }
      ],
      "totalCount": 5
    },
    "taplists": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5f6j",
        "photo": "https://assets.pinthop.com/taplists/brewery001_20250418.jpg",
        "uploadedBy": {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy"
        },
        "uploadedAt": "2025-04-18T15:30:00.000Z",
        "beers": [
          {
            "name": "Market Fresh IPA",
            "style": "New England IPA",
            "abv": 6.8
          },
          {
            "name": "Darkenfloxx Stout",
            "style": "Imperial Stout",
            "abv": 9.2
          }
        ]
      }
    ],
    "userCheckins": {
      "visited": true,
      "lastVisit": "2025-04-15T19:45:00.000Z",
      "totalVisits": 3
    }
  }
}
```

### 5.3 ブルワリー検索

ブルワリーを検索します。

**エンドポイント:** `GET /api/v1/breweries/search`

**認証:** 必須

**クエリパラメータ:**
- `q`: 検索キーワード
- `region`: 地域フィルター (例: seattle)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "breweries": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5d4g",
        "breweryId": "brewery-001",
        "name": "Cloudburst Brewing",
        "address": {
          "city": "Seattle",
          "state": "WA"
        },
        "ratings": {
          "untappd": {
            "score": 4.2,
            "url": "https://untappd.com/CloudburstBrewing"
          },
          "aggregateScore": 90
        },
        "specialtyStyles": [
          {
            "style": "New England IPA",
            "rating": 4.5
          }
        ]
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

## 6. チェックイン API

### 6.1 チェックイン作成

ブルワリーにチェックインします。

**エンドポイント:** `POST /api/v1/checkins`

**認証:** 必須

**リクエスト本文:**
```json
{
  "breweryId": "60d5f8b7a9ab8a2d9c7e5d4g",
  "location": {
    "coordinates": [-122.342911, 47.611561]
  },
  "visibility": "friends",
  "beer": {
    "name": "Market Fresh IPA",
    "style": "New England IPA",
    "rating": 4.5,
    "comment": "Juicy and delicious!"
  }
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5f7k",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "checkinTime": "2025-04-19T08:00:00.000Z",
    "visibility": "friends",
    "beer": {
      "name": "Market Fresh IPA",
      "style": "New England IPA",
      "rating": 4.5,
      "comment": "Juicy and delicious!"
    }
  }
}
```

### 6.2 チェックアウト

ブルワリーからチェックアウトします。

**エンドポイント:** `POST /api/v1/checkins/:checkinId/checkout`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5f7k",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "checkinTime": "2025-04-19T08:00:00.000Z",
    "checkoutTime": "2025-04-19T10:30:00.000Z",
    "status": "completed"
  }
}
```

### 6.3 ビール体験追加

チェックイン中にビール体験を追加します。

**エンドポイント:** `POST /api/v1/checkins/:checkinId/beers`

**認証:** 必須

**リクエスト本文:**
```json
{
  "beer": {
    "name": "Darkenfloxx Stout",
    "style": "Imperial Stout"
  },
  "rating": 5,
  "comment": "Incredible depth of flavor!",
  "photo": "data:image/jpeg;base64,..."
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "checkinId": "60d5f8b7a9ab8a2d9c7e5f7k",
    "beer": {
      "name": "Darkenfloxx Stout",
      "style": "Imperial Stout",
      "rating": 5,
      "comment": "Incredible depth of flavor!",
      "photo": "https://assets.pinthop.com/beers/60d5f8b7a9ab8a2d9c7e5f7k_2.jpg",
      "timestamp": "2025-04-19T09:15:00.000Z"
    }
  }
}
```

### 6.4 チェックイン履歴取得

ユーザーのチェックイン履歴を取得します。

**エンドポイント:** `GET /api/v1/checkins`

**認証:** 必須

**クエリパラメータ:**
- `userId`: 特定ユーザーの履歴（省略時は自分の履歴）
- `breweryId`: 特定ブルワリーでの履歴
- `status`: ステータスでフィルター (active, completed)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "checkins": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5f7k",
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d4g",
          "name": "Cloudburst Brewing",
          "address": {
            "city": "Seattle",
            "state": "WA"
          }
        },
        "checkinTime": "2025-04-19T08:00:00.000Z",
        "checkoutTime": "2025-04-19T10:30:00.000Z",
        "status": "completed",
        "beers": [
          {
            "name": "Market Fresh IPA",
            "style": "New England IPA",
            "rating": 4.5
          },
          {
            "name": "Darkenfloxx Stout",
            "style": "Imperial Stout",
            "rating": 5,
            "photo": "https://assets.pinthop.com/beers/60d5f8b7a9ab8a2d9c7e5f7k_2.jpg"
          }
        ]
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 6.5 タイムライン取得

フォローしているユーザーのアクティビティタイムラインを取得します。

**エンドポイント:** `GET /api/v1/timeline`

**認証:** 必須

**クエリパラメータ:**
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)
- `before`: 指定タイムスタンプ以前のアクティビティ

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "type": "checkin",
        "id": "60d5f8b7a9ab8a2d9c7e5f7l",
        "user": {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          }
        },
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d4g",
          "name": "Cloudburst Brewing"
        },
        "beer": {
          "name": "Market Fresh IPA",
          "style": "New England IPA",
          "rating": 4.5,
          "comment": "Best IPA in Seattle!"
        },
        "timestamp": "2025-04-19T07:30:00.000Z"
      },
      {
        "type": "taplist",
        "id": "60d5f8b7a9ab8a2d9c7e5f6j",
        "user": {
          "id": "60d5f8b7a9ab8a2d9c7e5b3f",
          "username": "craft_lover",
          "profile": {
            "displayName": "Craft Beer Lover",
            "avatar": "https://example.com/craft.jpg"
          }
        },
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d5h",
          "name": "Holy Mountain Brewing"
        },
        "photo": "https://assets.pinthop.com/taplists/brewery002_20250418.jpg",
        "timestamp": "2025-04-18T16:45:00.000Z"
      },
      {
        "type": "badge",
        "id": "60d5f8b7a9ab8a2d9c7e5f8m",
        "user": {
          "id": "60d5f8b7a9ab8a2d9c7e5b3f",
          "username": "craft_lover",
          "profile": {
            "displayName": "Craft Beer Lover",
            "avatar": "https://example.com/craft.jpg"
          }
        },
        "badge": {
          "id": "60d5f8b7a9ab8a2d9c7e5c3f",
          "name": "Seattle Explorer",
          "icon": "https://assets.pinthop.com/badges/explorer.png"
        },
        "timestamp": "2025-04-18T14:20:00.000Z"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

## 7. タップリスト API

### 7.1 タップリスト投稿

ブルワリーのタップリスト写真を投稿します。

**エンドポイント:** `POST /api/v1/taplists`

**認証:** 必須

**リクエスト:** `multipart/form-data` 形式で以下を送信
- `breweryId`: ブルワリーID
- `photo`: タップリスト写真

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5f9n",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "photo": "https://assets.pinthop.com/taplists/brewery001_20250419.jpg",
    "uploadedAt": "2025-04-19T08:00:00.000Z",
    "isProcessed": false
  }
}
```

### 7.2 タップリスト取得

ブルワリーのタップリスト履歴を取得します。

**エンドポイント:** `GET /api/v1/breweries/:breweryId/taplists`

**認証:** 必須

**クエリパラメータ:**
- `limit`: 返却するアイテム数 (デフォルト: 5)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "taplists": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5f9n",
        "photo": "https://assets.pinthop.com/taplists/brewery001_20250419.jpg",
        "uploadedBy": {
          "id": "60d5f8b7a9ab8a2d9c7e5b1d",
          "username": "example_user"
        },
        "uploadedAt": "2025-04-19T08:00:00.000Z",
        "beers": [
          {
            "name": "Market Fresh IPA",
            "style": "New England IPA",
            "abv": 6.8
          },
          {
            "name": "Darkenfloxx Stout",
            "style": "Imperial Stout",
            "abv": 9.2
          }
        ],
        "verifiedBy": [
          {
            "id": "60d5f8b7a9ab8a2d9c7e5b2e",
            "username": "beer_buddy"
          }
        ]
      },
      {
        "id": "60d5f8b7a9ab8a2d9c7e5f6j",
        "photo": "https://assets.pinthop.com/taplists/brewery001_20250418.jpg",
        "uploadedBy": {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy"
        },
        "uploadedAt": "2025-04-18T15:30:00.000Z",
        "beers": [
          {
            "name": "Market Fresh IPA",
            "style": "New England IPA",
            "abv": 6.8
          },
          {
            "name": "Darkenfloxx Stout",
            "style": "Imperial Stout",
            "abv": 9.2
          }
        ]
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 5,
      "pages": 1
    }
  }
}
```

### 7.3 タップリスト検証

タップリストの内容を検証します。

**エンドポイント:** `POST /api/v1/taplists/:taplistId/verify`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5f9n",
    "verifiedBy": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b1d",
        "username": "example_user",
        "verifiedAt": "2025-04-19T08:30:00.000Z"
      }
    ]
  }
}
```

## 8. プレゼンス API

### 8.1 プレゼンス更新

ユーザーのプレゼンス（オンライン状態と位置情報）を更新します。

**エンドポイント:** `POST /api/v1/presence`

**認証:** 必須

**リクエスト本文:**
```json
{
  "status": "online",
  "location": {
    "coordinates": [-122.342911, 47.611561],
    "accuracy": 10
  },
  "breweryId": "60d5f8b7a9ab8a2d9c7e5d4g",
  "visibility": "friends"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "status": "online",
    "location": {
      "type": "Point",
      "coordinates": [-122.342911, 47.611561]
    },
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "lastUpdated": "2025-04-19T08:00:00.000Z",
    "visibility": "friends"
  }
}
```

### 8.2 友達のプレゼンス取得

オンラインの友達のプレゼンス情報を取得します。

**エンドポイント:** `GET /api/v1/presence/friends`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy",
        "profile": {
          "displayName": "Beer Buddy",
          "avatar": "https://example.com/buddy.jpg"
        },
        "status": "online",
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d4g",
          "name": "Cloudburst Brewing"
        },
        "lastUpdated": "2025-04-19T07:50:00.000Z"
      }
    ]
  }
}
```

### 8.3 ブルワリーのプレゼンス取得

ブルワリーに現在いるユーザーのプレゼンス情報を取得します。

**エンドポイント:** `GET /api/v1/breweries/:breweryId/presence`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "presence": {
      "friendsCount": 2,
      "friends": [
        {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          },
          "lastUpdated": "2025-04-19T07:50:00.000Z"
        },
        {
          "id": "60d5f8b7a9ab8a2d9c7e5b3f",
          "username": "craft_lover",
          "profile": {
            "displayName": "Craft Beer Lover",
            "avatar": "https://example.com/craft.jpg"
          },
          "lastUpdated": "2025-04-19T07:40:00.000Z"
        }
      ],
      "totalCount": 5
    }
  }
}
```

## 9. バッジ API

### 9.1 バッジ一覧取得

利用可能なバッジの一覧を取得します。

**エンドポイント:** `GET /api/v1/badges`

**認証:** 必須

**クエリパラメータ:**
- `category`: カテゴリでフィルター (brewery, beer, style, region, event, achievement)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5c3f",
        "name": "Seattle Explorer",
        "category": "region",
        "description": "Visit 50% of breweries in Seattle",
        "icon": "https://assets.pinthop.com/badges/explorer.png",
        "rarity": "uncommon",
        "earned": true,
        "earnedAt": "2025-04-10T08:00:00.000Z",
        "progress": 1.0
      },
      {
        "id": "60d5f8b7a9ab8a2d9c7e5c4g",
        "name": "IPA Master",
        "category": "style",
        "description": "Try 20 different IPAs",
        "icon": "https://assets.pinthop.com/badges/ipa.png",
        "rarity": "common",
        "earned": false,
        "progress": 0.6
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 9.2 ユーザーのバッジ取得

ユーザーが獲得したバッジを取得します。

**エンドポイント:** `GET /api/v1/users/:userId/badges`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5c3f",
        "name": "Seattle Explorer",
        "category": "region",
        "description": "Visit 50% of breweries in Seattle",
        "icon": "https://assets.pinthop.com/badges/explorer.png",
        "rarity": "uncommon",
        "earnedAt": "2025-04-10T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 9.3 バッジ進行状況取得

バッジの獲得進行状況を取得します。

**エンドポイント:** `GET /api/v1/badges/:badgeId/progress`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "badge": {
      "id": "60d5f8b7a9ab8a2d9c7e5c4g",
      "name": "IPA Master",
      "category": "style",
      "description": "Try 20 different IPAs",
      "icon": "https://assets.pinthop.com/badges/ipa.png",
      "rarity": "common"
    },
    "progress": {
      "current": 12,
      "target": 20,
      "percentage": 0.6,
      "earned": false,
      "details": [
        {
          "beer": "Market Fresh IPA",
          "brewery": "Cloudburst Brewing",
          "date": "2025-04-19T08:00:00.000Z"
        },
        // 他のIPA履歴
      ]
    }
  }
}
```

## 10. イベント API

### 10.1 イベント一覧取得

イベントの一覧を取得します。

**エンドポイント:** `GET /api/v1/events`

**認証:** 必須

**クエリパラメータ:**
- `region`: 地域フィルター (例: seattle)
- `startDate`: 開始日フィルター (ISO8601形式)
- `endDate`: 終了日フィルター (ISO8601形式)
- `type`: イベントタイプフィルター (tasting, release, festival, class, meetup, other)
- `breweryId`: ブルワリーフィルター
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5g5o",
        "name": "IPA Release Party",
        "description": "Join us for the release of our new triple IPA!",
        "startTime": "2025-04-20T18:00:00.000Z",
        "endTime": "2025-04-20T22:00:00.000Z",
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d4g",
          "name": "Cloudburst Brewing"
        },
        "eventType": "release",
        "image": "https://assets.pinthop.com/events/ipa_release.jpg",
        "attendees": {
          "going": 12,
          "interested": 25,
          "friends": [
            {
              "id": "60d5f8b7a9ab8a2d9c7e5b2e",
              "username": "beer_buddy",
              "profile": {
                "displayName": "Beer Buddy",
                "avatar": "https://example.com/buddy.jpg"
              },
              "status": "going"
            }
          ]
        },
        "userStatus": "interested"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 10.2 イベント詳細取得

イベントの詳細情報を取得します。

**エンドポイント:** `GET /api/v1/events/:eventId`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5g5o",
    "name": "IPA Release Party",
    "description": "Join us for the release of our new triple IPA! We'll have special pricing and exclusive merchandise.",
    "startTime": "2025-04-20T18:00:00.000Z",
    "endTime": "2025-04-20T22:00:00.000Z",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing",
      "address": {
        "formattedAddress": "2116 Western Ave, Seattle, WA 98121"
      }
    },
    "location": {
      "address": "2116 Western Ave, Seattle, WA 98121",
      "coordinates": {
        "type": "Point",
        "coordinates": [-122.342911, 47.611561]
      }
    },
    "organizer": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "eventType": "release",
    "image": "https://assets.pinthop.com/events/ipa_release.jpg",
    "website": "https://cloudburstbrew.com/events/ipa-release",
    "price": "Free entry",
    "tags": ["IPA", "Beer Release", "Limited Edition"],
    "attendees": {
      "going": 12,
      "interested": 25,
      "friends": [
        {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          },
          "status": "going"
        }
      ]
    },
    "userStatus": "interested"
  }
}
```

### 10.3 イベント作成

新しいイベントを作成します。

**エンドポイント:** `POST /api/v1/events`

**認証:** 必須

**リクエスト:** `multipart/form-data` 形式で以下を送信
- `name`: イベント名
- `description`: 説明
- `startTime`: 開始日時 (ISO8601形式)
- `endTime`: 終了日時 (ISO8601形式)
- `breweryId`: ブルワリーID (任意)
- `location`: 場所情報 (JSON文字列)
- `eventType`: イベントタイプ
- `image`: イベント画像 (任意)
- `website`: ウェブサイト (任意)
- `price`: 価格情報 (任意)
- `isPublic`: 公開設定 (デフォルト: true)
- `tags`: タグ (JSON配列文字列)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5g6p",
    "name": "Craft Beer Meetup",
    "description": "Monthly meetup for craft beer enthusiasts",
    "startTime": "2025-04-25T18:00:00.000Z",
    "endTime": "2025-04-25T21:00:00.000Z",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "eventType": "meetup",
    "image": "https://assets.pinthop.com/events/meetup.jpg"
  }
}
```

### 10.4 イベント参加状態更新

イベントへの参加状態を更新します。

**エンドポイント:** `POST /api/v1/events/:eventId/attend`

**認証:** 必須

**リクエスト本文:**
```json
{
  "status": "going"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "eventId": "60d5f8b7a9ab8a2d9c7e5g5o",
    "status": "going",
    "updatedAt": "2025-04-19T08:00:00.000Z"
  }
}
```

## 11. 通知 API

### 11.1 通知一覧取得

ユーザーの通知一覧を取得します。

**エンドポイント:** `GET /api/v1/notifications`

**認証:** 必須

**クエリパラメータ:**
- `read`: 既読ステータスでフィルター (true/false)
- `limit`: 返却するアイテム数 (デフォルト: 20)
- `page`: ページ番号 (デフォルト: 1)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5h7q",
        "type": "friend_request",
        "sender": {
          "id": "60d5f8b7a9ab8a2d9c7e5b4g",
          "username": "hops_fan",
          "profile": {
            "displayName": "Hops Fan",
            "avatar": "https://example.com/hops.jpg"
          }
        },
        "content": {
          "message": "Hops Fan sent you a friend request"
        },
        "isRead": false,
        "actionUrl": "/friends/requests",
        "createdAt": "2025-04-18T16:30:00.000Z"
      },
      {
        "id": "60d5f8b7a9ab8a2d9c7e5h8r",
        "type": "nearby",
        "sender": {
          "id": "60d5f8b7a9ab8a2d9c7e5b2e",
          "username": "beer_buddy",
          "profile": {
            "displayName": "Beer Buddy",
            "avatar": "https://example.com/buddy.jpg"
          }
        },
        "content": {
          "brewery": {
            "id": "60d5f8b7a9ab8a2d9c7e5d4g",
            "name": "Cloudburst Brewing"
          },
          "message": "Beer Buddy is at Cloudburst Brewing"
        },
        "isRead": true,
        "actionUrl": "/breweries/60d5f8b7a9ab8a2d9c7e5d4g",
        "createdAt": "2025-04-18T14:00:00.000Z"
      }
    ],
    "unreadCount": 1,
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 11.2 通知既読設定

通知を既読にします。

**エンドポイント:** `POST /api/v1/notifications/:notificationId/read`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "60d5f8b7a9ab8a2d9c7e5h7q",
    "isRead": true
  }
}
```

### 11.3 すべての通知を既読設定

すべての通知を既読にします。

**エンドポイント:** `POST /api/v1/notifications/read-all`

**認証:** 必須

**レスポンス:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

## 12. 検索 API

### 12.1 統合検索

ブルワリー、ユーザー、イベントなどを横断的に検索します。

**エンドポイント:** `GET /api/v1/search`

**認証:** 必須

**クエリパラメータ:**
- `q`: 検索キーワード
- `types`: 検索対象タイプ (カンマ区切り、デフォルト: all)
  - 有効値: breweries, users, events, beers
- `limit`: 返却するアイテム数 (デフォルト: 5)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "breweries": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5d4g",
        "name": "Cloudburst Brewing",
        "address": {
          "city": "Seattle",
          "state": "WA"
        },
        "ratings": {
          "untappd": {
            "score": 4.2,
            "url": "https://untappd.com/CloudburstBrewing"
          },
          "aggregateScore": 90
        }
      }
    ],
    "users": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy",
        "profile": {
          "displayName": "Beer Buddy",
          "avatar": "https://example.com/buddy.jpg"
        },
        "friendship": {
          "status": "accepted"
        }
      }
    ],
    "events": [
      {
        "id": "60d5f8b7a9ab8a2d9c7e5g5o",
        "name": "IPA Release Party",
        "brewery": {
          "name": "Cloudburst Brewing"
        },
        "startTime": "2025-04-20T18:00:00.000Z"
      }
    ],
    "beers": [
      {
        "name": "Market Fresh IPA",
        "style": "New England IPA",
        "brewery": {
          "id": "60d5f8b7a9ab8a2d9c7e5d4g",
          "name": "Cloudburst Brewing"
        }
      }
    ]
  }
}
```

## 13. WebSocket API

### 13.1 接続

WebSocketサーバーへ接続します。

**エンドポイント:** `wss://api.pinthop.com`

**認証:** クエリパラメータにアクセストークンを含めます
```
wss://api.pinthop.com?token=access_token
```

### 13.2 イベント

#### 接続確立

```json
{
  "type": "connection_established",
  "data": {
    "userId": "60d5f8b7a9ab8a2d9c7e5b1d",
    "timestamp": "2025-04-19T08:00:00.000Z"
  }
}
```

#### プレゼンス更新

```json
{
  "type": "presence_update",
  "data": {
    "user": {
      "id": "60d5f8b7a9ab8a2d9c7e5b2e",
      "username": "beer_buddy",
      "profile": {
        "displayName": "Beer Buddy",
        "avatar": "https://example.com/buddy.jpg"
      }
    },
    "status": "online",
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "timestamp": "2025-04-19T08:00:00.000Z"
  }
}
```

#### 友達チェックイン

```json
{
  "type": "friend_checkin",
  "data": {
    "checkin": {
      "id": "60d5f8b7a9ab8a2d9c7e5f7l",
      "user": {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy",
        "profile": {
          "displayName": "Beer Buddy",
          "avatar": "https://example.com/buddy.jpg"
        }
      },
      "brewery": {
        "id": "60d5f8b7a9ab8a2d9c7e5d4g",
        "name": "Cloudburst Brewing"
      },
      "timestamp": "2025-04-19T08:00:00.000Z"
    }
  }
}
```

#### 友達チェックアウト

```json
{
  "type": "friend_checkout",
  "data": {
    "checkout": {
      "id": "60d5f8b7a9ab8a2d9c7e5f7l",
      "user": {
        "id": "60d5f8b7a9ab8a2d9c7e5b2e",
        "username": "beer_buddy"
      },
      "brewery": {
        "id": "60d5f8b7a9ab8a2d9c7e5d4g",
        "name": "Cloudburst Brewing"
      },
      "timestamp": "2025-04-19T10:30:00.000Z"
    }
  }
}
```

#### 新規通知

```json
{
  "type": "notification",
  "data": {
    "notification": {
      "id": "60d5f8b7a9ab8a2d9c7e5h7q",
      "type": "friend_request",
      "sender": {
        "id": "60d5f8b7a9ab8a2d9c7e5b4g",
        "username": "hops_fan",
        "profile": {
          "displayName": "Hops Fan",
          "avatar": "https://example.com/hops.jpg"
        }
      },
      "content": {
        "message": "Hops Fan sent you a friend request"
      },
      "actionUrl": "/friends/requests",
      "createdAt": "2025-04-19T08:00:00.000Z"
    }
  }
}
```

#### バッジ獲得

```json
{
  "type": "badge_earned",
  "data": {
    "badge": {
      "id": "60d5f8b7a9ab8a2d9c7e5c3f",
      "name": "Seattle Explorer",
      "icon": "https://assets.pinthop.com/badges/explorer.png",
      "description": "Visit 50% of breweries in Seattle"
    },
    "timestamp": "2025-04-19T08:00:00.000Z"
  }
}
```

#### 友達近くにいる通知

```json
{
  "type": "friend_nearby",
  "data": {
    "user": {
      "id": "60d5f8b7a9ab8a2d9c7e5b2e",
      "username": "beer_buddy",
      "profile": {
        "displayName": "Beer Buddy",
        "avatar": "https://example.com/buddy.jpg"
      }
    },
    "brewery": {
      "id": "60d5f8b7a9ab8a2d9c7e5d4g",
      "name": "Cloudburst Brewing"
    },
    "distance": 0.2, // キロメートル単位
    "timestamp": "2025-04-19T08:00:00.000Z"
  }
}
```

## 14. エラーコード

| コード | 説明 |
|------|------|
| `AUTH_REQUIRED` | 認証が必要です |
| `INVALID_CREDENTIALS` | 認証情報が無効です |
| `TOKEN_EXPIRED` | トークンの有効期限が切れています |
| `FORBIDDEN` | アクセス権限がありません |
| `RESOURCE_NOT_FOUND` | リソースが見つかりません |
| `VALIDATION_ERROR` | バリデーションエラー |
| `DUPLICATE_ENTRY` | 重複したエントリーがあります |
| `RATE_LIMIT_EXCEEDED` | レート制限を超えました |
| `INTERNAL_ERROR` | サーバー内部エラー |

## 15. バージョン履歴

| バージョン | リリース日 | 説明 |
|----------|-----------|------|
| v1       | 2025-04-15 | 初期リリース |
| v1       | 2025-05-04 | ratings構造の更新（スコアとURLを含むオブジェクト型へ変更） |

## 16. 今後の予定

- ビールOCR API (2025-Q3)
- 自然言語検索 API (2025-Q4)
- パーソナライズ推薦 API (2025-Q4)
