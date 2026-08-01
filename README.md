# おこづかいマネージャー

「今月あといくら自由に使えるか」をすぐ確認するための、自分用おこづかい管理アプリです。

## 起動方法

Node.js 20以降を用意し、このフォルダーで次を実行します。

```bash
npm install
npm run dev
```

ターミナルに表示されたURL（通常は `http://localhost:5173`）をブラウザーで開きます。

## スマホのホーム画面に追加する

このアプリはPWAに対応しています。インターネット上へ公開したURLをスマホで開き、次の操作をします。

- Android（Chrome）：メニューから「アプリをインストール」または「ホーム画面に追加」
- iPhone（Safari）：共有ボタンから「ホーム画面に追加」

インストール後は通常のアプリのようにホーム画面から起動できます。一度読み込んだ後は、オフラインでも起動できます。

> PWAのインストールには、原則としてHTTPSで公開されたURLが必要です。`localhost` は開発時の例外として利用できます。

## その他のコマンド

```bash
# 本番用ファイルを作成
npm run build

# 本番用ファイルをローカルで確認
npm run preview

# コードチェック
npm run lint
```

## データ保存

データはブラウザーのLocalStorageにだけ保存されます。ログインやサーバー通信はありません。同じ端末・同じブラウザーで利用してください。ブラウザーのサイトデータを削除すると、このアプリのデータも消えます。

PWAとしてインストールしても、データはその端末内だけに保存されます。

## GitHub Pagesで公開する

このプロジェクトは、`okozukai-manager` リポジトリへアップロードするとGitHub Pagesへ自動公開される設定です。

1. GitHubでPublicの空リポジトリ `okozukai-manager` を作成します。
2. このZIPを展開し、中身をリポジトリへアップロードします。
3. リポジトリの「Settings」→「Pages」を開きます。
4. 「Build and deployment」のSourceで「GitHub Actions」を選びます。
5. 「Actions」タブのデプロイ完了を待ちます。

公開URLは通常、次の形式です。

```text
https://GitHubのユーザー名.github.io/okozukai-manager/
```
