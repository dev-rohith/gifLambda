import https from 'https';

export const handler = async (event) => {
  const { prompt } = event.pathParameters || {};
  const apiKey = process.env.TENOR_API_KEY || 'LIVDSRZULELA';
  
  const url = `https://g.tenor.com/v1/search?q=${prompt}&key=${apiKey}&limit=1`;

  try {
    const resData = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      }).on('error', reject);
    });

    if (!resData?.results || resData.results.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No gifs found with that search term" }),
        headers: { "Content-Type": "application/json" }
      };
    }

    const gifUrl = resData.results[0].url;

    return {
      statusCode: 301,
      headers: {
        Location: gifUrl
      },
      body: ""
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
