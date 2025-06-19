import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Set realistic browser headers to avoid blocking
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
    };

    // Fetch the HTML content
    const response = await axios.get(url, { headers });
    const html = response.data;

    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Find the main player statistics table
    const statsTable = $('#stats_standard');
    
    if (statsTable.length === 0) {
      return NextResponse.json(
        { error: 'Player statistics table not found' },
        { status: 404 }
      );
    }

    const players: any[] = [];

    // Iterate over each row in the table body
    statsTable.find('tbody tr').each((index, element) => {
      const $row = $(element);
      
      // Skip rows that don't have player data (like summary rows)
      if ($row.hasClass('thead') || $row.hasClass('full_table')) {
        return;
      }

      // Extract player data using data-stat attributes
      const playerName = $row.find('[data-stat="player"]').text().trim();
      const club = $row.find('[data-stat="squad"]').text().trim();
      const ageText = $row.find('[data-stat="age"]').text().trim();
      const goalsPensText = $row.find('[data-stat="goals_pens"]').text().trim();
      
      // Only include players with valid names
      if (playerName && playerName !== '') {
        const player = {
          name: playerName,
          club: club || 'Unknown',
          age: ageText ? parseInt(ageText) : null,
          goals: goalsPensText ? parseInt(goalsPensText) : 0,
          // Add more fields as needed
          position: $row.find('[data-stat="position"]').text().trim() || 'Unknown',
          matches: $row.find('[data-stat="games"]').text().trim() || '0',
          minutes: $row.find('[data-stat="minutes"]').text().trim() || '0',
          assists: $row.find('[data-stat="assists"]').text().trim() || '0',
        };

        players.push(player);
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        count: players.length, 
        players 
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