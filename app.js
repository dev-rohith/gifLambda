export const handler = async (event) => {
  const { prompt } = event.pathParameters || {}; //event object that is getting from the apigateway
  const apiKey = process.env.TENOR_API_KEY;
  if (prompt?.length === 0) { 
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "empty search",
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
  try {
    const apiRes = await fetch(
      `https://g.tenor.com/v1/search?q=${prompt}&key=${apiKey}&limit=1`
    );
    const resData = await apiRes.json();

    if (!resData?.results || resData.results?.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No gif's found with that search term",
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const gifUrl = resData.results[0].url;

    return {
      statusCode: 307, //307 http statusCode is for the  temporary redirect if we use the 301 then we can't come back previous url that is permanently moving(it will remove history from browser history Api)
      headers: {
        Location: gifUrl,
      },
      body: "",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error?.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
