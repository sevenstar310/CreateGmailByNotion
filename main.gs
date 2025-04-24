const NOTION_TOKEN = "XXXXXXXXXXXXXXXXXXXXX";
const DATABASE_ID = "XXXXXXXXXXXXXXXXXXXXX";
const GmailAddress = "XXXXXXXXXXXXXXXXXXXXX";

function sendNotionEventsToEmail() {
  const notionEvents = fetchNotionEvents(); // Notionからイベントを取得（title, startDateを含む）
  notionEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  Logger.log(notionEvents);

  // メール本文を作成
  const messageBody = notionEvents.map(event => {
    const title = event.title;
    const startDate = new Date(event.startDate);
    const formatted = Utilities.formatDate(startDate, Session.getScriptTimeZone(), "M/d");
    return `${title}: ${formatted}`;
  }).join("\n");

  Logger.log(messageBody)

  const today   = new Date();
  const formattedToday = Utilities.formatDate(today, Session.getScriptTimeZone(), "M/d");

  // メール送信
  MailApp.sendEmail(GmailAddress, `選考締切 ${formattedToday}`, messageBody);

}

function fetchNotionEvents() {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  Logger.log(data);

  // 今日と60日後のDateオブジェクトを用意
  const today   = new Date();
  const monthAfter = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  
  try {
    return data.results
      .filter(page => {

        // 予定の種類プロパティが「締切」ではない場合，除外
        try {
          const kinds = page.properties["種類"].select.name;
          // Logger.log(kinds);
          if (kinds != "締切") {
            return false;
          }
        } catch (e) {
        return false;
        }

        // 今日から二カ月間の予定ではないなら除外
        try {
          const startDate = new Date(page.properties["開始"].date.start);
          // Logger.log(startDate);
          if ((startDate < today ) || (monthAfter < startDate)) {
            return false;
          }
        } catch (e) {
        return false;
        }
        return true; 

      })
      .map(page => {
        const title = page.properties["名前"].title[0]?.plain_text || "（タイトル未設定）";
        const startDate = new Date(page.properties["開始"].date.start);
        Logger.log(title);
        Logger.log(startDate);
        return {title, startDate};
      });
    } catch (e) {
      Logger.log("エラー: " + e);
    }
}


