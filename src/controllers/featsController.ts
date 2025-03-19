import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

export interface Feat {
    id?: any,
    nom: string,
    type?: string,
    courte_description: string,
    source?: string,
    condition?: string[],
    condition_url?: string[],
    avantage: string,
    normal?: string,
    url: string,
};

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
};

async function fetch_html(url: string): Promise<string> {
    const html = await axios.get(url, { responseType: 'text' });
    return html.data
};

async function get_all_feats(): Promise<Feat[]>{
    return await fetch_html('https://gemmaline.com/dons/description.php').then(async html => {
        const $ = cheerio.load(html);
    
        let feats_url = $('body table.tableau tbody tr td strong a')
        .map((_, element) => $(element).attr('href')?.substring(1))
        .get();

        let feats_data: Feat[] = [];

        const index = 0;
        const number = 10; //feats_url.length

        console.log(`yipee ${feats_url.slice(0, 5)}`)
        
        for(var url of feats_url.slice(index, number)){
            await fetch_html('https://gemmaline.com/dons'+url).then(html => {
                console.log(`'feat ${url} fetched`)

                const $ = cheerio.load(html);
                let nom = $('body h1').clone().children().remove().end().text().trim();
                let type = $('body h1 em').text();
                let courte_desc = $('body p:first').clone().children().remove().end().text().split('\n')[1].trim();
                let source = $('body .source').text();
                let condition = $('body h4:contains("Condition") + ul li')
                .map((_, element) => {
                    const $element = $(element);
                    const text = $element.text().trim();
                    return text;
                })
                .get()
                .join(', ');
                let condition_url = $('body h4:contains("Condition") + ul li')
                .map((_, element) => {
                    const $element = $(element);
                    const link = $element.find('a');

                    if (link.length > 0) {
                    const href = link.attr('href')?.trim();
                    return `https://gemmaline.com${href}`;
                    }
                        
                    return 'null';
                })
                .get()
                .join(', ');
                let avantage = $('h4:contains("Avantage") + p').text();
                let normal = $('h4:contains("Normal") + p').text();
                
                feats_data.push({
                    'nom': nom,
                    'type': type,
                    'courte_description': courte_desc,
                    'source': source,
                    'condition': condition.split(', '),
                    'condition_url': condition_url.split(', '),
                    'avantage': avantage.slice(1, -1),
                    'normal': normal.slice(1, -1),
                    'url': 'https://gemmaline.com/dons'+url,
                });
                delay(1000);
            });
        };
  
    return feats_data;
    });
};

export const scrapFeats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const feats = await get_all_feats();
        res.status(200).json({ feats });
    } catch (error) {
        console.error('Error scraping feats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
