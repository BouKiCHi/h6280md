#!/usr/bin/env node

// h6280md

var fs = require('fs');
var cheerio = require('cheerio');

if (process.argv.length < 3) {
    console.log("Usage: h6280md input.html");
    return;
}

// ファイル書き出し
function writeText(filename, data) {
    fs.writeFile(filename, data, (err) => {
        if (err) throw err;
        console.log('OK');
    });
}

// トリミング
function trimLines(text) {
    var lines = text.split('\n');
    return lines.map(x => x.trim()).join('\n');
}

// HTML読み出し
function readHtml(filename, data) {
    try {
        var output = '';
        const $ = cheerio.load(data);

        // セクション
        const sections = $('section');

        // 命令HEXテーブル セクション
        const ophexSection = sections.eq(0);
        ophexSection.find('caption').remove();
        ophexSection.find('*').attr('style','');

        const ophexTableHtml = trimLines(ophexSection.html());

        output += `## 命令HEXテーブル\n\n${ophexTableHtml}\n\n`;

        // ヘッダ
        const header = $('header').text().trim();

        output += '# ' + header + '\n\n';

        // 説明セクション
        const explaination = sections.eq(1);
        const explainationHtml = trimLines(explaination.html());

        output += `## 説明\n\n${explainationHtml}\n\n`;

        // opセクション
        const opsection = sections.eq(2);

        // opセクションの直下のdiv
        const opdiv = opsection.children('div');
        const opdivElement = opdiv.map(function(i, el) { return $(this); });

        // 見出し
        output += '## 命令\n\n';

        for(var i=0; i < opdivElement.length; i++) {
            var e = opdivElement[i];
            var id = e.attr('id');

            // 命令タイトル
            const optitleText = e.find('h3.optitle').text();
            let operation = e.find('table.operation');
            operation.find('*').attr('style','');
            const operationHtml = trimLines($.html(operation));

            const descriptionText = e.find('p.description').text().trim();

            const optable = e.find('table.optable');
            optable.find('caption').remove();
            // テーブルフッタ
            var tfoot = optable.find('tfoot');
            var tfootHtml = tfoot.find('td').eq(0).html();
            var tfootText = tfoot.text().trim();
            tfoot.remove();

            // 命令テーブル
            const optableHtml = trimLines($.html(optable));

            // console.log([id, optitle, operation, description, optable]);
            output += `<a id='${id}'></a>\n\n`;
            output += `### ${optitleText}\n\n`;
            output += `#### 動作\n\n${operationHtml}\n\n`;
            output += `#### 詳細\n\n${descriptionText}\n\n`;
            output += `#### 命令一覧\n\n${optableHtml}\n\n`;
            if (tfootText.length > 0) output += `\n${tfootHtml}\n\n`;
        }

        // フッタ
        const footer = $('footer');
        footer.find('hr').remove();
        const footerHtml = footer.html();

        output += '## あとがき\n\n' + trimLines(footerHtml) + '\n\n';

        // 出力
        outputFilename = '.\\output.md';
        console.log('write:' + outputFilename);
        writeText(outputFilename, output);


    } catch (e) {
        console.error(e);
    }
    
}

// メイン
var filename = process.argv[2];
console.log("read html:" + filename);
fs.readFile(filename, function (err, data) {
    if (err) { throw err; }
    readHtml(filename, data);
});