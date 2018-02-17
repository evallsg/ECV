var xhr = new XMLHttpRequest();
var url = "84.89.136.194:13456";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json.email + ", " + json.password);
    }
};

var new_chapter = {
  "parent": 1,
  "title": "Un altre capítol d'aquests",
  "text": "Més text",
  "chapter_author": "Un altre autor",
  "state": "on_progress",
  "is_terminal": "false",
  "children": [
    {
      "text": "Opció 1 un altre cop"
    },
    {
      "text": "Una altra opció (la 2, en aquest cas)"
    }
  ]
}

var data = JSON.stringify(new_chapter);
xhr.send(data);