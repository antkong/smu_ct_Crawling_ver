const chromium = require('chrome-aws-lambda');
const { S3 } = require('aws-sdk');
const s3 = new S3();

exports.handler = async function(event, context) {
  let browser;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.goto('https://www.smu.ac.kr/kor/life/restaurantView.do');
    
    // 특정 div 요소의 데이터를 크롤링
    const data = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('.menu-list-box'));
      return divs.map(div => div.outerHTML);
    });

    // JSON 데이터로 변환
    const dataDict = { divs: data };
    const jsonData = JSON.stringify(dataDict, null, 2);

    // AWS S3에 파일 업로드 (저장소로 S3 사용)
    const params = {
      Bucket: 'YOUR_S3_BUCKET_NAME',  // 여기 상수를 적절히 본인의 S3 버킷 이름으로 바꿔주세요.
      Key: 'div_data.json',
      Body: jsonData,
      ContentType: 'application/json',
    };

    await s3.upload(params).promise();

    // 성공적으로 완료되었음을 반환
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data has been successfully saved to div_data.json.' }),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};