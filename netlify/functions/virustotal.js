export async function handler(event) {
  const target = event.queryStringParameters?.target;
  if (!target) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No target provided' }) };
  }

  const apiKey = process.env.VITE_VIRUSTOTAL_API_KEY;
  const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target);
  const endpoint = isIP
    ? `https://www.virustotal.com/api/v3/ip_addresses/${target}`
    : `https://www.virustotal.com/api/v3/domains/${target}`;

  try {
    const response = await fetch(endpoint, {
      headers: { 'x-apikey': apiKey }
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
}