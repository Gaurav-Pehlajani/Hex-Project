export async function handler(event) {
  const target = event.queryStringParameters?.target;
  if (!target) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No target provided' }) };
  }

  const apiKey = process.env.VITE_VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'VirusTotal API key is not configured' }) };
  }

  try {
    const subdomainsSet = new Set();
    
    // Page 1: Initial VT Subdomain Fetch
    const vtUrl1 = `https://www.virustotal.com/api/v3/domains/${target}/subdomains?limit=40`;
    const vtResponse1 = await fetch(vtUrl1, { headers: { 'x-apikey': apiKey } });
    
    if (vtResponse1.ok) {
      const data1 = await vtResponse1.json();
      if (data1.data && Array.isArray(data1.data)) {
        data1.data.forEach(item => { if (item.id) subdomainsSet.add(item.id.toLowerCase()); });
        
        const nextCursor = data1.meta?.cursor;
        
        // Launch Page 2 and HackerTarget in parallel for speed
        const [nextRes, htRes] = await Promise.allSettled([
          nextCursor 
            ? fetch(`https://www.virustotal.com/api/v3/domains/${target}/subdomains?limit=40&cursor=${nextCursor}`, { headers: { 'x-apikey': apiKey } })
            : Promise.resolve(null),
          fetch(`https://api.hackertarget.com/hostsearch/?q=${target}`)
        ]);

        if (nextRes.status === 'fulfilled' && nextRes.value && nextRes.value.ok) {
          const nextData = await nextRes.value.json();
          if (nextData.data && Array.isArray(nextData.data)) {
            nextData.data.forEach(item => { if (item.id) subdomainsSet.add(item.id.toLowerCase()); });
          }
        }

        if (htRes.status === 'fulfilled' && htRes.value && htRes.value.ok) {
          const text = await htRes.value.text();
          if (!text.includes('API count exceeded')) {
            text.split('\n').forEach(line => {
              const name = line.split(',')[0].trim().toLowerCase();
              if (name && name.endsWith(target) && name !== target) subdomainsSet.add(name);
            });
          }
        }
      }
    }

    const subdomains = Array.from(subdomainsSet).sort();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ subdomains })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
}
