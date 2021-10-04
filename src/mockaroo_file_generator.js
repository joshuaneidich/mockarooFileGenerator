$(document).ready(() => {
    //adding an event listener to demonstrate create text files from a csv, zipping up all the text files and then downloading
    document.getElementById("csv").addEventListener("change", convertCSV);

    async function convertCSV(e) {
        let csvFile = await e.target.files[0].text();
        let csvArray = $.csv.toObjects(csvFile);
        let zip = new JSZip();


        for (let i = 0; i < csvArray.length; i++) {
            //in this case we are given the filename as part of the mockaroo output
            let fileName = csvArray[i].filename;
            //the file path to be used in nesting the directory structure of the file
            let filePath = csvArray[i].filepath;
            //the text content to add to the file
            let fileText = csvArray[i].body;
            //create the file from the above choices - if there's no Path specified, just produce flattened files.  Otherwise, include the directory structure specified.
            if (!filePath) {
                zip.file(fileName, fileText);
            }
            else {
                zip.file(filePath + '/' + fileName, fileText);
            }
        }

        //create the zip file as a blob
        let zipFileToSave = await zip.generateAsync({
            type: "blob"
        });
        //trigger a download
        saveAs(zipFileToSave, "Mockaroo Ingest Files.zip");
    }
})