# notionの情報を取得して，Gmailを自動送信する

意図: notionで管理している選考の締切の情報を毎日リマインドメールで送りたい．

取得する情報: notionのカレンダーにあるタスクで，プロパティーの「種類」が「締切」かつ，プロパティーの「開始日」が今日より後の日程のタスク名と開始日

送信先: GmailAddressで指定したアドレス

送信する内容: タスクのタイトル ( 〇〇締切など ) と締切日

### APIについて
Notionから情報を得るために，NotionAPIが必要なので，下記のURLからインテグレーションを作成し，APIトークンを取得する必要がある．
取得したAPIトークンをコードのNOTION_TOKENに代入する．
https://www.notion.so/my-integrations

### Notionについて
情報を取得したいNotionのページに，作成したインテグレーションを追加する必要がある．
NotonのページのURLで，v=XXXX となっている部分をDATABASE_IDに代入する

### 送信先について
GmailAddressに送信したいアドレスを代入する．
このとき，関数を実行したGoogleアカウントのアドレスから，上記のアドレスにメールが送信される．

上記の処理を実行することでGoogle Apps Scriptを使用してNotionから情報を得ることができる．

プロパティーは設定に個人差があるため，コードを一部書き換える必要はある．

得た情報を基にGmailの文章を作成し，自動で送信する．

この関数をトリガーで一日一回自動で起動するように設定することで，毎日自動的にリマインドを受け取ることが可能．
