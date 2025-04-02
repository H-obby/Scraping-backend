"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapFeats = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
;
function fetch_html(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const html = yield axios_1.default.get(url, { responseType: 'text' });
        return html.data;
    });
}
;
function get_all_feats() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch_html('https://gemmaline.com/dons/description.php').then((html) => __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio.load(html);
            let feats_url = $('body table.tableau tbody tr td strong a')
                .map((_, element) => { var _a; return (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.substring(1); })
                .get();
            let feats_data = [];
            const index = 0;
            const number = feats_url.length;
            //console.log(`yipee ${feats_url.slice(0, 5)}`)
            for (var url of feats_url.slice(index, number)) {
                yield fetch_html('https://gemmaline.com/dons' + url).then(html => {
                    //console.log(`'feat ${url} fetched`)
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
                        var _a;
                        const $element = $(element);
                        const link = $element.find('a');
                        if (link.length > 0) {
                            const href = (_a = link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
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
                        'type': type.slice(1, -1).split(', '),
                        'courte_description': courte_desc,
                        'source': source,
                        'condition': condition.split(', '),
                        'condition_url': condition_url.split(', '),
                        'avantage': avantage.slice(1, -1),
                        'normal': normal.slice(1, -1),
                        'url': 'https://gemmaline.com/dons' + url,
                    });
                    delay(1000);
                });
            }
            ;
            return feats_data;
        }));
    });
}
;
const scrapFeats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feats = yield get_all_feats();
        res.status(200).json(feats);
    }
    catch (error) {
        console.error('Error scraping feats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.scrapFeats = scrapFeats;
