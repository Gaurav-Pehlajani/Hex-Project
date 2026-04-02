import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, AlertTriangle, ExternalLink, RefreshCw, Activity } from 'lucide-react';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  categories: string[];
}

const ThreatIntelFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Using rss2json to bypass CORS issues for RSS feeds
      const rssUrl = encodeURIComponent('https://feeds.feedburner.com/TheHackersNews');
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=`);
      if (!response.ok) throw new Error('Failed to fetch threat intel');
      const data = await response.json();
      
      if (data.status !== 'ok') throw new Error('Invalid feed data');
      
      setFeed(data.items.slice(0, 10)); // Keep top 10 items
    } catch (err) {
      console.error('ThreatFeed Error:', err);
      setError('Connection to intel server lost.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchFeed, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Card className="bg-gray-900/50 border-green-500/30 backdrop-blur-sm flex flex-col shadow-lg shadow-green-900/20 max-h-[calc(100vh-450px)] min-h-[250px]">
      <CardHeader className="pb-2 pt-4 border-b border-green-500/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 text-sm font-bold tracking-wide flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Global Threat Intel
          </CardTitle>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchFeed} 
              disabled={isLoading}
              className={`text-gray-500 hover:text-green-400 transition-colors ${isLoading ? 'animate-spin opacity-50' : ''}`}
            >
              <RefreshCw className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded text-[10px] text-green-400 font-mono">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-y-auto raw-data-scrollbar flex-1">
        {isLoading && feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500 space-y-3">
            <Activity className="h-6 w-6 animate-pulse text-green-500/50" />
            <p className="text-xs font-mono">Establishing secure channel...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-red-400/80 space-y-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-xs text-center">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-800/50">
            {feed.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 hover:bg-green-500/5 transition-colors block"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5 text-gray-500 group-hover:text-green-400 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-300 group-hover:text-green-300 line-clamp-2 leading-relaxed">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {formatDate(item.pubDate)}
                      </span>
                      {item.categories && item.categories.length > 0 && (
                        <span className="text-[9px] px-1.5 border border-gray-700 rounded text-gray-400 uppercase truncate max-w-[80px]">
                          {item.categories[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatIntelFeed;
