# h6280md

h6280mdは、minachunさんのHuC6280命令一覧ページをMarkdown形式に変換します。
https://www.2a03.jp/~minachun/pce/huc6280_opmap.html

また、huc6280csvは一覧ページのoptableの内容をCSVへと変換します。

## インストール(更新)方法
```
npm install -g BouKiCHi/h6280md
```

## アンインストール方法
``
npm uninstall -g h6280md
``

## 使用例

### 事前準備

```
curl.exe -O https://www.2a03.jp/~minachun/pce/huc6280_opmap.html
```

### 実行例

```
h6280md ./huc6280_opmap.html
```

```
huc6280csv ./huc6280_opmap.html
```

## 注意

htmlの内容(構造)が変更された場合、処理できない場合があります。
