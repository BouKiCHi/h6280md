#!/usr/bin/env node

// huc6280csv
// minachunさんのhuc6280_opmap.htmlをcsvにするコンバータ

const fs = require('fs');
const cheerio = require('cheerio');

if (process.argv.length < 3) {
    console.log("Usage: huc6280csv input.html");
    return;
}

// HuC6280 HTML読み出し
function convertToCsv(html) {
    let output = '';
    try {
        const $ = cheerio.load(html);

        // optable取得
        const optables = $('table.optable');

        // 0,1,2,3,4,5
        // Syntax,AddressingMode,Opcode,byteLength,cycles,どのCPUから？
        output += "syntax,addressingMode,opcode,byteLength,cycles,cpuType,firstOpcode\n";

        for(let ti=0; ti < optables.length; ti++) {
            const tbl = optables.eq(ti);
            const rows = tbl.find('tbody > tr');
            for(let rc=0; rc < rows.length; rc++) {
                const row = rows.eq(rc);
                const cells = row.find('td');
                // 
                const syntax = cells.eq(0).text();
                const addressingMode = cells.eq(1).text();
                const opcodes = cells.eq(2).text();
                const byteLength = cells.eq(3).text();
                const cycles = cells.eq(4).text();
                const cpuType = cells.eq(5).text();
                const splitedOpcodes = opcodes.split(',');
                const firstOpcode = splitedOpcodes[0].replace("$","0x");

                const outputCells = [
                    `\"${syntax}\"`,
                    `\"${addressingMode}\"`,
                    `\"${opcodes}\"`,
                    `\"${byteLength}\"`,
                    `\"${cycles}\"`,
                    `\"${cpuType}\"`,
                    `\"${firstOpcode}\"`,
                ];
                output += outputCells.join(',');
                output += "\n";
            }
        }
    } catch (e) {
        console.error(e);
    }
    return output;
}

// ファイル書き出し
function writeText(filename, data) {
    fs.writeFile(filename, data, (err) => {
        if (err) throw err;
    });
}

// メイン
const htmlFilename = process.argv[2];
console.log('input:' + htmlFilename);
fs.readFile(htmlFilename, function (err, html) {
    if (err) { throw err; }
    const csvText = convertToCsv(html);

    // 出力
    const outputCsvFilename = '.\\output.csv';
    console.log('output:' + outputCsvFilename);
    writeText(outputCsvFilename, csvText);
    console.log('done');
});