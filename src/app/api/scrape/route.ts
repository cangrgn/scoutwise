import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Helper function to add delay between requests to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to clean and parse numeric values
const parseNumericValue = (value: string): number => {
  if (!value || value === '' || value === '-') return 0;
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to extract team URLs from league page
async function getTeamUrls(leagueUrl: string): Promise<string[]> {
  try {
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const headers = {
      'User-Agent': randomUserAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.google.com/',
    };

    // Add delay before making request
    await delay(5000); // Much longer delay
    const response = await axios.get(leagueUrl, { headers });
    const $ = cheerio.load(response.data);
    
    // Debug: Check if we got a rate limit page
    const pageTitle = $('title').text();
    console.log('Page title:', pageTitle);
    
    if (pageTitle.includes('Rate Limited') || pageTitle.includes('429')) {
      console.error('Rate limited by FBRef!');
      return [];
    }
    
    const teamUrls: string[] = [];
    
    // Debug: Check what links are available
    const allLinks = $('a[href]');
    console.log(`Found ${allLinks.length} total links on the page`);
    
    // Show first 10 links for debugging
    allLinks.slice(0, 10).each((i, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      console.log(`Link ${i}: "${text}" -> ${href}`);
    });
    
    // Look for team links in multiple ways
    const teamSelectors = [
      'a[href*="/en/squads/"]',
      'a[href*="/squads/"]',
      'a[href*="/teams/"]',
      'a[href*="/en/teams/"]'
    ];
    
    for (const selector of teamSelectors) {
      const links = $(selector);
      console.log(`Found ${links.length} links with selector: ${selector}`);
      
      links.each((i, element) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim();
        
        if (href && !teamUrls.includes(href) && text.length > 0) {
          const fullUrl = href.startsWith('http') ? href : `https://fbref.com${href}`;
          teamUrls.push(fullUrl);
          console.log(`Found team: ${text} -> ${fullUrl}`);
        }
      });
      
      if (teamUrls.length > 0) {
        break; // Found teams, no need to try other selectors
      }
    }
    
    // If still no teams found, try to find any links that might be team-related
    if (teamUrls.length === 0) {
      console.log('No teams found with standard selectors, trying alternative approach...');
      
      // Look for links with team-like text
      $('a[href]').each((i, element) => {
        const href = $(element).attr('href');
        const text = $(element).text().trim();
        
        // Check if text looks like a team name
        const teamNames = ['Arsenal', 'Liverpool', 'Manchester', 'Chelsea', 'Tottenham', 'Newcastle', 'Aston Villa', 'Brighton', 'West Ham', 'Brentford', 'Fulham', 'Crystal Palace', 'Bournemouth', 'Wolves', 'Everton', 'Nottingham', 'Southampton'];
        
        if (href && text && teamNames.some(team => text.includes(team))) {
          const fullUrl = href.startsWith('http') ? href : `https://fbref.com${href}`;
          if (!teamUrls.includes(fullUrl)) {
            teamUrls.push(fullUrl);
            console.log(`Found team by name: ${text} -> ${fullUrl}`);
          }
        }
      });
    }

    console.log(`Found ${teamUrls.length} team URLs`);
    return teamUrls;
  } catch (error) {
    console.error('Error getting team URLs:', error);
    return [];
  }
}

// Helper function to extract player URLs from team page
async function getPlayerUrls(teamUrl: string): Promise<string[]> {
  try {
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const headers = {
      'User-Agent': randomUserAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.google.com/',
    };

    await delay(2000); // 2-second delay before fetching team page
    const response = await axios.get(teamUrl, { headers });
    const $ = cheerio.load(response.data);
    
    const playerUrls: string[] = [];
    
    // Look for player links in the squad table
    $('a[href*="/en/players/"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !playerUrls.includes(href)) {
        playerUrls.push(href.startsWith('http') ? href : `https://fbref.com${href}`);
      }
    });

    console.log(`Found ${playerUrls.length} player URLs from ${teamUrl}`);
    return playerUrls;
  } catch (error) {
    console.error('Error getting player URLs from team:', teamUrl, error);
    return [];
  }
}

// Helper function to scrape detailed player data
async function scrapePlayerData(playerUrl: string): Promise<any> {
  try {
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const headers = {
      'User-Agent': randomUserAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.google.com/',
    };

    await delay(2000); // 2-second delay before fetching player page
    const response = await axios.get(playerUrl, { headers });
    const $ = cheerio.load(response.data);

    // Initialize player object with basic info
    const player: any = {
      name: '',
      club: '',
      position: '',
      age: 0,
      marketValue: 0,
      goals: 0,
      penaltiesScored: 0,
      expectedGoals: 0,
      shotsTotal: 0,
      shotsOnTarget: 0,
      shotAccuracyPct: 0,
      assists: 0,
      expectedAssists: 0,
      keyPasses: 0,
      passesIntoFinalThird: 0,
      progressivePasses: 0,
      crosses: 0,
      successfulDribbles: 0,
      dribbleSuccessPct: 0,
      progressiveCarries: 0,
      touchesInBox: 0,
      miscontrols: 0,
      tacklesWon: 0,
      interceptions: 0,
      blocks: 0,
      clearances: 0,
      aerialDuelsWonPct: 0,
      successfulPressures: 0,
      pressureRegains: 0,
      pressuresInAttThird: 0,
      minutesPlayed: 0,
    };

    // Get player name from page title or header
    const pageTitle = $('title').text();
    const nameMatch = pageTitle.match(/([A-Za-z\s]+)\s+\|\s+FBRef/);
    if (nameMatch) {
      player.name = nameMatch[1].trim();
    }

    // Get club from page content
    const clubElement = $('a[href*="/en/squads/"]').first();
    if (clubElement.length) {
      player.club = clubElement.text().trim();
    }

    // Scrape data from different stat tables
    const statTables = [
      { id: 'stats_standard', prefix: '' },
      { id: 'stats_shooting', prefix: '' },
      { id: 'stats_passing', prefix: '' },
      { id: 'stats_defense', prefix: '' },
      { id: 'stats_possession', prefix: '' },
    ];

    for (const tableInfo of statTables) {
      const table = $(`#${tableInfo.id}`);
      if (table.length > 0) {
        // Find the most recent season's data (usually the first row)
        const dataRow = table.find('tbody tr').first();
        if (dataRow.length > 0) {
          const $row = $(dataRow);
          
          // Extract stats using data-stat attributes
          const stats: any = {
            // Standard stats
            goals: $row.find('[data-stat="goals"]').text().trim(),
            assists: $row.find('[data-stat="assists"]').text().trim(),
            minutes: $row.find('[data-stat="minutes"]').text().trim(),
            position: $row.find('[data-stat="position"]').text().trim(),
            age: $row.find('[data-stat="age"]').text().trim(),
            
            // Shooting stats
            expectedGoals: $row.find('[data-stat="xg"]').text().trim(),
            shotsTotal: $row.find('[data-stat="shots"]').text().trim(),
            shotsOnTarget: $row.find('[data-stat="shots_on_target"]').text().trim(),
            shotAccuracyPct: $row.find('[data-stat="shots_on_target_pct"]').text().trim(),
            
            // Passing stats
            expectedAssists: $row.find('[data-stat="xa"]').text().trim(),
            keyPasses: $row.find('[data-stat="key_passes"]').text().trim(),
            passesIntoFinalThird: $row.find('[data-stat="passes_into_final_third"]').text().trim(),
            progressivePasses: $row.find('[data-stat="progressive_passes"]').text().trim(),
            crosses: $row.find('[data-stat="crosses"]').text().trim(),
            
            // Possession stats
            successfulDribbles: $row.find('[data-stat="dribbles_completed"]').text().trim(),
            dribbleSuccessPct: $row.find('[data-stat="dribbles_completed_pct"]').text().trim(),
            progressiveCarries: $row.find('[data-stat="progressive_carries"]').text().trim(),
            touchesInBox: $row.find('[data-stat="touches_att_pen_area"]').text().trim(),
            miscontrols: $row.find('[data-stat="miscontrols"]').text().trim(),
            
            // Defensive stats
            tacklesWon: $row.find('[data-stat="tackles"]').text().trim(),
            interceptions: $row.find('[data-stat="interceptions"]').text().trim(),
            blocks: $row.find('[data-stat="blocks"]').text().trim(),
            clearances: $row.find('[data-stat="clearances"]').text().trim(),
            aerialDuelsWonPct: $row.find('[data-stat="aerials_won_pct"]').text().trim(),
            
            // Pressing stats
            successfulPressures: $row.find('[data-stat="pressures"]').text().trim(),
            pressureRegains: $row.find('[data-stat="pressure_regains"]').text().trim(),
            pressuresInAttThird: $row.find('[data-stat="pressures_att_3rd"]').text().trim(),
          };

          // Update player object with found stats
          Object.keys(stats).forEach(key => {
            if (stats[key] && stats[key] !== '' && stats[key] !== '-') {
              if (key === 'position') {
                player.position = stats[key];
              } else if (key === 'minutes') {
                player.minutesPlayed = parseNumericValue(stats[key]);
              } else {
                player[key] = parseNumericValue(stats[key]);
              }
            }
          });
        }
      }
    }

    // Only return player if we have at least a name
    if (player.name) {
      console.log(`Scraped data for: ${player.name}`);
      return player;
    }
    
    return null;
  } catch (error) {
    console.error('Error scraping player data from:', playerUrl, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('Starting intelligent scraping process for:', url);

    // Phase 1: Get all team URLs
    console.log('Phase 1: Getting team URLs...');
    const teamUrls = await getTeamUrls(url);
    
    if (teamUrls.length === 0) {
      return NextResponse.json(
        { error: 'No team URLs found' },
        { status: 404 }
      );
    }

    // Phase 2: Get all player URLs from each team
    console.log('Phase 2: Getting player URLs from teams...');
    const allPlayerUrls: string[] = [];
    
    for (const teamUrl of teamUrls) {
      const playerUrls = await getPlayerUrls(teamUrl);
      allPlayerUrls.push(...playerUrls);
      await delay(5000); // Increased delay between team requests
    }

    // Remove duplicates
    const uniquePlayerUrls = [...new Set(allPlayerUrls)];
    console.log(`Found ${uniquePlayerUrls.length} unique player URLs`);

    if (uniquePlayerUrls.length === 0) {
      return NextResponse.json(
        { error: 'No player URLs found' },
        { status: 404 }
      );
    }

    // Phase 3: Scrape detailed data for each player
    console.log('Phase 3: Scraping detailed player data...');
    const players: any[] = [];
    
    for (let i = 0; i < uniquePlayerUrls.length; i++) {
      const playerUrl = uniquePlayerUrls[i];
      console.log(`Processing player ${i + 1}/${uniquePlayerUrls.length}: ${playerUrl}`);
      
      const playerData = await scrapePlayerData(playerUrl);
      if (playerData) {
        players.push(playerData);
      }
      
      await delay(8000); // Much longer delay between player requests to avoid rate limiting
    }

    console.log(`Successfully scraped data for ${players.length} players`);

    return NextResponse.json(
      { 
        success: true, 
        count: players.length, 
        players,
        debug: {
          teamUrlsFound: teamUrls.length,
          playerUrlsFound: uniquePlayerUrls.length,
          playersScraped: players.length,
          originalUrl: url
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Scraping error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape data',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 